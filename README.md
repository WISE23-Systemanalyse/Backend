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

### Status
- `GET /status` - Überprüft den Status des Systems

### Filme
- `GET /movies` - Liste aller Filme
- `GET /movies/:id` - Details eines bestimmten Films
- `GET /movies/:id/shows` - Zeigt alle Vorführungen eines Films
- `GET /movies/tmdb/search` - Suche nach Filmen in TMDB
- `GET /movies/tmdb/popular` - Beliebte Filme von TMDB
- `POST /movies` - Neuen Film erstellen
- `PUT /movies/:id` - Film aktualisieren
- `DELETE /movies/:id` - Film löschen

### Benutzer & Authentifizierung
- `POST /signup` - Neuen Benutzer registrieren
- `POST /signin` - Benutzer anmelden
- `POST /verifyemail` - E-Mail-Adresse verifizieren
- `GET /users` - Alle Benutzer auflisten
- `GET /users/:id` - Benutzerdetails abrufen
- `PUT /users/:id` - Benutzerdaten aktualisieren
- `DELETE /users/:id` - Benutzer löschen
- `GET /users/:id/bookings` - Buchungen eines Benutzers anzeigen

### Buchungen
- `GET /bookings` - Alle Buchungen anzeigen
- `GET /bookings/details` - Detaillierte Buchungsübersicht
- `GET /bookings/:id` - Details einer Buchung
- `GET /bookings/payment/:paymentId` - Buchung nach Zahlungs-ID
- `POST /bookings` - Neue Buchung erstellen
- `PUT /bookings/:id` - Buchung aktualisieren
- `DELETE /bookings/:id` - Buchung stornieren

### Vorführungen
- `GET /shows` - Alle Vorführungen
- `GET /shows/details` - Detaillierte Vorführungsübersicht
- `GET /shows/:id` - Details einer Vorführung
- `GET /shows/hall/:id` - Vorführungen eines Saals
- `GET /shows/:id/seats` - Sitzplatzstatus einer Vorführung
- `GET /shows/:id/bookings` - Buchungen einer Vorführung
- `POST /shows` - Neue Vorführung erstellen
- `POST /shows/:id/book` - Sitzplatz für Vorführung buchen
- `PUT /shows/:id` - Vorführung aktualisieren
- `DELETE /shows/:id` - Vorführung löschen

### Säle & Sitzplätze
- `GET /halls` - Alle Kinosäle
- `GET /halls/:id` - Details eines Saals
- `GET /halls/:id/seats` - Sitzplätze eines Saals
- `POST /halls` - Neuen Saal erstellen
- `PUT /halls/:id` - Saal aktualisieren
- `DELETE /halls/:id` - Saal löschen

- `GET /seats` - Alle Sitzplätze
- `GET /seats/:id` - Details eines Sitzplatzes
- `POST /seats` - Sitzplatz erstellen
- `POST /seats/:id/reserve` - Sitzplatz reservieren
- `POST /seats/bulk` - Mehrere Sitzplätze erstellen
- `PUT /seats/bulk` - Mehrere Sitzplätze aktualisieren
- `DELETE /seats/bulk` - Mehrere Sitzplätze löschen

### Zahlungen
- `GET /payments` - Alle Zahlungen
- `GET /payments/:id` - Details einer Zahlung
- `POST /payments` - Neue Zahlung erstellen
- `POST /payments/create-order` - PayPal-Bestellung erstellen
- `POST /payments/finalize` - Buchung abschließen
- `PUT /payments/:id` - Zahlung aktualisieren
- `DELETE /payments/:id` - Zahlung löschen

### Kategorien
- `GET /categories` - Alle Kategorien
- `GET /categories/:id` - Details einer Kategorie
- `POST /categories` - Neue Kategorie erstellen
- `PUT /categories/:id` - Kategorie aktualisieren
- `DELETE /categories/:id` - Kategorie löschen

### Freundschaften
- `GET /friendships` - Alle Freundschaften
- `GET /friendships/:id` - Details einer Freundschaft
- `GET /friendships/user/:userId` - Freundschaften eines Benutzers
- `POST /friendships` - Neue Freundschaft erstellen
- `PUT /friendships/:id` - Freundschaft aktualisieren
- `DELETE /friendships/:id` - Freundschaft löschen

### Sonstiges
- `POST /newsletter/subscribe` - Newsletter-Anmeldung
- `POST /contact` - Kontaktformular absenden
