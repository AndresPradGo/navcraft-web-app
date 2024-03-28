import { useReducer, useState, useEffect } from 'react';
import { styled } from 'styled-components';

import FilterButton, { FilterParametersType } from './FilterButton';
import Table, { Props as TableProps } from './Table';
import SearchBar, { SearchBarDataType } from './SearchBar';
import SortButton, { SortColumnType, SortDataType } from './SortButton';
import pageReducer from './pageReducer';
import Pagination from './Pagination';
import useProcessTableData from './useProcessTableData';
import sortReducer from './sortReducer';
import filtersReducer from './filtersReducer';
import FilterTags from './FilterTags';

const HtmlTableContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
`;

const HtmlButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  flex-wrap: wrap;
  width: 100%;
  min-height: 60px;

  @media screen and (min-width: 936px) {
    justify-content: space-between;
  }
`;

const HtmlNoDataMessageParagraph = styled.p`
  font-size: 20px;
  padding: 20px;
  border-left: 1px solid var(--color-grey-bright);
  text-wrap: wrap;
`;

interface SearchBarParametersType extends SearchBarDataType {
  columnKeys: string[];
}

export interface Props {
  tableData: TableProps;
  emptyTableMessage?: string;
  sortColumnOptions?: SortColumnType[];
  pageSize?: number;
  searchBarParameters?: SearchBarParametersType;
  filterParameters?: FilterParametersType;
}

const TableContainer = ({
  tableData,
  emptyTableMessage,
  sortColumnOptions,
  pageSize,
  searchBarParameters,
  filterParameters,
}: Props) => {
  const [searchText, setSearchText] = useState('');
  const [page, dispatchPage] = useReducer(pageReducer, 1);
  const [filters, dispatchFilters] = useReducer(filtersReducer, []);
  const [sort, dispatchSort] = useReducer(sortReducer, {
    index: 0,
    order: 'asc',
  } as SortDataType);

  useEffect(() => {
    dispatchPage({ type: 'RESET' });
  }, [searchText, filters.length]);

  const tableKey = tableData.keys[0];
  useEffect(() => {
    setSearchText('');
    dispatchFilters({ type: 'CLEAR' });
    dispatchSort({ type: 'RESET' });
    dispatchPage({ type: 'RESET' });
  }, [
    emptyTableMessage,
    tableData.keys.length,
    tableKey,
    sortColumnOptions?.length,
  ]);

  const { processedData, numPages } = useProcessTableData({
    data: tableData.rows,
    sortParams: sortColumnOptions
      ? {
          key: sortColumnOptions[sort.index]
            ? sortColumnOptions[sort.index].key
            : sortColumnOptions[0].key,
          order: sort.order,
        }
      : undefined,
    paginationParams: pageSize
      ? {
          currentPage: page,
          pageSize: pageSize,
        }
      : undefined,
    searchParams: searchBarParameters
      ? {
          columnKeys: searchBarParameters.columnKeys,
          text: searchText,
        }
      : undefined,
    filterParams:
      (filters.map((idx) => filterParameters?.filters[idx]) || []).map(
        (item) => ({
          key: item?.key || '',
          value: item?.value || '',
        }),
      ) || [],
  });

  if (tableData.rows.length === 0) {
    if (emptyTableMessage)
      return (
        <HtmlNoDataMessageParagraph>
          {emptyTableMessage}
        </HtmlNoDataMessageParagraph>
      );
    else return null;
  }

  return (
    <HtmlTableContainer>
      {searchBarParameters && (
        <SearchBar
          placeHolder={searchBarParameters.placeHolder}
          text={searchText}
          setText={setSearchText}
        />
      )}
      {(sortColumnOptions || filterParameters) && (
        <HtmlButtonContainer>
          {sortColumnOptions && (
            <SortButton
              sortOptions={sortColumnOptions}
              selectedSortData={sort}
              dispatch={dispatchSort}
            />
          )}
          {filterParameters && (
            <FilterButton
              text={filterParameters.text}
              filters={filterParameters.filters}
              appliedFilters={filters}
              dispatch={dispatchFilters}
            />
          )}
        </HtmlButtonContainer>
      )}
      {filterParameters && filters.length > 0 ? (
        <FilterTags
          filters={filterParameters.filters}
          selectedFilters={filters}
          dispatch={dispatchFilters}
        />
      ) : null}
      <Table
        rows={processedData}
        headers={tableData.headers}
        keys={tableData.keys}
        hasButtons={!!tableData.rows.find((row) => !!row.permissions)}
        breakingPoint={tableData.breakingPoint}
      />
      {numPages >= 2 && (
        <Pagination
          currentPage={page}
          finalPage={numPages}
          dispatch={dispatchPage}
        />
      )}
    </HtmlTableContainer>
  );
};

export default TableContainer;
