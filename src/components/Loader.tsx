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
    border: 16px solid var(--color-contrast);
    border-radius: 50%;
    border-top: 16px solid var(--color-primary-dark);
    width: 120px;
    height: 120px;
    -webkit-animation: spin 2s linear infinite;
    animation: spin 2s linear infinite;
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
