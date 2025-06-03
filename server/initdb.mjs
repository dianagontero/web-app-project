import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const dbFile = './DB.sqlite';

const schema = `
CREATE TABLE IF NOT EXISTS User (
    UserId INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    psw TEXT NOT NULL,
    salt TEXT NOT NULL,
    name TEXT NOT NULL,
    surname TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Card (
    CardId INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    level REAL NOT NULL,
    url TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Match (
    MatchId INTEGER PRIMARY KEY AUTOINCREMENT,
    UserId INTEGER NOT NULL,
    matchResult INTEGER NOT NULL,
    cardsObtained INTEGER NOT NULL,
    date TEXT NOT NULL,
    FOREIGN KEY(UserId) REFERENCES User(UserId)
);

CREATE TABLE IF NOT EXISTS RoundCard (
    RoundCardId INTEGER PRIMARY KEY AUTOINCREMENT,
    CardId INTEGER NOT NULL,
    MatchId INTEGER NOT NULL,
    RoundResult INTEGER NOT NULL,
    roundNumber INTEGER NOT NULL,
    FOREIGN KEY(CardId) REFERENCES Card(CardId),
    FOREIGN KEY(MatchId) REFERENCES Match(MatchId)
);
`;

const main = async () => {
    const db = await open({
        filename: dbFile,
        driver: sqlite3.Database
    });
    await db.exec(schema);
    console.log('Database initialized.');
    
    await db.run(
        `INSERT OR IGNORE INTO User (email, psw, salt, name, surname)
         VALUES (?, ?, ?, ?, ?)`,
        [
            'test@example.com',
            'hashedpassword',
            'randomsalt',
            'Mario',
            'Rossi'
        ]
    );

    // Insert 5 cards
    const cards = [
        ['Drago Rosso', 1, 'https://example.com/drago-rosso.png'],
        ['Mago Blu', 10, 'https://example.com/mago-blu.png'],
        ['Guerriero Verde', 5, 'https://example.com/guerriero-verde.png'],
        ['Fata Gialla', 4.5, 'https://example.com/fata-gialla.png'],
        ['Bestia Nera', 99.5, 'https://example.com/bestia-nera.png']
    ];
    for (const [title, level, url] of cards) {
        await db.run(
            `INSERT OR IGNORE INTO Card (title, level, url)
             VALUES (?, ?, ?)`,
            [title, level, url]
        );
    }
    console.log('Database initialized and populated.');
    await db.close();
};

main();