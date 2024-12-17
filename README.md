# Contract Management Frontend

## Project Overview

This is the frontend for the Contract Management System, developed using **React.js**. It provides an interface for uploading contracts, managing them, and real-time updates via Socket.IO.

## Technologies Used

- **React.js** for building UI
- **Axios** for API calls
- **Socket.IO** for real-time updates

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/ayushtiwari24/contract-management-frontend.git
cd contract-management-frontend

## Install Dependencies
npm install

#Create a .env file in the root directory:
REACT_APP_API_URL=https://contract-management-backend.onrender.com

#Run the following command:
npm start

This will start the application at http://localhost:3000.

##Deployment
The application is deployed on Vercel:
https://contract-management-frontend-ten.vercel.app/

##Features
-Upload Contracts: Upload contracts via JSON files.
-View Contracts: Filter, paginate, and view contract details.
-Edit/Delete Contracts: Update and delete contracts.
-Real-Time Updates: Updates are reflected immediately via Socket.IO.
```
