import { render, screen, waitFor } from '@testing-library/react';
import CartPage from './CartPage';
import api from '../lib/api';
import { BrowserRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';

jest.mock('../lib/api');

test('shows empty cart message', async () => {
  (api.get as jest.Mock).mockResolvedValue({ data: { items: [], total_price: 0 } });
  await act(async () => {
    render(
      <BrowserRouter>
        <CartPage />
      </BrowserRouter>
    );
  });
  await waitFor(() => expect(screen.getByText(/Your cart is empty/i)).toBeInTheDocument());
});
