import { styled } from "styled-components";

const HtmlLoader = styled.div`
  grid-row: 2;
  grid-column: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  & div {
    border-right: 4px solid transparent;
    border-radius: 50%;
    border-top: 4px solid var(--color-contrast);
    background-color: transparent;
    width: 120px;
    height: 120px;
    -webkit-animation: spin 1s linear infinite;
    animation: spin 1s linear infinite;
  }
`;

const Loader = () => {
  return (
    <HtmlLoader>
      <div></div>
    </HtmlLoader>
  );
};

export default Loader;
