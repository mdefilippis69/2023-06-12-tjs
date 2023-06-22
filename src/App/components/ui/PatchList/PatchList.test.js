import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PatchList from './PatchList';

describe('<PatchList />', () => {
  test('it should mount', () => {
    render(<PatchList />);
    
    const patchList = screen.getByTestId('PatchList');

    expect(patchList).toBeInTheDocument();
  });
});