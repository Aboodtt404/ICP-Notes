use candid::{CandidType, Decode, Encode, Principal};
use ic_cdk::api::time;
use ic_stable_structures::memory_manager::{MemoryId, MemoryManager, VirtualMemory};
use ic_stable_structures::{storable::Bound, DefaultMemoryImpl, StableBTreeMap, Storable};
use serde::{Deserialize, Serialize};
use std::borrow::Cow;
use std::cell::RefCell;

type Memory = VirtualMemory<DefaultMemoryImpl>;

#[derive(CandidType, Serialize, Deserialize, Clone)]
struct Note {
    id: u64,
    title: String,
    content: String,
    created_at: u64,
    updated_at: u64,
    owner: Principal,
}

impl Storable for Note {
    fn to_bytes(&self) -> Cow<[u8]> {
        Cow::Owned(Encode!(self).unwrap())
    }

    fn from_bytes(bytes: Cow<[u8]>) -> Self {
        Decode!(bytes.as_ref(), Self).unwrap()
    }

    const BOUND: Bound = Bound::Bounded {
        max_size: 1024,
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
        content,
        created_at: time(),
        updated_at: time(),
        owner: ic_cdk::caller(),
    };
    NOTES.with(|notes| notes.borrow_mut().insert(id, note));
    id
}

#[ic_cdk::query]
fn get_note(id: u64) -> Option<Note> {
    NOTES.with(|notes| notes.borrow().get(&id))
}

#[ic_cdk::query]
fn get_all_notes() -> Vec<Note> {
    NOTES.with(|notes| notes.borrow().iter().map(|(_, note)| note.clone()).collect())
}

#[ic_cdk::update]
fn update_note(id: u64, title: String, content: String) -> Option<Note> {
    NOTES.with(|notes| {
        let mut notes = notes.borrow_mut();
        if let Some(mut note) = notes.get(&id) {
            if note.owner != ic_cdk::caller() {
                return None; // Not the owner
            }
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
                return None; // Not the owner
            }
            notes.remove(&id)
        } else {
            None
        }
    })
}

// Candid interface generation has been moved to src/notes_backend/src/notes_backend.did
// ic_cdk::export_candid!();
