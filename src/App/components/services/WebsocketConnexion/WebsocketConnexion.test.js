import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import WebsocketConnexion from './WebsocketConnexion';

describe('<WebsocketConnexion />', () => {
  test('it should mount', () => {
    render(<WebsocketConnexion />);
    
    const websocketConnexion = screen.getByTestId('WebsocketConnexion');

    expect(websocketConnexion).toBeInTheDocument();
  });
});