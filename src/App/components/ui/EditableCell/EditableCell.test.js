import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import EditableCell from './EditableCell';

describe('<EditableCell />', () => {
  test('it should mount', () => {
    render(<EditableCell />);
    
    const editableCell = screen.getByTestId('EditableCell');

    expect(editableCell).toBeInTheDocument();
  });
});