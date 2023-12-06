import { useState, useEffect } from "react";
import { styled } from "styled-components";

import Button from "./button";
import { ReactNode } from "react";

const HtmlContainer = styled.div`
  width: 100%;
  align-self: flex-start;
`;

interface HtmlListProps {
  $expanded: boolean;
}
const HtmlList = styled.ol<HtmlListProps>`
  text-wrap: wrap;
  transition: all 0.3s linear;
  max-height: ${(props) => (props.$expanded ? "200px" : "0")};
  overflow-x: hidden;
  overflow-y: auto;
  padding: ${(props) => (props.$expanded ? "10px 5px 10px 40px" : "0 30px")};
  flex-shrink: 0;
  border: ${(props) => (props.$expanded ? "2px" : "0")} solid
    var(--color-grey-bright);
  margin: ${(props) => (props.$expanded ? "5px 10px 0" : "0 10px")};
  border-radius: 8px;
  opacity: ${(props) => (props.$expanded ? "1" : "0")};
`;

interface Props {
  reset: boolean;
  children: ReactNode;
  messageList: string[];
}

const ExpandibleMessage = ({ reset, children, messageList }: Props) => {
  const [helpExpanded, setHelpExpanded] = useState(false);

  useEffect(() => {
    if (reset) {
      setHelpExpanded(false);
    }
  }, [reset]);

  return (
    <HtmlContainer>
      <Button
        color={helpExpanded ? "var(--color-primary-dark)" : "var(--color-grey)"}
        hoverColor={
          helpExpanded
            ? "var(--color-primary-dark)"
            : "var(--color-grey-bright)"
        }
        backgroundColor="var(--color-grey)"
        backgroundHoverColor="var(--color-grey-bright)"
        fill={helpExpanded}
        width="100px"
        spaceChildren="center"
        fontSize={16}
        borderRadious={100}
        borderWidth={2}
        margin="0 0 0 10px"
        padding="10px 20px"
        handleClick={() => {
          setHelpExpanded(!helpExpanded);
        }}
        onlyHover={true}
      >
        {children}
      </Button>
      <HtmlList $expanded={helpExpanded}>
        {messageList.map((point, index) => (
          <li key={index}>{point}</li>
        ))}
      </HtmlList>
    </HtmlContainer>
  );
};

export default ExpandibleMessage;
