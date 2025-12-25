# NestJS Starter Kits

> Opinionated, production-ready NestJS starter kits for building real-world backend applications.

This repository is a **monorepo** containing multiple **NestJS starter kits**, each designed to solve a specific backend use case with **best practices**, **clean architecture**, and **scalable structure** in mind.

---

## ✨ Why this repository exists

Most NestJS examples focus on *how things work*.
This repository focuses on **how things should be built in production**.

Each starter kit in this repo is:

* Opinionated (with clear architectural decisions)
* Easy to extend
* Ready to be used in real projects
* Well-documented per kit

---

## 📦 Available Starter Kits

| Kit                  | Description                               | Status         |
| -------------------- | ----------------------------------------- | -------------- |
| **nestjs-basic**     | Minimal NestJS setup with clean structure | ✅ Ready        |
| **nestjs-swagger**   | REST API starter with Swagger OpenAPI     | 🚧 In Progress |
| **nestjs-auth-jwt**  | Authentication using JWT                  | 🔜 Planned     |
| **nestjs-auth-rbac** | Role-based access control                 | 🔜 Planned     |
| **nestjs-prisma**    | Prisma ORM integration                    | 🔜 Planned     |

📂 All starter kits are located inside the [`/kits`](./kits) directory.

---

## 🗂 Repository Structure

```txt
nestjs-starter-kits/
├── README.md
├── kits/
│   ├── basic/
│   │   └── nestjs-basic/
│   ├── swagger/
│   │   └── nestjs-swagger/
│   └── auth/
│       └── nestjs-auth-jwt/
```

Each kit is **self-contained** and includes:

* Its own `README.md`
* Independent configuration
* Clear setup instructions

---

## 🚀 Getting Started

1. Choose a starter kit inside the `kits/` directory
2. Copy the kit to your project directory
3. Install dependencies
4. Start building

Example:

```bash
cd kits/swagger/nestjs-swagger
npm install
npm run start:dev
```

> Each kit may have additional setup steps.
> Please refer to the `README.md` inside the selected kit.

---

## 🧠 Design Principles

These starter kits are built with the following principles:

* **Separation of concerns**
* **DTO-first API design**
* **Validation & error handling by default**
* **Explicit configuration**
* **Readable over clever code**

---

## 🧪 What this is NOT

* Not a boilerplate generator
* Not a CLI tool
* Not a one-size-fits-all solution

This repository is a **collection of curated starting points**, not magic.

---

## 🤝 Contribution

Contributions are welcome.

If you want to:

* Improve an existing kit
* Propose a new starter kit
* Fix documentation

Please open an issue or submit a pull request.

---

## 📄 License

MIT License © 2025

---

## ⭐ Support

If this repository helps you:

* Give it a ⭐
* Share it with your team
* Use it as a base for your next project

---

Happy building with NestJS 🚀
