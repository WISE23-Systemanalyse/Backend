**Kinoticketsystem - Backend**

**Routen**

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
