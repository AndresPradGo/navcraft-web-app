import { styled } from 'styled-components';

const HtmlHeading = styled.h1`
  text-align: center;
  text-wrap: wrap;
  margin: 18px 8px;
  font-size: 25px;

  @media screen and (min-width: 635px) {
    margin: 18px 10px;
  }

  @media screen and (min-width: 1280px) {
    margin: 18px;
  }
`;

const SideBarTitle = ({ children }: { children: string }) => {
  return <HtmlHeading>{children}</HtmlHeading>;
};

export default SideBarTitle;
