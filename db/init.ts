import { sequelize } from './config';
import Genre from './models/genre';
import Movie from './models/movie';

async function initDatabase() {
  try {
    // Verbindung testen
    await sequelize.authenticate();
    console.log('Verbindung zur Datenbank hergestellt.');

    // Tabellen erstellen
    await sequelize.sync({ force: true }); // ACHTUNG: force: true löscht existierende Tabellen!
    
    // Optional: Beispiel-Genres erstellen
    await Genre.bulkCreate([
      { name: 'Action' },
      { name: 'Komödie' },
      { name: 'Drama' },
      { name: 'Science Fiction' }
    ]);

    console.log('Datenbank wurde initialisiert');
  } catch (error) {
    console.error('Fehler beim Initialisieren der Datenbank:', error);
  }
}

initDatabase(); 