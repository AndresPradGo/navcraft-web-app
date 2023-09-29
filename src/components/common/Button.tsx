import { ReactNode } from "react";
import { styled } from "styled-components";

interface HtmlButtonProps {
  $color: string;
  $hoverColor: string;
  $backgroundColor: string;
  $backgroundHoverColor: string;
  $fill: boolean;
  $scale: number;
  $margin: string;
}

const HtmlButton = styled.button<HtmlButtonProps>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 24px;
  font-size: 12px;
  font-weight: lighter;
  letter-spacing: 2px;
  white-space: nowrap;
  border: 2px solid ${(props) => props.$backgroundColor};
  border-radius: 10px;
  cursor: pointer;
  outline: 0;
  transition: all 0.2s linear;
  padding: 15px 10px;
  margin: ${(props) => props.$margin};
  color: ${(props) => props.$color};
  background-color: ${(props) =>
    props.$fill ? props.$backgroundColor : "transparent"};

  &:hover,
  &:focus {
    color: ${(props) => props.$hoverColor};
    background-color: ${(props) =>
      props.$fill ? props.$backgroundHoverColor : "transparent"};
    border: 2px solid ${(props) => props.$backgroundHoverColor};
  }
`;

interface Props {
  color: string;
  hoverColor: string;
  backgroundColor: string;
  backgroundHoverColor: string;
  fill: boolean;
  scale: number;
  margin: string;
  children: ReactNode[];
  handleClick?: () => void;
}

const Button = ({
  color,
  hoverColor,
  backgroundColor,
  backgroundHoverColor,
  fill,
  scale,
  margin,
  children,
  handleClick,
}: Props) => {
  return (
    <HtmlButton
      $color={color}
      $hoverColor={hoverColor}
      $backgroundColor={backgroundColor}
      $backgroundHoverColor={backgroundHoverColor}
      $fill={fill}
      $scale={scale}
      $margin={margin}
      onClick={handleClick ? handleClick : () => {}}
    >
      {children.map((child) => child)}
    </HtmlButton>
  );
};

export default Button;
