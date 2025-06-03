import dayjs from "dayjs";

function User (UserId, email, psw, salt, name, surname) {
    this.UserId = UserId;
    this.email = email;
    this.psw = psw;
    this.salt = salt;
    this.name = name;
    this.surname = surname;
}

function Card(CardId, title, level, url) {
    this.CardId = CardId;
    this.title = title;
    this.level = level;
    this.url = url;
}

function RoundCard(RoundCardId, CardId, MatchId, RoundResult, roundNumber) {
    this.RoundCardId = RoundCardId;
    this.CardId = CardId;
    this.MatchId = MatchId;
    this.RoundResult = RoundResult;
    this.roundNumber = roundNumber;
}

function Match(MatchId, UserId, matchResult, cardsObtained, date) {
    this.MatchId = MatchId;
    this.UserId = UserId;
    this.matchResult = matchResult;
    this.cardsObtained = cardsObtained;
    this.date = dayjs(date).format("YYYY-MM-DD HH:mm:ss");
}

export { User, Card, RoundCard, Match };