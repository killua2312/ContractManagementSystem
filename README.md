# Contract Management System

A full-stack web application for managing contracts with real-time updates. The system allows users to create, view, edit, and delete contracts while providing real-time notifications of changes to all connected users.

## Features

- **Contract Management**: Create, view, update, and delete contracts
- **Real-time Updates**: WebSocket integration for instant updates across all connected clients
- **Search & Filter**: Find contracts by client name, contract ID, or status
- **Pagination**: Navigate through large sets of contracts efficiently

## Tech Stack

### Backend
- **Node.js** with **Express.js**
- **PostgreSQL(Supabase)** with **Sequelize ORM**
- **Socket.IO** for real-time communication
- **Joi** for validation

### Frontend
- **Next.js** with App Router
- **TypeScript**
- **TailwindCSS** with **Shadcn/ui** components
- **Zustand** for state management
- **Zod** for form validation
- **Socket.IO-Client** for real-time updates

## Prerequisites

- Node.js (v20+)
- Supabase connection URI for PostgreSQL database
- npm or yarn

## Setup Instructions

### Backend Setup

1. Clone the repository
   ```bash
   git clone https://github.com/killua2312/ContractManagementSystem.git
   cd ContractManagementSystem
   ```

2. Navigate to the backend directory
   ```bash
   cd server
   ```

3. Install dependencies
   ```bash
   npm install
   ```

4. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=4000
   DATABASE_URL=postgresql://username:password@localhost:5432/contract_management
   ```

   Adjust the `DATABASE_URL` to match your Supabase URL configuration.

5. Start the backend server
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory from the project root
   ```bash
   cd client
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the client directory

  ```
  NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
  ```

4. Start the frontend development server
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Environment Variables

### Server
- `PORT` - The port on which the backend server will run (default: 4000)
- `DATABASE_URL` - Supabase connection string

### Client
- `NEXT_PUBLIC_BACKEND_URL` - The server api url (default: http://localhost:4000)

## Local Development Guide

### Backend Development

- The backend uses Express.js with a modular structure:
  - `models/`: Database models (Sequelize)
  - `controllers/`: Request handlers
  - `routes/`: API route definitions
  - `services/`: Business logic
  - `utils/`: Helper functions and utilities

- To add a new model:
  1. Create a new file in the `models/` directory
  2. Define the model using Sequelize
  3. Add any associations in the model file

- To add a new API endpoint:
  1. Create or update controller methods in `controllers/`
  2. Add routes in the appropriate router file in `routes/`
  3. Implement business logic in `services/`

- Hot reloading is enabled, so changes will automatically restart the server

### Frontend Development

- The frontend uses Next.js with the App Router:
  - `app/`: Pages and routing
  - `components/`: Reusable UI components
  - `store/`: Zustand state management
  - `types/`: TypeScript type definitions
  - `utils/`: Helper functions and utilities

- Component Structure:
  - UI components are built with Shadcn/UI over TailwindCSS
  - Form components use React Hook Form with Zod validation

- State Management:
  - Zustand store in `store/contractStore.ts` handles contract data and API calls
  - WebSocket connections are managed in `utils/socket.ts`

- When adding new features:
  1. Define any new types in `types/`
  2. Add state and actions to the store if needed
  3. Create or update components
  4. Add or update pages in the app directory

## Database Schema

The main entity is the `Contract` with the following structure:

- `id` (UUIDv4): Primary key
- `client` (String): Client name
- `title` (String): Contract title
- `status` (Enum): "Draft" or "Finalized"
- `data` (Text): Contract content/data
- `createdAt` (DateTime): Creation timestamp
- `updatedAt` (DateTime): Last update timestamp

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/contracts` | Get all contracts with pagination and filters |
| GET | `/api/contracts/:id` | Get a specific contract by ID |
| POST | `/api/contracts` | Create a new contract |
| PUT | `/api/contracts/:id` | Update an existing contract |
| DELETE | `/api/contracts/:id` | Delete a contract |

## WebSocket Events

| Event | Description | Payload |
|-------|-------------|---------|
| `newContract` | A new contract was created | Contract object |
| `contractUpdate` | A contract was updated | Updated contract object |
| `contractDelete` | A contract was deleted | `{ deletedId: string }` |
