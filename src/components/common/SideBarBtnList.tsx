import { styled } from 'styled-components';

import Button, { BaseButtonType } from './button';
import { ReactNode } from 'react';

interface HtmlProps {
  $paddingBottom: boolean;
}
const HtmlButtonList = styled.div<HtmlProps>`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 15px 8px;
  padding-bottom: ${(props) => (props.$paddingBottom ? 30 : 15)}px;
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
    padding-bottom: ${(props) => (props.$paddingBottom ? 20 : 10)}px;

    & div {
      padding: 10px 13px;
    }
  }

  @media screen and (min-width: 1280px) {
    padding: 18px;
    padding-bottom: ${(props) => (props.$paddingBottom ? 36 : 18)}px;

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
  paddingBottom?: boolean;
}

const SideBarBtnList = ({
  buttons,
  titleIcon,
  title,
  paddingBottom,
}: Props) => {
  return (
    <HtmlButtonList $paddingBottom={!!paddingBottom}>
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
