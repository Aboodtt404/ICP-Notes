import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Note {
  'id' : bigint,
  'title' : string,
  'updated_at' : bigint,
  'is_markdown' : boolean,
  'content' : string,
  'owner' : Principal,
  'created_at' : bigint,
  'shared_with' : Array<[Principal, Permission]>,
  'versions' : Array<NoteVersion>,
}
export interface NoteVersion { 'updated_at' : bigint, 'content' : string }
export type Permission = { 'Read' : null } |
  { 'Write' : null };
export interface _SERVICE {
  'add_note' : ActorMethod<[string, string], bigint>,
  'delete_note' : ActorMethod<[bigint], [] | [Note]>,
  'get_all_notes' : ActorMethod<[], Array<Note>>,
  'get_note' : ActorMethod<[bigint], [] | [Note]>,
  'get_note_versions' : ActorMethod<
    [bigint],
    { 'Ok' : Array<NoteVersion> } |
      { 'Err' : string }
  >,
  'revert_to_version' : ActorMethod<[bigint, bigint], [] | [Note]>,
  'revoke_access' : ActorMethod<[bigint, Principal], [] | [Note]>,
  'share_note' : ActorMethod<[bigint, Principal, Permission], [] | [Note]>,
  'toggle_markdown' : ActorMethod<[bigint], [] | [Note]>,
  'update_note' : ActorMethod<[bigint, string, string], [] | [Note]>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
