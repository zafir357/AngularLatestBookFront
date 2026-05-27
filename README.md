# 📚 BookClient

> Angular 19 + ASP.NET Core .NET 10 — Full-Stack Book Management App

---

<details open>
<summary>🇬🇧 English</summary>

## Overview

A full-stack book management application built with **Angular 19** (frontend) and **ASP.NET Core .NET 10** (backend). Demonstrates one-to-many and many-to-many relationships with a clean, modern UI.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Angular 19, TypeScript, Signals, Reactive Forms |
| Backend | ASP.NET Core (.NET 10), Entity Framework Core, SQLite |
| ORM Mapping | AutoMapper |
| API Docs | Swagger / OpenAPI |

---

## Data Model

```
Publisher (1) ──────────────────── Book (N)
                                     │
                                     │ many-to-many
                                     │ via BookAuthor
                                  Author (N)
```

- **Publisher → Books**: One-to-many. A publisher has many books. Deleting a publisher sets `Book.PublisherId` to `NULL` (books are not deleted).
- **Book ↔ Author**: Many-to-many via `BookAuthor` join table. A book can have multiple authors, an author can have multiple books.

---

## Project Structure

```
book-client/
├── src/
│   └── app/
│       ├── core/
│       │   ├── models/           # TypeScript interfaces matching .NET DTOs
│       │   ├── services/         # HTTP services with signals
│       │   └── interceptors/     # HTTP interceptors
│       ├── features/
│       │   ├── authors/          # Authors list, detail, form
│       │   ├── books/            # Books list, detail, form
│       │   └── publishers/       # Publishers list, detail, form
│       ├── shared/
│       │   └── components/
│       │       └── confirm-dialog/   # Reusable confirmation dialog
│       └── layout/
│           └── navbar/           # Top navigation bar
├── src/environments/
│   └── environment.ts            # API base URL config
└── angular.json
```

---

## Prerequisites

| Tool | Version | Download |
|---|---|---|
| Node.js | v20 or v22 LTS | https://nodejs.org |
| Angular CLI | v19+ | `npm install -g @angular/cli` |
| .NET SDK | v10 | https://dotnet.microsoft.com |

---

## Backend Setup (.NET Core API)

### 1. Open the API project

```bash
cd .NETCoreBookApi
```

### 2. Configure CORS

Open `Program.cs` and ensure the following is present:

```csharp
// Add CORS policy — allows Angular dev server
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Apply CORS — must be BEFORE app.MapControllers()
app.UseCors("AllowAngular");
app.MapControllers();
```

> **Important**: If Angular runs on a different port (e.g. 4201), add it to `WithOrigins("http://localhost:4200", "http://localhost:4201")`.

### 3. Run the API

```bash
dotnet run --launch-profile http
```

API running at: `http://localhost:5280`

Swagger UI: `http://localhost:5280/swagger`

### 4. Verify

Open in browser:
```
http://localhost:5280/api/publishers
http://localhost:5280/api/authors
http://localhost:5280/api/books
```

You should see JSON with seed data.

---

## Frontend Setup (Angular)

### 1. Install dependencies

```bash
cd book-client
npm install
```

### 2. Configure the API URL

Open `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:5280/api'  // ← update if needed
};
```

### 3. Run Angular

```bash
ng serve
```

Open: `http://localhost:4200`

---

## Running Both Projects

Open two terminals:

**Terminal 1 — API:**
```bash
cd .NETCoreBookApi
dotnet run --launch-profile http
# → http://localhost:5280
```

**Terminal 2 — Angular:**
```bash
cd book-client
ng serve
# → http://localhost:4200
```

---

## API Endpoints

### Books
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/books` | Get all books (with publisher + authors) |
| GET | `/api/books/:id` | Get book by ID |
| POST | `/api/books` | Create book (with authorIds) |
| PUT | `/api/books/:id` | Update book title/year/publisher |
| PUT | `/api/books/:id/authors` | Update book authors (many-to-many) |
| DELETE | `/api/books/:id` | Delete book |

### Authors
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/authors` | Get all authors (with books) |
| GET | `/api/authors/:id` | Get author by ID |
| POST | `/api/authors` | Create author |
| PUT | `/api/authors/:id` | Update author |
| PUT | `/api/authors/:id/books` | Update author books (many-to-many) |
| DELETE | `/api/authors/:id` | Delete author |

