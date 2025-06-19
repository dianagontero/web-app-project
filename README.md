[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/ArqHNgsV)
# Exam #1: "Stuff happens"
## Student: s343452 Gontero Diana 

## React Client Application Routes

- Route `/`: Home page, with buttons/links to start a new game, read the game rules, login/logout and view the user profile for logged in user. It includes a navbar present in each component.
- Route `/Login`: Login page to perform the login.
- Route `/Rules`: page showing game rules.
- Route `/GameIntro`: game page intro showing basic instructions to play and a button to get the 3 starting cards.
- Route `/:GameId`: game page to handle actual owned cards + getting and handling a new card + handling timer and timeout + handling wrong/correct user choices and victory/loss. It is used for games played by both login user and demo user. 
GameId is the identifier of the active game.  
- Route `/:GameId/Result`: page with the just ended game result. It shows the cards obtained for logged in user or a victory/loss message for demo user. GameId is the identifier of the just ended game.  
- Route `/UserProfile`: page showing user info + history of his/her games

## API Server

- POST `/api/users/:userId/matches` 
  - request parameters: userId
  - request body: None
  - response body: matchId of just created match.
  - error responses: 
    - 400 not valid param
    - 404 User not found
    - 500 server error
- GET `/api/users/:userId/matches` (just for logged in user)
  - request parameters: userId
  - request body: None
  - response body: array of Match OR empty array
  - error responses: 
    - 400 not valid param/response
    - 404 User not found
    - 500 server error
- PUT `/api/users/:userId/matches/MatchId`
  - request parameters: userId, matchId
  - request body: object with matchResult + cardsObtained
  - response body: object with updated rows.
  - error responses: 
    - 400 not valid request/response
    - 404 User not found OR Match not found 
    - 500 server error.
- GET `/api/cards/starting`
  - request parameters: None
  - response body content: None
  - response body: array of Card. len = 3.
    - error responses: 
      - 400 not valid response
      - 500 server error
- GET `/api/cards/CardId` (just for logged in user)
  - request parameters: CardId
  - response body content: None
  - response body: Card taken from db
    - error responses: 
      - 400 not valid request/response
      - 404 Card not found
      - 500 server error
- POST `/api/matches/:matchId/rounds` (just for logged in user)
  - request parameters: matchId
  - request body: array of Card. len = 3 OR len = 1.
  - response body: array of RoundCardId (id of just posted RoundCard). len = 3 OR len = 1.
  - error responses: 
    - 400 not valid request/response
    - 404 Match not found OR Card not found 
    - 500 server error
- GET `/api/matches/:matchId/rounds` (just for logged in user)
  - request parameters: matchId
  - request body: None.
  - response body: array of RoundCard
  - error responses: 
    - 400 not valid request/response
    - 404 RoundCard not found 
    - 500 server error
- POST `/api/matches/:matchId/cards` (just for logged in user)
  - request parameters: matchId
  - request body: object with startTime.
  - response body: Card taken from db.
  - error responses: 
    - 400 not valid request/response
    - 404 Match not found OR Card not found 
    - 500 server error
- POST `/api/matches/:matchId/cards/:CardId` 
  - request parameters: matchId, CardId.
  - request body: object with levelsx + leveldx + endTime.
  - response body: object with (success:true + Card) OR (success:false + timeout(true/false)).
  - error responses: 
    - 400 not valid request/response
    - 404 Match not found OR Card not found 
    - 500 server error
- POST `/api/matches/:matchId/demo`
  - request parameters: matchId
  - request body: object with array of Card + startTime.
  - response body: Card taken from db.
  - error responses: 
    - 400 not valid request/response
    - 404 Match not found OR Card not found 
    - 500 server error
- GET `/api/session/current` 
  - request parameters: None
  - request body: None
  - response body: User
  - error responses: 
    - 401 User non authenticated
- POST `/api/login` 
  - request parameters: None
  - request body: object with email + password
  - response body: User or object with message: "invalid credentials" 
  - error responses:
    - generic error  
- POST `/api/logout` 
  - request parameters: None
  - request body: None
  - response body: Null


## Database Tables

- Table `User` - contains UserId email psw salt name surname
- Table `Card` - contains CardId title level url 
  - static table storing 50 cards. Cards shown to user taken from here.  
- Table `Match` - contains MatchId UserId matchResult cardsObtained date
  - table storing each game with the updating result and # cards obtained, for both demo and logged in user. UserId for demo user is a default value (0).
- Table `RoundCard` contains RoundCardId CardId MatchId RoundResult RoundNumber
  - posting a new round card in each round, only for logged in user. The 3 starting cards have default values for RoundResult(-1) and RoundNumber(0). Getting (only for logged in user) round cards with a specific MatchId to be displayed in the game history + used to take a new different card from db (different from the cards already shown in the actual game).  
- Table `Timer_Card` contains TimerCardId CardId  MatchId StartTimer
  - table used to store the timer starting time for each card. Used to avoid user cheating -> check is performed in back end using the stored value.
Used for both logged in and demo user. 


## Main React Components

- `Home` (in `Home.jsx`): Home page with a card including buttons/links to start a new game, read the game rules, login/logout and view the user profile for logged in user. 
- `Login` (in `Login.jsx`): Login page to perform the login. It consists in a card with a form for email and psw.
- `GameIntro` (in `GameIntro.jsx`): GameIntro page with a static card showing basic rules + button to start a game. 
- `CardsRow, NewCard` (in `Game.jsx`): Game page with definition of functions (getNewCard, updateGameVictory, updateGameLoss, handleDrop, handleTimeout) and states (some of them received as input from app.jsx) to handle the game logic, some of them passed to sub-component. 
- `CardsRow` (in `CardsRow.jsx`): component to display the cards owned by the user and to handle user dropping the new card. 
- `RenderNewCard` (in `NewCard.jsx`): component to display the button to get the new card. If the user has received the card, RenderNewCard is invoked (displaying the card utself) and the timer is showed.
- `Header` (in `Header.jsx`): Navbar present in each page. It contains a link to the home page and the button login/logout. These 2 functionalities are disabled if the user is playing a game.
- `MatchResult` (in `MatchResult.jsx`): component to display the result of just ended game. (cards obtained for login user, Victory/Loss message for both). It also includes a button to start a new game.
- `Rules` (in `Rules.jsx`): page consisting in a card with all the written rules. 
- `UserProvider` (in `UserContext.js`): component to handle the authenticated or not user. It is the provider of user, login and logout for all the other components.
- `UserProvider` (in `UserContext.js`): component to handle the authenticated or not user. It is the provider of user, login and logout for all the other components.
- `Userprofile` (in `UserProfile.js`): component displaying a static card with user info + a table with all the matches (with relative info) played by the user.  

## Screenshot

![Screenshot](./server/images/Screenshot%202025-06-19%20123321.png)

![Screenshot](./server/images/Screenshot%202025-06-19%20123441.png)

## Users Credentials

- username: cip@example.com, psw: mypassword
  - user with played games
- username: ciop@example.com, psw: mypassword 
