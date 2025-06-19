import { Container, Card } from 'react-bootstrap';

function Rules() {
  return (
    <Container style={{ maxWidth: '700px', marginTop: '3rem', marginBottom: '3rem' }}>
      <Card style={{ padding: '2rem', borderRadius: '15px', boxShadow: '0 8px 16px rgba(234, 234, 18, 0.63)' }}>
        <h2 style={{ color: '#0d6efd', marginBottom: '1.5rem' }}>Game Rules</h2>
        
        <p>Welcome! Here’s how to play:</p>

        <ul>
          <li>You start the game with 3 random "horrible situation" cards. Each card shows a situation, a picture, and a "bad luck" value (hidden for new situations).</li>
          <li>In each round, you will be shown a new horrible situation (name and image only, no bad luck value).</li>
          <li>Your task is to guess where this new situation fits among your current cards, based on how unlucky it is.</li>
          <li>Imagine your cards are ordered from least unlucky to most unlucky. Decide if the new situation’s bad luck should be placed before, between, or after your existing cards.</li>
          <li>You have <strong>30 seconds</strong> to make your guess.</li>
          <li>If you guess correctly, you get the new card and it’s added to your collection, with all details revealed.</li>
          <li>If you guess incorrectly or run out of time, you lose that card and won’t see it again during this game.</li>
          <li>The game ends when:
            <ul>
              <li>You collect <strong>6 cards</strong> — you win!</li>
              <li>You fail to guess correctly <strong>3 times</strong> — you lose.</li>
            </ul>
          </li>
        </ul>

        <p>Good luck, and have fun!</p>
      </Card>
    </Container>
  );
}

export default Rules;