### Publishers
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/publishers` | Get all publishers |
| GET | `/api/publishers/:id` | Get publisher by ID |
| POST | `/api/publishers` | Create publisher |
| PUT | `/api/publishers/:id` | Update publisher |
| PUT | `/api/publishers/:id/books` | Assign books to publisher |
| DELETE | `/api/publishers/:id` | Delete publisher (sets PublisherId to NULL) |

---

## Key Angular Concepts

### Signals
Reactive state containers. When `.set()` is called, all consumers update automatically.

```typescript
publishers = signal<Publisher[]>([]);
this.publishers.set(data);  // triggers re-render
this.publishers()           // read the value
```

### Services with DI
Singletons injected via `inject()`. All components share the same instance.

```typescript
@Injectable({ providedIn: 'root' })
export class PublishersService {
  private http = inject(HttpClient);
  publishers = signal<Publisher[]>([]);
}
```

### Observable → Signal Flow
HttpClient returns Observables. We subscribe and pipe results into signals.

```typescript
this.http.get<Publisher[]>(url).subscribe({
  next: (data) => this.publishers.set(data),
  error: () => this.error.set('Failed')
});
```

### effect()
Runs automatically when signals it reads change. Used to pre-fill edit forms.

```typescript
constructor() {
  effect(() => {
    const p = this.service.selectedPublisher();
    if (p && this.isEdit) {
      this.form.patchValue({ name: p.name, country: p.country });
    }
  });
}
```

### Many-to-Many in Action
Creating a book with multiple authors:

```typescript
// POST /api/books
{
  title: "Co-authored Book",
  year: 2024,
  publisherId: 1,
  authorIds: [1, 2]   // ← multiple authors
}

// PUT /api/books/1/authors — update authors
{
  authorIds: [1, 3]   // ← replaces all existing author links
}
```

---

## Common Issues

| Issue | Solution |
|---|---|
| CORS error in browser | Check `UseCors` is before `MapControllers` and Angular port is in `WithOrigins` |
| "Failed to load publishers" | Verify API is running and `environment.ts` has the correct URL |
| Port 4200 already in use | Run `ng serve --port 4201` and add `4201` to CORS config |
| AutoMapper exception | Check `MappingProfile.cs` — all DTO → Model mappings must be registered |
| Signal not updating template | Make sure you call `.set()` not directly assign the value |

---

## CLI Commands

```bash
ng g c features/books/book-detail    # Generate component (4 files)
ng g s core/services/books           # Generate service (2 files)
ng g interface core/models/book      # Generate interface
ng serve                             # Dev server
ng build                             # Production build
```

</details>

---

<details>
<summary>🇫🇷 Français</summary>

## Vue d'ensemble

Une application full-stack de gestion de livres construite avec **Angular 19** (frontend) et **ASP.NET Core .NET 10** (backend). Démontre les relations one-to-many et many-to-many avec une interface moderne et propre.

---

## Stack Technique

| Couche | Technologie |
|---|---|
| Frontend | Angular 19, TypeScript, Signals, Reactive Forms |
| Backend | ASP.NET Core (.NET 10), Entity Framework Core, SQLite |
| Mapping ORM | AutoMapper |
| Docs API | Swagger / OpenAPI |

---

## Modèle de données

```
Publisher (1) ──────────────────── Book (N)
                                     │
                                     │ many-to-many
                                     │ via BookAuthor
                                  Author (N)
```

- **Publisher → Books** : One-to-many. Un publisher peut avoir plusieurs livres. Supprimer un publisher met `Book.PublisherId` à `NULL` (les livres ne sont pas supprimés).
- **Book ↔ Author** : Many-to-many via la table de jointure `BookAuthor`. Un livre peut avoir plusieurs auteurs, un auteur peut avoir plusieurs livres.

---

## Structure du projet

```
book-client/
├── src/
│   └── app/
│       ├── core/
│       │   ├── models/           # Interfaces TypeScript correspondant aux DTOs .NET
│       │   ├── services/         # Services HTTP avec signals
│       │   └── interceptors/     # Intercepteurs HTTP
│       ├── features/
│       │   ├── authors/          # Liste, détail, formulaire auteurs
│       │   ├── books/            # Liste, détail, formulaire livres
│       │   └── publishers/       # Liste, détail, formulaire publishers
│       ├── shared/
│       │   └── components/
│       │       └── confirm-dialog/   # Dialog de confirmation réutilisable
│       └── layout/
│           └── navbar/           # Barre de navigation
├── src/environments/
│   └── environment.ts            # Config URL de l'API
└── angular.json
```

---

## Prérequis

| Outil | Version | Téléchargement |
|---|---|---|
| Node.js | v20 ou v22 LTS | https://nodejs.org |
| Angular CLI | v19+ | `npm install -g @angular/cli` |
| .NET SDK | v10 | https://dotnet.microsoft.com |

---

## Configuration du Backend (.NET Core API)

### 1. Ouvrir le projet API

```bash
cd .NETCoreBookApi
```

### 2. Configurer CORS

Ouvrir `Program.cs` et s'assurer que ce code est présent :

```csharp
// Définir la politique CORS — autorise le serveur de dev Angular
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Appliquer CORS — doit être AVANT app.MapControllers()
app.UseCors("AllowAngular");
app.MapControllers();
```

> **Important** : Si Angular tourne sur un port différent (ex: 4201), l'ajouter dans `WithOrigins("http://localhost:4200", "http://localhost:4201")`.

### 3. Lancer l'API

```bash
dotnet run --launch-profile http
```

API disponible sur : `http://localhost:5280`

Swagger UI : `http://localhost:5280/swagger`

### 4. Vérifier

Ouvrir dans le navigateur :
```
http://localhost:5280/api/publishers
http://localhost:5280/api/authors
http://localhost:5280/api/books
```

