import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, FieldValues } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { AiOutlineSave } from "react-icons/ai";
import { IoAirplane } from "react-icons/io5";
import { LiaTimesSolid } from "react-icons/lia";
import { MdConnectingAirports } from "react-icons/md";
import { styled } from "styled-components";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Button from "../../../components/common/button";
import DataList from "../../../components/common/datalist";
import { AircraftDataFromAPI } from "../../../services/aircraftClient";
import useChangeAircraft from "../hooks/useChangeAircraft";
import Loader from "../../../components/Loader";

const HtmlForm = styled.form`
  width: 100%;
  flex-grow: 1;
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
    font-size: 25px;

    & div {
      display: flex;
      align-items: center;
    }

    @media screen and (min-width: 425px) {
      padding: 10px;
      font-size: 32px;
    }
  }
`;

const HtmlInputContainer = styled.div`
  width: 100%;
  overflow-y: auto;
  padding: 20px 0;
  flex-grow: 1;

  border-top: 1px solid var(--color-grey);
  border-bottom: 1px solid var(--color-grey);

  & p {
    margin: 10px 20px;
  }

  & h2 {
    margin: 20px;
    border-bottom: 1px solid var(--color-grey-bright);
    display: flex;
    align-items: center;
    text-wrap: wrap;
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

const SaveIcon = styled(AiOutlineSave)`
  font-size: 25px;
`;

const TitleIcon = styled(MdConnectingAirports)`
  font-size: 45px;
  margin: 0 5px;

  @media screen and (min-width: 425px) {
    margin: 0 10px;
    font-size: 50px;
  }
`;

const AircraftIcon = styled(IoAirplane)`
  font-size: 25px;
  margin: 0 10px;
  flex-shrink: 0;
`;

interface CloseIconProps {
  $disabled: boolean;
}

const CloseIcon = styled(LiaTimesSolid)<CloseIconProps>`
  flex-shrink: 0;
  font-size: 25px;
  margin: 0 5px;
  cursor: ${(props) => (props.$disabled ? "default" : "pointer")};
  color: var(--color-grey);
  opacity: ${(props) => (props.$disabled ? "0.3" : "1")};

  &:hover,
  &:focus {
    color: ${(props) =>
      props.$disabled ? "var(--color-grey)" : "var(--color-white)"};
  }

  @media screen and (min-width: 510px) {
    margin: 0 10px;
    font-size: 30px;
  }
`;

const schema = z.object({
  aircraft: z.string(),
});
export type ChangeAircraftType = z.infer<typeof schema>;

interface Props {
  flightId: number;
  aircraft: string;
  noAircraft: boolean;
  closeModal: () => void;
  isOpen: boolean;
}
const ChangeAircraftForm = ({
  aircraft,
  closeModal,
  isOpen,
  noAircraft,
  flightId,
}: Props) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const aircraftList = queryClient.getQueryData<AircraftDataFromAPI[]>([
    "aircraft",
    "list",
  ]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
    clearErrors,
    reset,
    setValue,
  } = useForm<ChangeAircraftType>({ resolver: zodResolver(schema) });

  const [submited, setSubmited] = useState(false);

  const mutation = useChangeAircraft(flightId);

  useEffect(() => {
    if (submited && !mutation.isLoading) {
      closeModal();
    }
  }, [submited, mutation.isLoading]);

  useEffect(() => {
    register("aircraft");
  }, []);

  useEffect(() => {
    if (isOpen) {
      reset({
        aircraft: aircraft,
      });
    }
  }, [isOpen]);

  const submitHandler = (data: FieldValues) => {
    const aircraftId = aircraftList?.find(
      (a) => a.registration === data.aircraft
    )?.id;

    if (!aircraftId) {
      setError("aircraft", {
        type: "manual",
        message: "Select a valid option",
      });
    } else {
      mutation.mutate({
        aircraftId,
        aircraft: data.aircraft,
      });
      setSubmited(true);
    }
  };

  return (
    <HtmlForm onSubmit={handleSubmit(submitHandler)}>
      <h1>
        <div>
          <TitleIcon />
          {aircraft === "" && noAircraft
            ? "Select Aircraft"
            : "Change Aircraft"}
        </div>
        {mutation.isLoading || (aircraft === "" && noAircraft) ? (
          <CloseIcon onClick={() => {}} $disabled={true} />
        ) : (
          <CloseIcon onClick={closeModal} $disabled={false} />
        )}
      </h1>
      <HtmlInputContainer>
        {mutation.isLoading ? (
          <Loader message="Calculating flight data . . ." margin={50} />
        ) : (
          <>
            {aircraft === "" && noAircraft ? (
              <p>
                This flight doesn't have an aircraft, or the aircraft does not
                have a performance profile. Select a valid aircraft to continue.
              </p>
            ) : null}
            <DataList
              setError={(message) =>
                setError("aircraft", {
                  type: "manual",
                  message: message,
                })
              }
              clearErrors={() => clearErrors("aircraft")}
              required={true}
              value={watch("aircraft")}
              hasError={!!errors.aircraft}
              errorMessage={errors.aircraft?.message || ""}
              options={
                aircraftList
                  ? aircraftList.map((item) => item.registration)
                  : []
              }
              setValue={(value: string) => setValue("aircraft", value)}
              name="changeAircraft"
              formIsOpen={isOpen}
              resetValue={aircraft}
            >
              <AircraftIcon /> Aircraft
            </DataList>
          </>
        )}
      </HtmlInputContainer>
      <HtmlButtons>
        {aircraft === "" && noAircraft ? (
          <Button
            color="var(--color-primary-dark)"
            hoverColor="var(--color-primary-dark)"
            backgroundColor="var(--color-grey)"
            backgroundHoverColor="var(--color-grey-bright)"
            fontSize={15}
            margin="5px 0"
            borderRadious={4}
            handleClick={() => {
              navigate("/flights");
            }}
            btnType="button"
            width="120px"
            height="35px"
            disabled={mutation.isLoading}
          >
            Go back
          </Button>
        ) : (
          <Button
            color="var(--color-primary-dark)"
            hoverColor="var(--color-primary-dark)"
            backgroundColor="var(--color-grey)"
            backgroundHoverColor="var(--color-grey-bright)"
            fontSize={15}
            margin="5px 0"
            borderRadious={4}
            handleClick={closeModal}
            btnType="button"
            width="120px"
            height="35px"
            disabled={mutation.isLoading}
          >
            Cancel
          </Button>
        )}
        <Button
          color="var(--color-primary-dark)"
          hoverColor="var(--color-primary-dark)"
          backgroundColor="var(--color-contrast)"
          backgroundHoverColor="var(--color-contrast-hover)"
          fontSize={15}
          margin="5px 0"
          borderRadious={4}
          btnType="submit"
          width="120px"
          height="35px"
          spaceChildren="space-evenly"
          disabled={mutation.isLoading}
          disabledText="Saving..."
        >
          Save
          <SaveIcon />
        </Button>
      </HtmlButtons>
    </HtmlForm>
  );
};

export default ChangeAircraftForm;
