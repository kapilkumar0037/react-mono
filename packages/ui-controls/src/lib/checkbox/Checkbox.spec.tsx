import { render, screen, fireEvent } from '@testing-library/react';
import Checkbox from './Checkbox';

describe('Checkbox', () => {
  it('should render successfully', () => {
    render(<Checkbox />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeTruthy();
  });

  it('should render with children', () => {
    render(<Checkbox>Test Label</Checkbox>);
    const label = screen.getByText('Test Label');
    expect(label).toBeTruthy();
  });

  it('should render with custom children', () => {
    render(
      <Checkbox>
        <span className="font-bold">Bold</span>
        <span className="text-red-500">Red</span>
      </Checkbox>
    );
    expect(screen.getByText('Bold')).toBeTruthy();
    expect(screen.getByText('Red')).toBeTruthy();
  });

  it('should handle checked state', () => {
    render(<Checkbox defaultChecked />);
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  it('should handle disabled state', () => {
    render(<Checkbox disabled />);
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.disabled).toBe(true);
  });

  it('should handle onChange', () => {
    const handleChange = vi.fn();
    render(<Checkbox onChange={handleChange} />);
    const checkbox = screen.getByRole('checkbox');
    
    fireEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalled();
  });
});
