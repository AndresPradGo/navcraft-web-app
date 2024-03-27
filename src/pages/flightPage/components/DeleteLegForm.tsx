import { useEffect, useState } from 'react';
import { IoWarningOutline } from 'react-icons/io5';
import { LiaTimesSolid } from 'react-icons/lia';
import { RiDeleteBinLine } from 'react-icons/ri';
import { styled } from 'styled-components';

import Button from '../../../components/common/button';
import useDeleteLeg from '../hooks/useDeleteLeg';
import Loader from '../../../components/Loader';

const HtmlContainer = styled.div`
  width: 100%;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-start;
  padding: 0;
  overflow: hidden;

  & h1 {
    width: 100%;
    margin: 0;
    padding: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 20px;

    & div {
      display: flex;
      align-items: center;
      text-wrap: wrap;
    }

    @media screen and (min-width: 510px) {
      padding: 10px;
      font-size: 32px;
    }
  }
`;

const HtmlBodyContainer = styled.div`
  width: 100%;
  overflow-x: hidden;
  text-wrap: wrap;
  overflow-y: auto;
  padding: 20px 0;

  border-top: 1px solid var(--color-grey);
  border-bottom: 1px solid var(--color-grey);

  & p {
    text-align: start;
    padding: 10px 20px;
    margin: 0;
    font-size: 20px;
    cursor: default;
  }
`;

const HtmlButtons = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  padding: 10px 20px;
`;

const DeleteIcon = styled(RiDeleteBinLine)`
  font-size: 20px;
  margin-left: 5px;
`;

const TitleIcon = styled(IoWarningOutline)`
  flex-shrink: 0;
  font-size: 25px;
  margin: 0 10px;
  color: var(--color-white);
  background-color: var(--color-warning);
  border-radius: 50%;
  padding: 0 5px 5px;
  height: 40px;
  width: 40px;
  flex-shrink: 0;

  @media screen and (min-width: 510px) {
    padding: 0 5px 5px;
    height: 50px;
    width: 50px;
  }
`;

interface CloseIconProps {
  $disabled: boolean;
}

const CloseIcon = styled(LiaTimesSolid)<CloseIconProps>`
  flex-shrink: 0;
  font-size: 25px;
  margin: 0 5px;
  cursor: ${(props) => (props.$disabled ? 'default' : 'pointer')};
  color: var(--color-grey);
  opacity: ${(props) => (props.$disabled ? '0.3' : '1')};

  &:hover,
  &:focus {
    color: ${(props) =>
      props.$disabled ? 'var(--color-grey)' : 'var(--color-white)'};
  }

  @media screen and (min-width: 510px) {
    margin: 0 10px;
    font-size: 30px;
  }
`;

interface Props {
  closeModal: () => void;
  id: number;
  fromWaypoint: string;
  toWaypoint: string;
  flightId: number;
}
const DeleteLegForm = ({
  closeModal,
  id,
  fromWaypoint,
  toWaypoint,
  flightId,
}: Props) => {
  const [submited, setSubmited] = useState(false);
  const mutation = useDeleteLeg(flightId, true);

  useEffect(() => {
    if (submited && !mutation.isLoading) {
      closeModal();
    }
  }, [submited, mutation.isLoading]);

  const handleDelete = () => {
    mutation.mutate({
      id: id,
      identifier: `from ${fromWaypoint} to ${toWaypoint}`,
    });
    setSubmited(true);
  };

  return (
    <HtmlContainer>
      <h1>
        <div>
          <TitleIcon />
          Delete Flight Leg
        </div>
        {mutation.isLoading ? (
          <CloseIcon onClick={() => {}} $disabled={true} />
        ) : (
          <CloseIcon onClick={closeModal} $disabled={false} />
        )}
      </h1>
      <HtmlBodyContainer>
        {mutation.isLoading ? (
          <Loader message="Calculating flight data . . ." />
        ) : (
          <p>{`Are you sure you want to delete the leg from ${fromWaypoint} to ${toWaypoint}?`}</p>
        )}
      </HtmlBodyContainer>
      <HtmlButtons>
        <Button
          color="var(--color-primary-dark)"
          hoverColor="var(--color-primary-dark)"
          backgroundColor="var(--color-grey)"
          backgroundHoverColor="var(--color-grey-bright)"
          fontSize={15}
          margin="5px 0"
          borderRadious={4}
          handleClick={closeModal}
          width="120px"
          height="35px"
          disabled={mutation.isLoading}
        >
          Cancel
        </Button>
        <Button
          color="var(--color-grey-bright)"
          hoverColor="var(--color-white)"
          backgroundColor="var(--color-warning)"
          backgroundHoverColor="var(--color-warning-hover)"
          fontSize={15}
          margin="5px 0"
          borderRadious={4}
          handleClick={handleDelete}
          width="120px"
          height="35px"
          disabled={mutation.isLoading}
          disabledText="Deleting..."
        >
          Delete
          <DeleteIcon />
        </Button>
      </HtmlButtons>
    </HtmlContainer>
  );
};

export default DeleteLegForm;
