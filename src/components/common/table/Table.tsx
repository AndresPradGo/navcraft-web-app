import styled from "styled-components";
import useSideBar from "../../sidebar/useSideBar";
import EditTableButtons from "./EditTableButtons";

interface HtmlTagProps {
  $sideBarIsExpanded: boolean;
  $breakingPoint: number;
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

  @media screen and (min-width: ${(props) => props.$breakingPoint}px) {
    position: ${(props) =>
      props.$sideBarIsExpanded ? "absolute" : "relative"};
    clip: ${(props) =>
      props.$sideBarIsExpanded ? "rect(1px 1px 1px 1px)" : "auto"};
    height: ${(props) => (props.$sideBarIsExpanded ? "1px" : "auto")};
    width: ${(props) => (props.$sideBarIsExpanded ? "1px" : "auto")};
  }

  @media screen and (min-width: ${(props) => props.$breakingPoint + 300}px) {
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

  @media screen and (min-width: ${(props) => props.$breakingPoint}px) {
    display: ${(props) =>
      props.$sideBarIsExpanded ? "block" : "table-row-group"};
  }

  @media screen and (min-width: ${(props) => props.$breakingPoint + 300}px) {
    display: table-row-group;
  }
`;

const HtmlTableRow = styled.tr<HtmlTagProps>`
  display: block;
  padding: 0;
  padding-bottom: 20px;
  text-align: left;
  white-space: normal;
  border-radius: 3px;

  background-color: var(--color-primary-bright);
  overflow: hidden;
  perspective: 1px;

  margin-bottom: 24px;

  @media screen and (min-width: ${(props) => props.$breakingPoint}px) {
    display: ${(props) => (props.$sideBarIsExpanded ? "block" : "table-row")};
    padding-bottom: ${(props) => (props.$sideBarIsExpanded ? "20" : "0")}px;

    & td:last-of-type,
    & th:last-of-type {
      border-radius: 0 3px 3px 0;
    }

    & th:first-of-type,
    & td:first-of-type {
      border-radius: 3px 0 0 3px;
    }
  }

  @media screen and (min-width: ${(props) => props.$breakingPoint + 300}px) {
    display: table-row;
    padding-bottom: 0;
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

  @media screen and (min-width: ${(props) => props.$breakingPoint}px) {
    display: ${(props) => (props.$sideBarIsExpanded ? "block" : "table-cell")};
    padding: ${(props) => (props.$sideBarIsExpanded ? "8px" : "16px 10px")};
  }

  @media screen and (min-width: ${(props) => props.$breakingPoint + 300}px) {
    display: table-cell;
    padding: 16px 10px;
  }
`;

const HtmlTableBodyHeaderCell = styled(HtmlTableHeaderCell)`
  @media screen and (min-width: ${(props) => props.$breakingPoint}px) {
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

  @media screen and (min-width: ${(props) => props.$breakingPoint + 300}px) {
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
  text-align: right;
  padding: 8px 16px;
  color: var(--color-grey-bright);

  &:first-of-type {
    padding-top: 16px;
  }

  &:before {
    content: attr(data-title);
    margin-right: 10px;
    float: left;
    color: var(--color-white);
    text-transform: uppercase;
    font-weight: bold;
  }

  @media screen and (min-width: 425px) {
    padding: ${(props) => (props.$sideBarIsExpanded ? "8px 16px" : "8px 10%")};
  }

  @media screen and (min-width: 525px) {
    padding: ${(props) => (props.$sideBarIsExpanded ? "8px 16px" : "8px 15%")};
  }

  @media screen and (min-width: 625px) {
    padding: ${(props) => (props.$sideBarIsExpanded ? "8px 5%" : "8px 20%")};
  }

  @media screen and (min-width: ${(props) => props.$breakingPoint}px) {
    padding: ${(props) => (props.$sideBarIsExpanded ? "8px 20%" : "16px 10px")};
    display: ${(props) => (props.$sideBarIsExpanded ? "block" : "table-cell")};
    text-align: ${(props) => (props.$sideBarIsExpanded ? "right" : "center")};

    &:last-of_type {
      border-right: 0px;
    }

    &:before {
      content: ${(props) =>
        props.$sideBarIsExpanded ? "attr(data-title)" : "none"};
      margin-right: ${(props) => (props.$sideBarIsExpanded ? "10px" : "0")};
    }
  }

  @media screen and (min-width: ${(props) => props.$breakingPoint + 300}px) {
    display: table-cell;
    text-align: center;
    padding: 16px 10px;

    &:before {
      content: none;
      margin-right: 0;
    }
  }
`;

interface RowType {
  id: number;
  href: string;
  onDelete: () => void;
  data: { [key: string]: string | number };
}

interface Props {
  keys: string[];
  headers: { [key: string]: string };
  rows: RowType[];
  breakingPoint?: number;
  editable?: "edit" | "open";
}

const Table = ({
  keys,
  headers,
  rows,
  breakingPoint = 768,
  editable,
}: Props) => {
  const { sideBarIsExpanded } = useSideBar();

  const keysWithButtons = [...keys];
  const headersWithButtons = { ...headers };
  if (editable) {
    keysWithButtons.push("buttons");
    headersWithButtons.buttons = "";
  } else {
  }

  const truncatedBreakingPoint =
    breakingPoint < 768 ? 768 : breakingPoint > 980 ? 980 : breakingPoint;

  return (
    <>
      <HtmlTable
        $sideBarIsExpanded={sideBarIsExpanded}
        $breakingPoint={truncatedBreakingPoint}
      >
        <HtmlTableHead
          $sideBarIsExpanded={sideBarIsExpanded}
          $breakingPoint={truncatedBreakingPoint}
        >
          <HtmlTableRow
            $sideBarIsExpanded={sideBarIsExpanded}
            $breakingPoint={truncatedBreakingPoint}
          >
            {keysWithButtons.map((key) => (
              <HtmlTableHeaderCell
                key={key}
                $sideBarIsExpanded={sideBarIsExpanded}
                $breakingPoint={truncatedBreakingPoint}
              >
                {headersWithButtons[key]}
              </HtmlTableHeaderCell>
            ))}
          </HtmlTableRow>
        </HtmlTableHead>
        <HtmlTableBody
          $sideBarIsExpanded={sideBarIsExpanded}
          $breakingPoint={truncatedBreakingPoint}
        >
          {rows.map((row) => (
            <HtmlTableRow
              key={row.id}
              $sideBarIsExpanded={sideBarIsExpanded}
              $breakingPoint={truncatedBreakingPoint}
            >
              {keysWithButtons.map((key, idx) =>
                idx ? (
                  key === "buttons" ? (
                    <HtmlTableDataCell
                      key={`${key}${row.id}`}
                      $sideBarIsExpanded={sideBarIsExpanded}
                      $breakingPoint={truncatedBreakingPoint}
                    >
                      <EditTableButtons
                        href={row.href}
                        onDelete={row.onDelete}
                        editable={editable ? editable : "edit"}
                      />
                    </HtmlTableDataCell>
                  ) : (
                    <HtmlTableDataCell
                      data-title={headersWithButtons[key]}
                      key={`${key}${row.id}`}
                      $sideBarIsExpanded={sideBarIsExpanded}
                      $breakingPoint={truncatedBreakingPoint}
                    >
                      {row.data[key]}
                    </HtmlTableDataCell>
                  )
                ) : (
                  <HtmlTableBodyHeaderCell
                    key={`${key}${row.id}`}
                    $sideBarIsExpanded={sideBarIsExpanded}
                    $breakingPoint={truncatedBreakingPoint}
                  >
                    {row.data[key]}
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
