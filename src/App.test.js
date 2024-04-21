import { render, screen } from '@testing-library/react';
import App from './App';

test('renders login text', () => {
  render(<App />);
  const loginElement = screen.getByText('Login', { selector: 'h2' });
  expect(loginElement).toBeInTheDocument();
});
