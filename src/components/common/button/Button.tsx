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
  $minWidth: string;
  $maxWidth: string;
  $height: string;
  $spaceChildren: "center" | "space-between" | "space-evenly" | "flex-start";
  $fontSize: number;
  $borderRadious: number;
  $borderWidth: number;
  $margin: string;
  $padding: string;
  $onlyHover: boolean;
  $alignSelf: "center" | "flex-start" | "flex-end" | undefined;
}

const HtmlButton = styled.button<HtmlButtonProps>`
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  justify-content: ${(props) => props.$spaceChildren};
  align-items: center;
  ${(props) => (props.$alignSelf ? "align-self:" + props.$alignSelf + ";" : "")}
  min-width: ${(props) => props.$minWidth};
  max-width: ${(props) => props.$maxWidth};
  height: ${(props) => props.$height};
  font-size: ${(props) => props.$fontSize}px;
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

  &:hover${(props) => (props.$onlyHover ? "" : ", &:focus")} {
    color: ${(props) => props.$hoverColor};
    background-color: ${(props) =>
      props.$fill ? props.$backgroundHoverColor : "transparent"};
    border: ${(props) => props.$borderWidth}px solid
      ${(props) => props.$backgroundHoverColor};
  }

  &[disabled] {
    background-color: ${(props) => props.$backgroundHoverColor};
    border: ${(props) => props.$borderWidth}px solid
      ${(props) => props.$backgroundHoverColor};
    color: ${(props) => props.$hoverColor};
    cursor: not-allowed;
    opacity: 25%;
  }

  &[disabled]:hover,
  &[disabled]:focus {
    background-color: ${(props) => props.$backgroundHoverColor};
    color: ${(props) => props.$hoverColor};
  }
`;

const HtmlLink = styled(Link)<HtmlButtonProps>`
  display: flex;
  flex-direction: row;
  justify-content: ${(props) =>
    props.$spaceChildren ? "space-between" : "center"};
  align-items: center;
  min-width: ${(props) => props.$minWidth};
  max-width: ${(props) => props.$maxWidth};
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

  &:hover${(props) => (props.$onlyHover ? "" : ", &:focus")} {
    color: ${(props) => props.$hoverColor};
    background-color: ${(props) =>
      props.$fill ? props.$backgroundHoverColor : "transparent"};
    border: 2px solid ${(props) => props.$backgroundHoverColor};
  }
`;

export interface Props {
  color?: string;
  hoverColor?: string;
  backgroundColor?: string;
  backgroundHoverColor?: string;
  fill?: boolean;
  shadow?: boolean;
  width?: string;
  height?: string;
  spaceChildren?: "center" | "space-between" | "space-evenly" | "flex-start";
  alignSelf?: "center" | "flex-start" | "flex-end";
  fontSize?: number;
  borderRadious?: number;
  borderWidth?: number;
  margin?: string;
  padding?: string;
  children?: ReactNode;
  handleClick?: () => void;
  href?: string;
  reference?: Dispatch<SetStateAction<HTMLElement | null>>;
  btnType?: "button" | "reset" | "submit";
  disabled?: boolean;
  disabledText?: string;
  onlyHover?: boolean;
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
  disabled,
  disabledText,
  onlyHover,
  alignSelf,
}: Props) => {
  const defaultColor = color
    ? color
    : fill
    ? "var(--color-grey-dark)"
    : "var(--color-highlight)";

  const defaultHoverColor = hoverColor
    ? hoverColor
    : fill
    ? "var(--color-grey-dark)"
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
        $minWidth={width ? width : "0px"}
        $maxWidth={width ? width : "100%"}
        $height={height ? height : "30px"}
        $spaceChildren={spaceChildren ? spaceChildren : "space-evenly"}
        $alignSelf={alignSelf}
        $fontSize={fontSize ? fontSize : 12}
        $borderRadious={borderRadious ? borderRadious : 10}
        $borderWidth={borderWidth ? borderWidth : 0}
        $margin={margin ? margin : "0px"}
        $padding={padding ? padding : "5px 10px"}
        onClick={handleClick ? handleClick : () => {}}
        to={href}
        $onlyHover={!!onlyHover}
      >
        {children}
      </HtmlLink>
    );

  return (
    <HtmlButton
      type={btnType ? btnType : "button"}
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
      $minWidth={width ? width : "0px"}
      $maxWidth={width ? width : "100%"}
      $height={height ? height : "30px"}
      $spaceChildren={spaceChildren ? spaceChildren : "space-evenly"}
      $alignSelf={alignSelf}
      $fontSize={fontSize ? fontSize : 12}
      $borderRadious={borderRadious ? borderRadious : 10}
      $borderWidth={borderWidth ? borderWidth : 2}
      $margin={margin ? margin : "0px"}
      $padding={padding ? padding : "5px 10px"}
      onClick={handleClick ? handleClick : () => {}}
      disabled={!!disabled}
      $onlyHover={!!onlyHover}
    >
      {disabled && disabledText ? disabledText : children}
    </HtmlButton>
  );
};

export default Button;
