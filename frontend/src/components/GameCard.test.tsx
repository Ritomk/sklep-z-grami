import { render, screen } from '@testing-library/react';
import GameCard from './GameCard';
import type { Game } from './GameCard';
import { BrowserRouter } from 'react-router-dom';

const mockGame: Game = {
  id: 1,
  title: 'MyGame',
  price: 49.99,
  release_date: '2025-06-01',
  genres: [{ id: 1, name: 'Action' }],
  cover_image: null,
};

test('renders title, price and genre chip', () => {
  render(
    <BrowserRouter>
      <GameCard game={mockGame} />
    </BrowserRouter>
  );
  expect(screen.getByText(/MyGame/)).toBeInTheDocument();
  expect(screen.getByText(/PLN 50/)).toBeInTheDocument();
  expect(screen.getByText(/Action/)).toBeInTheDocument();
});
