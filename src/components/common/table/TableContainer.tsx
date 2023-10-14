import { useReducer } from "react";
import { styled } from "styled-components";

import Table, { Props as TableProps } from "./Table";
import SearchBar, { Props as SearchBarDataType } from "./SearchBar";
import SortButton, { SortColumnType, SortDataType } from "./SortButton";
import pageReducer from "./pageReducer";
import Pagination from "./Pagination";
import useProcessTableData from "./useProcessTableData";
import sortReducer from "./sortReducer";

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
  margin: 0;

  @media screen and (min-width: 917px) {
    justify-content: space-between;
  }
`;

const HtmlNoDataMessageParagraph = styled.p`
  font-size: 20px;
  padding: 20px;
  border-left: 1px solid var(--color-grey-bright);
`;

interface Props {
  tableData: TableProps;
  emptyTableMessage: string;
  sortColumnOptions?: SortColumnType[];
  pageSize?: number;
  searchBarParameters?: SearchBarDataType;
}

const TableContainer = ({
  tableData,
  emptyTableMessage,
  sortColumnOptions,
  pageSize,
  searchBarParameters,
}: Props) => {
  const [page, dispatchPage] = useReducer(pageReducer, 1);
  const [sort, dispatchSort] = useReducer(sortReducer, {
    index: 0,
    order: "asc",
  } as SortDataType);

  const numPages = pageSize ? Math.ceil(tableData.rows.length / pageSize) : 1;

  const processedData = useProcessTableData({
    data: tableData.rows,
    sortParams: sortColumnOptions
      ? {
          key: sortColumnOptions[sort.index].key,
          order: sort.order,
        }
      : undefined,
    paginationParams: pageSize
      ? {
          currentPage: page,
          pageSize: pageSize,
        }
      : undefined,
  });

  if (tableData.rows.length === 0)
    return (
      <HtmlNoDataMessageParagraph>
        {emptyTableMessage}
      </HtmlNoDataMessageParagraph>
    );

  return (
    <HtmlTableContainer>
      {searchBarParameters && (
        <SearchBar placeHolder={searchBarParameters.placeHolder} />
      )}
      {sortColumnOptions && (
        <HtmlButtonContainer>
          {sortColumnOptions && (
            <SortButton
              sortOptions={sortColumnOptions}
              selectedSortData={sort}
              dispatch={dispatchSort}
            />
          )}
        </HtmlButtonContainer>
      )}
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
