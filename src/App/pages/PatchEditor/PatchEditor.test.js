import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PatchEditor from './PatchEditor';

describe('<PatchEditor />', () => {
  test('it should mount', () => {
    render(<PatchEditor />);
    
    const patchEditor = screen.getByTestId('PatchEditor');

    expect(patchEditor).toBeInTheDocument();
  });
});