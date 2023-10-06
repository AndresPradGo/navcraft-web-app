import { useState, useEffect, useReducer } from "react";
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

interface Props {
  tableData: TableProps;
  sortColumnOptions?: SortColumnType[];
}

const TableContainer = ({ tableData, sortColumnOptions }: Props) => {
  const [sortData, setSortData] = useState<SortDataType>({
    index: 0,
    order: "asc",
  });
  const [processedData, dispatch] = useReducer(
    tableDataReducer,
    tableData.rows
  );

  useEffect(() => {
    if (sortColumnOptions) {
      dispatch({
        type: "SORT",
        sortKey: sortColumnOptions[sortData.index].key,
        order: sortData.order,
      });
    }
  }, [sortData.index, sortData.order]);

  return (
    <HtmlTableContainer>
      <HtmlButtonContainer>
        {sortColumnOptions ? (
          <SortButton
            sortOptions={sortColumnOptions}
            selectedSortData={sortData}
            changeSelectedSortData={setSortData}
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
