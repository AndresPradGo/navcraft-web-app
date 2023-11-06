import { ReactNode } from "react";
import { styled } from "styled-components";

const HtmlDataList = styled.ul`
  margin: 35px 0;
  list-style: none;
  width: 100%;
  align-self: center;
  max-width: 800px;
  padding: 0;

  & li {
    width: 100%;
    margin: 5px 0;
    padding: 20px 5px 5px;
    border-bottom: 1px solid var(--color-grey);
    display: flex;
    justify-content: space-between;
    align-items: center;

    & h3 {
      padding-right: 8px;
      margin: 0;
      display: flex;
      align-items: center;
      color: var(--color-white);
    }

    & span {
      text-wrap: wrap;
      text-align: right;
      padding-left: 8px;
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
  icon: ReactNode;
  data: string;
}

interface Props {
  dataList: DataType[];
}

const DataTableList = ({ dataList }: Props) => {
  return (
    <HtmlDataList>
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
