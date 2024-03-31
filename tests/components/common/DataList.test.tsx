import { it, expect, describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import DataList from '../../../src/components/common/datalist';

describe('DataList', () => {
  const initialTerm = { text: 'Option', n: 2 };
  const validTypedTerm = { text: ' Alternative', n: 3 };
  const otherTerm = { text: 'Other', n: 4 };
  const invalidTypedText = ' isWrong';
  const errorMessageText = 'This is the error message.';

  const renderDataList = async (
    withError: boolean = false,
    required: boolean = true,
  ) => {
    const setValue = vi.fn();
    const setError = vi.fn();
    const clearErrors = vi.fn();

    render(
      <DataList
        value=""
        resetValue={initialTerm.text}
        setValue={setValue}
        hasError={withError}
        errorMessage={errorMessageText}
        setError={setError}
        clearErrors={clearErrors}
        options={Array.from({ length: initialTerm.n }, (_, index) => index + 1)
          .map((n) => `${initialTerm.text} ${n}`)
          .concat(
            Array.from(
              { length: validTypedTerm.n },
              (_, index) => index + 1,
            ).map((n) => `${initialTerm.text}${validTypedTerm.text} ${n}`),
            Array.from({ length: otherTerm.n }, (_, index) => index + 1).map(
              (n) => `${otherTerm.text} ${n}`,
            ),
          )}
        name="mock-data-list"
        required={required}
        formIsOpen={true}
      >
        Label
      </DataList>,
    );

    return {
      getListItems: async () => await screen.findAllByRole('listitem'),
      queryListItems: () => screen.queryAllByRole('listitem'),
      getListItemByText: (text: string) => screen.getByText(text),
      input: await screen.findByLabelText('Label'),
      setValue,
      setError,
      clearErrors,
    };
  };

  it('should render with the initial value, filtered options and no Error if hasError is false', async () => {
    const { getListItems } = await renderDataList(false);
    const listItems = await getListItems();
    const error = await screen.findByRole('paragraph');

    expect(listItems.length).toBe(initialTerm.n + validTypedTerm.n);
    expect(error).not.toHaveTextContent(errorMessageText);
  });

  it('should render with the initial value, filtered options and Error if hasError is true', async () => {
    const { getListItems } = await renderDataList(true);
    const listItems = await getListItems();
    const error = await screen.findByRole('paragraph');

    expect(listItems.length).toBe(initialTerm.n + validTypedTerm.n);
    expect(error).toHaveTextContent(errorMessageText);
  });

  it('should filter options and call setValue and clearError on change with valid value', async () => {
    const { getListItems, input, setValue, clearErrors } =
      await renderDataList();

    const user = userEvent.setup();
    await user.type(input, validTypedTerm.text);
    const listItems = await getListItems();

    expect(listItems.length).toBe(validTypedTerm.n);
    expect(setValue).toHaveBeenCalledWith(
      `${initialTerm.text}${validTypedTerm.text}`,
    );
    expect(clearErrors).toHaveBeenCalled();
  });

  it('should show no options, call setValue and call setError on blur, if invalid value is entered', async () => {
    const { queryListItems, input, setValue, setError } =
      await renderDataList();

    const user = userEvent.setup();
    await user.type(input, invalidTypedText);
    const listItems = queryListItems();

    expect(listItems.length).toBe(0);
    expect(setValue).toHaveBeenCalledWith(
      `${initialTerm.text}${invalidTypedText}`,
    );

    // Blur with Tab key
    await user.keyboard('{Tab}');
    expect(setError).toHaveBeenCalled();
  });

  it('should unfilter options and call setValue and clearError on blank if not required', async () => {
    const { getListItems, input, setValue, clearErrors } = await renderDataList(
      false,
      false,
    );

    const user = userEvent.setup();
    await user.type(input, '{Backspace}'.repeat(initialTerm.text.length));
    const listItems = await getListItems();

    expect(listItems.length).toBe(9);
    expect(setValue).toHaveBeenCalledWith('');
    expect(clearErrors).toHaveBeenCalled();
  });

  it('should call clearError on blur if not required', async () => {
    const { input, clearErrors } = await renderDataList(false, false);

    const user = userEvent.setup();
    await user.click(input);
    // Blur with Tab key
    await user.keyboard('{Tab}');

    expect(clearErrors).toHaveBeenCalledOnce();
  });

  it('should call clearError and setValue on select item', async () => {
    const { getListItemByText, setValue, clearErrors } = await renderDataList();
    const listItemText = `${initialTerm.text} 1`;
    const listItem = getListItemByText(listItemText);

    const user = userEvent.setup();
    await user.click(listItem);

    expect(setValue).toHaveBeenCalledWith(listItemText);
    expect(clearErrors).toHaveBeenCalled();
  });
});
