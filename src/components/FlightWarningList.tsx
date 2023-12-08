import { styled } from "styled-components";

const HtmlContainer = styled.div`
  width: 100%;
  color: var(--color-grey-bright);
  text-wrap: wrap;

  & h3 {
    color: var(--color-warning-hover);
    margin: 16px 0 0;
  }

  & ul {
    margin: 0 0 16px;
  }
`;

interface Props {
  warnings: string[][];
}
const FlightWarningList = ({ warnings }: Props) => {
  if (
    warnings.length === 0 ||
    warnings.every((innerList) => innerList.length === 0)
  )
    return null;

  return (
    <HtmlContainer>
      <h3>WARNINGS!</h3>
      <ul>
        {warnings.map((list, i) =>
          list.map((w, j) => <li key={`${i}.${j}`}>{w}</li>)
        )}
      </ul>
    </HtmlContainer>
  );
};

export default FlightWarningList;
