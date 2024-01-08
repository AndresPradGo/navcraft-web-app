import { styled } from "styled-components";
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
}

const Loader = ({ size }: Props) => {
  return (
    <HtmlLoader $size={size || 120}>
      <div></div>
    </HtmlLoader>
  );
};

export default Loader;
