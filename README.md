# Secure Note-Taking API (Backend)

This is the backend server for the Secure Note-Taking and Public Posts web application. It is built using Node.js, Express, TypeScript, and MongoDB (via Mongoose).

## Tech Stack
* **Language:** TypeScript
* **Framework:** Express
* **Database:** MongoDB
* **Documentation:** Swagger (OpenAPI)

## Key Features
* **User Authentication:** Sign up, log in, and JSON Web Token (JWT) session authorization.
* **Private Notes:** Create, read, update, delete, and list personal notes with pagination. Only the note owner can view/edit their notes.
* **Public Posts:** Publish posts visible to all users. Users can only edit/delete their own posts.
* **Aggregations:** Direct Mongo aggregation lookup to query a user's combined documents (Scenario 2 lookup) and group users by interest profiles (Scenario 1 unwind/group).
* **Security & Roles:** RBAC separation where Admins can manage users but cannot delete/edit other users' files.

## Local Setup

### 1. Prerequisite
Ensure you have MongoDB running locally or have a MongoDB connection string.

### 2. Environment Setup
Create a `.env` file in the backend root:
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/careguide
JWT_SECRET=supersecretkey
```

### 3. Install & Start
```bash
# Install dependencies
npm install

# Start the dev server (defaults to http://localhost:5001)
npm run dev
```

## API Documentation & Verification
* **Swagger OpenAPI Docs:** Open `http://localhost:5001/api-docs` in your browser.
* **Run Integration Tests:** Run `npm test` or `npx tsx <path/to/verify.js>` to run the automated API suite.
# care-guide-task-backend
# care-guide-task-backend
