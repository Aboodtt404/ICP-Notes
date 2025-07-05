import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory as notesBackendIdlFactory } from "../../declarations/notes_backend/notes_backend.did.js";

const canisterId = process.env.NEXT_PUBLIC_NOTES_BACKEND_CANISTER_ID;

const createActor = (canisterId, idlFactory) => {
  const agent = new HttpAgent();
  
  // Fetch root key for certificate validation during development
  if (process.env.NODE_ENV !== "production") {
    agent.fetchRootKey().catch(err => {
      console.warn("Unable to fetch root key. Check to ensure that your local replica is running");
      console.error(err);
    });
  }

  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
  });
};

export const notesBackend = createActor(canisterId, notesBackendIdlFactory); 