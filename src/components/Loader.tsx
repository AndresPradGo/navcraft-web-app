import { styled } from "styled-components";

interface HtmlContainerProps {
  $margin: number;
}
const HtmlLoaderContainer = styled.div<HtmlContainerProps>`
  grid-row: 2;
  grid-column: 1;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: ${(props) => props.$margin}px 0;

  & p {
    color: var(--color-contrast) !important;
    font-size: 20px;
  }
`;

interface HtmlProps {
  $size: number;
}
const HtmlLoader = styled.div<HtmlProps>`
  grid-row: 2;
  grid-column: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  flex-shrink: 1;

  & div {
    border-right: 4px solid transparent;
    border-radius: 50%;
    border-top: 4px solid var(--color-contrast);
    background-color: transparent;
    width: ${(props) => props.$size}px;
    height: ${(props) => props.$size}px;
    -webkit-animation: spin 1s linear infinite;
    animation: spin 1s linear infinite;
  }
`;

interface Props {
  size?: number;
  message?: string;
  margin?: number;
}

const Loader = ({ size, message, margin }: Props) => {
  if (message) {
    return (
      <HtmlLoaderContainer $margin={margin === undefined ? 0 : margin}>
        <HtmlLoader $size={size || 120}>
          <div></div>
        </HtmlLoader>
        <p>{message}</p>
      </HtmlLoaderContainer>
    );
  }
  return (
    <HtmlLoader $size={size || 120}>
      <div></div>
    </HtmlLoader>
  );
};

export default Loader;
