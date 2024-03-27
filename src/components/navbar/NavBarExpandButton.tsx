import { RxHamburgerMenu, RxCross1 } from 'react-icons/rx';
import { styled } from 'styled-components';

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
  color: var(--color-grey-bright);
  background-color: transparent;

  &:hover,
  &:focus {
    color: var(--color-white);
    background-color: var(--color-primary-bright);
  }

  @media screen and (min-width: 768px) {
    max-width: 0px;
    max-height: 0px;
    display: none;
  }
`;

const HamburguerMenueIcon = styled(RxHamburgerMenu)`
  font-size: 26px;
`;

const CrossIcon = styled(RxCross1)`
  font-size: 20px;
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
