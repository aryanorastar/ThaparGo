# Thapar Go

## Problem Statement

Thapar Go solves critical challenges in campus management:

1. **Inefficient Room Booking** - Manual, paper-based systems cause scheduling conflicts and lost requests
2. **Campus Navigation Difficulties** - New students/staff struggle to find buildings and facilities
3. **Disconnected Systems** - Separate platforms for timetables, events, and societies create confusion
4. **Lack of Transparency** - Students have limited input on campus decisions and resource allocation
5. **Security Concerns** - Traditional authentication systems are vulnerable to impersonation

## Solution
A comprehensive campus management system for Thapar University, integrating Web3 technologies for decentralized governance and secure transactions.

## Features

### For Students:
- **Room Bookings**: Reserve classrooms for study sessions, club meetings, and events
- **Campus Navigation**: Interactive map with real-time location tracking
- **Class Scheduling**: View and manage your timetable
- **Society Management**: Join and interact with student societies
- **Decentralized Governance**: Participate in campus decisions through voting

### For Faculty:
- **Room Management**: Approve/reject booking requests
- **Attendance Tracking**: Digital attendance system with blockchain verification
- **Society Oversight**: Monitor student society activities

## Tech Stack

### Frontend
- React.js with Vite
- Tailwind CSS
- Radix UI components
- Internet Identity for authentication

### Backend
- Motoko (DFINITY)
- Node.js
- Supabase

### Blockchain
- Internet Computer Protocol (ICP)
- Ethereum (for some Web3 features)

### Other
- Git for version control
- GitHub for collaboration

## Local Development Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the local replica:
   ```
   dfx start --background
   ```
4. Deploy canisters locally:
   ```
   dfx deploy
   ```
5. Run the frontend:
   ```
   npm run dev
   ```

## Production Deployment

1. Set network to IC mainnet:
   ```
   dfx deploy --network ic
   ```
2. Update canister IDs in `canister_ids.json` after deployment

## Troubleshooting

- If DFX can't connect to local replica:
  ```
   dfx stop
   dfx start --clean --background
   ```

## Future Scope

- Integration with IoT devices for smart classrooms
- NFT-based student IDs
- Decentralized autonomous organization (DAO) for campus governance
- Tokenized rewards system

## Live Demo

Check out our live demo at: [https://thapargo.xyz](https://thapargo.xyz)
