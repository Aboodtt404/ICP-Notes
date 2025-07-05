export const idlFactory = ({ IDL }) => {
  const Permission = IDL.Variant({ 'Read' : IDL.Null, 'Write' : IDL.Null });
  const NoteVersion = IDL.Record({
    'updated_at' : IDL.Nat64,
    'content' : IDL.Text,
  });
  const Note = IDL.Record({
    'id' : IDL.Nat64,
    'title' : IDL.Text,
    'updated_at' : IDL.Nat64,
    'is_markdown' : IDL.Bool,
    'content' : IDL.Text,
    'owner' : IDL.Principal,
    'created_at' : IDL.Nat64,
    'shared_with' : IDL.Vec(IDL.Tuple(IDL.Principal, Permission)),
    'versions' : IDL.Vec(NoteVersion),
  });
  return IDL.Service({
    'add_note' : IDL.Func([IDL.Text, IDL.Text], [IDL.Nat64], []),
    'delete_note' : IDL.Func([IDL.Nat64], [IDL.Opt(Note)], []),
    'get_all_notes' : IDL.Func([], [IDL.Vec(Note)], ['query']),
    'get_note' : IDL.Func([IDL.Nat64], [IDL.Opt(Note)], ['query']),
    'get_note_versions' : IDL.Func(
        [IDL.Nat64],
        [IDL.Variant({ 'Ok' : IDL.Vec(NoteVersion), 'Err' : IDL.Text })],
        ['query'],
      ),
    'revert_to_version' : IDL.Func([IDL.Nat64, IDL.Nat], [IDL.Opt(Note)], []),
    'revoke_access' : IDL.Func([IDL.Nat64, IDL.Principal], [IDL.Opt(Note)], []),
    'share_note' : IDL.Func(
        [IDL.Nat64, IDL.Principal, Permission],
        [IDL.Opt(Note)],
        [],
      ),
    'toggle_markdown' : IDL.Func([IDL.Nat64], [IDL.Opt(Note)], []),
    'update_note' : IDL.Func(
        [IDL.Nat64, IDL.Text, IDL.Text],
        [IDL.Opt(Note)],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
