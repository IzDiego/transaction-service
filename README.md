# Transaction Service

A microservices-based transaction management system built with Node.js, TypeScript, and MongoDB.

## Features

- CRUD operations for transactions
- Report generation in Excel format
- Metrics and analytics endpoints
- Local storage for reports (simulating S3)
- MongoDB for data persistence

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <https://github.com/IzDiego/transaction-service>
cd transaction-service
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=3000
MONGODB_URI=mongodb://user:pswrdlocalhost:27017/transaction-service
NODE_ENV=development
```

4. Seed the database with sample data:
```bash
npm run seed
```

## Running the Application

Development mode:
```bash
npm run dev
```

## API Endpoints

### Transactions

- `POST /api/transactions` - Create a new transaction
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/:id` - Get a specific transaction
- `PUT /api/transactions/:id` - Update a transaction
- `DELETE /api/transactions/:id` - Deactivate a transaction

### Reports

- `POST /api/reports/generate` - Generate a new report
- `GET /api/reports/download/:filename` - Download a generated report

### Metrics

- `GET /api/metrics/by-category` - Get transactions grouped by category
- `GET /api/metrics/by-date` - Get transactions grouped by date
- `GET /api/metrics/by-client` - Get transactions grouped by client

## Project Structure

```
src/
├── models/         # Database models
├── routes/         # API routes
├── services/       # Business logic
├── middleware/     # Express middleware
├── utils/          # Utility functions
└── scripts/        # Database scripts
```