import { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";
import { styled } from "styled-components";

import useUserAerodromesData from "../hooks/useUserAerodromesData";
import Table from "../../../components/common/table";
import Loader from "../../../components/Loader";
import Button from "../../../components/common/button";
import EditUserAerodromeForm from "../../../components/editUserAerodromeForm";
import DeleteUserAerodromeForm from "../../../components/deleteUserAerodromeForm";
import {
  useModal,
  Modal,
  UseModalType,
} from "../../../components/common/modal";

interface HtmlTagProps {
  $isOpen: boolean;
}
const HtmlContainer = styled.div`
  margin: 100px 0 50px;
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

interface Props {
  editModal: UseModalType;
}

const AerodromesTable = ({ editModal }: Props) => {
  const [isOpen, setIsOpen] = useState(true);
  const [aerodromeId, setAerodromeId] = useState<number>(0);
  const deleteModal = useModal();
  const { data: aerodromes, isLoading, error } = useUserAerodromesData();
  const aerodromeData = {
    id: 0,
    code: "",
    name: "",
    lat_degrees: 0,
    lat_minutes: 0,
    lat_seconds: 0,
    lat_direction: "North" as "North",
    lon_degrees: 0,
    lon_minutes: 0,
    lon_seconds: 0,
    lon_direction: "West" as "West",
    magnetic_variation: NaN,
    elevation_ft: 0,
    status: 6,
  };

  const tableData = {
    keys: [
      "code",
      "name",
      "latitude",
      "longitude",
      "elevation_ft",
      "runways",
      "variation",
    ],
    headers: {
      code: "Code",
      name: "Name",
      latitude: "Latitude",
      longitude: "Longitude",
      elevation_ft: "Elevation [ft]",
      runways: "Runways",
      variation: "Magnetic Var",
    },
    rows:
      !error && aerodromes
        ? aerodromes.map((a) => ({
            id: a.id,
            code: a.code,
            name: a.name,
            latitude: `${a.lat_direction}${a.lat_degrees}\u00B0${a.lat_minutes}'${a.lat_seconds}"`,
            longitude: `${a.lon_direction}${a.lon_degrees}\u00B0${a.lon_minutes}'${a.lon_seconds}"`,
            variation: `${Math.abs(
              a.magnetic_variation ? a.magnetic_variation : 0
            )}\u00B0${
              a.magnetic_variation
                ? a.magnetic_variation < 0
                  ? "E"
                  : a.magnetic_variation > 0
                  ? "W"
                  : ""
                : ""
            }`,
            elevation_ft: a.elevation_ft,
            runways: a.runways.length
              ? a.runways
                  .map(
                    (r) =>
                      `${r.number.toString().padStart(2, "0")}${
                        r.position ? r.position : ""
                      }`
                  )
                  .join(", ")
              : "-",
            handleEdit: `/waypoints/private-aerodrome/${a.id}`,
            handleDelete: () => {
              setAerodromeId(a.id);
              deleteModal.handleOpen();
            },
            permissions: "open-delete" as "open-delete",
          }))
        : [],
    breakingPoint: 1000,
  };

  const sortData = [
    {
      title: "Code",
      key: "code",
    },
    {
      title: "Name",
      key: "name",
    },
  ];

  return (
    <>
      <Modal isOpen={editModal.isOpen}>
        <EditUserAerodromeForm
          queryKey={"user"}
          closeModal={editModal.handleClose}
          aerodromeData={aerodromeData}
          isOpen={editModal.isOpen}
        />
      </Modal>
      <Modal isOpen={deleteModal.isOpen}>
        <DeleteUserAerodromeForm
          closeModal={deleteModal.handleClose}
          name={aerodromes?.find((item) => item.id === aerodromeId)?.name || ""}
          id={aerodromeId}
          queryKey="user"
        />
      </Modal>
      <HtmlContainer>
        <HtmlTitleContainer>
          <div>
            <ToggleIcon onClick={() => setIsOpen(!isOpen)} $isOpen={isOpen} />
            <h3>Saved Aerodromes</h3>
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
            handleClick={editModal.handleOpen}
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
              emptyTableMessage="No Aerodromes saved..."
            />
          )}
        </HtmlTableContainer>
      </HtmlContainer>
    </>
  );
};

export default AerodromesTable;
