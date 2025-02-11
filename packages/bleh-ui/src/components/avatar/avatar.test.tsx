import { render, screen } from '@testing-library/react';
import { Avatar } from './avatar';

describe('Avatar', () => {
  it('renders default icon when no props provided', () => {
    render(<Avatar />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('renders initials when name is provided without image', () => {
    render(<Avatar name="John Doe" />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renders image when src is provided', () => {
    const src = 'test.jpg';
    render(<Avatar src={src} alt="test" />);
    const img = screen.getByRole('img') as HTMLImageElement;
    expect(img.src).toContain(src);
  });

  it('falls back to initials when image fails to load', () => {
    render(<Avatar src="invalid.jpg" name="John Doe" />);
    const img = screen.getByRole('img') as HTMLImageElement;
    img.dispatchEvent(new Event('error'));
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('applies correct size variant', () => {
    render(<Avatar size="lg" />);
    expect(screen.getByRole('img')).toHaveStyle({
      width: '4rem',
      height: '4rem'
    });
  });

  it('applies correct visual variant', () => {
    render(<Avatar variant="outline" />);
    expect(screen.getByRole('img')).toHaveStyle({
      borderWidth: '1px'
    });
  });
});
