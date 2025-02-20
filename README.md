````md
# Project Setup Guide

Follow these steps to set up and run the project locally.

### 1️⃣ Clone the Repository

Run the following commands:

```sh
git clone https://github.com/imYashGupta/contacts>
cd contacts
```
````

### 2️⃣ Install Dependencies

Install backend and frontend dependencies:

```sh
composer install
npm install
```

### 3️⃣ Set Up Environment

Copy the `.env.example` file and configure your database details:

```sh
cp .env.example .env
php artisan key:generate
```

### 4️⃣ Run Database Migrations

```sh
php artisan migrate
```

_(Include `--seed` if you have seeders to populate initial data.)_

### 5️⃣ Start the Development Server

```sh
php artisan serve
```

### 6️⃣ Start the Frontend

Run Vite to build and watch frontend assets:

```sh
npm run dev
```

### 7️⃣ Access the Application

Open your browser and visit:

```
http://127.0.0.1:8000
```

```

```
