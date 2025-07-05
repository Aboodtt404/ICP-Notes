# 📝 ICP Notes: Your First Full-Stack dApp

![Rust](https://img.shields.io/badge/rust-%23000000.svg?style=for-the-badge&logo=rust&logoColor=white)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![Internet Computer](https://img.shields.io/badge/Internet%20Computer-3B00B9?style=for-the-badge&logo=internetcomputer&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

A simple, but complete, note-taking application built entirely on the Internet Computer (ICP). It serves as a comprehensive example of a full-stack Web3 application, with a Rust backend and a Next.js frontend, where every part of it runs 100% on-chain.

---

## 💡 The Core Idea: Truly Decentralized

In a world dominated by centralized services like AWS or Google Cloud, this project explores what it means to build an application that is genuinely unstoppable and independent.

-   **Backend Canister**: The application's logic is written in Rust, compiled to WebAssembly (Wasm), and deployed as a canister smart contract.
-   **On-Chain Database**: Notes are stored directly in the canister's stable memory—a form of persistent storage on the blockchain that survives code upgrades.
-   **On-Chain Hosting**: The Next.js user interface is also deployed in its own canister, meaning the website itself is served directly from the Internet Computer network.

This creates a complete, self-contained application that doesn't rely on any single corporate entity. It's Web3, from front to back.

---

## ✨ Features

Beyond basic note-taking, this dApp offer several advanced features:

-   **📝 Markdown Support**: Write your notes in Markdown for rich text formatting. A simple toggle on each note switches between plain text and a rendered Markdown view.
-   **🤝 Note Sharing**: Securely share your notes with other users. Just enter another user's Principal ID to grant them either "Read" or "Write" access. You remain in full control as the owner and can revoke access at any time.
-   **⏳ Version History**: Never lose an edit again. Every time you save a change to a note, the previous version is automatically archived. You can view the entire history of a note and revert to any previous version with a single click.

---

## 🛠️ Tech Stack

-   **Backend**: 🦀 Rust with the `ic-cdk` (Canister Development Kit)
-   **Frontend**: ⚛️ Next.js (React) & Tailwind CSS
-   **Blockchain**: ♾️ The Internet Computer (ICP)
-   **Deployment**: DFINITY Canister SDK (`dfx`)

---

## 📂 Project Structure

The project is cleanly organized into its two main parts:

-   `src/notes_backend/`: Contains the Rust source code for the backend canister (manages notes).
-   `src/notes_frontend/`: Contains the Next.js source code for the frontend canister (provides the UI).

---

## ✅ Prerequisites

Before you begin, make sure you have the following installed:

1.  **DFINITY Canister SDK (`dfx`)**: [Installation Guide](https://internetcomputer.org/docs/current/developer-docs/setup/install/)
2.  **Node.js**: (LTS version recommended)
3.  **Rust**: With the `wasm32-unknown-unknown` target installed.
    ```bash
    rustup target add wasm32-unknown-unknown
    ```

> **A Note for Windows Users** 🖥️
> The DFINITY Canister SDK and the broader Rust/Node.js ecosystem work best in a Unix-like environment. If you're on Windows, it is **highly recommended** to use the **[Windows Subsystem for Linux (WSL)](https://learn.microsoft.com/en-us/windows/wsl/install)** to avoid potential compatibility issues. All instructions in this guide assume you are running commands in a WSL terminal (like Ubuntu).

---

## 🚀 Getting Started: Running Locally

Ready to run your own decentralized notes app? The process is now simpler and more reliable.

**1. Start the Local Replica**

First, open a dedicated terminal window and start a clean, local Internet Computer replica. This will be your local blockchain.

```bash
dfx start --clean
```

**2. Generate Canister Interfaces**

In a new terminal, run the `generate` command. This crucial step creates the necessary JavaScript files that allow your frontend to understand the API of your backend canister.

```bash
dfx generate
```

**3. Deploy the Application**

Now, you can deploy both canisters with a single command. This will install dependencies, build the frontend, and deploy both the Rust backend and the Next.js frontend to your local replica.

```bash
dfx deploy
```

**4. Access Your dApp! 🎉**

After the deployment completes, `dfx` will output the URLs for your canisters. Open the URL for `notes_frontend` in your browser to use the application.

Congratulations! You are now running a full-stack decentralized application with advanced sharing and versioning features.

---

## 🙌 Contributing

Contributions are very much welcome! If you have ideas for improvements or find any bugs, feel free to open an issue or submit a pull request. Let's make this project even better together.

---
