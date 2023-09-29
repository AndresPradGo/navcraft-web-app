import { RxHamburgerMenu, RxCross1 } from "react-icons/rx";
import { styled } from "styled-components";

const Button = styled.button`
  border-radius: 99999px;
  width: 40px;
  height: 40px;
  padding: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  border: 0px solid var(--color-primary);
  cursor: pointer;
  transition: all 0.2s linear;
  background-color: var(--color-primary);

  @media screen and (min-width: 768px) {
    max-width: 0px;
    max-height: 0px;
    diosplay: none;
  }
`;

const HamburguerMenueIcon = styled(RxHamburgerMenu)`
  font-size: 26px;
  color: var(--color-grey);
`;

const CrossIcon = styled(RxCross1)`
  font-size: 20px;
  color: var(--color-grey);
`;

interface Props {
  isExpanded: boolean;
  handleClick: (expandNavBar: boolean) => void;
}

const NavBarExpandButton = ({ isExpanded, handleClick }: Props) => {
  return (
    <Button onClick={() => handleClick(!isExpanded)}>
      {isExpanded ? <CrossIcon /> : <HamburguerMenueIcon />}
    </Button>
  );
};

export default NavBarExpandButton;
