import { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";
import { styled } from "styled-components";

import useWaypointsData from "./useWaypointsData";
import Table from "../../components/common/table";
import Loader from "../../components/Loader";
import Button from "../../components/common/button/index";

interface HtmlTagProps {
  $isOpen: boolean;
}
const HtmlContainer = styled.div`
  margin-top: 100px;
  width: 100%;
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

const HtmlTableContainer = styled.div<HtmlTagProps>`
  transition: padding 0.6s, max-height 0.3s, opacity 0.6s;
  border-bottom: 1px solid var(--color-grey);
  padding: ${(props) => (props.$isOpen ? "15px" : "0px 15px")};
  max-height: ${(props) => (props.$isOpen ? "10000vh" : "0px")};
  opacity: ${(props) => (props.$isOpen ? "1" : "0")};
  overflow: hidden;
`;

const WaypointsTable = ({ userId }: { userId: number }) => {
  const [isOpen, setIsOpen] = useState(true);
  const { data: waypoints, isLoading } = useWaypointsData(userId);

  const tableData = {
    keys: ["code", "name", "latitude", "longitude", "variation"],
    headers: {
      code: "Code",
      name: "Name",
      latitude: "Latitude",
      longitude: "Longitude",
      variation: "Magnetic Var",
    },
    rows: waypoints
      ? waypoints.map((waypoint) => ({
          ...waypoint,
          handleEdit: () => {},
          handleDelete: () => {},
          permissions: "delete" as "delete",
        }))
      : [],
    breakingPoint: 0,
  };

  const sortData = [
    {
      key: "code",
      title: "Code",
    },
    {
      key: "name",
      title: "Name",
    },
  ];

  return (
    <HtmlContainer>
      <HtmlTitleContainer>
        <div>
          <ToggleIcon onClick={() => setIsOpen(!isOpen)} $isOpen={isOpen} />
          <h3>Saved Waypoints</h3>
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
          <Table
            tableData={tableData}
            sortColumnOptions={sortData}
            pageSize={5}
            emptyTableMessage="No Waypoints saved..."
          />
        )}
      </HtmlTableContainer>
    </HtmlContainer>
  );
};

export default WaypointsTable;
