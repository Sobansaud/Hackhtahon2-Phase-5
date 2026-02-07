# Quickstart Guide: Frontend for The Evolution of Todo - Phase II

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Access to the backend API server

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd [repository-name]
   ```

2. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

3. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

4. **Environment Configuration**
   Create a `.env.local` file in the frontend directory with the following:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:8000
   BETTER_AUTH_SECRET=your-secret-key
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000) to see the application

## Key Features

- **Authentication**: Sign up and sign in with email/password
- **Todo Management**: Create, read, update, delete, and mark todos as complete
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Real-time Updates**: Todos update immediately after actions
- **Loading States**: Visual feedback during API operations
- **Error Handling**: User-friendly error messages

## Running Tests

```bash
# Run unit tests
npm run test

# Run end-to-end tests
npm run test:e2e

# Run tests with coverage
npm run test:coverage
```

## Building for Production

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## API Integration

The frontend communicates with the backend API for all data operations:
- Authentication endpoints via Better Auth
- Todo CRUD operations via REST API
- JWT tokens automatically included in requests
- Protected routes redirect unauthenticated users