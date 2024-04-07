import { it, expect, describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import Table from '../../../src/components/common/table';

describe('Table', () => {
  const numSatus = 3;
  const numOptions = 3;
  const columns = {
    id: 'ID',
    name: 'Name',
    status: 'Status',
    options: 'Options',
  };
  const firstNames = ['Clark', 'Bruce', 'Diana', 'Barry'];
  const lastNames = [
    'Stark',
    'Rogers',
    'Romanoff',
    'Banner',
    'Parker',
    'Barton',
  ];
  const numTotalRows = firstNames.length * lastNames.length;
  const numRowsPerStatus = numTotalRows / numSatus;
  const statusList = Array.from(
    { length: numSatus },
    (_, i) => `Status ${i + 1}`,
  );
  const optionsList = Array.from(
    { length: numOptions },
    (_, i) => `Op${i + 1}`,
  );
  type TableRowType = {
    id: number;
    name: string;
    status: string;
    options: string;
    handleEdit: () => void;
    handleDelete: () => void;
    permissions?: 'open' | 'edit' | 'delete' | 'open-delete' | 'edit-delete';
  };
  const handleEditMock = vi.fn();
  const handleDeleteMock = vi.fn();
  const getTableRows: () => TableRowType[] = () => {
    const options = ['', '', '']
      .concat(Array.from({ length: 3 }, () => optionsList[0]))
      .concat(Array.from({ length: 3 }, () => optionsList[1]))
      .concat(Array.from({ length: 3 }, () => optionsList[2]))
      .concat(
        Array.from({ length: 3 }, () => `${optionsList[0]}, ${optionsList[1]}`),
      )
      .concat(
        Array.from({ length: 3 }, () => `${optionsList[0]}, ${optionsList[2]}`),
      )
      .concat(
        Array.from({ length: 3 }, () => `${optionsList[1]}, ${optionsList[2]}`),
      )
      .concat(
        Array.from(
          { length: 3 },
          () => `${optionsList[0]}, ${optionsList[1]}, ${optionsList[2]}`,
        ),
      );
    const rows: TableRowType[] = [];
    let id = 1;
    for (let i = 0; i < firstNames.length; i++) {
      for (let j = 0; j < lastNames.length; j++) {
        rows.push({
          id,
          name: `${firstNames[i]} ${lastNames[j]}`,
          status: statusList[Math.ceil(id / numRowsPerStatus) - 1],
          options: options[id - 1],
          handleEdit: () => {},
          handleDelete: () => {},
          permissions:
            id <= 4
              ? undefined
              : id <= 8
                ? 'open'
                : id <= 12
                  ? 'edit'
                  : id <= 16
                    ? 'delete'
                    : id <= 20
                      ? 'open-delete'
                      : 'edit-delete',
        });
        id++;
      }
    }
    return rows.map((row) => ({
      ...row,
      handleEdit: () => {
        handleEditMock(row.id);
      },
      handleDelete: () => {
        handleDeleteMock(row.id);
      },
    }));
  };
  const searchBarPlaceholder = 'Search Bar Placeholder';

  const emptyTableMessage = 'Table is empty!';
  const tableData = {
    keys: Object.keys(columns),
    headers: columns,
    rows: getTableRows(),
  };
  const sortColumnOptions = Object.keys(columns)
    .filter((key) => key === 'id' || key === 'name' || key === 'status')
    .map((key) => ({
      key,
      title: columns[key as 'id' | 'name' | 'status'],
    }));
  const pageSize = 5;

  const searchBarParameters = {
    columnKeys: Object.keys(columns).filter(
      (key) => key === 'id' || key === 'name',
    ),
    placeHolder: searchBarPlaceholder,
  };
  const filterParameters = {
    text: 'Filter',
    filters: statusList
      .map((status) => ({
        key: 'status',
        value: status,
        title: `Status: ${status}`,
      }))
      .concat(
        optionsList.map((option) => ({
          key: 'options',
          value: option,
          title: `Has ${option}`,
        })),
      ),
  };

  const renderDummyTable = async (isEmpty: boolean = false) => {
    const tableDataToRender = { ...tableData };
    if (isEmpty) tableDataToRender.rows = [];
    render(
      <Table
        tableData={tableDataToRender}
        emptyTableMessage={emptyTableMessage}
        sortColumnOptions={sortColumnOptions}
        pageSize={pageSize}
        searchBarParameters={searchBarParameters}
        filterParameters={filterParameters}
      />,
    );

    if (!isEmpty) await screen.findByRole('table');

    return {
      getDataCells: (key: string, id: string = '') =>
        screen.queryAllByTestId(new RegExp(`table-data-cell-${key}-${id}`)),
      getEditButton: (id: number) =>
        screen.getByTestId(`table-edit-button-${id}`),
      getDeleteButton: (id: number) =>
        screen.getByTestId(`table-delete-button-${id}`),
      searchBar: screen.queryByPlaceholderText(searchBarPlaceholder),
      searchBarClearBtn: screen.queryByTestId('table-clear-search-bar-btn'),
      getSortOptions: (sort: string = 'all') =>
        sort === 'all'
          ? screen.queryAllByTestId(/table-sortBy-option-/)
          : screen.queryAllByTestId(`table-sortBy-option-${sort}`),
      getFilterOptions: (filter: string = 'all') =>
        filter === 'all'
          ? screen.queryAllByTestId(/table-filter-option-/)
          : screen.queryAllByTestId(`table-filter-option-${filter}`),
      getFilterTagDeleteBtn: (filter: string) =>
        screen.queryByTestId(`table-filter-tag-delete-${filter}`),
      clearAllFiltersBtn: screen.queryByTestId(`table-filter-clear-all-btn`),
      getPageNumber: (currentPage?: number, finalPage?: number) =>
        currentPage && finalPage
          ? screen.queryByText(`Page ${currentPage} / ${finalPage}`)
          : screen.queryByText(/Page \d{1,2} \/ \d{1,2}/),
      paginationIndex: screen.queryByTestId(/pagination-index/),
      getPaginationBtn: (action: 'previous' | 'next' | 'first' | 'last') =>
        screen.queryByTestId(`table-${action}-page-btn`),
      emptyMessage: screen.queryByText(emptyTableMessage),
    };
  };

  it('should render the emptyTableMessage only, if the table is empty', async () => {
    const {
      searchBar,
      getSortOptions,
      getFilterOptions,
      getDataCells,
      paginationIndex,
      emptyMessage,
    } = await renderDummyTable(true);

    expect(getDataCells('id').length).toBe(0);
    expect(getSortOptions().length).toBe(0);
    expect(getFilterOptions().length).toBe(0);
    expect(searchBar).toBe(null);
    expect(paginationIndex).toBe(null);
    expect(emptyMessage).toBeInTheDocument();
  });

  it('should render all rowsin the first page, sort and filter buttons, search bar and pagination', async () => {
    const {
      searchBar,
      getSortOptions,
      getFilterOptions,
      getDataCells,
      paginationIndex,
      emptyMessage,
    } = await renderDummyTable();

    expect(getDataCells('id').length).toBe(pageSize);
    expect(getSortOptions().length).toBe(sortColumnOptions.length);
    const filters = getFilterOptions();
    expect(filters.length).toBe(filterParameters.filters.length);
    for (const filter of filters) {
      expect(filter).not.toBeChecked();
    }
    expect(searchBar).toBeEmptyDOMElement();
    expect(paginationIndex).toBeInTheDocument();
    expect(emptyMessage).toBe(null);
  });

  it('should render the remainder of rows when clicking through all the pages', async () => {
    const { getDataCells, getPaginationBtn } = await renderDummyTable();

    const user = userEvent.setup();

    const totalNumRows = numTotalRows;
    const numPages = Math.ceil(totalNumRows / pageSize);
    const checkPaginationBtnsAreInDOM = (page: number) => {
      if (page === 1) {
        expect(getPaginationBtn('previous')).toBe(null);
        expect(getPaginationBtn('first')).toBe(null);
        expect(getPaginationBtn('next')).not.toBe(null);
        expect(getPaginationBtn('last')).not.toBe(null);
      } else if (page === numPages) {
        expect(getPaginationBtn('previous')).not.toBe(null);
        expect(getPaginationBtn('first')).not.toBe(null);
        expect(getPaginationBtn('next')).toBe(null);
        expect(getPaginationBtn('last')).toBe(null);
      } else {
        expect(getPaginationBtn('previous')).not.toBe(null);
        expect(getPaginationBtn('first')).not.toBe(null);
        expect(getPaginationBtn('next')).not.toBe(null);
        expect(getPaginationBtn('last')).not.toBe(null);
      }
    };

    const checkPageRowsAreInDOM = (page: number) => {
      const lastPageSize = pageSize - (numPages * pageSize - totalNumRows);
      const currentPageSize = page < numPages ? pageSize : lastPageSize;
      const firstRowNumber = (page - 1) * pageSize + 1;
      const lastRowNumber = firstRowNumber + currentPageSize - 1;
      const firstRow = getDataCells('id', firstRowNumber.toString());
      const lastRow = getDataCells('id', lastRowNumber.toString());

      expect(firstRow.length).toBe(1);
      expect(lastRow.length).toBe(1);
    };

    const clickPagination = async (page: number): Promise<number> => {
      if (page === 1 || page === 2) {
        const paginationForwardBtn = getPaginationBtn('next');
        if (paginationForwardBtn) await user.click(paginationForwardBtn);
        return page + 1;
      } else if (page === 3) {
        const paginationLastBtn = getPaginationBtn('last');
        if (paginationLastBtn) await user.click(paginationLastBtn);
        return numPages;
      } else if (page === 4) {
        const paginationFirstBtn = getPaginationBtn('first');
        if (paginationFirstBtn) await user.click(paginationFirstBtn);
        return 1;
      } else {
        const paginationBackwardBtn = getPaginationBtn('previous');
        if (paginationBackwardBtn) await user.click(paginationBackwardBtn);
        return page - 1;
      }
    };

    let page = 1;
    for (let i = 1; i <= numPages; i++) {
      checkPaginationBtnsAreInDOM(page);
      page = await clickPagination(page);
      checkPageRowsAreInDOM(page);
    }
  });

  it('should filter the rows when a filter is applied', async () => {
    const { getFilterOptions, getDataCells, getPaginationBtn } =
      await renderDummyTable(false);
    const status1filter = getFilterOptions('status-0')[0];
    const op1filter = getFilterOptions('options-3')[0];
    const nextPageBtn = getPaginationBtn('next');

    const user = userEvent.setup();
    await user.click(status1filter);
    if (nextPageBtn) await user.click(nextPageBtn);
    let numRows = getDataCells('id').length;

    expect(numRows).toBe(3);

    await user.click(op1filter);
    numRows = getDataCells('id').length;

    expect(numRows).toBe(3);
  });

  it('should remove a filter when clicking on the filter tag', async () => {
    const {
      getFilterOptions,
      getDataCells,
      getPaginationBtn,
      getFilterTagDeleteBtn,
    } = await renderDummyTable(false);
    const status1filter = getFilterOptions('status-0')[0];
    let op1filter = getFilterOptions('options-3')[0];

    const user = userEvent.setup();
    await user.click(status1filter);
    await user.click(op1filter);
    const closeStatus1filter = getFilterTagDeleteBtn('status-0');
    let closeOp1filter = getFilterTagDeleteBtn('options-3');
    let numRows = getDataCells('id').length;
    expect(closeOp1filter).not.toBe(null);
    expect(closeStatus1filter).not.toBe(null);
    expect(numRows).toBe(3);

    if (closeOp1filter) await user.click(closeOp1filter);
    const nextPageBtn = getPaginationBtn('next');
    if (nextPageBtn) await user.click(nextPageBtn);
    op1filter = getFilterOptions('options-3')[0];
    closeOp1filter = getFilterTagDeleteBtn('options-3');

    expect(op1filter).not.toBeChecked();
    expect(closeOp1filter).toBe(null);
    numRows = getDataCells('id').length;
    expect(numRows).toBe(3);
  });

  it('should remove all filters when clicking on the "Clear all" button', async () => {
    const {
      getFilterOptions,
      getDataCells,
      getFilterTagDeleteBtn,
      clearAllFiltersBtn,
      getPageNumber,
    } = await renderDummyTable(false);
    const status1filter = getFilterOptions('status-0')[0];
    const op1filter = getFilterOptions('options-3')[0];

    const user = userEvent.setup();
    await user.click(status1filter);
    await user.click(op1filter);
    let pageNumber = getPageNumber();
    expect(pageNumber).toBe(null);
    if (clearAllFiltersBtn) await user.click(clearAllFiltersBtn);

    const closeStatus1filter = getFilterTagDeleteBtn('status-0');
    const closeOp1filter = getFilterTagDeleteBtn('options-3');
    const numRows = getDataCells('id').length;
    pageNumber = getPageNumber(1, 5);
    expect(closeOp1filter).toBe(null);
    expect(closeStatus1filter).toBe(null);
    expect(numRows).toBe(5);
    expect(pageNumber).not.toBe(null);
  });

  it('should sort the rows in the right order when clicking on the sorting options', async () => {
    const { getSortOptions, getDataCells } = await renderDummyTable(false);

    const sortByIdBtn = getSortOptions('id')[0];
    const sortByNameBtn = getSortOptions('name')[0];
    const expectedFirstName = 'Barry';

    const user = userEvent.setup();
    await user.click(sortByIdBtn);
    const idDataCells = getDataCells('id');
    const expectedIds = Array.from(
      { length: idDataCells.length },
      (_, i) => numTotalRows - i,
    );

    idDataCells.forEach((dataCell, i) => {
      expect(dataCell).toContainHTML(expectedIds[i].toString());
    });

    await user.click(sortByNameBtn);
    const nameDataCells = getDataCells('name');
    nameDataCells.forEach((dataCell) => {
      const textContent = dataCell.textContent;
      expect(textContent).not.toBe(null);
      if (textContent)
        expect(textContent.includes(expectedFirstName)).toBe(true);
    });
  });

  it('should filter the rows according to the text typed on the search bar', async () => {
    const { searchBar, getDataCells } = await renderDummyTable(false);
    const nameToSearch = `${firstNames[2]} ${lastNames[1]}`;

    const user = userEvent.setup();
    let searchValue = '';
    if (searchBar) {
      await user.type(searchBar, nameToSearch);
      if ('value' in searchBar) searchValue = searchBar.value as string;
    }
    const dataCells = getDataCells('name');

    expect(dataCells.length).toBe(1);
    expect(dataCells[0]).toContainHTML(nameToSearch);
    expect(searchValue).toBe(nameToSearch);
  });

  it('should clear the search bar when clicking on the "X" button in the search bar form', async () => {
    const { searchBar, searchBarClearBtn, getDataCells } =
      await renderDummyTable(false);
    const nameToSearch = `${firstNames[2]} ${lastNames[1]}`;

    const user = userEvent.setup();
    if (searchBar) await user.type(searchBar, nameToSearch);
    if (searchBarClearBtn) await user.click(searchBarClearBtn);
    const numRows = getDataCells('id').length;

    expect(numRows).toBe(pageSize);
    expect(searchBar).toBeEmptyDOMElement();
  });

  it('should call handleEditMock when clicking on the edit button', async () => {
    const editId = 7;
    const { getPaginationBtn, getEditButton } = await renderDummyTable(false);
    const nextButton = getPaginationBtn('next');

    const user = userEvent.setup();
    if (nextButton) await user.click(nextButton);
    const editButton = getEditButton(editId);
    await user.click(editButton);

    expect(handleEditMock).toHaveBeenCalledOnce();
    expect(handleEditMock).toHaveBeenCalledWith(editId);
  });

  it('should call handleDeleteMock when clicking on the delete button', async () => {
    const deleteId = 14;
    const { getPaginationBtn, getDeleteButton } = await renderDummyTable(false);
    const nextButton = getPaginationBtn('next');

    const user = userEvent.setup();
    if (nextButton) {
      await user.click(nextButton);
      await user.click(nextButton);
    }
    const deleteButton = getDeleteButton(deleteId);
    await user.click(deleteButton);

    expect(handleDeleteMock).toHaveBeenCalledOnce();
    expect(handleDeleteMock).toHaveBeenCalledWith(deleteId);
  });
});
