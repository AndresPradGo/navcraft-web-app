import { styled } from "styled-components";

const HtmlSideBar = styled.div`
  background-color: var(--color-primary);
  border-right: 2px solid var(--color-primary-light);
  height: 100%;
  width: 100%;
  transition: all 1s linear;
  padding: 100px 20px 0;
  display: flex;
  flex-direction: column;
`;

const SideBar = () => {
  return <HtmlSideBar>SideBar</HtmlSideBar>;
};

export default SideBar;
