import { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";
import { styled } from "styled-components";

import useUserWaypointsData from "../../../hooks/useUserWaypointsData";
import Table from "../../../components/common/table";
import Loader from "../../../components/Loader";
import Button from "../../../components/common/button/index";
import { useModal, Modal } from "../../../components/common/modal";
import EditWaypointForm from "../../../components/editWaypointForm";
import { WaypointDataFromAPI } from "../../../services/waypointClient";

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

const WaypointsTable = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [waypointId, setWaypointId] = useState<number>(0);
  const { data: waypoints, isLoading } = useUserWaypointsData();
  const editModal = useModal();

  const waypointData = waypoints?.find((item) => item.id === waypointId);

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
      ? waypoints.map((w) => ({
          id: w.id,
          code: w.code,
          name: w.name,
          latitude: `${w.lat_direction}${w.lat_degrees}\u00B0${w.lat_minutes}'${w.lat_seconds}"`,
          longitude: `${w.lon_direction}${w.lon_degrees}\u00B0${w.lon_minutes}'${w.lon_seconds}"`,
          variation: `${Math.abs(
            w.magnetic_variation ? w.magnetic_variation : 0
          )}\u00B0${
            w.magnetic_variation
              ? w.magnetic_variation < 0
                ? "E"
                : w.magnetic_variation > 0
                ? "W"
                : ""
              : ""
          }`,
          handleEdit: () => {
            setWaypointId(w.id);
            editModal.handleOpen();
          },
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

  const handleAddNewClick = () => {
    setWaypointId(0);
    editModal.handleOpen();
  };

  type LatitudeDirections = "North" | "South";
  const latitudeDirectionConverter = (
    waypoint?: WaypointDataFromAPI
  ): LatitudeDirections => {
    const direction = waypoint?.lat_direction === "S" ? "South" : "North";
    return direction;
  };

  type LongitudeDirections = "East" | "West";
  const longitudeDirectionConverter = (
    waypoint?: WaypointDataFromAPI
  ): LongitudeDirections => {
    const direction = waypoint?.lon_direction === "E" ? "East" : "West";
    return direction;
  };

  return (
    <>
      <Modal isOpen={editModal.isOpen}>
        <EditWaypointForm
          closeModal={editModal.handleClose}
          waypointData={
            waypointData
              ? {
                  id: waypointData.id,
                  code: waypointData.code,
                  name: waypointData.name,
                  lat_degrees: waypointData.lat_degrees,
                  lat_minutes: waypointData.lat_minutes,
                  lat_seconds: waypointData.lat_seconds,
                  lat_direction: latitudeDirectionConverter(waypointData),
                  lon_degrees: waypointData.lon_degrees,
                  lon_minutes: waypointData.lon_minutes,
                  lon_seconds: waypointData.lon_seconds,
                  lon_direction: longitudeDirectionConverter(waypointData),
                  magnetic_variation: waypointData.magnetic_variation,
                }
              : {
                  id: 0,
                  code: "",
                  name: "",
                  lat_degrees: 0,
                  lat_minutes: 0,
                  lat_seconds: 0,
                  lat_direction: "North",
                  lon_degrees: 0,
                  lon_minutes: 0,
                  lon_seconds: 0,
                  lon_direction: "West",
                  magnetic_variation: NaN,
                }
          }
          isOpen={editModal.isOpen}
        />
      </Modal>
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
            handleClick={handleAddNewClick}
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
    </>
  );
};

export default WaypointsTable;
