<<<<<<< HEAD
## 🚀 Thapar Go – Campus Management System

**Thapar Go** is a centralized platform designed to simplify campus navigation, class scheduling, classroom availability, and room bookings for both students and faculty at Thapar University.

### 🧭 Features

#### 🎯 For Students
- 🔎 **Campus Map**: Navigate the university with an interactive 3D map.
- 🕒 **Timetable Viewer**: Easily access class schedules for various courses.
- 🏫 **Classroom Finder**: Check real-time availability and location of classrooms.
- 📅 **Room Bookings**: Book rooms for society events and academic purposes.
- 🔗 **Web3 Integration**: Join and create blockchain-based societies and events using wallet authentication.

#### 🧑‍🏫 For Faculty
- 📘 View and manage teaching schedules and classroom assignments.
- ✅ Approve or decline room booking requests.
- 🏫 Find classrooms based on capacity and equipment.
- 📍 Navigate campus facilities efficiently.

---

### 📂 Project Structure

- **Homepage**: Quick access to all modules.
- **Campus Map**: 3D interactive map for navigation.
- **Timetable**: Course-wise class schedule view.
- **Classroom Finder**: Real-time room availability.
- **Room Bookings**: Request and manage room bookings.
- **Web3 Features**:
  - **Wallet Authentication**: Connect with MetaMask wallet.
  - **Societies**: Create and manage blockchain-based societies.
  - **Events**: Create and join events for societies.

---

### 🌐 Live Demo

Check out the live project:  
🔗 [https://thapargo2.netlify.app](https://thapargo2.netlify.app)

---

### 🛠️ Tech Stack

#### Frontend
- **React (TypeScript)** – UI library for building interactive interfaces
- **Vite** – Lightning-fast build tool and dev server
- **Shadcn/UI** – Pre-styled, accessible React component library
- **Tailwind CSS** – Utility-first CSS framework
- **Lucide React** – Icon set for React

#### Web3 Integration
- **Ethers.js** – Ethereum wallet connection and contract interaction
- **Hardhat** – Smart contract development and deployment
- **Solidity** – Smart contract programming language
- **Polygon Mumbai** – Testnet for blockchain integration

#### State & Forms
- **React Hooks** – State and lifecycle management
- **React Hook Form** – Form state and validation
- **Web3 Context Provider** – Blockchain state management

#### Backend & Data
- **Supabase** – Backend-as-a-service (PostgreSQL DB, Auth, APIs)
- **Smart Contracts** – Decentralized data storage and logic

#### Utilities & Tooling
- **TypeScript** – Type-safe JavaScript
- **ESLint** – Linting and code quality
- **PostCSS, Autoprefixer** – CSS processing
- **date-fns** – Date utilities

#### Visualization & UI Enhancements
- **Radix UI** – Accessible React primitives
- **Framer Motion** – Animations
- **Recharts** – Data visualization
- **Mapbox GL** – Interactive maps
- **Three.js** – 3D graphics

#### Testing
- **Jest** – Testing framework

---

### 📌 Future Scope

- Authentication system for students and faculty
- Admin dashboard for managing bookings
- Notifications/reminders for bookings and class schedules
- Mobile responsive design improvements
- Enhanced Web3 features:
  - NFT-based event tickets
  - Decentralized voting for society decisions
  - Integration with more blockchain networks

---

### 🧑‍💻 Author

Made with ❤️ by [Aryan](mailto:aryangupts05@gmail.com)

---

## License

This project is licensed under the [Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International](https://creativecommons.org/licenses/by-nc-nd/4.0/) license.

ThaparGo © 2025 by Aryan Gupta
=======
# `tech_team`

Welcome to your new `tech_team` project and to the Internet Computer development community. By default, creating a new project adds this README and some template files to your project directory. You can edit these template files to customize your project and to include your own code to speed up the development cycle.

To get started, you might want to explore the project directory structure and the default configuration file. Working with this project in your development environment will not affect any production deployment or identity tokens.

To learn more before you start working with `tech_team`, see the following documentation available online:

- [Quick Start](https://internetcomputer.org/docs/current/developer-docs/setup/deploy-locally)
- [SDK Developer Tools](https://internetcomputer.org/docs/current/developer-docs/setup/install)
- [Motoko Programming Language Guide](https://internetcomputer.org/docs/current/motoko/main/motoko)
- [Motoko Language Quick Reference](https://internetcomputer.org/docs/current/motoko/main/language-manual)

If you want to start working on your project right away, you might want to try the following commands:

```bash
cd tech_team/
dfx help
dfx canister --help
```

## Running the project locally

If you want to test your project locally, you can use the following commands:

```bash
# Starts the replica, running in the background
dfx start --background

# Deploys your canisters to the replica and generates your candid interface
dfx deploy
```

Once the job completes, your application will be available at `http://localhost:4943?canisterId={asset_canister_id}`.

If you have made changes to your backend canister, you can generate a new candid interface with

```bash
npm run generate
```

at any time. This is recommended before starting the frontend development server, and will be run automatically any time you run `dfx deploy`.

If you are making frontend changes, you can start a development server with

```bash
npm start
```

Which will start a server at `http://localhost:8080`, proxying API requests to the replica at port 4943.

### Note on frontend environment variables

If you are hosting frontend code somewhere without using DFX, you may need to make one of the following adjustments to ensure your project does not fetch the root key in production:

- set`DFX_NETWORK` to `ic` if you are using Webpack
- use your own preferred method to replace `process.env.DFX_NETWORK` in the autogenerated declarations
  - Setting `canisters -> {asset_canister_id} -> declarations -> env_override to a string` in `dfx.json` will replace `process.env.DFX_NETWORK` with the string in the autogenerated declarations
- Write your own `createActor` constructor
>>>>>>> 9617e75 (Initial commit.)
