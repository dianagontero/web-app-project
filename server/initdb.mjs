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

CREATE TABLE IF NOT EXISTS TIMER_CARD (
    TimerCardId INTEGER PRIMARY KEY AUTOINCREMENT,
    CardId INTEGER NOT NULL,
    MatchId INTEGER NOT NULL,
    StartTimer INTEGER NOT NULL,
    FOREIGN KEY(CardId) REFERENCES Card(CardId),
    FOREIGN KEY(MatchId) REFERENCES Match(MatchId)
)
`;

const main = async () => {
    const db = await open({
        filename: dbFile,
        driver: sqlite3.Database
    });

    db.run("DROP TABLE IF EXISTS Card")
    db.run("DROP TABLE IF EXISTS Match")
    db.run("DROP TABLE IF EXISTS RoundCard")

    await db.exec(schema);
    console.log('Database initialized.');
    


     /*await db.run(
        `INSERT OR IGNORE INTO User (email, psw, salt, name, surname)
         VALUES (?, ?, ?, ?, ?)`,
        [
            'cip@example.com',
            'a095d4a185f8b0b6ca27211275f7f7b9f355eb16f32b45240b72b1f3811bfc08',
            '9c711903a8804b0e7c794002492da92c',
            'cip',
            'cip'
        ]
    );


    await db.run(
        `INSERT OR IGNORE INTO User (email, psw, salt, name, surname)
         VALUES (?, ?, ?, ?, ?)`,
        [
            'ciop@example.com',
            '55ac0e2e7c47f558137b699ed45e639464cb2f4d225bee9ac02baba027024025',
            'a0a018a209e96e153408522879427e12',
            'ciop',
            'ciop'
        ]
    );*/
    // Insert 5 cards
    const cards = [
  ['Red wine on white outfit', 95.0, 'image1.jpeg'],
  ['Political debate at dinner', 92.0, 'image2.jpeg'],
  ['Forget cousin’s name during toast', 89.0, 'image3.jpeg'],
  ['Seated at kids’ table at 25', 16.0, 'image4.jpeg'],
  ['Grandma asks why you’re single', 83.0, 'image5.jpeg'],
  ['Old photo posted online', 80.0, 'image6.jpeg'],
  ['Accidental reply-all in group chat', 77.0, 'image7.jpeg'],
  ['Family forgets your birthday', 74.0, 'image8.jpeg'],
  ['Snoring cousin bed-sharing', 71.0, 'image9.jpeg'],
  ['Dog eats holiday turkey', 68.0, 'image10.jpeg'],
  ['Sneezing during speech', 65.0, 'image11.jpeg'],
  ['Dish duty for 20 people', 62.0, 'image12.jpeg'],
  ['Same gift three years straight', 59.0, 'image13.jpeg'],
  ['Same outfit as aunt again', 56.0, 'image14.jpeg'],
  ['Kids spill drink on host’s laptop', 73.0, 'image15.jpeg'],
  ['Aunt brings up old story', 50.0, 'image16.jpeg'],
  ['Power outage during dinner', 47.0, 'image17.jpeg'],
  ['Lose voice mid-song', 44.0, 'image18.jpeg'],
  ['Call partner by ex’s name', 98.0, 'image19.jpeg'],
  ['Your ex shows up', 38.0, 'image20.jpeg'],
  ['Trip giving a toast', 35.0, 'image21.jpeg'],
  ['Baby bath pic in slideshow', 32.0, 'image22.jpeg'],
  ['Ruin surprise party', 29.0, 'image23.jpeg'],
  ['Kids paint on your car', 26.0, 'image24.jpeg'],
  ['Karaoke glitch mid-performance', 23.0, 'image25.jpeg'],
  ['Burn the turkey... again', 20.0, 'image26.jpeg'],
  ['Lose voice before speech', 17.0, 'image27.jpeg'],
  ['Between feuding relatives', 14.0, 'image28.jpeg'],
  ['Cousin proposes at your party', 11.0, 'image29.jpeg'],
  ['Partner mistaken for your sibling', 8.0, 'image30.jpeg'],
  ['Break Grandma’s antique vase', 5.0, 'image31.jpeg'],
  ['Livestream eating awkwardly', 2.0, 'image32.jpeg'],
  ['Memorial slide has typo', 1.5, 'image33.jpeg'],
  ['Cat vomits on your lap', 4.5, 'image34.jpeg'],
  ['Roasted in family trivia', 7.5, 'image35.jpeg'],
  ['Pants rip during charades', 10.5, 'image36.jpeg'],
  ['Sibling announces pregnancy at your wedding', 13.5, 'image37.jpeg'],
  ['BBQ ruined by raccoon', 16.5, 'image38.jpeg'],
  ['Livestreamed in bathroom', 19.5, 'image39.jpeg'],
  ['Knock over wedding cake', 22.5, 'image40.jpeg'],
  ['Locked in bathroom before speech', 25.5, 'image41.jpeg'],
  ['Dog humps a guest during photo', 28.5, 'image42.jpeg'],
  ['Step on Grandpa’s oxygen tube', 31.5, 'image43.jpeg'],
  ['Pants split in family photo', 34.5, 'image44.jpeg'],
  ['Old nickname chant won’t stop', 37.5, 'image45.jpeg'],
  ['Slide freezes on awkward photo', 40.5, 'image46.jpeg'],
  ['Forget to pick up Grandma', 43.5, 'image47.jpeg'],
  ['Sneeze on birthday cake', 46.5, 'image48.jpeg'],
  ['Rant sent to entire family', 49.5, 'image49.jpeg'],
  ['Knock over wedding arch', 52.5, 'image50.jpeg']
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