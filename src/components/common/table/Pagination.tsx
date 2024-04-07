import { Dispatch } from 'react';
import {
  BsArrowLeft,
  BsArrowRight,
  BsChevronDoubleLeft,
  BsChevronDoubleRight,
} from 'react-icons/bs';
import { styled } from 'styled-components';

import { PageAction } from './pageReducer';
import type { ReactIconType } from '../../../services/reactIconEntity';

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

const DoubleLeftIcon = styled(BsChevronDoubleLeft as ReactIconType)`
  cursor: pointer;
  color: var(--color-grey);
  font-size: 25px;
  margin: 0;

  &:hover,
  &:focus {
    color: var(--color-white);
  }
`;

const DoubleRightIcon = styled(BsChevronDoubleRight as ReactIconType)`
  cursor: pointer;
  color: var(--color-grey);
  font-size: 25px;
  margin: 0;

  &:hover,
  &:focus {
    color: var(--color-white);
  }
`;

const LeftIcon = styled(BsArrowLeft as ReactIconType)`
  cursor: pointer;
  color: var(--color-grey);
  font-size: 25px;
  margin: 0;

  &:hover,
  &:focus {
    color: var(--color-white);
  }
`;

const RightIcon = styled(BsArrowRight as ReactIconType)`
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
    <HtmlContainer data-testid="pagination-index">
      {currentPage > 1 ? (
        <IconContainer>
          <DoubleLeftIcon
            onClick={() => dispatch({ type: 'RESET' })}
            data-testid="table-first-page-btn"
          />
          <LeftIcon
            onClick={() => dispatch({ type: 'DECREASE' })}
            data-testid="table-previous-page-btn"
          />
        </IconContainer>
      ) : (
        <IconContainer />
      )}
      <span>{`Page ${currentPage} / ${finalPage}`}</span>
      {currentPage < finalPage ? (
        <IconContainer>
          <RightIcon
            onClick={() => dispatch({ type: 'INCREASE' })}
            data-testid="table-next-page-btn"
          />
          <DoubleRightIcon
            onClick={() => dispatch({ type: 'SET', page: finalPage })}
            data-testid="table-last-page-btn"
          />
        </IconContainer>
      ) : (
        <IconContainer />
      )}
    </HtmlContainer>
  );
};

export default Pagination;
