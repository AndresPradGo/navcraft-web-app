import { ReactNode } from "react";
import { styled } from "styled-components";

interface HtmlTagProps {
  $maxWidth: number;
  $margin: string;
}
const HtmlDataList = styled.ul<HtmlTagProps>`
  flex-shrink: 0;
  margin: ${(props) => props.$margin};
  list-style: none;
  width: 100%;
  align-self: center;
  max-width: ${(props) => props.$maxWidth}px;
  padding: 0;

  & li {
    width: 100%;
    margin: 5px 0;
    padding: 20px 5px 5px;
    border-bottom: 1px solid var(--color-grey);
    display: flex;
    justify-content: space-between;
    flex-wrap: nowrap;
    align-items: center;

    & h3 {
      padding-right: 8px;
      margin: 0;
      display: flex;
      align-items: center;
      color: var(--color-white);
      text-wrap: wrap;

      & svg {
        flex-shrink: 0;
      }
    }

    & span {
      text-align: right;
      padding-left: 5px;
      padding-right: 10px;
      text-wrap: wrap;
      overflow: hidden;
    }
  }

  @media screen and (min-width: 425px) {
    & li {
      padding: 20px 10px 5px;
    }
  }
`;

export interface DataType {
  key: string;
  title: string;
  icon?: ReactNode;
  data: string | number;
}

interface Props {
  dataList: DataType[];
  maxWidth?: number;
  margin?: string;
}

const DataTableList = ({ dataList, maxWidth, margin }: Props) => {
  return (
    <HtmlDataList
      $maxWidth={maxWidth !== undefined ? maxWidth : 700}
      $margin={margin !== undefined ? margin : "35px 0"}
    >
      {dataList.map((item) => {
        return (
          <li key={item.key}>
            <h3>
              {item.icon}
              {item.title}
            </h3>
            <span>{item.data}</span>
          </li>
        );
      })}
    </HtmlDataList>
  );
};

export default DataTableList;
