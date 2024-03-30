import { it, expect, describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Modal, useModal } from '../../../src/components/common/modal';

const ModalContainer = () => {
  const modalTools = useModal();

  return (
    <>
      <button onClick={modalTools.handleOpen}>Open Modal</button>
      <Modal isOpen={modalTools.isOpen}>
        <button onClick={modalTools.handleClose} hidden={!modalTools.isOpen}>
          Close Modal
        </button>
      </Modal>
    </>
  );
};

describe('Modal', () => {
  const renderModal = () => {
    render(<ModalContainer />);

    return {
      closeButton: screen.getByText('Close Modal'),
      openButton: screen.getByRole('button', { name: 'Open Modal' }),
    };
  };

  it('should render the modal with its children initially not visible', () => {
    const { closeButton } = renderModal();

    expect(closeButton).not.toBeVisible();
  });

  it('should be visible if open button is clicked', async () => {
    const { openButton, closeButton } = renderModal();
    const user = userEvent.setup();
    await user.click(openButton);

    expect(closeButton).toBeVisible();
  });

  it('should not be visible if close button is clicked', async () => {
    const { openButton, closeButton } = renderModal();
    const user = userEvent.setup();
    await user.click(openButton);

    await user.click(closeButton);

    expect(closeButton).not.toBeVisible();
  });

  it('should not be visible if esc key is pressed', async () => {
    const { openButton, closeButton } = renderModal();
    const user = userEvent.setup();
    await user.click(openButton);

    await user.keyboard('{Escape}');

    expect(closeButton).not.toBeVisible();
  });
});
