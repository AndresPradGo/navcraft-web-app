import { useState, useReducer } from "react";
import { styled } from "styled-components";
import Table, { Props as TableProps } from "./Table";
import SortButton, { SortColumnType, SortDataType } from "./SortButton";
import tableDataReducer from "./tableDataReducer";

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
  sortColumnOptions?: SortColumnType[];
  emptyTableMessage: string;
}

const TableContainer = ({
  tableData,
  sortColumnOptions,
  emptyTableMessage,
}: Props) => {
  const [sortData, setSortData] = useState<SortDataType>({
    index: 0,
    order: "asc",
  });
  const [processedData, dispatch] = useReducer(
    tableDataReducer,
    tableData.rows
  );

  const handleSortColumnChange = (newSortData: SortDataType) => {
    if (sortColumnOptions) {
      dispatch({
        type: "SORT",
        sortKey: sortColumnOptions[newSortData.index].key,
        order: newSortData.order,
      });
      setSortData({ ...newSortData });
    }
  };
  if (tableData.rows.length === 0)
    return (
      <HtmlNoDataMessageParagraph>
        {emptyTableMessage}
      </HtmlNoDataMessageParagraph>
    );
  return (
    <HtmlTableContainer>
      <HtmlButtonContainer>
        {sortColumnOptions ? (
          <SortButton
            sortOptions={sortColumnOptions}
            selectedSortData={sortData}
            changeSelectedSortData={handleSortColumnChange}
          />
        ) : (
          <></>
        )}
      </HtmlButtonContainer>
      <Table
        rows={processedData}
        headers={tableData.headers}
        keys={tableData.keys}
      />
    </HtmlTableContainer>
  );
};

export default TableContainer;
