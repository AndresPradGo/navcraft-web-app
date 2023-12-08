import styled from "styled-components";
import useSideBar from "../../sidebar/useSideBar";
import { ReactNode } from "react";
import EditTableButtons, {
  Props as EditButtonsProps,
  EditButtonsPropsTypeUnion,
} from "./EditTableButtons";

interface HtmlTagProps {
  $sideBarIsExpanded: boolean;
  $breakingPoint: number;
}

const HtmlTable = styled.table<HtmlTagProps>`
  flex-grow: 0;
  width: 100%;
  max-width: 800px;
  margin-bottom: 10px;
  border-spacing: 0 10px;

  @media screen and (min-width: ${(props) => props.$breakingPoint}px) {
    max-width: 100vw;
  }
`;

const HtmlTableHead = styled.thead<HtmlTagProps>`
  position: absolute;
  clip: rect(1px 1px 1px 1px);
  padding: 0;
  height: 1px;
  width: 1px;
  overflow: hidden;

  @media screen and (min-width: ${(props) => props.$breakingPoint}px) {
    position: ${(props) =>
      props.$sideBarIsExpanded ? "absolute" : "relative"};
    clip: ${(props) =>
      props.$sideBarIsExpanded ? "rect(1px 1px 1px 1px)" : "auto"};
    height: ${(props) => (props.$sideBarIsExpanded ? "1px" : "auto")};
    width: ${(props) => (props.$sideBarIsExpanded ? "1px" : "auto")};

    & tr th:first-of-type {
      border-radius: ${(props) =>
        props.$sideBarIsExpanded ? "0" : "3px 0 0 3px"};
    }

    & tr th:last-of-type {
      border-radius: ${(props) =>
        props.$sideBarIsExpanded ? "0" : "0 3px 3px 0"};
    }
  }

  @media screen and (min-width: ${(props) => props.$breakingPoint + 315}px) {
    position: relative;
    clip: auto;
    height: auto;
    width: auto;

    & tr th:first-of-type {
      border-radius: 3px 0 0 3px;
    }

    & tr th:last-of-type {
      border-radius: 0 3px 3px 0;
    }
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

    & tr th:first-of-type {
      border-radius: ${(props) =>
        props.$sideBarIsExpanded ? "0" : "3px 0 0 3px"};
    }

    & tr td:last-of-type {
      border-radius: ${(props) =>
        props.$sideBarIsExpanded ? "0" : "0 3px 3px 0"};
    }
  }

  @media screen and (min-width: ${(props) => props.$breakingPoint + 315}px) {
    display: table-row-group;

    & tr th:first-of-type {
      border-radius: 3px 0 0 3px;
    }

    & tr td:last-of-type {
      border-radius: 0 3px 3px 0;
    }
  }
`;

const HtmlTableRow = styled.tr<HtmlTagProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
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
    display: ${(props) => (props.$sideBarIsExpanded ? "flex" : "table-row")};
    padding-bottom: ${(props) => (props.$sideBarIsExpanded ? "20" : "0")}px;
  }

  @media screen and (min-width: ${(props) => props.$breakingPoint + 315}px) {
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
  min-width: 100%;

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

  @media screen and (min-width: ${(props) => props.$breakingPoint + 315}px) {
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

  @media screen and (min-width: ${(props) => props.$breakingPoint + 315}px) {
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
  text-wrap: wrap;
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: break-word;
  max-width: 1000px;
  min-width: 100%;

  &:first-of-type {
    padding-top: 16px;
  }

  &:before {
    content: attr(data-title);
    margin-right: 10px;
    float: left;
    color: var(--color-white);
    font-weight: bold;
  }

  @media screen and (min-width: 425px) {
    padding: ${(props) => (props.$sideBarIsExpanded ? "8px 16px" : "8px 10%")};
  }

  @media screen and (min-width: 525px) {
    padding: ${(props) => (props.$sideBarIsExpanded ? "8px 5%" : "8px 10%")};
  }

  @media screen and (min-width: ${(props) => props.$breakingPoint}px) {
    padding: ${(props) => (props.$sideBarIsExpanded ? "8px 15%" : "16px 10px")};
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

  @media screen and (min-width: ${(props) => props.$breakingPoint + 315}px) {
    display: table-cell;
    text-align: center;
    padding: 16px 10px;

    &:before {
      content: none;
      margin-right: 0;
    }
  }
`;

export interface RowType extends EditButtonsProps {
  id: number;
  [key: string]: ReactNode | EditButtonsPropsTypeUnion;
}

export interface Props {
  keys: string[];
  headers: { [key: string]: string };
  rows: RowType[] | [];
  breakingPoint?: number;
}

interface InternalProps extends Props {
  hasButtons: boolean;
}

const Table = ({
  keys,
  headers,
  rows,
  hasButtons,
  breakingPoint = 768,
}: InternalProps) => {
  const { sideBarIsExpanded } = useSideBar();

  const keysWithButtons = [...keys];
  const headersWithButtons = { ...headers };
  if (hasButtons) {
    keysWithButtons.push("buttons");
    headersWithButtons.buttons = "";
  }

  const truncatedBreakingPoint = breakingPoint < 526 ? 526 : breakingPoint;
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
                        handleEdit={row.handleEdit}
                        handleDelete={row.handleDelete as () => {}}
                        permissions={row.permissions}
                      />
                    </HtmlTableDataCell>
                  ) : (
                    <HtmlTableDataCell
                      data-title={headersWithButtons[key]}
                      key={`${key}${row.id}`}
                      $sideBarIsExpanded={sideBarIsExpanded}
                      $breakingPoint={truncatedBreakingPoint}
                    >
                      {row[key] as ReactNode}
                    </HtmlTableDataCell>
                  )
                ) : (
                  <HtmlTableBodyHeaderCell
                    key={`${key}${row.id}`}
                    $sideBarIsExpanded={sideBarIsExpanded}
                    $breakingPoint={truncatedBreakingPoint}
                  >
                    {row[key] as ReactNode}
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
