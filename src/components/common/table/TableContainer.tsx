import { useState, ReactNode, useReducer } from "react";
import { styled } from "styled-components";

import Table, { Props as TableProps } from "./Table";
import SortButton, { SortColumnType, SortDataType } from "./SortButton";
import pageReducer from "./pageReducer";
import Pagination from "./Pagination";
import useProcessTableData from "./useProcessTableData";

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
  addButton?: ReactNode;
}

const TableContainer = ({
  tableData,
  emptyTableMessage,
  sortColumnOptions,
  pageSize,
  addButton,
}: Props) => {
  const [page, dispatchPage] = useReducer(pageReducer, 1);
  const [sortData, setSortData] = useState<SortDataType>({
    index: 0,
    order: "asc",
  });

  const numPages = pageSize ? Math.ceil(tableData.rows.length / pageSize) : 1;

  const processedData = useProcessTableData({
    data: tableData.rows,
    sortParams: sortColumnOptions
      ? {
          key: sortColumnOptions[sortData.index].key,
          order: sortData.order,
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
      {sortColumnOptions && (
        <HtmlButtonContainer>
          {sortColumnOptions && (
            <SortButton
              sortOptions={sortColumnOptions}
              selectedSortData={sortData}
              changeSelectedSortData={(newSortData: SortDataType) => {
                setSortData({ ...newSortData });
              }}
            />
          )}
          {addButton && addButton}
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
