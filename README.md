# Milestone 4 - Enrico ZD

## 📌 Project Overview
This project is a **Banking System API** built with **NestJS + Prisma + PostgreSQL**.  
It provides features for **User Management**, **Account Management**, and **Transactions** with **JWT Authentication**.

---

## 📖 API Documentation
All available endpoints can be accessed via Postman:  

🔗 **[Postman Documentation](https://documenter.getpostman.com/view/20230761/2sB3BAMCUQ)**

---

## 🗂 ERD (Entity Relationship Diagram)
You can check the database structure in the ERD below:  

🔗 **[ERD Link](https://drive.google.com/file/d/1NvYjGq1fgzBFQYoPwAg-8D-Lt7N1dl8p/view?usp=sharing)**

---

## ⚙️ Installation & Setup

1. **Clone the repository**
    ```bash
    git clone https://github.com/revou-fsse-feb25/milestone-4-enrico-zd.git
    cd milestone-4-enrico-zd
    ```

2. **Install dependencies**
    ```bash
    npm install
    ```

3. **Setup environment variables**  
   Create a `.env` file in the root folder:
    ```env
    DATABASE_URL="postgresql://username:password@localhost:5432/db_name"
    JWT_SECRET="your_jwt_secret"
    JWT_REFRESH_SECRET="your_refresh_secret"
    ```

4. **Run migrations & optional seed**
    ```bash
    npx prisma migrate dev
    npx prisma db seed
    ```

5. **Run the project**
    ```bash
    npm run start:dev
    ```

---

## 🚀 Features
- **Authentication & Authorization**
  - User Registration & Login
  - JWT Access & Refresh Token
  - Role-based Access Control

- **User Management**
  - CRUD User (Soft Delete & Restore)
  - Last Login Tracking

- **Account Management**
  - Create, Update, Soft Delete & Restore Accounts
  - Balance management using Decimal

- **Transactions**
  - Deposit, Withdraw, and Transfer
  - View transaction history by user and account

---

## 📦 Tech Stack
- **Backend:** [NestJS](https://nestjs.com/)
- **Database ORM:** [Prisma](https://www.prisma.io/)
- **Database:** PostgreSQL
- **Authentication:** JWT (Access & Refresh Token)
- **Deployment:** Railway

