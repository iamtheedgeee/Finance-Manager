# Finance Manager

[![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)](https://reactjs.org/) 
[![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)](https://expressjs.com/) 
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/) 
[![Prisma](https://img.shields.io/badge/Prisma-0C344B?logo=prisma&logoColor=white)](https://www.prisma.io/) 
[![Redux](https://img.shields.io/badge/Redux-764ABC?logo=redux&logoColor=white)](https://redux.js.org/)

A full-stack web application for personal finance management.  
Finance Manager allows users to track transactions, manage accounts and categories, visualize reports with charts, and set budget limits.

---

## Features

- **Transaction Management**: Add, edit, and delete transactions across multiple accounts and categories.  
- **Custom Accounts & Categories**: Create and manage your own accounts and categories.  
- **Visual Reports**: View charts and summaries of your finances.  
- **Budgeting**: Set category budget limits and monitor spending.  

---

## Tech Stack

- **Frontend**: React  
- **Backend**: Express.js  
- **Database**: PostgreSQL with Prisma ORM  
- **State Management**: Redux  

---

## Installation

# 1. Clone the repository
git clone git@github.com:iamtheedgeee/Finance-Manager.git

# 2. Navigate to the project folder
cd Finance-Manager

# 3. Install backend dependencies
cd backend
npm install

# 4. Set up environment variables
# Create a .env file in the backend folder with your PostgreSQL credentials, e.g.:
# DATABASE_URL="postgresql://username:password@localhost:5432/financemanager"

# 5. Initialize Prisma client and apply migrations
npx prisma generate
npx prisma migrate dev --name init

# 6. Install frontend dependencies
cd ../frontend
npm install

# 7. Run the backend server
cd ../backend
npm start

# 8. Run the frontend development server
cd ../frontend
npm start


