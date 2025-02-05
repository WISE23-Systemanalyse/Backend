# Kinoticketsystem - Backend

Ein Backend-System für die Verwaltung von Kinobuchungen, entwickelt mit Deno und PostgreSQL.

## Voraussetzungen

Bevor Sie beginnen, stellen Sie sicher, dass folgende Software installiert ist:

- [Deno](https://deno.land/) (Version 1.41.0 oder höher)
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Installation & Setup

1. **Repository klonen**

   git clone https://github.com/ihr-username/kinoticketsystem-backend.git
   cd kinoticketsystem-backend

2. **Umgebungsvariablen konfigurieren**

   - Erstellen Sie eine `.env` Datei und passen Sie die Werte an:

    DATABASE_URL=postgres://root:password123@localhost:5432/cinema
    TMDB_API_KEY=eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2M2NlYzU4ZGQ4ODI3ODA3NzViMGNhZjRhZGVlMTY2YyIsIm5iZiI6MTczMzIyMjU3MS40NjcsInN1YiI6IjY3NGVlMGFiOTAyOWExZmNjMzZhYTVjNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.nSa8QmTJD6aFuCFSGLRFBLe4kin-zR-nudk_qK0643w

3. **Datenbank starten**

   docker run --name database-container -e POSTGRES_USER=root -e POSTGRES_PASSWORD=password123 -e POSTGRES_DB=cinema -p 5432:5432 -d postgres

5. **Anwendung starten**

   deno run start


Die Anwendung läuft nun standardmäßig auf `http://localhost:8000`.

## API-Endpunkte

GET /api/status

GET /movies/api/movies -> gibt id’s von allen Filmen + Titel, Genre<br>
GET /movies/:id -> gibt Informationen über einen Film (alle infos)<br>
GET /movies/:id/thumbnail -> gibt das Thumbnail zurück<br>
GET /api/movies/:id/seats -> gibt die Sitzplätze für einen Film zurück

POST /api/reserve -> "expiresAt": "2024-12-01T10:00:00Z"<br>
DELETE /api/reserve

GET /api/cart -> zeigt die Reservierungen des Benutzers an<br>
POST /api/checkout

POST /api/register<br>
POST /api/login<br>
POST /api/logout
