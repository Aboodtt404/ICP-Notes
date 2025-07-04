# ICP Notes: A Full-Stack Decentralized Application

This project is a simple but complete note-taking application built entirely on the Internet Computer (ICP). It serves as a comprehensive example of a full-stack Web3 application, featuring a Rust-based backend and a Next.js frontend, with all components running 100% on-chain.

## The Idea: A Truly Decentralized Application

Unlike traditional web apps that rely on centralized servers and databases (like AWS or Google Cloud), this application is fully decentralized:

- **Backend Canister**: The application's logic is written in Rust, compiled to WebAssembly (Wasm), and deployed as a canister smart contract.
- **On-Chain Database**: Notes are stored directly in the canister's own stable memory, which is a form of persistent storage on the blockchain that survives code upgrades.
- **On-Chain Hosting**: The Next.js user interface is also deployed in a canister, meaning the website itself is served directly from the Internet Computer network.

This creates a complete, self-contained, and unstoppable application that does not depend on any single corporate entity.

---

## Core Technologies

- **Backend**: Rust, IC-CDK (Canister Development Kit)
- **Frontend**: Next.js (React), Tailwind CSS
- **Blockchain**: The Internet Computer (ICP)
- **Deployment**: DFINITY Canister SDK (`dfx`)

---

## Project Structure

The project is organized into two main parts:

- `src/notes_backend/`: Contains the Rust source code for the backend canister responsible for managing notes.
- `src/notes_frontend/`: Contains the Next.js source code for the frontend canister that provides the user interface.

---

## Prerequisites

Before you begin, ensure you have the following installed:

1.  **DFINITY Canister SDK (`dfx`)**: [Installation Guide](https://internetcomputer.org/docs/current/developer-docs/setup/install/)
2.  **Node.js**: (LTS version recommended)
3.  **Rust**: With the `wasm32-unknown-unknown` target installed (`rustup target add wasm32-unknown-unknown`)

---

## Getting Started: Running Locally

To get a local instance of the application running, follow these steps carefully.

**1. Start the Local Replica**

First, start the local Internet Computer replica. It's recommended to do this in a separate, dedicated terminal window so you can see its logs.

```bash
dfx start --clean
```

**2. Install Frontend Dependencies**

In a new terminal window, navigate to the frontend directory and install the necessary Node.js packages.

```bash
cd src/notes_frontend
npm install
cd ../..
```

**3. The Two-Step Deployment**

Deploying an ICP application with a frontend that needs to know its backend's address requires a two-step process.

**Step 3a: Initial Deploy**

This first deployment creates the canisters on your local network and generates their unique IDs. The frontend build will fail during this step, which is **expected behavior**.

```bash
dfx deploy
```

**Step 3b: Build the Frontend**

Now that the backend canister has an ID, we can build the frontend. This step reads the canister ID and "bakes" it into the frontend code so it knows how to communicate with the backend.

```bash
cd src/notes_frontend
npm run build
```

**Step 3c: Final Deploy**

Return to the root directory and deploy one last time. This will be very fast, as it only needs to upload the newly built frontend.

```bash
cd ../..
dfx deploy
```

**4. Access Your Application**

After the final deployment, `dfx` will output the URLs for your canisters. Open the URL for the `notes_frontend` canister in your browser to use the application. Congratulations, you are running a full-stack decentralized application on your local machine! 