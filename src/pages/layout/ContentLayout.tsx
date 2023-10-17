import { styled } from "styled-components";
import { ReactNode } from "react";
import WithSideBar from "../../components/sidebar/WithSideBar";

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
  sideBarContent?: ReactNode;
  truncateWidth?: boolean;
}

const ContentLayout = ({
  children,
  sideBarContent,
  truncateWidth = true,
}: Props) => {
  if (truncateWidth) {
    return (
      <WithSideBar sideBarContent={sideBarContent ? sideBarContent : ""}>
        <HtmlMainContentContainerWithConstrain>
          {children}
        </HtmlMainContentContainerWithConstrain>
      </WithSideBar>
    );
  }

  return (
    <WithSideBar sideBarContent={sideBarContent ? sideBarContent : ""}>
      <HtmlMainContentContainer>{children}</HtmlMainContentContainer>
    </WithSideBar>
  );
};

export default ContentLayout;
