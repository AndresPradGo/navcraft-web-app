import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { styled } from "styled-components";

interface HtmlButtonProps {
  $color: string;
  $hoverColor: string;
  $backgroundColor: string;
  $backgroundHoverColor: string;
  $fill: boolean;
  $shadow: boolean;
  $width: number;
  $height: number;
  $spaceChildren: boolean;
  $fontSize: number;
  $borderRadious: number;
  $margin: string;
  $padding: string;
}

const HtmlButton = styled.button<HtmlButtonProps>`
  display: flex;
  flex-direction: row;
  justify-content: ${(props) =>
    props.$spaceChildren ? "space-between" : "center"};
  align-items: center;
  min-width: ${(props) => props.$width}px;
  height: ${(props) => props.$height}px;
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
      ? "0 0 8px 1px var(--color-shadow)"
      : "0 0 0 0 var(--color-primary-dark)"};

  &:hover,
  &:focus {
    color: ${(props) => props.$hoverColor};
    background-color: ${(props) =>
      props.$fill ? props.$backgroundHoverColor : "transparent"};
    border: 2px solid ${(props) => props.$backgroundHoverColor};
  }
`;

const HtmlLink = styled(Link)<HtmlButtonProps>`
  display: flex;
  flex-direction: row;
  justify-content: ${(props) =>
    props.$spaceChildren ? "space-between" : "center"};
  align-items: center;
  min-width: ${(props) => props.$width}px;
  height: ${(props) => props.$height}px;
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
      ? "0 0 8px 1px var(--color-shadow)"
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
  height?: number;
  spaceChildren?: boolean;
  fontSize?: number;
  borderRadious?: number;
  margin?: string;
  padding?: string;
  children: ReactNode;
  handleClick?: () => void;
  href?: string;
}

const Button = ({
  color,
  hoverColor,
  backgroundColor,
  backgroundHoverColor,
  fill = true,
  shadow,
  width,
  height,
  spaceChildren,
  fontSize,
  borderRadious,
  margin,
  padding,
  children,
  handleClick,
  href,
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

  if (href)
    return (
      <HtmlLink
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
        $height={height ? height : 30}
        $spaceChildren={spaceChildren ? spaceChildren : false}
        $fontSize={fontSize ? fontSize : 12}
        $borderRadious={borderRadious ? borderRadious : 10}
        $margin={margin ? margin : "0px"}
        $padding={padding ? padding : "5px 10px"}
        onClick={handleClick ? handleClick : () => {}}
        to={href}
      >
        {children}
      </HtmlLink>
    );

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
      $height={height ? height : 30}
      $spaceChildren={spaceChildren ? spaceChildren : false}
      $fontSize={fontSize ? fontSize : 12}
      $borderRadious={borderRadious ? borderRadious : 10}
      $margin={margin ? margin : "0px"}
      $padding={padding ? padding : "5px 10px"}
      onClick={handleClick ? handleClick : () => {}}
    >
      {children}
    </HtmlButton>
  );
};

export default Button;
