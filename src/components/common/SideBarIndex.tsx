import { ReactNode } from "react";
import { RiArchiveDrawerFill } from "react-icons/ri";
import { animateScroll as scroll } from "react-scroll";
import { styled } from "styled-components";

import Button from "./button";
import useSideBar from "../sidebar/useSideBar";

const HtmlButtonList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 15px 8px;

  & h3 {
    padding: 0 10px;
    color: var(--color-grey-bright);
    margin: 0;
    display: flex;
    align-items: center;
    width: 100%;
  }

  & div {
    width: 100%;
    padding: 10px 8px;
    border-top: 1px solid var(--color-grey);
  }

  @media screen and (min-width: 635px) {
    padding: 10px;

    & div {
      padding: 10px 13px;
    }
  }

  @media screen and (min-width: 1280px) {
    padding: 18px;

    & div {
      padding: 10px 18px;
    }
  }
`;

const HtmlSpan = styled.span`
  margin-left: 10px;
`;

const SectionIcon = styled(RiArchiveDrawerFill)`
  font-size: 27px;
  margin-right: 8px;
  padding-bottom: 3px;
`;

export interface PageSectionDataType {
  key: string;
  title: string;
  icon: ReactNode;
}

interface Props {
  handleChangeSection: (index: number) => void;
  selectedIdx: number;
  sectionOptions: PageSectionDataType[];
}

const SideBarIndex = ({
  handleChangeSection,
  selectedIdx,
  sectionOptions,
}: Props) => {
  const sideBar = useSideBar();

  const handleClick = (index: number) => {
    scroll.scrollToTop({
      duration: 400,
      delay: 200,
      smooth: true,
    });
    handleChangeSection(index);
    sideBar.handleExpandSideBar(false);
  };

  return (
    <HtmlButtonList>
      <h3>
        <SectionIcon />
        {"Sections"}
      </h3>
      <div>
        {sectionOptions.map((item, index) => (
          <Button
            key={index}
            handleClick={() => handleClick(index)}
            color={`${
              index === selectedIdx
                ? "var(--color-white)"
                : "var(--color-contrast)"
            }`}
            hoverColor={`${
              index === selectedIdx
                ? "var(--color-white)"
                : "var(--color-white)"
            }`}
            backgroundColor="transparent"
            backgroundHoverColor="transparent"
            fill={false}
            spaceChildren="space-between"
            borderWidth={0}
            fontSize={20}
            margin="5px 0"
            padding="0"
            onlyHover={true}
          >
            {item.icon}
            <HtmlSpan>{item.title}</HtmlSpan>
          </Button>
        ))}
      </div>
    </HtmlButtonList>
  );
};

export default SideBarIndex;
