import { useEffect, useState, FormEvent, ChangeEvent } from "react";
import { AiOutlineSave, AiFillTag } from "react-icons/ai";
import { BiSolidEditAlt } from "react-icons/bi";
import { GiWeight, GiRadialBalance } from "react-icons/gi";
import { LiaTimesSolid } from "react-icons/lia";
import { MdOutlineAdd, MdBalance } from "react-icons/md";
import { VscGraphScatter } from "react-icons/vsc";
import { styled } from "styled-components";
import { z } from "zod";

import Button from "../../../components/common/button";
import WeightBalanceLimitsList from "./WeightBalanceLimitsList";
import WeightBalanceGraph from "../../../components/WeightBalanceGraph";

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

const HtmlSectionContainer = styled.div`
  margin: 20px 0;
  width: 100%;
  padding: 0 10px;

  @media screen and (min-width: 610px) {
    padding: 0 20px;
  }
`;

const HtmlSectionTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0 2px 5px;

  & div {
    display: flex;
    align-items: center;

    & h3:first-of-type {
      margin: 0;
      color: var(--color-grey-bright);
    }

    & svg {
      color: var(--color-grey-bright);
      margin-right: 10px;
      font-size: 25px;
    }
  }

  @media screen and (min-width: 425px) {
    padding: 0 0 2px 20px;
  }
`;

const HtmlSectionContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  border: 1px solid var(--color-grey);
  border-radius: 3px;
  overflow: hidden;
  padding: 10px;
`;

const HtmlPairedInputsContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  align-content: center;
  flex-wrap: wrap;

  & div {
    max-width: 205px;
    padding: 10px 0 0;
    margin: 0 5px;

    & input {
      padding: 10px;
    }
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
    font-size: 15px;
    color: var(--color-warning-hover);
    margin: 2px;
    text-wrap: wrap;
  }

  @media screen and (min-width: 425px) {
    padding: 10px 20px 0;
  }
`;

const HtmlGraphContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  align-content: center;
  flex-grow: 0;
  flex-wrap: wrap;
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

const TitleAddIcon = styled(MdOutlineAdd)`
  flex-shrink: 0;
  font-size: 30px;
  margin: 0 2px 0 0;

  @media screen and (min-width: 510px) {
    font-size: 40px;
  }
`;

const EditIcon = styled(BiSolidEditAlt)`
  flex-shrink: 0;
  font-size: 30px;
  margin: 0 2px 0 0;

  @media screen and (min-width: 510px) {
    font-size: 40px;
  }
`;

const BalanceIcon = styled(MdBalance)`
  flex-shrink: 0;
  font-size: 30px;
  margin: 0 10px 0 0;

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

const WeightIcon = styled(GiWeight)`
  font-size: 25px;
  margin: 0 5px 0 10px;
`;

const AddIcon = styled(MdOutlineAdd)`
  font-size: 20px;
  margin-left: 5px;
`;

const COGIcon = styled(GiRadialBalance)`
  font-size: 25px;
  margin: 0 5px 0 10px;
`;

const SaveIcon = styled(AiOutlineSave)`
  font-size: 25px;
`;

const limitSchema = z.object({
  weight_lb: z
    .number({ invalid_type_error: "Enter a number" })
    .max(99999.94, { message: "Must be less than 99999.95" })
    .min(0, { message: "Must be greater than zero" }),
  cg_location_in: z
    .number({ invalid_type_error: "Enter a number" })
    .max(9999.94, { message: "Must be less than 9999.95" })
    .min(0, { message: "Must be greater than zero" }),
});
export type LimitDataType = z.infer<typeof limitSchema>;

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Must be at least 2 characters long" })
    .max(50, { message: "Must be at most 50 characters long" })
    .regex(/^[\-a-zA-Z0-9\(\) ]+$/, {
      message: "Only letters, numbers, white space, and symbols -()",
    }),
  limits: z.array(limitSchema),
});
type FormDataType = z.infer<typeof formSchema>;

interface ErrorType {
  name: string | null;
  limits: string | null;
}

interface LimitErrorType {
  weight_lb: string | null;
  cg_location_in: string | null;
}

interface FormDataWithId extends FormDataType {
  id: number;
}

interface Props {
  closeModal: () => void;
  data: FormDataWithId;
  isOpen: boolean;
}

