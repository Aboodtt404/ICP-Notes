use candid::{CandidType, Decode, Encode, Principal};
use ic_cdk::api::time;
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{storable::Bound, DefaultMemoryImpl, StableBTreeMap, Storable};
use serde::{Deserialize, Serialize};
use std::borrow::Cow;
use std::cell::RefCell;
use std::collections::HashMap;

type Memory = VirtualMemory<DefaultMemoryImpl>;

#[derive(CandidType, Serialize, Deserialize, Clone, PartialEq, Eq, Hash)]
enum Permission {
    Read,
    Write,
}

#[derive(CandidType, Serialize, Deserialize, Clone)]
struct NoteVersion {
    content: String,
    updated_at: u64,
}

#[derive(CandidType, Serialize, Deserialize, Clone)]
struct Note {
    id: u64,
    title: String,
    content: String, // Current content
    created_at: u64,
    updated_at: u64,
    owner: Principal,
    versions: Vec<NoteVersion>,
    shared_with: HashMap<Principal, Permission>,
    is_markdown: bool,
}

impl Storable for Note {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Bounded {
        max_size: 8192, // Increased size to accommodate versions and sharing map
        is_fixed_size: false,
    };
}

thread_local! {
    static MEMORY_MANAGER: RefCell<MemoryManager<DefaultMemoryImpl>> = RefCell::new(
        MemoryManager::init(DefaultMemoryImpl::default())
    );

    static NOTES: RefCell<StableBTreeMap<u64, Note, Memory>> = RefCell::new(
        StableBTreeMap::init(
            MEMORY_MANAGER.with(|m| m.borrow().get(MemoryId::new(0))),
        )
    );

    static NEXT_ID: RefCell<u64> = RefCell::new(0);
}

#[ic_cdk::update]
fn add_note(title: String, content: String) -> u64 {
    let id = NEXT_ID.with(|next_id| {
        let mut next_id = next_id.borrow_mut();
        let id = *next_id;
        *next_id += 1;
        id
    });
    let note = Note {
        id,
        title,
        content: content.clone(),
        created_at: time(),
        updated_at: time(),
        owner: ic_cdk::caller(),
        versions: vec![NoteVersion {
            content,
            updated_at: time(),
        }],
        shared_with: HashMap::new(),
        is_markdown: false, // Default to false
    };
    NOTES.with(|notes| notes.borrow_mut().insert(id, note));
    id
}

#[ic_cdk::query]
fn get_note(id: u64) -> Option<Note> {
    NOTES.with(|notes| {
        let notes = notes.borrow();
        if let Some(note) = notes.get(&id) {
            let caller = ic_cdk::caller();
            // Allow access if the caller is the owner or the note is shared with them
            if note.owner == caller || note.shared_with.contains_key(&caller) {
                Some(note)
            } else {
                None
            }
        } else {
            None
        }
    })
}

#[ic_cdk::query]
fn get_all_notes() -> Vec<Note> {
    let caller = ic_cdk::caller();
    NOTES.with(|notes| {
        notes
            .borrow()
            .iter()
            .map(|(_, note)| note.clone())
            // Filter to only include notes owned by the caller or shared with the caller
            .filter(|note| note.owner == caller || note.shared_with.contains_key(&caller))
            .collect()
    })
}

#[ic_cdk::update]
fn update_note(id: u64, title: String, content: String) -> Option<Note> {
    NOTES.with(|notes| {
        let mut notes = notes.borrow_mut();
        if let Some(mut note) = notes.get(&id) {
            let caller = ic_cdk::caller();
            // Allow update if caller is owner or has Write permission
            if note.owner != caller && note.shared_with.get(&caller) != Some(&Permission::Write) {
                return None;
            }

            // Archive the current content as a new version before updating
            note.versions.push(NoteVersion {
                content: note.content,
                updated_at: note.updated_at,
            });

            note.title = title;
            note.content = content;
            note.updated_at = time();
            notes.insert(id, note.clone());
            Some(note)
        } else {
            None
        }
    })
}

#[ic_cdk::update]
fn delete_note(id: u64) -> Option<Note> {
    NOTES.with(|notes| {
        let mut notes = notes.borrow_mut();
        if let Some(note) = notes.get(&id) {
            if note.owner != ic_cdk::caller() {
                return None; // Only the owner can delete
            }
            notes.remove(&id)
        } else {
            None
        }
    })
}

#[ic_cdk::update]
fn toggle_markdown(id: u64) -> Option<Note> {
    NOTES.with(|notes| {
        let mut notes = notes.borrow_mut();
        if let Some(mut note) = notes.get(&id) {
            let caller = ic_cdk::caller();
            // Allow update if caller is owner or has Write permission
            if note.owner != caller && note.shared_with.get(&caller) != Some(&Permission::Write) {
                return None;
            }
            note.is_markdown = !note.is_markdown;
            notes.insert(id, note.clone());
            Some(note)
        } else {
            None
        }
    })
}

#[ic_cdk::update]
fn share_note(note_id: u64, user: Principal, permission: Permission) -> Option<Note> {
    NOTES.with(|notes| {
        let mut notes = notes.borrow_mut();
        if let Some(mut note) = notes.get(&note_id) {
            // Only the owner can share the note
            if note.owner != ic_cdk::caller() {
                return None;
            }
            note.shared_with.insert(user, permission);
            notes.insert(note_id, note.clone());
            Some(note)
        } else {
            None
        }
    })
}

#[ic_cdk::update]
fn revoke_access(note_id: u64, user: Principal) -> Option<Note> {
    NOTES.with(|notes| {
        let mut notes = notes.borrow_mut();
        if let Some(mut note) = notes.get(&note_id) {
            // Only the owner can revoke access
            if note.owner != ic_cdk::caller() {
                return None;
            }
            note.shared_with.remove(&user);
            notes.insert(note_id, note.clone());
            Some(note)
        } else {
            None
        }
    })
}

#[ic_cdk::query]
fn get_note_versions(note_id: u64) -> Result<Vec<NoteVersion>, String> {
    NOTES.with(|notes| {
        let notes = notes.borrow();
        if let Some(note) = notes.get(&note_id) {
            let caller = ic_cdk::caller();
            // Allow access if the caller is the owner or the note is shared with them
            if note.owner == caller || note.shared_with.contains_key(&caller) {
                Ok(note.versions)
            } else {
                Err("You do not have permission to view this note's versions.".to_string())
            }
        } else {
            Err("Note not found.".to_string())
        }
    })
}

#[ic_cdk::update]
fn revert_to_version(note_id: u64, version_index: usize) -> Option<Note> {
    NOTES.with(|notes| {
        let mut notes = notes.borrow_mut();
        if let Some(mut note) = notes.get(&note_id) {
            let caller = ic_cdk::caller();
            // Allow revert if caller is owner or has Write permission
            if note.owner != caller && note.shared_with.get(&caller) != Some(&Permission::Write) {
                return None;
            }

            if let Some(version_to_revert) = note.versions.get(version_index).cloned() {
                // Archive the current state before reverting
                note.versions.push(NoteVersion {
                    content: note.content.clone(),
                    updated_at: note.updated_at,
                });

                note.content = version_to_revert.content;
                note.updated_at = time();
                notes.insert(note_id, note.clone());
                Some(note)
            } else {
                None // Version index out of bounds
            }
        } else {
            None
        }
    })
}