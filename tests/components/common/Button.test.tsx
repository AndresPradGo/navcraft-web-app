import { it, expect, describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Button from '../../../src/components/common/button';

describe('Button', () => {
  it('should render an a-tag with children, href and target _blank if href is provided and isAnchor is true', () => {
    const children = 'Anchor Text';
    const href = '/flights';
    render(
      <Button href={href} isAnchor={true}>
        {children}
      </Button>,
    );
    const anchor = screen.getByRole('link');

    expect(anchor).toHaveAttribute('href', href);
    expect(anchor).toContainHTML(children);
  });

  it('should render a button with children if href is not provided', () => {
    const children = 'Button Text';
    render(<Button>{children}</Button>);
    const button = screen.getByRole('button');

    expect(button).toContainHTML(children);
  });

  it('should render a disabled button with disabledText if disabled is true', () => {
    const disabledChildren = 'Disabled Button';
    const enabledChildren = 'Enabled Button';
    render(
      <Button disabled={true} disabledText={disabledChildren}>
        {enabledChildren}
      </Button>,
    );
    const button = screen.getByRole('button');

    expect(button).not.toContainHTML(enabledChildren);
    expect(button).toContainHTML(disabledChildren);
    expect(button).toBeDisabled();
  });

  it('should call handleClick on click', async () => {
    const handleClick = vi.fn();
    render(<Button handleClick={handleClick}>Button</Button>);
    const button = screen.getByRole('button');

    const user = userEvent.setup();
    await user.click(button);

    expect(handleClick).toHaveBeenCalled();
  });
});
