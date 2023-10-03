import { ReactNode } from "react";
import { styled } from "styled-components";

interface HtmlButtonProps {
  $color: string;
  $hoverColor: string;
  $backgroundColor: string;
  $backgroundHoverColor: string;
  $fill: boolean;
  $shadow: boolean;
  $width: number;
  $fontSize: number;
  $borderRadious: number;
  $margin: string;
  $padding: string;
  $justifyContent: "space-between" | "center";
}

const HtmlButton = styled.button<HtmlButtonProps>`
  display: flex;
  flex-direction: row;
  justify-content: ${(props) => props.$justifyContent};
  align-items: center;
  min-height: 24px;
  min-width: ${(props) => props.$width}px;
  font-size: ${(props) => props.$fontSize}px;
  font-weight: lighter;
  letter-spacing: 2px;
  white-space: nowrap;
  border: 2px solid ${(props) => props.$backgroundColor};
  border-radius: ${(props) => props.$borderRadious}px;
  cursor: pointer;
  outline: 0;
  transition: all 0.2s linear;
  padding: ${(props) => props.$padding};
  margin: ${(props) => props.$margin};
  color: ${(props) => props.$color};
  background-color: ${(props) =>
    props.$fill ? props.$backgroundColor : "transparent"};
  box-shadow: ${(props) =>
    props.$shadow
      ? "0 0 10px 1px var(--color-grey)"
      : "0 0 0 0 var(--color-primary-dark)"};

  &:hover,
  &:focus {
    color: ${(props) => props.$hoverColor};
    background-color: ${(props) =>
      props.$fill ? props.$backgroundHoverColor : "transparent"};
    border: 2px solid ${(props) => props.$backgroundHoverColor};
  }
`;

interface Props {
  color?: string;
  hoverColor?: string;
  backgroundColor?: string;
  backgroundHoverColor?: string;
  fill?: boolean;
  shadow?: boolean;
  width?: number;
  fontSize?: number;
  borderRadious?: number;
  margin?: string;
  padding?: string;
  children: ReactNode[];
  handleClick?: () => void;
}

const Button = ({
  color,
  hoverColor,
  backgroundColor,
  backgroundHoverColor,
  fill = true,
  shadow,
  width,
  fontSize,
  borderRadious,
  margin,
  padding,
  children,
  handleClick,
}: Props) => {
  const defaultColor = color
    ? color
    : fill
    ? "var(--color-grey-dark)"
    : "var(--color-highlight)";

  const defaultHoverColor = hoverColor
    ? hoverColor
    : fill
    ? "var(--color-grey-bright)"
    : "var(--color-highlight-hover)";

  return (
    <HtmlButton
      $color={defaultColor}
      $hoverColor={defaultHoverColor}
      $backgroundColor={
        backgroundColor ? backgroundColor : "var(--color-highlight)"
      }
      $backgroundHoverColor={
        backgroundHoverColor
          ? backgroundHoverColor
          : "var(--color-highlight-hover)"
      }
      $fill={fill}
      $shadow={shadow ? shadow : false}
      $width={width ? width : 0}
      $fontSize={fontSize ? fontSize : 12}
      $borderRadious={borderRadious ? borderRadious : 10}
      $margin={margin ? margin : "0px"}
      $padding={padding ? padding : "10px 10px"}
      $justifyContent={children.length >= 2 ? "space-between" : "center"}
      onClick={handleClick ? handleClick : () => {}}
    >
      {children.map((child) => child)}
    </HtmlButton>
  );
};

export default Button;
