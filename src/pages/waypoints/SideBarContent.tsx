import { styled } from "styled-components";

const HtmlContainer = styled.div`
  margin: 15px 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 0 15px;
  min-height: 300px;
`;

const HtmlButtonList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 15px;

  @media screen and (min-width: 1280px) {
    padding: 15px 47px;
  }
`;

const HtmlButtonListWithBorder = styled(HtmlButtonList)`
  border-top: 1px solid var(--color-grey);
`;

const SideBarContent = () => {
  return (
    <HtmlContainer>
      <HtmlButtonList></HtmlButtonList>
    </HtmlContainer>
  );
};

export default SideBarContent;
