import { BsChevronUp, BsChevronDown } from "react-icons/bs";
import { styled } from "styled-components";

import useSideBar from "./useSideBar";

interface ButtonProps {
  $expanded: boolean;
}

const Button = styled.button<ButtonProps>`
  border-radius: 99999px;
  width: 40px;
  height: 40px;
  padding: 0;
  font-size: 20px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  border: 1px solid var(--color-grey-dark);
  cursor: pointer;
  transition: all 0.2s linear;
  color: var(--color-grey-light);
  background-color: var(--color-primary-dark);

  &:last-of-type {
    max-width: 0px;
    max-height: 0px;
    display: none;
    pointer-events: none;
    cursor: none;
  }

  .chevron-icon:first-child {
    transition: all 0.2s linear;
    transform: ${(props) =>
      props.$expanded ? "translateY(13px)" : "translateY(3px)"};
  }
  .chevron-icon:last-child {
    transition: all 0.2s linear;
    transform: ${(props) =>
      props.$expanded ? "translateY(-13px)" : "translateY(-3px)"};
  }

  &:hover,
  &:focus {
    color: var(--color-white);
    background-color: var(--color-primary-bright);
  }

  @media screen and (min-width: 768px) {
    &:first-of-type {
      max-width: 0px;
      max-height: 0px;
      display: none;
      pointer-events: none;
      cursor: none;
    }

    &:last-of-type {
      max-width: 40px;
      max-height: 40px;
      display: flex;
      pointer-events: auto;
      cursor: pointer;
    }
  }

  @media screen and (min-width: 1280px) {
    max-width: 0px !important;
    max-height: 0px !important;
    display: none !important;
    pointer-events: none !important;
    cursor: none !important;
  }
`;

const HtmlDummyButton = styled.button`
  border: 0px;
  max-width: 0px;
  max-height: 0px;
  display: none;
  pointer-events: none;
  cursor: none;
  background-color: transparent,
  visibility: hidden;
`;

const SideBarExpandButton = () => {
  const { hasSideBar, sideBarIsExpanded, setSideBarIsExpanded } = useSideBar();

  if (!hasSideBar) return <HtmlDummyButton />;

  return (
    <Button
      $expanded={sideBarIsExpanded}
      onClick={() => setSideBarIsExpanded(!sideBarIsExpanded)}
    >
      <BsChevronUp className="chevron-icon" />
      <BsChevronDown className="chevron-icon" />
    </Button>
  );
};

export default SideBarExpandButton;
