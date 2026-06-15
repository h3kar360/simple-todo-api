## Pattern yang Digunakan

Proyek ini menggunakan **Module-based Pattern**, yaitu arsitektur standar NestJS.

### Mengapa Menggunakan Pattern Ini?

1. **Pemisahan Tanggung Jawab**
   - Setiap fitur (auth, users, todos) memiliki module sendiri
   - Controller hanya menangani HTTP request/response
   - Service menangani logika yang dibutuhkan controller
   - Repository menangani akses database
   - Entity mendefinisikan struktur data dalam database
   - Data Transfer Object (DTO) mendefinisikan bentuk data yang dikirim antara client dan server

2. **Scalability**
   - Menambah fitur baru cukup membuat module baru
   - Tidak mengganggu module yang sudah ada

3. **Reusability**
   - Module bisa di-import ke module lain
   - Contoh: DatabaseModule digunakan oleh AuthModule dan TodosModule
   - BcryptService di CommonModule bisa dipakai dimana saja

4. **Maintainability**
   - Kode terorganisir dengan rapi
   - Mudah mencari file tertentu

5. **Testability**
   - Setiap module bisa di-test secara independen

## Cara Menjalankan Proyek

### Prasyarat

- **Node.js** (versi 18 atau lebih baru)
- **Docker** (untuk database PostgreSQL)

### Langkah-langkah

#### 1. Clone Repository

```bash
git clone https://github.com/{your_username}/simple-todo-api.git
cd simple-todo-api
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Setup Environment Variables

Buat file `.env` di root directory

Isikan file `.env` dengan:

```bash
# Database Environments
DB_HOST=localhost
DB_PORT=5232
DB_USER=h3kar360
DB_PASSWORD=password
DB_NAME=simple_todo

# JWT
JWT_SECRET=your_secret_key
```

#### 4. Setup PostgreSQL Database With Docker

```bash
docker-compose up -d
```

#### 5. Run The Application

```bash
npm run start:dev
```

Aplikasi berjalan di: `http://localhost:3000`
