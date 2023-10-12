import { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";
import { styled } from "styled-components";

import usePassengerData from "./usePassengersData";
import Table from "../../components/common/table";
import Loader from "../../components/Loader";
import Button from "../../components/common/button/index";

interface HtmlTagProps {
  $isOpen: boolean;
}
const HtmlContainer = styled.div`
  margin-top: 60px;
  width: 100%;
  max-width: 1000px;
`;

const HtmlTitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 5px;
  padding: 0 0 10px 5px;
  border-bottom: 1px solid var(--color-grey);

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

const ToggleIcon = styled(BsChevronDown)<HtmlTagProps>`
  color: var(--color-grey);
  cursor: pointer;
  margin-right: 5px;
  font-size: 25px;
  transform: rotate(${(props) => (props.$isOpen ? "0deg" : "-90deg")});
  transition: 0.3s transform linear;

  &:hover,
  &:focus {
    color: var(--color-white);
  }

  @media screen and (min-width: 425px) {
    margin-right: 20px;
  }
`;

const HtmlTableContainer = styled.div<HtmlTagProps>`
  transition: max-height 0.3s, padding 0.3s, opacity 0.3s;
  border-bottom: 1px solid var(--color-grey);
  padding: ${(props) => (props.$isOpen ? "30px" : "0px 30px")};
  max-height: ${(props) => (props.$isOpen ? "100vh" : "0px")};
  opacity: ${(props) => (props.$isOpen ? "1" : "0")};
  overflow: hidden;
`;

const PassengersTable = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { data: passengers, isLoading } = usePassengerData();

  const tableData = {
    keys: ["name", "weight"],
    headers: {
      name: "Name",
      weight: "Weight [lb]",
    },
    rows: passengers
      ? passengers.map((passenger) => ({
          ...passenger,
          handleEdit: () => {},
          handleDelete: () => {},
          permissions: "delete" as "delete",
        }))
      : [],
    breakingPoint: 0,
  };

  return (
    <HtmlContainer>
      <HtmlTitleContainer>
        <div>
          <ToggleIcon onClick={() => setIsOpen(!isOpen)} $isOpen={isOpen} />
          <h3>Frequent Passengers</h3>
        </div>
        <Button
          borderRadious={100}
          padding="5px"
          height="30px"
          backgroundColor="var(--color-grey)"
          backgroundHoverColor="var(--color-white)"
          color="var(--color-primary-dark)"
          hoverColor="var(--color-primary-dark)"
          margin="0 20px 0 0px"
          fontSize={18}
        >
          <AiOutlinePlus />
        </Button>
      </HtmlTitleContainer>
      <HtmlTableContainer $isOpen={isOpen}>
        {isLoading ? (
          <Loader />
        ) : (
          passengers && (
            <Table
              tableData={tableData}
              emptyTableMessage="No Passengers saved..."
            />
          )
        )}
      </HtmlTableContainer>
    </HtmlContainer>
  );
};

export default PassengersTable;
