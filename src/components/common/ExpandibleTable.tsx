import { useState, ReactNode } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";
import { styled } from "styled-components";

import Button from "./button";
import Table, { TableProps } from "./table/";

interface HtmlContainerProps {
  $marginTop: number;
}
const HtmlContainer = styled.div<HtmlContainerProps>`
  margin: ${(props) => props.$marginTop}px 0 50px;
  width: 100%;
`;

const HtmlTitleContainer = styled.div`
  text-wrap: wrap;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 5px;
  padding: 0 0 10px 5px;
  border-bottom: 1px solid var(--color-grey);

  & div {
    display: flex;
    align-items: center;

    & h3:first-of-type {
      margin: 0;
      color: var(--color-grey-bright);
    }
  }

  @media screen and (min-width: 425px) {
    padding: 0 0 10px 20px;
  }
`;

interface HtmlTagProps {
  $isOpen: boolean;
}
const ToggleIcon = styled(BsChevronDown)<HtmlTagProps>`
  color: var(--color-grey);
  cursor: pointer;
  margin-right: 5px;
  font-size: 25px;
  transform: rotate(${(props) => (props.$isOpen ? "-180deg" : "0deg")});
  transition: 0.3s transform linear;

  &:hover,
  &:focus {
    color: var(--color-white);
  }

  @media screen and (min-width: 425px) {
    margin-right: 20px;
  }
`;

const HtmlTableContainer = styled.div<HtmlTagProps>`
  transition: padding 0.6s, max-height 0.3s, opacity 0.6s;
  border-bottom: 1px solid var(--color-grey);
  padding: ${(props) => (props.$isOpen ? "15px" : "0px 15px")};
  max-height: ${(props) => (props.$isOpen ? "10000vh" : "0px")};
  opacity: ${(props) => (props.$isOpen ? "1" : "0")};
  overflow: hidden;
`;

interface Props extends TableProps {
  title: string;
  hanldeAdd: () => void;
  disableAdd?: boolean;
  otherComponent?: ReactNode;
  marginTop?: number;
}

const ExpandibleTable = ({
  title,
  hanldeAdd,
  disableAdd,
  otherComponent,
  tableData,
  emptyTableMessage,
  sortColumnOptions,
  pageSize,
  searchBarParameters,
  filterParameters,
  marginTop,
}: Props) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <HtmlContainer $marginTop={marginTop || 50}>
      <HtmlTitleContainer>
        <div>
          <ToggleIcon onClick={() => setIsOpen(!isOpen)} $isOpen={isOpen} />
          <h3>{title}</h3>
        </div>
        {!disableAdd ? (
          <Button
            borderRadious={100}
            padding="5px"
            height="30px"
            backgroundColor="var(--color-grey)"
            backgroundHoverColor="var(--color-white)"
            color="var(--color-primary-dark)"
            hoverColor="var(--color-primary-dark)"
            margin="0 20px 0 0px"
            fontSize={18}
            handleClick={hanldeAdd}
          >
            <AiOutlinePlus />
          </Button>
        ) : null}
      </HtmlTitleContainer>
      <HtmlTableContainer $isOpen={isOpen}>
        {otherComponent}
        <Table
          tableData={tableData}
          emptyTableMessage={emptyTableMessage}
          sortColumnOptions={sortColumnOptions}
          pageSize={pageSize}
          searchBarParameters={searchBarParameters}
          filterParameters={filterParameters}
        />
      </HtmlTableContainer>
    </HtmlContainer>
  );
};

export default ExpandibleTable;
