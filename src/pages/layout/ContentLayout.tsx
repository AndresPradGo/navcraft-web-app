import { styled } from "styled-components";
import { ReactNode } from "react";

const HtmlMainContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
`;

const HtmlMainContentContainerWithConstrain = styled(HtmlMainContentContainer)`
  max-width: 1312px;
  padding: 40px 3%;

  @media screen and (min-width: 533px) {
    padding: 40px 20px;
  }
`;

interface Props {
  children: ReactNode;
  truncateWidth?: boolean;
}

const ContentLayout = ({ children, truncateWidth = true }: Props) => {
  if (truncateWidth) {
    return (
      <HtmlMainContentContainerWithConstrain>
        {children}
      </HtmlMainContentContainerWithConstrain>
    );
  }

  return <HtmlMainContentContainer>{children}</HtmlMainContentContainer>;
};

export default ContentLayout;
