# 📚 NestJS Swagger Integration - Studi Kasus

Dokumentasi lengkap tentang cara mengintegrasikan dan menggunakan Swagger (OpenAPI) di NestJS untuk membuat dokumentasi API yang interaktif dan profesional.

## 📖 Daftar Isi

- [Pengenalan](#-pengenalan)
- [Instalasi](#-instalasi)
- [Konfigurasi Dasar](#-konfigurasi-dasar)
- [Struktur Project](#-struktur-project)
- [Cara Kerja](#-cara-kerja)
- [Decorator Swagger](#-decorator-swagger)
- [Best Practices](#-best-practices)
- [Cara Menggunakan](#-cara-menggunakan)
- [Troubleshooting](#-troubleshooting)

---

## 🎯 Pengenalan

**Swagger** (sekarang dikenal sebagai OpenAPI) adalah framework untuk mendokumentasikan REST API. Dengan Swagger, kita dapat:

- ✅ Membuat dokumentasi API yang interaktif
- ✅ Menguji endpoint API langsung dari browser
- ✅ Menghasilkan client SDK secara otomatis
- ✅ Memvalidasi request/response schema
- ✅ Meningkatkan kolaborasi antara frontend dan backend developer

**NestJS** menyediakan modul `@nestjs/swagger` yang memudahkan integrasi Swagger dengan menggunakan decorator TypeScript.

---

## 📦 Instalasi

Install package yang diperlukan:

```bash
npm install --save @nestjs/swagger
```

---

## ⚙️ Konfigurasi Dasar

### 1. Setup di `main.ts`

File `main.ts` adalah entry point aplikasi NestJS. Di sini kita mengkonfigurasi Swagger:

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Enable API Versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // 2. Konfigurasi Swagger Document
  const config = new DocumentBuilder()
    .setTitle('NestJS Swagger') // Judul API
    .setDescription('NestJS Swagger API description') // Deskripsi API
    .setVersion('1.0') // Versi API
    .addBearerAuth(
      // Konfigurasi Authentication
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        in: 'header',
      },
      'access-token', // Nama reference untuk auth
    )
    .build();

  // 3. Generate Swagger Document
  const document = SwaggerModule.createDocument(app, config);

  // 4. Setup Swagger UI
  SwaggerModule.setup('docs', app, document); // Akses di /docs

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

**Penjelasan:**

| Konfigurasi                      | Fungsi                                    |
| -------------------------------- | ----------------------------------------- |
| `DocumentBuilder()`              | Builder untuk membuat konfigurasi Swagger |
| `.setTitle()`                    | Mengatur judul dokumentasi API            |
| `.setDescription()`              | Mengatur deskripsi API                    |
| `.setVersion()`                  | Mengatur versi API                        |
| `.addBearerAuth()`               | Menambahkan autentikasi JWT Bearer Token  |
| `SwaggerModule.createDocument()` | Generate dokumen OpenAPI dari konfigurasi |
| `SwaggerModule.setup()`          | Mount Swagger UI di path tertentu         |

### 2. Akses Swagger UI

Setelah aplikasi berjalan, buka browser dan akses:

```
http://localhost:3000/docs
```

Anda akan melihat dokumentasi API yang interaktif! 🎉

---

## 📁 Struktur Project

```
src/
├── main.ts                           # Entry point & Swagger setup
├── app.module.ts
└── modules/
    └── users/
        ├── users.controller.ts       # Controller dengan Swagger decorators
        ├── users.service.ts          # Business logic
        ├── entities/
        │   └── user.entity.ts        # Entity dengan @ApiProperty
        └── dto/
            ├── create-user.dto.ts    # Request DTO
            ├── update-user.dto.ts    # Request DTO
            └── responses/
                ├── create-user-response.dto.ts  # Response DTO
                ├── get-user.response.dto.ts     # Response DTO
                └── get-users-response.dto.ts    # Response DTO
```

---

## 🔧 Cara Kerja

### 1. **Controller Level Decorators**

Di `users.controller.ts`, kita menggunakan decorator di level class:

```typescript
@ApiTags('Users') // Grouping endpoint di Swagger UI
@ApiBearerAuth('access-token') // Require authentication
@Controller({ path: 'users', version: '1' }) // Base path: /v1/users
export class UsersController {
  // ...
}
```

**Penjelasan:**

- `@ApiTags('Users')`: Mengelompokkan semua endpoint dalam controller ini di bawah tag "Users"
- `@ApiBearerAuth('access-token')`: Menandakan semua endpoint memerlukan JWT token
- `@Controller({ path: 'users', version: '1' })`: Base URL menjadi `/v1/users`

### 2. **Endpoint Level Decorators**

Setiap endpoint method menggunakan decorator untuk dokumentasi:

#### **POST - Create User**

```typescript
@Post()
@ApiOperation({ summary: 'Create a new user' })
@ApiCreatedResponse({
  description: 'The user has been successfully created.',
  type: CreateUserResponseDto
})
create(@Body() createUserDto: CreateUserDto) {
  return this.usersService.create(createUserDto);
}
```

**Penjelasan:**

- `@ApiOperation()`: Deskripsi singkat endpoint
- `@ApiCreatedResponse()`: Dokumentasi response 201 (Created)
- `type: CreateUserResponseDto`: Schema response yang akan ditampilkan

#### **GET - Get All Users**

```typescript
@Get()
@ApiOperation({ summary: 'Get all users' })
@ApiOkResponse({
  description: 'List of all users.',
  type: GetUsersResponseDto
})
findAll() {
  return this.usersService.findAll();
}
```

#### **GET - Get User by ID**

```typescript
@Get(':id')
@ApiOperation({ summary: 'Get a user by id' })
@ApiParam({ name: 'id', description: 'User ID', type: String })
@ApiOkResponse({
  description: 'The found user.',
  type: GetUserResponseDto
})
@ApiNotFoundResponse({ description: 'User not found.' })
findOne(@Param('id') id: string) {
  return this.usersService.findOne(id);
}
```

**Penjelasan:**

- `@ApiParam()`: Dokumentasi untuk path parameter
- `@ApiNotFoundResponse()`: Dokumentasi response 404

#### **PATCH - Update User**

```typescript
@Patch(':id')
@ApiOperation({ summary: 'Update a user' })
@ApiParam({ name: 'id', description: 'User ID', type: String })
@ApiOkResponse({
  description: 'The user has been successfully updated.',
  type: GetUserResponseDto
})
@ApiNotFoundResponse({ description: 'User not found.' })
update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  return this.usersService.update(id, updateUserDto);
}
```

#### **DELETE - Delete User**

```typescript
@Delete(':id')
@ApiOperation({ summary: 'Delete a user' })
@ApiParam({ name: 'id', description: 'User ID', type: String })
@ApiOkResponse({
  description: 'The user has been successfully deleted.',
  type: GetUserResponseDto
})
@ApiNotFoundResponse({ description: 'User not found.' })
remove(@Param('id') id: string) {
  return this.usersService.remove(id);
}
```

### 3. **DTO (Data Transfer Object)**

DTO mendefinisikan struktur data request dan response.

#### **Request DTO** (`create-user.dto.ts`)

```typescript
export class CreateUserDto {
  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: 'john@example.com' })
  email: string;

  @ApiProperty({
    example: 'admin',
    enum: ['admin', 'staff', 'viewer'],
  })
  role: string;
}
```

**Penjelasan:**

- `@ApiProperty()`: Mendokumentasikan setiap property
- `example`: Contoh value yang ditampilkan di Swagger UI
- `enum`: Membatasi value yang diperbolehkan

#### **Response DTO** (`create-user-response.dto.ts`)

```typescript
export class CreateUserDataDto {
  @ApiProperty({ type: () => User })
  user: User;
}

export class CreateUserResponseDto {
  @ApiProperty({ example: true })
  status: boolean;

  @ApiProperty({ example: 'User created successfully' })
  message: string;

  @ApiProperty({ type: () => CreateUserDataDto })
  data: CreateUserDataDto;
}
```

**Penjelasan:**

- `type: () => User`: Menggunakan arrow function untuk lazy loading (menghindari circular dependency)
- Nested DTO (`CreateUserDataDto`) untuk struktur response yang kompleks

### 4. **Entity** (`user.entity.ts`)

```typescript
export class User {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'The unique identifier of the user',
  })
  id: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the user',
  })
  name: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email address of the user',
  })
  email: string;

  @ApiProperty({
    example: 'admin',
    description: 'The role of the user',
  })
  role: string;
}
```

---

## 🎨 Decorator Swagger

### Controller Decorators

| Decorator          | Fungsi              | Contoh                           |
| ------------------ | ------------------- | -------------------------------- |
| `@ApiTags()`       | Grouping endpoint   | `@ApiTags('Users')`              |
| `@ApiBearerAuth()` | Require JWT auth    | `@ApiBearerAuth('access-token')` |
| `@ApiBasicAuth()`  | Require basic auth  | `@ApiBasicAuth()`                |
| `@ApiCookieAuth()` | Require cookie auth | `@ApiCookieAuth()`               |

### Method Decorators

| Decorator                    | Fungsi             | Contoh                                                     |
| ---------------------------- | ------------------ | ---------------------------------------------------------- |
| `@ApiOperation()`            | Deskripsi endpoint | `@ApiOperation({ summary: 'Create user' })`                |
| `@ApiResponse()`             | Generic response   | `@ApiResponse({ status: 200, description: 'Success' })`    |
| `@ApiOkResponse()`           | 200 response       | `@ApiOkResponse({ type: UserDto })`                        |
| `@ApiCreatedResponse()`      | 201 response       | `@ApiCreatedResponse({ type: UserDto })`                   |
| `@ApiBadRequestResponse()`   | 400 response       | `@ApiBadRequestResponse({ description: 'Invalid input' })` |
| `@ApiUnauthorizedResponse()` | 401 response       | `@ApiUnauthorizedResponse()`                               |
| `@ApiNotFoundResponse()`     | 404 response       | `@ApiNotFoundResponse({ description: 'Not found' })`       |
| `@ApiParam()`                | Path parameter     | `@ApiParam({ name: 'id', type: String })`                  |
| `@ApiQuery()`                | Query parameter    | `@ApiQuery({ name: 'page', required: false })`             |
| `@ApiBody()`                 | Request body       | `@ApiBody({ type: CreateUserDto })`                        |

### Property Decorators

| Decorator                | Fungsi               | Contoh                              |
| ------------------------ | -------------------- | ----------------------------------- |
| `@ApiProperty()`         | Dokumentasi property | `@ApiProperty({ example: 'John' })` |
| `@ApiPropertyOptional()` | Optional property    | `@ApiPropertyOptional()`            |

### Options untuk `@ApiProperty()`

```typescript
@ApiProperty({
  description: 'Deskripsi property',
  example: 'Contoh value',
  type: String,                    // Tipe data
  required: true,                  // Wajib atau tidak
  enum: ['admin', 'user'],         // Enum values
  minimum: 0,                      // Nilai minimum (number)
  maximum: 100,                    // Nilai maksimum (number)
  minLength: 3,                    // Panjang minimum (string)
  maxLength: 50,                   // Panjang maksimum (string)
  pattern: '^[a-zA-Z]+$',         // Regex pattern
  format: 'email',                 // Format (email, uuid, date, dll)
  isArray: true,                   // Apakah array
  nullable: false,                 // Bisa null atau tidak
})
```

---

## ✨ Best Practices

### 1. **Pisahkan Request dan Response DTO**

❌ **Jangan:**

```typescript
// Menggunakan entity langsung sebagai response
@ApiOkResponse({ type: User })
```

✅ **Lakukan:**

```typescript
// Buat DTO khusus untuk response
@ApiOkResponse({ type: GetUserResponseDto })
```

### 2. **Gunakan Nested DTO untuk Struktur Kompleks**

❌ **Jangan:**

```typescript
@ApiProperty({ type: { user: User } })  // Error!
data: { user: User }
```

✅ **Lakukan:**

```typescript
// Buat DTO terpisah
export class CreateUserDataDto {
  @ApiProperty({ type: () => User })
  user: User;
}

@ApiProperty({ type: () => CreateUserDataDto })
data: CreateUserDataDto;
```

### 3. **Gunakan Arrow Function untuk Type Reference**

```typescript
// Menghindari circular dependency
@ApiProperty({ type: () => User })
user: User;

@ApiProperty({ type: () => [User] })  // Array
users: User[];
```

### 4. **Dokumentasikan Semua Response Status**

```typescript
@ApiOkResponse({ description: 'Success', type: UserDto })
@ApiBadRequestResponse({ description: 'Invalid input' })
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiNotFoundResponse({ description: 'User not found' })
```

### 5. **Gunakan Enum untuk Nilai Terbatas**

```typescript
@ApiProperty({
  example: 'admin',
  enum: ['admin', 'staff', 'viewer']
})
role: string;
```

### 6. **Berikan Example yang Jelas**

```typescript
@ApiProperty({
  example: 'john.doe@example.com',
  description: 'User email address'
})
email: string;
```

---

## 🚀 Cara Menggunakan

### 1. **Jalankan Aplikasi**

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

### 2. **Akses Swagger UI**

Buka browser dan kunjungi:

```
http://localhost:3000/docs
```

### 3. **Testing Endpoint dengan Authentication**

#### **Langkah 1: Authorize**

1. Klik tombol **"Authorize"** di pojok kanan atas
2. Masukkan JWT token (tanpa prefix "Bearer")
3. Klik **"Authorize"**
4. Klik **"Close"**

#### **Langkah 2: Test Endpoint**

1. Pilih endpoint yang ingin di-test (misal: POST /v1/users)
2. Klik **"Try it out"**
3. Edit request body jika diperlukan
4. Klik **"Execute"**
5. Lihat response di bagian bawah

### 4. **Contoh Request Body**

**POST /v1/users** - Create User

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "role": "admin"
}
```

**PATCH /v1/users/:id** - Update User

```json
{
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "role": "staff"
}
```

### 5. **Contoh Response**

**Success Response (200/201)**

```json
{
  "status": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "admin"
    }
  }
}
```

**Error Response (404)**

```json
{
  "statusCode": 404,
  "message": "User not found",
  "error": "Not Found"
}
```

---

## 🔍 Troubleshooting

### 1. **Swagger UI tidak muncul**

**Masalah:** Halaman `/docs` menampilkan 404

**Solusi:**

- Pastikan `SwaggerModule.setup('docs', app, document)` dipanggil di `main.ts`
- Cek apakah aplikasi sudah berjalan
- Coba akses `http://localhost:3000/docs` (bukan `https`)

### 2. **Property tidak muncul di Swagger**

**Masalah:** Property di DTO tidak muncul di dokumentasi

**Solusi:**

- Pastikan menggunakan decorator `@ApiProperty()`
- Jangan lupa import dari `@nestjs/swagger`

```typescript
import { ApiProperty } from '@nestjs/swagger';
```

### 3. **Error: "Type is not assignable to ApiPropertyOptions"**

**Masalah:** TypeScript error saat menggunakan nested object

**Solusi:**

```typescript
// ❌ Salah
@ApiProperty({ type: { user: User } })

// ✅ Benar
export class DataDto {
  @ApiProperty({ type: () => User })
  user: User;
}

@ApiProperty({ type: () => DataDto })
data: DataDto;
```

### 4. **Authentication tidak bekerja**

**Masalah:** Setelah authorize, request masih unauthorized

**Solusi:**

- Pastikan nama reference sama di `main.ts` dan controller:

```typescript
// main.ts
.addBearerAuth({...}, 'access-token')

// controller
@ApiBearerAuth('access-token')
```

- Pastikan token valid dan belum expired

### 5. **Circular Dependency Error**

**Masalah:** Error saat compile karena circular dependency

**Solusi:**
Gunakan arrow function untuk type reference:

```typescript
@ApiProperty({ type: () => User })  // Lazy loading
user: User;
```

---

## 📚 Referensi

- [NestJS Swagger Documentation](https://docs.nestjs.com/openapi/introduction)
- [OpenAPI Specification](https://swagger.io/specification/)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)

---

## 📝 Kesimpulan

Dengan menggunakan Swagger di NestJS, kita dapat:

1. ✅ **Dokumentasi Otomatis**: Dokumentasi API dibuat otomatis dari kode
2. ✅ **Interactive Testing**: Test endpoint langsung dari browser
3. ✅ **Type Safety**: Memanfaatkan TypeScript untuk validasi
4. ✅ **Standardisasi**: Mengikuti standar OpenAPI
5. ✅ **Kolaborasi**: Memudahkan komunikasi antara frontend dan backend

**Key Points:**

- Gunakan decorator Swagger di controller, DTO, dan entity
- Pisahkan request dan response DTO
- Dokumentasikan semua response status
- Gunakan arrow function untuk type reference
- Berikan example yang jelas

---

**Happy Coding! 🚀**

Jika ada pertanyaan atau issue, silakan buat issue di repository ini.
