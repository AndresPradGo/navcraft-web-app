import styled from "styled-components";
import useSideBar from "../../sidebar/useSideBar";

interface HtmlTagProps {
  $sideBarIsExpanded: boolean;
}

const HtmlTable = styled.table<HtmlTagProps>`
  width: 100%;
  max-width: ${(props) => (props.$sideBarIsExpanded ? "100vw" : "100%")};
  margin-bottom: 24px;
  border-spacing: 0 16px;
`;

const HtmlTableHead = styled.thead<HtmlTagProps>`
  position: absolute;
  clip: rect(1px 1px 1px 1px);
  padding: 0;
  height: 1px;
  width: 1px;
  overflow: hidden;
  text-transform: uppercase;

  @media screen and (min-width: 768px) {
    position: ${(props) =>
      props.$sideBarIsExpanded ? "absolute" : "relative"};
    clip: ${(props) =>
      props.$sideBarIsExpanded ? "rect(1px 1px 1px 1px)" : "auto"};
    height: ${(props) => (props.$sideBarIsExpanded ? "1px" : "auto")};
    width: ${(props) => (props.$sideBarIsExpanded ? "1px" : "auto")};
  }

  @media screen and (min-width: 1068px) {
    position: relative;
    clip: auto;
    height: auto;
    width: auto;
  }
`;

const HtmlTableBody = styled.tbody<HtmlTagProps>`
  display: block;
  padding: 0;
  text-align: left;
  white-space: normal;

  @media screen and (min-width: 768px) {
    display: ${(props) =>
      props.$sideBarIsExpanded ? "block" : "table-row-group"};
  }

  @media screen and (min-width: 1068px) {
    display: table-row-group;
  }
`;

const HtmlTableRow = styled.tr<HtmlTagProps>`
  display: block;
  padding: 0;
  text-align: left;
  white-space: normal;
  border-radius: 3px;

  background-color: var(--color-primary-bright);
  overflow: hidden;
  perspective: 1px;

  margin-bottom: 24px;

  @media screen and (min-width: 768px) {
    display: ${(props) => (props.$sideBarIsExpanded ? "block" : "table-row")};
    & td:last-of-type,
    & th:last-of-type {
      border-radius: 0 3px 3px 0;
    }

    & th:first-of-type,
    & td:first-of-type {
      border-radius: 3px 0 0 3px;
    }
  }

  @media screen and (min-width: 1068px) {
    display: table-row;
  }
`;

const HtmlTableHeaderCell = styled.th<HtmlTagProps>`
  display: block;
  padding: 0;
  text-align: left;
  white-space: normal;
  overflow: hidden;

  padding: 8px;
  vertical-align: middle;

  font-weight: bold;

  background-color: var(--color-highlight);
  border: 0px;
  text-align: center;
  color: var(--color-grey-dark);

  @media screen and (min-width: 768px) {
    display: ${(props) => (props.$sideBarIsExpanded ? "block" : "table-cell")};
    padding: ${(props) => (props.$sideBarIsExpanded ? "8px" : "16px 10px")};
  }

  @media screen and (min-width: 1068px) {
    display: table-cell;
    padding: 16px 10px;
  }
`;

const HtmlTableBodyHeaderCell = styled(HtmlTableHeaderCell)`
  @media screen and (min-width: 768px) {
    background-color: ${(props) =>
      props.$sideBarIsExpanded ? "var(--color-highlight)" : "transparent"};
    color: ${(props) =>
      props.$sideBarIsExpanded
        ? "var(--color-grey-dark)"
        : "var(--color-white)"};
    text-align: ${(props) => (props.$sideBarIsExpanded ? "center" : "left")};

    &:first-of-type {
      text-align: center;
    }
  }

  @media screen and (min-width: 1068px) {
    background-color: transparent;
    color: var(--color-white);
    text-align: left;

    &:first-of-type {
      text-align: center;
    }
  }
`;

const HtmlTableDataCell = styled.td<HtmlTagProps>`
  display: block;
  white-space: normal;

  vertical-align: middle;
  padding: 8px 16px;
  text-align: right;

  color: var(--color-grey-bright);

  &:first-of-type {
    padding-top: 16px;
  }

  &:before {
    content: attr(data-title);
    float: left;
    color: var(--color-white);
    text-transform: uppercase;
    font-weight: bold;
  }

  @media screen and (min-width: 425px) {
    padding: ${(props) => (props.$sideBarIsExpanded ? "8px 16px" : "8px 40px")};
  }

  @media screen and (min-width: 525px) {
    padding: ${(props) => (props.$sideBarIsExpanded ? "8px 16px" : "8px 64px")};
  }

  @media screen and (min-width: 625px) {
    padding: ${(props) => (props.$sideBarIsExpanded ? "8px 16px" : "8px 88px")};
  }

  @media screen and (min-width: 768px) {
    display: ${(props) => (props.$sideBarIsExpanded ? "block" : "table-cell")};

    padding: ${(props) =>
      props.$sideBarIsExpanded ? "8px 64px" : "16px 10px"};
    text-align: ${(props) => (props.$sideBarIsExpanded ? "right" : "center")};

    &:last-of_type {
      border-right: 0px;
    }

    &:before {
      content: ${(props) =>
        props.$sideBarIsExpanded ? "attr(data-title)" : "none"};
    }
  }

  @media screen and (min-width: 1068px) {
    display: table-cell;

    padding: 16px 10px;
    text-align: center;

    &:before {
      content: none;
    }
  }
`;

interface Props {
  keys: string[];
  headers: { [key: string]: string };
  rows: { [key: string]: any }[];
}

const Table = ({ keys, headers, rows }: Props) => {
  const { sideBarIsExpanded } = useSideBar();
  return (
    <>
      <HtmlTable $sideBarIsExpanded={sideBarIsExpanded}>
        <HtmlTableHead $sideBarIsExpanded={sideBarIsExpanded}>
          <HtmlTableRow $sideBarIsExpanded={sideBarIsExpanded}>
            {keys.map((key) => (
              <HtmlTableHeaderCell
                key={key}
                $sideBarIsExpanded={sideBarIsExpanded}
              >
                {headers[key]}
              </HtmlTableHeaderCell>
            ))}
          </HtmlTableRow>
        </HtmlTableHead>
        <HtmlTableBody $sideBarIsExpanded={sideBarIsExpanded}>
          {rows.map((row) => (
            <HtmlTableRow key={row.id} $sideBarIsExpanded={sideBarIsExpanded}>
              {keys.map((key, idx) =>
                idx ? (
                  <HtmlTableDataCell
                    data-title={headers[key]}
                    key={`${key}${row}`}
                    $sideBarIsExpanded={sideBarIsExpanded}
                  >
                    {row[key]}
                  </HtmlTableDataCell>
                ) : (
                  <HtmlTableBodyHeaderCell
                    key={`${key}${row}`}
                    $sideBarIsExpanded={sideBarIsExpanded}
                  >
                    {row[key]}
                  </HtmlTableBodyHeaderCell>
                )
              )}
            </HtmlTableRow>
          ))}
        </HtmlTableBody>
      </HtmlTable>
    </>
  );
};

export default Table;
