import { it, expect, describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SideBarBtnList from '../../../src/components/common/SideBarBtnList';

describe('SideBarBtnList', () => {
  const icons = ['Icon 0', 'Icon 1', 'Icon 2'];
  const title = 'Title';
  const buttonsData = [1, 2].map((n) => ({
    text: `Button ${n}`,
    icon: icons[n],
    styles: {},
    onClick: vi.fn(),
  }));
  const renderComponent = () => {
    render(
      <SideBarBtnList
        titleIcon={icons[0]}
        title={title}
        buttons={buttonsData}
      />,
    );

    return {
      heading: screen.getByRole('heading', { level: 3 }),
      buttons: screen.getAllByRole('button'),
    };
  };

  it('should render with text and icon of title and buttons', () => {
    const { heading, buttons } = renderComponent();

    expect(heading).toContainHTML(title);
    expect(heading).toContainHTML(icons[0]);
    buttons.forEach((btn, idx) => {
      expect(btn).toContainHTML(buttonsData[idx].text);
      expect(btn).toContainHTML(buttonsData[idx].icon);
    });
  });

  it('should call the onClick function of the respective button, when a button gets clicked', async () => {
    const { buttons } = renderComponent();

    const user = userEvent.setup();

    for (let i = 0; i < buttons.length; i++) {
      await user.click(buttons[i]);
      expect(buttonsData[i].onClick).toHaveBeenCalledOnce();
    }
  });
});
