import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import PatchForm from './PatchForm';

describe('<PatchForm />', () => {
  test('it should mount', () => {
    render(<PatchForm />);
    
    const patchForm = screen.getByTestId('PatchForm');

    expect(patchForm).toBeInTheDocument();
  });
});