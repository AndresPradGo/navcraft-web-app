import { useEffect, useState } from "react";
import { useForm, FieldValues } from "react-hook-form";
import { AiOutlineSave, AiFillTag } from "react-icons/ai";
import { BsFillFuelPumpFill, BsChevronDown } from "react-icons/bs";
import { CgPerformance } from "react-icons/cg";
import { IoAirplaneOutline } from "react-icons/io5";
import { LiaTimesSolid } from "react-icons/lia";
import { styled } from "styled-components";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Button from "../common/button";
import useAddAircraftProfile from "./useAddAircraftProfile";
import { FuelTypeData } from "../../hooks/useFuelTypes";
import DataList from "../common/datalist/index";
import useAircraftModels from "../../hooks/useAircraftModels";
import Loader from "../Loader";

const HtmlForm = styled.form`
  width: 100%;
  min-height: 200px;
  height: 100%;
  flex-grow: 1;
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
      text-wrap: wrap;
    }

    @media screen and (min-width: 510px) {
      padding: 10px;
      font-size: 32px;
    }
  }
`;

const HtmlInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-y: auto;
  padding: 20px 0;
  flex-grow: 1;

  border-top: 1px solid var(--color-grey);
  border-bottom: 1px solid var(--color-grey);
`;

interface HtmlSectionProps {
  $isOpen: boolean;
}
const HtmlSectionContainer = styled.div`
  margin: 20px 0;
  width: 100%;
  padding: 0 10px;

  @media screen and (min-width: 610px) {
    padding: 0 20px;
  }
`;

const HtmlSectionTitle = styled.div<HtmlSectionProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 5px;
  padding: 0 0 10px 5px;
  border-bottom: 1px solid
    ${(props) => (props.$isOpen ? "var(--color-white)" : "var(--color-grey)")};

  & div {
    display: flex;
    align-items: center;

    & h3:first-of-type {
      margin: 0;
      color: var(--color-grey-bright);
    }
  }

  @media screen and (min-width: 425px) {
    padding: 0 0 10px 20px;
  }
`;

const ToggleIcon = styled(BsChevronDown)<HtmlSectionProps>`
  color: var(--color-grey);
  cursor: pointer;
  margin-right: 5px;
  font-size: 25px;
  transform: rotate(${(props) => (props.$isOpen ? "-180deg" : "0deg")});
  transition: 0.3s transform linear;

  &:hover,
  &:focus {
    color: var(--color-white);
  }

  @media screen and (min-width: 425px) {
    margin-right: 20px;
  }
`;

const HtmlSectionContent = styled.div<HtmlSectionProps>`
  transition: padding 0.6s, height 0.3s, opacity 0.6s;
  border: ${(props) => (props.$isOpen ? "1px" : "0")} solid var(--color-white);
  border-top: 0;
  padding: 0px;
  height: ${(props) => (props.$isOpen ? "400px" : "0px")};
  opacity: ${(props) => (props.$isOpen ? "1" : "0")};
  overflow: hidden;

  & ul {
    padding-right: 10px;
  }

  @media screen and (min-width: 425px) {
    & ul {
      padding-right: 20px;
    }
  }

  @media screen and (min-width: 490px) {
    height: ${(props) => (props.$isOpen ? "310px" : "0px")};
  }
`;

const HtmlSectionSeparator = styled.div`
  display: flex;
  align-items: center;
  padding: 30px 20%;

  & div {
    flex: 1;
    border: 0.4px solid var(--color-grey);
    margin: 0 10px;
  }
`;

