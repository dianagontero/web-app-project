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
    ['Red wine on white outfit', 67, 'https://example.com/family01.png'],
  ['Political debate at dinner', 76, 'https://example.com/family02.png'],
  ['Forget cousin’s name during toast', 68, 'https://example.com/family03.png'],
  ['Seated at kids’ table at 25', 40, 'https://example.com/family04.png'],
  ['Grandma asks why you’re single', 5.5, 'https://example.com/family05.png'],
  ['Old photo posted online', 7.0, 'https://example.com/family06.png'],
  ['Accidental reply-all in group chat', 8.5, 'https://example.com/family07.png'],
  ['Family forgets your birthday', 10.0, 'https://example.com/family08.png'],
  ['Snoring cousin bed-sharing', 11.5, 'https://example.com/family09.png'],
  ['Dog eats holiday turkey', 13.0, 'https://example.com/family10.png'],
  ['Sneezing during speech', 14.5, 'https://example.com/family11.png'],
  ['Dish duty for 20 people', 16.0, 'https://example.com/family12.png'],
  ['Same gift three years straight', 17.5, 'https://example.com/family13.png'],
  ['Same outfit as aunt again', 19.0, 'https://example.com/family14.png'],
  ['Kids spill drink on host’s laptop', 20.5, 'https://example.com/family15.png'],
  ['Aunt brings up old story', 22.0, 'https://example.com/family16.png'],
  ['Power outage during dinner', 23.5, 'https://example.com/family17.png'],
  ['Lose voice mid-song', 25.0, 'https://example.com/family18.png'],
  ['Call partner by ex’s name', 26.5, 'https://example.com/family19.png'],
  ['Your ex shows up', 28.0, 'https://example.com/family20.png'],
  ['Trip giving a toast', 29.5, 'https://example.com/family21.png'],
  ['Baby bath pic in slideshow', 31.0, 'https://example.com/family22.png'],
  ['Ruin surprise party', 32.5, 'https://example.com/family23.png'],
  ['Kids paint on your car', 34.0, 'https://example.com/family24.png'],
  ['Karaoke glitch mid-performance', 35.5, 'https://example.com/family25.png'],
  ['Burn the turkey... again', 37.0, 'https://example.com/family26.png'],
  ['Lose voice before speech', 38.5, 'https://example.com/family27.png'],
  ['Between feuding relatives', 40.0, 'https://example.com/family28.png'],
  ['Cousin proposes at your party', 42.0, 'https://example.com/family29.png'],
  ['Partner mistaken for your sibling', 44.0, 'https://example.com/family30.png'],
  ['Break Grandma’s antique vase', 46.0, 'https://example.com/family31.png'],
  ['Livestream eating awkwardly', 48.0, 'https://example.com/family32.png'],
  ['Memorial slide has typo', 50.0, 'https://example.com/family33.png'],
  ['Cat vomits on your lap', 52.0, 'https://example.com/family34.png'],
  ['Roasted in family trivia', 54.0, 'https://example.com/family35.png'],
  ['Pants rip during charades', 56.0, 'https://example.com/family36.png'],
  ['Sibling announces pregnancy at your wedding', 58.0, 'https://example.com/family37.png'],
  ['BBQ ruined by raccoon', 60.0, 'https://example.com/family38.png'],
  ['Livestreamed in bathroom', 62.0, 'https://example.com/family39.png'],
  ['Knock over wedding cake', 64.0, 'https://example.com/family40.png'],
  ['Locked in bathroom before speech', 66.0, 'https://example.com/family41.png'],
  ['Dog humps a guest during photo', 68.0, 'https://example.com/family42.png'],
  ['Step on Grandpa’s oxygen tube', 70.0, 'https://example.com/family43.png'],
  ['Pants split in family photo', 73.0, 'https://example.com/family44.png'],
  ['Old nickname chant won’t stop', 76.0, 'https://example.com/family45.png'],
  ['Slide freezes on awkward photo', 79.0, 'https://example.com/family46.png'],
  ['Forget to pick up Grandma', 82.0, 'https://example.com/family47.png'],
  ['Sneeze on birthday cake', 85.0, 'https://example.com/family48.png'],
  ['Rant sent to entire family', 90.0, 'https://example.com/family49.png'],
  ['Knock over wedding arch', 95.0, 'https://example.com/family50.png']
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