import { styled } from "styled-components";

import Button, { BaseButtonType } from "./common/button";
import { ReactNode } from "react";

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

interface ButtonData {
  text: string;
  icon: ReactNode;
  styles: BaseButtonType;
  onClick: () => void;
}

interface Props {
  titleIcon: ReactNode;
  title: string;
  buttons: ButtonData[];
}

const SideBarBtnList = ({ buttons, titleIcon, title }: Props) => {
  return (
    <HtmlButtonList>
      <h3>
        {titleIcon}
        {title}
      </h3>
      <div>
        {buttons.map((button, index) => (
          <Button key={index} {...button.styles} handleClick={button.onClick}>
            {button.text}
            {button.icon}
          </Button>
        ))}
      </div>
    </HtmlButtonList>
  );
};

export default SideBarBtnList;
