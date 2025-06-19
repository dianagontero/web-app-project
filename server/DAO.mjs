import sqlite from 'sqlite3';
import { User, Card, Match, RoundCard } from './Models.mjs';
import crypto from 'crypto';

const db = new sqlite.Database('db.sqlite', (err) => {
    if (err) {
        throw new Error(`Error opening database: ${err.message}`);
    }
    else {
        console.log('Database opened successfully');
    };
});

export const getUSer = (UserId) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM User WHERE UserId = ?', [UserId], (err, row) => {
            if (err) {
                reject(err);
            } else if (row) {
                resolve(new User(row.UserId, row.email, row.psw, row.salt, row.name, row.surname));
            } else {
                resolve(new Error('User not found'));
            }
        });
    });
}


export const postTimerCard = (CardId, MatchId, StartTimer) => {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO Timer_Card (CardId, MatchId, StartTimer) VALUES (?, ?, ?)', 
            [CardId, MatchId, StartTimer], 
            function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
    });
}

export const getCard = (MatchId) => {
     return new Promise((resolve, reject) => {
        db.all('SELECT CardId FROM RoundCard WHERE MatchId = ?', [MatchId], (err, rows) => {
            if (err) {
                reject(err);
            }
            else if (!rows) {
                reject(new Error('No cards found for this match'));
            }
            else if (rows.length < 3) {
                reject(new Error('No enough cards found for this match'));
            }
            const usedIds = rows.map(row => row.CardId);

            let query = 'SELECT * FROM Card';
            let params = [];
            const placeholders = usedIds.map((id) => '?').join(', ');
            query += ` WHERE CardId NOT IN (${placeholders})`;
            params = usedIds;
            query += ' ORDER BY RANDOM() LIMIT 1';
            db.get(query, params, (err, row) => {
                if (err) {
                    reject(err);
                }
                if (row) {
                    resolve(new Card(row.CardId, row.title, null, row.url)); 
                } else {
                    reject(new Error('No card found'));
                }
            });
        });
    });
}


export const getCardDemo = (cards) => {
    return new Promise((resolve, reject) => {
        const usedIds = cards.map(card => card.CardId);
        let query = 'SELECT * FROM Card';
        let params = [];
        const placeholders = usedIds.map((id) => '?').join(', ');
        query += ` WHERE CardId NOT IN (${placeholders})`;
        params = usedIds;
        query += ' ORDER BY RANDOM() LIMIT 1';
        db.get(query, params, (err, row) => {
            if (err) {
                reject(err);
            }
            if (row) {
                resolve(new Card(row.CardId, row.title, null, row.url));
            } else {
                reject(new Error('No card found'));
            }
        });
    });
}

export const getCardbyID = (CardId) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM Card WHERE CardId = ?', [CardId], (err, row) => {
            if (err) {
                reject(err);
            } else if (row) {
                resolve(new Card(row.CardId, row.title, row.level, row.url));
            } else {
                resolve(new Error('Card not found'));
            }
        });
    });
}

export const getThreeCards = () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM Card ORDER BY RANDOM() LIMIT 3', [], (err, rows) => {
            if (err) {
                reject(err);
            } else if (rows.length === 3) {
                const cards = rows.map(row => new Card(row.CardId, row.title, row.level, row.url));
                resolve(cards);
            } else {
                resolve(new Error("Found less than 3 cards: " + rows.length));
            }
        });
    });
}

export const getMatch = (MatchId) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM Match WHERE MatchId = ?', [MatchId], (err, row) => {
            if (err) {
                reject(err);
            } else if (row) {
                resolve(new Match(row.MatchId, row.UserId, row.matchResult, row.cardsObtained, row.date));
            } else {
                resolve(new Error('Match not found'));
            }
        });
    });
}

export const getMatches = (UserId) => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM Match WHERE UserId = ?', [UserId], (err, rows) => {
            if (err) {
                reject(err);
            } else if (rows.length > 0) {
                const matches = rows.map(row => new Match(row.MatchId, row.UserId, row.matchResult, row.cardsObtained, row.date));
                resolve(matches);
            } else {
                resolve({ message: 'No matches found for this user' });
            }
        });
    });
}

export const PostMatch = (UserId, matchResult, cardsObtained) => {
    return new Promise((resolve, reject) => {
        const date = new Date().toISOString();
        db.run('INSERT INTO Match (UserId, matchResult, cardsObtained, date) VALUES (?, ?, ?, ?)', 
            [UserId, matchResult, cardsObtained, date], 
            function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
    });
}

export const PutMatch = (MatchId, matchResult, cardsObtained) => {
    return new Promise((resolve, reject) => {
        db.run('UPDATE Match SET matchResult = ?, cardsObtained = ? WHERE MatchId = ?', 
            [matchResult, cardsObtained, MatchId], 
            function(err) {
                if (err) {
                    reject(err);
                } else if (this.changes !== 0) {
                    resolve(this.changes);
                }
                else {
                    resolve(new Error('Match not found'));
                }
            });
    });
}

export const PostRoundCard = (CardId, MatchId, RoundResult, roundNumber) => {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO RoundCard (CardId, MatchId, RoundResult, roundNumber) VALUES (?, ?, ?, ?)', 
            [CardId, MatchId, RoundResult, roundNumber], 
            function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
    });
}

export const getRoundCards = (MatchId) => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM RoundCard WHERE MatchId = ?', [MatchId], (err, rows) => {
            if (err) {
                reject(err);
            } else if (rows.length >= 3 && rows.length <= 8) {
                const roundCards = rows.map(row => new RoundCard(row.RoundCardId, row.CardId, row.MatchId, row.RoundResult, row.roundNumber));
                resolve(roundCards);
            } else {
                resolve(new Error("Found invalid number of cards for this Match, length:" + rows.length));
            }
        });
    });
}

export const CheckAnswer = (cardId, levelLeft, levelRight, endTime, MatchId) => {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM Card WHERE CardID = ?', [cardId], (err, row) => {
      if (err) {
        return reject(err);
      }
      if (!row) {
        return reject(new Error('Card not found'));
      }

      db.get('SELECT * FROM Timer_Card WHERE CardId = ? AND MatchId = ?', [cardId, MatchId], (err, timerRow) => {
        if (err) {
          return reject(err);
        }
        if (!timerRow) {
          return reject(new Error('Timer card not found'));
        }

        const startTime = timerRow.StartTimer;
        const delta = endTime - startTime;

        if (delta > 30000) { // 30 seconds in milliseconds
          return resolve({success: false, timeout: true});
        }
      })

      const isCorrect = row.level >= levelLeft && row.level <= levelRight;

      if (isCorrect) {
        resolve({success: true, card: new Card(row.CardId, row.title, row.level, row.url)});
      } else {
        resolve({success: false, timeout: false});
      }
    });
  });
};

export const getUserLogin = (email, password) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM User WHERE email = ?', [email], (err, row) => {
            if (err) {
                reject(err);
            } else if (row === undefined) {
                resolve(false);
            }
            else {
                const user = {id: row.UserId, email: row.email, name: row.name, surname: row.surname};

                crypto.scrypt(password, row.salt, 32, function(err, hashedpsw) {
                    if (err) {
                        reject(err);
                    } else if (!crypto.timingSafeEqual(Buffer.from(row.psw, 'hex'), hashedpsw)) {
                        resolve(false);
                    } else {
                        resolve(user);
                    }
                });
            }
        });
    });
}