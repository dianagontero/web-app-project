import express from 'express';
import {param, check, validationResult} from 'express-validator';
import { getUSer, getCard, getMatch, getThreeCards, getRoundCards, getMatches, PostMatch, PostRoundCard, PutMatch, getCardbyID, CheckAnswer, getUserLogin, getCardDemo} from './DAO.mjs';
import cors from 'cors';
import morgan from 'morgan';
import passport from 'passport';
import session from 'express-session';
import LocalStrategy from 'passport-local';

// init express
const app = new express();
const port = 3001;

const corsOptions = {
  origin: 'http://localhost:5173',
  optionSuccesState: 200,
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));

passport.use(new LocalStrategy(
  { usernameField: 'email', passwordField: 'password' },
  async function verify(email, password, cb) {
    const user = await getUserLogin(email, password);
    if (!user) {
      return cb(null, false, "Incorrect email or password");
    }
    return cb(null, user);
  }
));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(user, cb) {
    return cb(null, user);
});

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'User not authenticated' });
};

app.use(session({
  secret: "this is a super mega important secret",
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.authenticate('session'));

//get three random cards
app.get('/api/cards/starting', async (req, res) => {
  try {
    const cards = await getThreeCards();
    if (cards instanceof Error) {
      return res.status(400).json({ error: cards.message });
    } else {
      res.status(200).json(cards);
    }
  } catch (err) {
    res.status(500).json({ error: `Internal server error: ${err.message}` });
  }
});


//get all matches for a user
app.get('/api/users/:UserId/matches', isLoggedIn,
  [param('UserId').isInt({min: 1}).withMessage('UserId must be a positive integer')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.params.UserId;
    const user = await getUSer(userId);
    if (user instanceof Error) {
      return res.status(404).json({ error: user.message });
    }

    try {
      const matches = await getMatches(userId);
      if (matches instanceof Error) {
        return res.status(404).json({ error: matches.message });
      } else {
        res.status(200).json(matches);
      }
    } catch (err) {
      res.status(500).json({ error: `Internal server error: ${err.message}` });
    }
  }
);

//create a new match
app.post('/api/users/:UserId/matches', 
  [
    param('UserId').isInt({min: 0}).withMessage('UserId must be a positive integer'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if the user exists (demo user not in db with userid 0)
    const userId = req.params.UserId;
    if (userId != 0) {
      const user = await getUSer(userId);
      if (user instanceof Error) {
        return res.status(404).json({ error: user.message });
      }
    }

    try {
      const matchId = await PostMatch(userId, -1, 0); //default values: matchResult = -1, cardsObtained = 0
      res.status(201).json(matchId);
    } catch (err) {
      res.status(500).json({ error: `Internal server error: ${err.message}` });
    }
  }
);

//update a match
app.put('/api/users/:UserId/matches/:MatchId', 
  [
    param('UserId').isInt({min: 0}).withMessage('UserId must be a positive integer'),
    param('MatchId').isInt({min: 1}).withMessage('MatchId must be a positive integer'),
    check('matchResult').isInt({min: 0, max: 1}).withMessage('matchResult must be 0 (loss) or 1 (win)'),
    check('cardsObtained').isInt({min: 3, max: 6}).withMessage('cardsObtained must be between 3 and 6')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.params.UserId;
    const matchId = req.params.MatchId;
    const {matchResult, cardsObtained} = req.body;

    if (userId != 0){
      const user = await getUSer(userId); 
      if (user instanceof Error) {
        return res.status(404).json({ error: user.message });
      }
    }
    const match = await getMatch(matchId);
    if (match instanceof Error) {
      return res.status(404).json({ error: match.message });
    }

    if (userId != 0) {
      if ((matchResult === 0 && (cardsObtained < 3 || cardsObtained === 6)) || (matchResult === 1 && cardsObtained < 6)) {
        return res.status(400).json({ error: 'Invalid matchResult and cardsObtained combination.' });
      }
    }
    try {
      const updatedMatch = await PutMatch(req.params.MatchId, req.body.matchResult, req.body.cardsObtained);
      if (updatedMatch instanceof Error) {
        return res.status(400).json({ error: updatedMatch.message });
      } else {
        res.status(200).json(`Match updated successfully. Rows affected: ${updatedMatch}`);
      }
    } catch (err) {
      res.status(500).json({ error: `Internal server error: ${err.message}` });
    }
  }
);

//post a new round card
app.post('/api/matches/:MatchId/rounds', isLoggedIn,
  [
    param('MatchId').isInt({min: 1}).withMessage('MatchId must be a positive integer'),
    check('cards').isArray().withMessage('Cards must be an array'),
    check('cards.*.CardId').isInt({min: 1}).withMessage('Each CardId must be a positive integer'),
    check('cards.*.RoundResult').isInt({min: -1, max: 1}).withMessage('RoundResult must be -1 (starting) 0 (loss) or 1 (win)'),
    check('cards.*.roundNumber').isInt({min: 0}).withMessage('roundNumber must be a positive integer')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const matchId = req.params.MatchId;
    const match = await getMatch(matchId);
    if (match instanceof Error) {
      return res.status(404).json({ error: match.message });
    }

    const {cards} = req.body;
    if (cards.length != 3 && cards.length != 1) {
      return res.status(400).json({ error: 'You must provide exactly 3 or 1 cards.' });
    }

    try {
      for (const card of cards) {
        const {CardId, RoundResult, roundNumber} = card;

        const cardData = await getCardbyID(CardId);
        if (cardData instanceof Error) {
          return res.status(404).json({ error: cardData.message });
        }

        if ((RoundResult === -1 || roundNumber === 0) && cards.length === 1) {
          return res.status(400).json({ error: 'Non starting card must have Round# > 0 and valid result (0 or 1)' });
        }
        else if ((RoundResult !== -1 || roundNumber !== 0) && cards.length === 3) {
          return res.status(400).json({ error: 'RoundResult must be -1 and Round# must be 0 for 3 cards.' });
        }
      }

      const CardIds = [];
      for (const card of cards) {
        const {CardId, RoundResult, roundNumber} = card;
        const roundCardId = await PostRoundCard(CardId, matchId, RoundResult, roundNumber);
        CardIds.push(roundCardId);
      }
      res.status(201).json(`Round card(s) created with ID(s): ${CardIds.join(', ')}`);
    } catch (err) {
      res.status(500).json({ error: `Internal server error: ${err.message}` });
    }
  }
);


//get round cards for a match
app.get('/api/matches/:MatchId/rounds', isLoggedIn, 
  [param('MatchId').isInt({min: 1}).withMessage('MatchId must be a positive integer')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const matchId = req.params.MatchId;
    const match = await getMatch(matchId);
    if (match instanceof Error) {
      return res.status(404).json({ error: match.message });
    }

    try {
      const roundCards = await getRoundCards(req.params.MatchId);
      if (roundCards instanceof Error) {
        return res.status(400).json({ error: roundCards.message });
      } else {
        res.status(200).json(roundCards);
      }
    } catch (err) {
      res.status(500).json({ error: `Internal server error: ${err.message}` });
    }
  }
);

//check answer for a card
app.post('/api/cards/:CardId', 
  [param('CardId').isInt({min: 1}).withMessage('CardId must be a positive integer'), 
  check('levelsx').isFloat({min: -1, max: 101}).withMessage('levelsx must be between 0 and 100'),
  check('leveldx').isFloat({min: -1, max: 101}).withMessage('leveldx must be between 0 and 100'), 
  check('endTime').isInt({min: 0}).withMessage('endTime must be a positive integer'),
  check('MatchId').isInt({min: 1}).withMessage('MatchId must be a positive integer')
  ],
  async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const cardId = req.params.CardId;
  const card = await getCardbyID(cardId);
  if (card instanceof Error) {
    return res.status(404).json({ error: card.message });
  }

  const matchId = req.body.MatchId;
  const match = await getMatch(matchId);
  if (match instanceof Error) {
    return res.status(404).json({ error: match.message });
  }
  
  const { levelsx, leveldx, endTime } = req.body;

  try {
    const result = await CheckAnswer(cardId, levelsx, leveldx, endTime, matchId);
    if (result.success === true) {
      res.status(200).json(result);
    }
    else {
      res.status(200).json(result);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

//get card
app.post('/api/matches/:MatchId/cards', 
  [ 
    param('MatchId').isInt({min: 1}).withMessage('MatchId must be a positive integer'),
    check('startTime').isInt({min: 0}).withMessage('startTime must be a positive integer')
  ],
  
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const matchId = req.params.MatchId;
    const match = await getMatch(matchId);
    if (match instanceof Error) {
      return res.status(404).json({ error: match.message });
    }
    try {
      const card = await getCard(matchId, req.body.startTime);
      if (card instanceof Error) {
        return res.status(404).json({ error: card.message });
      } else {
        res.status(200).json(card);
      }
    } catch (err) {
      res.status(500).json({ error: `Internal server error: ${err.message}` });
    }
  }
);

//get demo card
app.post('/api/demo/cards',
  [
    check('matchId').isInt({min: 1}).withMessage('gameId must be a positive integer'),
    check('cards').isArray().withMessage('Cards must be an array'),
    check('cards.*.CardId').isInt({min: 1}).withMessage('Each CardId must be a positive integer'),
    check('startTime').isInt({min: 0}).withMessage('startTime must be a positive integer')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const matchId = req.body.matchId;
    const match = await getMatch(matchId);
    if (match instanceof Error) {
      return res.status(404).json({ error: match.message });
    }
    
    try {
      const card = await getCardDemo(req.body.cards, matchId, req.body.startTime);
      if (card instanceof Error) {
        return res.status(404).json({ error: card.message });
      } else {
        res.status(200).json(card);
      }
    } catch (err) {
      res.status(500).json({ error: `Internal server error: ${err.message}` });
    }
  }
);

app.post('/api/login', function(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
    if (!user) {
      // display wrong login messages
      return res.status(401).send(info);
    }
    // success, perform the login
    req.login(user, (err) => {
      if (err)
        return next(err);
      
      // req.user contains the authenticated user, we send all the user info back
      return res.status(201).json(req.user);
    });
  })(req, res, next);
});


app.get('/api/session/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
  return res.status(401).json({ error: 'User not authenticated' });
}});


app.post('/api/logout', (req, res) => {
  req.logout(() => {
    res.end();
  });
});

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});