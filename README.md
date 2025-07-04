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

Ready to run your own decentralized notes app? Follow these steps carefully.

**1. Start the Local Replica**

First, open a dedicated terminal window and start the local Internet Computer replica. This will be your local blockchain. Keeping this terminal open helps you see live logs.

```bash
dfx start --clean
```

**2. Install Frontend Dependencies**

In a new terminal, navigate to the frontend directory and install the necessary Node.js packages.

```bash
cd src/notes_frontend
npm install
cd ../..
```

**3. Deploy the Canisters (Two-Step Process)**

Deploying an ICP app with a frontend that needs its backend's address requires a special two-step process.

**Step 3a: Initial Deploy (Creates Canisters)**

This first deployment creates the canisters on your local network. It will give our backend canister an ID, which the frontend needs.

> **Note:** The frontend build is expected to fail during this step. This is normal!

```bash
dfx deploy
```

**Step 3b: Build the Frontend**

Now that the backend has an ID, we can build the frontend. This step reads that canister ID and "bakes" it into the frontend code, so it knows how to communicate with the backend.

```bash
cd src/notes_frontend
npm run build
cd ../..
```

**Step 3c: Final Deploy (Upload Frontend)**

Deploy one last time. This will be very fast, as it only needs to upload your newly-built frontend asset canister.

```bash
dfx deploy
```

**4. Access Your dApp! 🎉**

After the final deployment, `dfx` will output the URLs for your canisters. Open the URL for `notes_frontend` in your browser to use the application.

Congratulations! You are now running a full-stack decentralized application on your local machine.

---

## 🙌 Contributing

Contributions are welcome! If you have ideas for improvements or find any bugs, feel free to open an issue or submit a pull request. Let's make this project even better together.

---

## 📜 License

This project is licensed under the MIT License. 