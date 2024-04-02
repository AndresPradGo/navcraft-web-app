import { it, expect, describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { sideBarContext } from '../../../src/components/sidebar';
import SideBarIndex from '../../../src/components/common/SideBarIndex';

describe('SideBarIndex', () => {
  const handleChangeSection = vi.fn();
  const handleExpandSideBar = vi.fn();
  const numIndex = 3;
  const sectionOptions = Array.from({ length: numIndex }, (_, index) => ({
    key: `key-${index + 1}`,
    title: `Title ${index + 1}`,
    icon: `Icon ${index + 1}`,
  }));
  const selectedIdx = 1;
  const changeIdx = 0;
  const renderComponent = () => {
    render(
      <sideBarContext.Provider
        value={{
          hasSideBar: true,
          sideBarIsExpanded: true,
          handleExpandSideBar: handleExpandSideBar,
        }}
      >
        <SideBarIndex
          handleChangeSection={handleChangeSection}
          selectedIdx={selectedIdx}
          sectionOptions={sectionOptions}
        />
      </sideBarContext.Provider>,
    );

    return {
      heading: screen.getByRole('heading', { level: 3 }),
      buttons: screen.getAllByRole('button'),
      findSectionTitle: (title: string) => screen.getByText(title),
    };
  };

  it('should render heading and buttons with the selected index highlighted', () => {
    const { buttons, findSectionTitle } = renderComponent();

    expect(buttons.length).toBe(numIndex);
    const selectedClass = buttons[selectedIdx].className;
    for (let i = 0; i < numIndex; i++) {
      findSectionTitle(sectionOptions[i].title);
      expect(buttons[i]).toContainHTML(sectionOptions[i].icon);
      if (i === selectedIdx)
        expect(buttons[i]).toHaveAttribute('class', selectedClass);
      else expect(buttons[i]).not.toHaveAttribute('class', selectedClass);
    }
  });

  it('should call handleExpandSideBar and handleChangeSection when clicking on a button', async () => {
    const { buttons } = renderComponent();

    const user = userEvent.setup();
    await user.click(buttons[changeIdx]);

    expect(handleChangeSection).toHaveBeenCalledWith(changeIdx);
    expect(handleExpandSideBar).toHaveBeenCalledWith(false);
  });
});