interface RequiredInputProps {
  $accepted: boolean;
  $hasValue: boolean;
  $required: boolean;
}
const HtmlInput = styled.div<RequiredInputProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  padding: 10px 10px 0;

  & label {
    cursor: ${(props) => (props.$hasValue ? "default" : "text")};
    position: absolute;
    top: 0;
    left: 0;
    font-size: 20px;
    display: flex;
    align-items: center;
    transform: ${(props) =>
      props.$hasValue
        ? "translate(7px, 7px) scale(0.8)"
        : "translate(17px, 47px)"};
    color: ${(props) =>
      props.$hasValue
        ? props.$accepted
          ? "var(--color-grey-bright)"
          : "var(--color-highlight)"
        : "var(--color-grey-bright)"};
    transition: transform 0.3s;

    & span {
      margin: 0 15px;
    }
  }

  & input {
    width: 100%;
    padding: 10px 20px;
    margin: 0;
    margin-top: 30px;
    border-radius: 5px;
    background-color: var(--color-grey-dark);
    outline: none;
    border: 1px solid
      ${(props) =>
        props.$hasValue
          ? props.$accepted
            ? "var(--color-grey)"
            : "var(--color-highlight)"
          : "var(--color-grey)"};
    color: var(--color-white);
    font-size: 20px;

    &:focus ~ label {
      cursor: default;
      color: ${(props) =>
        props.$accepted && (props.$hasValue || !props.$required)
          ? "var(--color-white)"
          : "var(--color-highlight)"};
      transform: translate(7px, 7px) scale(0.8);
    }

    &:focus {
      box-shadow: ${(props) =>
        props.$accepted && (props.$hasValue || !props.$required)
          ? "0"
          : "0 0 6px 0 var(--color-highlight)"};
      border: 1px solid
        ${(props) =>
          props.$accepted && (props.$hasValue || !props.$required)
            ? "var(--color-white)"
            : "var(--color-highlight)"};
    }
  }

  & p {
    font-size: 16px;
    color: var(--color-warning-hover);
    margin: 2px;
    text-wrap: wrap;
  }

  @media screen and (min-width: 425px) {
    padding: 10px 20px 0;
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

const TitleIcon = styled(CgPerformance)`
  flex-shrink: 0;
  font-size: 25px;
  margin: 0 10px;

  @media screen and (min-width: 510px) {
    font-size: 40px;
  }
`;

const CloseIcon = styled(LiaTimesSolid)`
  flex-shrink: 0;
  font-size: 25px;
  margin: 0 5px;
  cursor: pointer;
  color: var(--color-grey);

  &:hover,
  &:focus {
    color: var(--color-white);
  }

  @media screen and (min-width: 510px) {
    margin: 0 10px;
    font-size: 30px;
  }
`;

const NameIcon = styled(AiFillTag)`
  font-size: 20px;
  margin: 0 5px 0 10px;
`;

const ModelIcon = styled(IoAirplaneOutline)`
  font-size: 25px;
  margin: 0 10px;
`;

const FuelIcon = styled(BsFillFuelPumpFill)`
  font-size: 20px;
  margin: 0 10px;
`;

const SaveIcon = styled(AiOutlineSave)`
  font-size: 25px;
`;

const schema = z.object({
  model: z
    .string()
    .min(2, { message: "Must be at least 2 characters long" })
    .max(255, { message: "Must be at most 255 characters long" })
    .regex(/^[a-zA-Z0-9\s.,()/\-]+$/, {
      message: "Only letters, numbers, white space, and symbols .,-()/",
    }),
  performance_profile_name: z
    .string()
    .min(2, { message: "Must be at least 2 characters long" })
    .max(255, { message: "Must be at most 255 characters long" })
    .regex(/^[a-zA-Z0-9\s.,()/\-]+$/, {
      message: "Only letters, numbers, white space, and symbols .,-()/",
    }),
  fuel_type: z
    .string()
    .min(1, { message: "Select a valid option" })
    .max(50, { message: "Must be at most 50 characters long" })
    .regex(/^[-a-zA-Z0-9 /]+$/, {
      message: "Only letters, numbers, white spaces, and symbols -/",
    }),
});
export type AircraftProfileDataFromForm = z.infer<typeof schema>;

interface Props {
  closeModal: () => void;
  isOpen: boolean;
  fuelOptions: FuelTypeData[];
  aircraftId: number;
}

const AddAircraftProfileForm = ({
  closeModal,
  isOpen,
  fuelOptions,
  aircraftId,
}: Props) => {
  const {
    data: preFilterAircraftModels,
    isLoading: aircraftModelsIsLoading,
    error: aircraftModelsError,
  } = useAircraftModels();

  const [fromModel, setFromModel] = useState(true);
  const [savedValues, setSavedValues] = useState({
    model: "",
    performance_profile_name: "",
    fuel_type: "",
  });

  const addMutation = useAddAircraftProfile(aircraftId);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    watch,
    setValue,
    clearErrors,
  } = useForm<AircraftProfileDataFromForm>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (isOpen) {
      reset({
        model: "",
        performance_profile_name: "Place Holder Name",
        fuel_type: fuelOptions[0].name,
      });

      setSavedValues({
        model: "",
        performance_profile_name: "",
        fuel_type: "",
      });
      setFromModel(true);
    }
  }, [isOpen]);

  if (aircraftModelsIsLoading) return <Loader />;
  if (aircraftModelsError) throw new Error("");

  const aircraftModels = preFilterAircraftModels.filter(
    (model) => model.is_complete
  );

  const handleOpenSection = () => {
    const newFromModel = !fromModel;
    setFromModel(newFromModel);
    if (newFromModel) {
      setValue("model", savedValues.model);
      const newSavedName = watch("performance_profile_name");
      const newSavedFuel = watch("fuel_type");
      setSavedValues((current) => ({
        ...current,
        performance_profile_name: newSavedName,
        fuel_type: newSavedFuel,
      }));
      setValue("performance_profile_name", "Place Holder Name");
      setValue("fuel_type", fuelOptions[0].name);
    } else {
      const newSavedModel = watch("model");
      setValue(
        "performance_profile_name",
        savedValues.performance_profile_name
      );
      setValue("fuel_type", savedValues.fuel_type);
      setSavedValues((current) => ({
        ...current,
        model: newSavedModel,
      }));
      setValue("model", "Place Holder Model");
    }
  };

  const submitHandler = (data: FieldValues) => {
    if (fromModel) {
      const model = aircraftModels.find(
        (item) => item.performance_profile_name.trim() === data.model
      );
      if (model) {
        closeModal();
        addMutation.mutate({
          model_id: model.id,
          type: "MODEL",
          performance_profile_name: model.performance_profile_name,
          fuel_type_id: model.fuel_type_id,
        });
      } else
        setError("model", {
          type: "manual",
          message: "Select a model",
        });
    } else {
      const fuelId = fuelOptions.find(
        (item) => item.name === data.fuel_type
      )?.id;
      if (fuelId) {
        closeModal();
        addMutation.mutate({
          type: "BLANK",
          performance_profile_name: data.performance_profile_name,
          fuel_type_id: fuelId,
        });
      } else
        setError("fuel_type", {
          type: "manual",
          message: "Select a valid fuel type",
        });
    }
  };

  return (
    <HtmlForm onSubmit={handleSubmit(submitHandler)}>
      <h1>
        <div>
          <TitleIcon />
          Add New Performance Profile
        </div>
        <CloseIcon onClick={closeModal} />
      </h1>
      <HtmlInputContainer>
        <HtmlSectionContainer>
          <HtmlSectionTitle $isOpen={fromModel}>
            <div>
              <ToggleIcon onClick={handleOpenSection} $isOpen={fromModel} />
              <h3>Build from Existing Model</h3>
            </div>
          </HtmlSectionTitle>
          <HtmlSectionContent $isOpen={fromModel}>
            <DataList
              setError={(_) =>
                setError("model", {
                  type: "manual",
                  message: "Select a model",
                })
              }
              clearErrors={() => clearErrors("model")}
              required={fromModel}
              value={watch("model")}
              hasError={!!errors.model}
              errorMessage={errors.model?.message || ""}
              options={
                aircraftModels
                  ? aircraftModels.map((item) => item.performance_profile_name)
                  : []
              }
              setValue={(value: string) => setValue("model", value)}
              name="model"
              formIsOpen={isOpen}
              resetValue=""
              lessPadding={true}
            >
              <ModelIcon /> Select Model
            </DataList>
            <ul>
              <li>Select the model that best describes your aircraft.</li>
              <li>All the performance values will be copied from the model.</li>
              <li>
                After the profile has been created, individual performance
                values can be adjusted to better approximate your aircraft.
              </li>
            </ul>
          </HtmlSectionContent>
        </HtmlSectionContainer>
        <HtmlSectionSeparator>
          <div />
          OR
          <div />
        </HtmlSectionSeparator>
        <HtmlSectionContainer>
          <HtmlSectionTitle $isOpen={!fromModel}>
            <div>
              <ToggleIcon onClick={handleOpenSection} $isOpen={!fromModel} />
              <h3>Build New Profile</h3>
            </div>
          </HtmlSectionTitle>
          <HtmlSectionContent $isOpen={!fromModel}>
            <DataList
              setError={(message) =>
                setError("fuel_type", {
                  type: "manual",
                  message: message,
                })
              }
              clearErrors={() => clearErrors("fuel_type")}
              required={!fromModel}
              value={watch("fuel_type")}
              hasError={!!errors.fuel_type}
              errorMessage={errors.fuel_type?.message || ""}
              options={fuelOptions ? fuelOptions.map((item) => item.name) : []}
              setValue={(value: string) => setValue("fuel_type", value)}
              name="fuel_type"
              formIsOpen={isOpen}
              resetValue=""
              lessPadding={true}
            >
              <FuelIcon /> Fuel
            </DataList>
            <HtmlInput
              $required={true}
              $hasValue={!!watch("performance_profile_name")}
              $accepted={!errors.performance_profile_name}
            >
              <input
                {...register("performance_profile_name")}
                id="performance_profile_name"
                type="text"
                autoComplete="off"
                required={!fromModel}
              />
              {errors.performance_profile_name ? (
                <p>{errors.performance_profile_name.message}</p>
              ) : (
                <p>&nbsp;</p>
              )}
              <label htmlFor="performance_profile_name">
                <NameIcon />
                Descriptive Name
              </label>
            </HtmlInput>
          </HtmlSectionContent>
        </HtmlSectionContainer>
      </HtmlInputContainer>
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
          btnType="button"
          width="120px"
          height="35px"
        >
          Cancel
        </Button>
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
        >
          Save
          <SaveIcon />
        </Button>
      </HtmlButtons>
    </HtmlForm>
  );
};

export default AddAircraftProfileForm;
