import { Dispatch } from 'react';
import {
  BsArrowLeft,
  BsArrowRight,
  BsChevronDoubleLeft,
  BsChevronDoubleRight,
} from 'react-icons/bs';
import { styled } from 'styled-components';

import { PageAction } from './pageReducer';

const HtmlContainer = styled.div`
  width: 100%;
  max-width: 500px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin: 10px 0;
`;

const IconContainer = styled.div`
  width: 22%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media screen and (min-width: 768px) {
    width: 17%;
  }
`;

const DoubleLeftIcon = styled(BsChevronDoubleLeft)`
  cursor: pointer;
  color: var(--color-grey);
  font-size: 25px;
  margin: 0;

  &:hover,
  &:focus {
    color: var(--color-white);
  }
`;

const DoubleRightIcon = styled(BsChevronDoubleRight)`
  cursor: pointer;
  color: var(--color-grey);
  font-size: 25px;
  margin: 0;

  &:hover,
  &:focus {
    color: var(--color-white);
  }
`;

const LeftIcon = styled(BsArrowLeft)`
  cursor: pointer;
  color: var(--color-grey);
  font-size: 25px;
  margin: 0;

  &:hover,
  &:focus {
    color: var(--color-white);
  }
`;

const RightIcon = styled(BsArrowRight)`
  cursor: pointer;
  color: var(--color-grey);
  font-size: 25px;
  margin: 0;

  &:hover,
  &:focus {
    color: var(--color-white);
  }
`;

interface Props {
  currentPage: number;
  finalPage: number;
  dispatch: Dispatch<PageAction>;
}

const Pagination = ({ currentPage, finalPage, dispatch }: Props) => {
  return (
    <HtmlContainer>
      {currentPage > 1 ? (
        <IconContainer>
          <DoubleLeftIcon onClick={() => dispatch({ type: 'RESET' })} />
          <LeftIcon onClick={() => dispatch({ type: 'DECREASE' })} />
        </IconContainer>
      ) : (
        <IconContainer />
      )}
      <span>{`Page ${currentPage} / ${finalPage}`}</span>
      {currentPage < finalPage ? (
        <IconContainer>
          <RightIcon onClick={() => dispatch({ type: 'INCREASE' })} />
          <DoubleRightIcon
            onClick={() => dispatch({ type: 'SET', page: finalPage })}
          />
        </IconContainer>
      ) : (
        <IconContainer />
      )}
    </HtmlContainer>
  );
};

export default Pagination;