const EditWeightBalanceProfileForm = ({ closeModal, data, isOpen }: Props) => {
  const [values, setValues] = useState<FormDataType>({
    name: "",
    limits: [],
  });
  const [limitValues, setLimitValues] = useState<LimitDataType>({
    weight_lb: 0,
    cg_location_in: 0,
  });
  const [errors, setErrors] = useState<ErrorType>({
    name: null,
    limits: null,
  });
  const [limitErrors, setLimitErrors] = useState<LimitErrorType>({
    weight_lb: null,
    cg_location_in: null,
  });

  useEffect(() => {
    if (isOpen) {
      setValues({
        name: data.name,
        limits: data.limits,
      });
      setErrors({
        name: null,
        limits: null,
      });
      setLimitValues({
        weight_lb: NaN,
        cg_location_in: NaN,
      });
      setLimitErrors({
        weight_lb: null,
        cg_location_in: null,
      });
    }
  }, [isOpen]);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    const result = formSchema.safeParse({
      name: newName,
      limits: [],
    });
    if (result.success) {
      setErrors((prev) => ({ ...prev, name: null }));
    } else
      setErrors((prev) => ({ ...prev, name: result.error.errors[0].message }));
    setValues((prev) => ({ ...prev, name: newName }));
  };

  const handleLimitsChange = (newLimits: LimitDataType[]) => {
    setValues((prev) => ({
      ...prev,
      limits: newLimits,
    }));
  };

  const handleLimitChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.id;
    const val = parseFloat(e.target.value);

    if (input === "cg_location_in") {
      const result = limitSchema.safeParse({
        cg_location_in: val,
        weight_lb: 100,
      });
      if (result.success) {
        setLimitErrors((prev) => ({ ...prev, cg_location_in: null }));
      } else
        setLimitErrors((prev) => ({
          ...prev,
          cg_location_in: result.error.errors[0].message,
        }));
      setLimitValues((prev) => ({ ...prev, cg_location_in: val }));
    } else {
      const result = limitSchema.safeParse({
        cg_location_in: 100,
        weight_lb: val,
      });
      if (result.success) {
        setLimitErrors((prev) => ({ ...prev, weight_lb: null }));
      } else
        setLimitErrors((prev) => ({
          ...prev,
          weight_lb: result.error.errors[0].message,
        }));
      setLimitValues((prev) => ({ ...prev, weight_lb: val }));
    }
  };

  const handleAddLimit = () => {
    const result = limitSchema.safeParse({
      cg_location_in: limitValues.cg_location_in,
      weight_lb: limitValues.weight_lb,
    });

    if (result.success) {
      setLimitErrors({
        cg_location_in: null,
        weight_lb: null,
      });
      const newLimits = [...values.limits];
      newLimits.push({
        cg_location_in: Math.round(limitValues.cg_location_in * 100) / 100,
        weight_lb: Math.round(limitValues.weight_lb * 100) / 100,
      });
      setValues((prev) => ({
        ...prev,
        limits: newLimits,
      }));
      setLimitValues({
        cg_location_in: NaN,
        weight_lb: NaN,
      });
    } else {
      const newErrors = { ...limitErrors };
      for (const e of result.error.errors) {
        newErrors[e.path[0] as "cg_location_in" | "weight_lb"] = e.message;
      }
      setLimitErrors(newErrors);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <HtmlForm onSubmit={handleSubmit}>
      <h1>
        <div>
          {data.id === 0 ? <TitleAddIcon /> : <EditIcon />}
          <BalanceIcon />
          {`${data.id === 0 ? "Add New" : "Edit"} W&B Profile`}
        </div>
        <CloseIcon onClick={closeModal} />
      </h1>
      <HtmlInputContainer>
        <HtmlInput
          $required={true}
          $hasValue={values.name.trim() !== ""}
          $accepted={!errors.name}
        >
          <input
            id="name"
            type="text"
            autoComplete="off"
            required={true}
            onChange={handleNameChange}
            value={values.name}
          />
          {errors.name ? <p>{errors.name}</p> : <p>&nbsp;</p>}
          <label htmlFor="name">
            <NameIcon />
            Profile Name
          </label>
        </HtmlInput>
        <HtmlSectionContainer>
          <HtmlSectionTitle>
            <div>
              <VscGraphScatter />
              <h3>Graph Boundary Points</h3>
            </div>
          </HtmlSectionTitle>
          <HtmlSectionContent>
            <HtmlPairedInputsContainer>
              <HtmlInput
                $required={true}
                $hasValue={limitValues.cg_location_in >= 0}
                $accepted={!limitErrors.cg_location_in}
              >
                <input
                  id="cg_location_in"
                  type="number"
                  autoComplete="off"
                  required={true}
                  onChange={handleLimitChange}
                  value={
                    isNaN(limitValues.cg_location_in)
                      ? ""
                      : limitValues.cg_location_in
                  }
                />
                {limitErrors.cg_location_in ? (
                  <p>{limitErrors.cg_location_in}</p>
                ) : (
                  <p>&nbsp;</p>
                )}
                <label htmlFor="cg_location_in">
                  <COGIcon />
                  {"CoG [in]"}
                </label>
              </HtmlInput>
              <HtmlInput
                $required={true}
                $hasValue={limitValues.weight_lb >= 0}
                $accepted={!limitErrors.weight_lb}
              >
                <input
                  id="weight_lb"
                  type="number"
                  autoComplete="off"
                  required={true}
                  onChange={handleLimitChange}
                  value={
                    isNaN(limitValues.weight_lb) ? "" : limitValues.weight_lb
                  }
                />
                {limitErrors.weight_lb ? (
                  <p>{limitErrors.weight_lb}</p>
                ) : (
                  <p>&nbsp;</p>
                )}
                <label htmlFor="weight_lb">
                  <WeightIcon />
                  {"Weight [lbs]"}
                </label>
              </HtmlInput>
            </HtmlPairedInputsContainer>
            <Button
              color="var(--color-primary-dark)"
              hoverColor="var(--color-primary-dark)"
              backgroundColor="var(--color-grey)"
              backgroundHoverColor="var(--color-grey-bright)"
              fontSize={15}
              margin="0 5px 20px 0"
              borderRadious={4}
              handleClick={handleAddLimit}
              btnType="button"
              width="250px"
              height="35px"
            >
              Add Boundary Point
              <AddIcon />
            </Button>
            <HtmlGraphContainer>
              <WeightBalanceLimitsList
                setLimits={handleLimitsChange}
                limits={values.limits}
              />
              {values.limits.length > 0 ? (
                <WeightBalanceGraph
                  profiles={[
                    {
                      name: values.name,
                      limits: values.limits.map((l) => ({
                        ...l,
                        weight_lb: Math.round(l.weight_lb * 100) / 100000,
                        label: `(${l.cg_location_in}, ${
                          Math.round(l.weight_lb * 100) / 100000
                        })`,
                      })),
                    },
                  ]}
                  hideLegend={values.name === ""}
                  width={400}
                />
              ) : null}
            </HtmlGraphContainer>
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

export default EditWeightBalanceProfileForm;