Vous devriez voir du JSON avec les données de seed.

---

## Configuration du Frontend (Angular)

### 1. Installer les dépendances

```bash
cd book-client
npm install
```

### 2. Configurer l'URL de l'API

Ouvrir `src/environments/environment.ts` :

```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:5280/api'  // ← modifier si nécessaire
};
```

### 3. Lancer Angular

```bash
ng serve
```

Ouvrir : `http://localhost:4200`

---

## Lancer les deux projets

Ouvrir deux terminaux :

**Terminal 1 — API :**
```bash
cd .NETCoreBookApi
dotnet run --launch-profile http
# → http://localhost:5280
```

**Terminal 2 — Angular :**
```bash
cd book-client
ng serve
# → http://localhost:4200
```

---

## Endpoints API

### Livres (Books)
| Méthode | Endpoint | Description |
|---|---|---|
| GET | `/api/books` | Récupérer tous les livres (avec publisher + auteurs) |
| GET | `/api/books/:id` | Récupérer un livre par ID |
| POST | `/api/books` | Créer un livre (avec authorIds) |
| PUT | `/api/books/:id` | Mettre à jour titre/année/publisher |
| PUT | `/api/books/:id/authors` | Mettre à jour les auteurs (many-to-many) |
| DELETE | `/api/books/:id` | Supprimer un livre |

### Auteurs (Authors)
| Méthode | Endpoint | Description |
|---|---|---|
| GET | `/api/authors` | Récupérer tous les auteurs (avec livres) |
| GET | `/api/authors/:id` | Récupérer un auteur par ID |
| POST | `/api/authors` | Créer un auteur |
| PUT | `/api/authors/:id` | Mettre à jour un auteur |
| PUT | `/api/authors/:id/books` | Mettre à jour les livres de l'auteur (many-to-many) |
| DELETE | `/api/authors/:id` | Supprimer un auteur |

### Éditeurs (Publishers)
| Méthode | Endpoint | Description |
|---|---|---|
| GET | `/api/publishers` | Récupérer tous les publishers |
| GET | `/api/publishers/:id` | Récupérer un publisher par ID |
| POST | `/api/publishers` | Créer un publisher |
| PUT | `/api/publishers/:id` | Mettre à jour un publisher |
| PUT | `/api/publishers/:id/books` | Assigner des livres à un publisher |
| DELETE | `/api/publishers/:id` | Supprimer (met PublisherId à NULL) |

---

## Concepts Angular clés

### Signals
Conteneurs d'état réactifs. Quand `.set()` est appelé, tous les consommateurs se mettent à jour automatiquement.

```typescript
publishers = signal<Publisher[]>([]);
this.publishers.set(data);  // déclenche le re-render
this.publishers()           // lire la valeur
```

### Services avec DI
Singletons injectés via `inject()`. Tous les composants partagent la même instance.

```typescript
@Injectable({ providedIn: 'root' })
export class PublishersService {
  private http = inject(HttpClient);
  publishers = signal<Publisher[]>([]);
}
```

### Flux Observable → Signal
HttpClient retourne des Observables. On subscribe et on met le résultat dans un signal.

```typescript
this.http.get<Publisher[]>(url).subscribe({
  next: (data) => this.publishers.set(data),
  error: () => this.error.set('Erreur')
});
```

### effect()
S'exécute automatiquement quand les signals qu'il lit changent. Utilisé pour pré-remplir les formulaires d'édition.

```typescript
constructor() {
  effect(() => {
    const p = this.service.selectedPublisher();
    if (p && this.isEdit) {
      this.form.patchValue({ name: p.name, country: p.country });
    }
  });
}
```

### Many-to-Many en action
Créer un livre avec plusieurs auteurs :

```typescript
// POST /api/books
{
  title: "Livre co-écrit",
  year: 2024,
  publisherId: 1,
  authorIds: [1, 2]   // ← plusieurs auteurs
}

// PUT /api/books/1/authors — mettre à jour les auteurs
{
  authorIds: [1, 3]   // ← remplace tous les liens existants
}
```

---

## Problèmes fréquents

| Problème | Solution |
|---|---|
| Erreur CORS dans le navigateur | Vérifier que `UseCors` est avant `MapControllers` et que le port Angular est dans `WithOrigins` |
| "Failed to load publishers" | Vérifier que l'API tourne et que `environment.ts` a la bonne URL |
| Port 4200 déjà utilisé | Lancer `ng serve --port 4201` et ajouter `4201` dans la config CORS |
| Exception AutoMapper | Vérifier `MappingProfile.cs` — tous les mappings DTO → Model doivent être enregistrés |
| Signal ne met pas à jour le template | S'assurer d'appeler `.set()` et non d'assigner directement la valeur |

---

## Commandes CLI

```bash
ng g c features/books/book-detail    # Générer un composant (4 fichiers)
ng g s core/services/books           # Générer un service (2 fichiers)
ng g interface core/models/book      # Générer une interface
ng serve                             # Serveur de développement
ng build                             # Build de production
```

</details>

