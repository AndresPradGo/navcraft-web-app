import { ReactNode, Dispatch, SetStateAction } from "react";
import { Link } from "react-router-dom";
import { styled } from "styled-components";

interface HtmlButtonProps {
  $color: string;
  $hoverColor: string;
  $backgroundColor: string;
  $backgroundHoverColor: string;
  $fill: boolean;
  $shadow: boolean;
  $width: string;
  $height: string;
  $spaceChildren: "center" | "space-between" | "space-evenly";
  $fontSize: number;
  $borderRadious: number;
  $borderWidth: number;
  $margin: string;
  $padding: string;
}

const HtmlButton = styled.button<HtmlButtonProps>`
  display: flex;
  flex-direction: row;
  justify-content: ${(props) => props.$spaceChildren};
  align-items: center;
  min-width: ${(props) => props.$width};
  height: ${(props) => props.$height};
  font-size: ${(props) => props.$fontSize}px;
  font-weight: lighter;
  letter-spacing: 2px;
  white-space: nowrap;
  border: ${(props) => props.$borderWidth}px solid
    ${(props) => props.$backgroundColor};
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
    border: ${(props) => props.$borderWidth}px solid
      ${(props) => props.$backgroundHoverColor};
  }
`;

const HtmlLink = styled(Link)<HtmlButtonProps>`
  display: flex;
  flex-direction: row;
  justify-content: ${(props) =>
    props.$spaceChildren ? "space-between" : "center"};
  align-items: center;
  min-width: ${(props) => props.$width};
  height: ${(props) => props.$height};
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
  width?: string;
  height?: string;
  spaceChildren?: "center" | "space-between" | "space-evenly";
  fontSize?: number;
  borderRadious?: number;
  borderWidth?: number;
  margin?: string;
  padding?: string;
  children: ReactNode;
  handleClick?: () => void;
  href?: string;
  reference?: Dispatch<SetStateAction<HTMLElement | null>>;
  btnType?: "button" | "reset" | "submit";
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
  borderWidth,
  margin,
  padding,
  children,
  handleClick,
  href,
  reference,
  btnType,
}: Props) => {
  const defaultColor = color
    ? color
    : fill
    ? "var(--color-grey-dark)"
    : "var(--color-highlight)";

  const defaultHoverColor = hoverColor
    ? hoverColor
    : fill
    ? "var(--color-white)"
    : "var(--color-highlight-hover)";

  if (href)
    return (
      <HtmlLink
        ref={reference}
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
        $width={width ? width : "0px"}
        $height={height ? height : "30px"}
        $spaceChildren={spaceChildren ? spaceChildren : "space-evenly"}
        $fontSize={fontSize ? fontSize : 12}
        $borderRadious={borderRadious ? borderRadious : 10}
        $borderWidth={borderWidth ? borderWidth : 2}
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
      type={btnType}
      ref={reference}
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
      $width={width ? width : "0px"}
      $height={height ? height : "30px"}
      $spaceChildren={spaceChildren ? spaceChildren : "space-evenly"}
      $fontSize={fontSize ? fontSize : 12}
      $borderRadious={borderRadious ? borderRadious : 10}
      $borderWidth={borderWidth ? borderWidth : 2}
      $margin={margin ? margin : "0px"}
      $padding={padding ? padding : "5px 10px"}
      onClick={handleClick ? handleClick : () => {}}
    >
      {children}
    </HtmlButton>
  );
};

export default Button;
