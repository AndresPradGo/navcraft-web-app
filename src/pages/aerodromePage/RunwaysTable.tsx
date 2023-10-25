import { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";
import { styled } from "styled-components";

import Table from "../../components/common/table";
import Button from "../../components/common/button";
import { RunwayDataFromAPI } from "../../services/userAerodromeClient";
import { useModal, Modal, UseModalType } from "../../components/common/modal";
import EditRunwayForm, { RunwayDataType } from "./EditRunwayForm";

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
  runwaysData: RunwayDataFromAPI[] | [];
  aerodromeId: number;
}

const RunwaysTable = ({ editModal, runwaysData, aerodromeId }: Props) => {
  const [isOpen, setIsOpen] = useState(true);
  const [runwayId, setRunwayId] = useState<number>(0);
  const deleteModal = useModal();
  const runwayData = runwayId
    ? { ...runwaysData[runwayId], aerodromeId }
    : ({
        aerodromeId,
        id: 0,
        number: NaN,
        position: undefined,
        length_ft: NaN,
        landing_length_ft: undefined,
        intersection_departure_length_ft: undefined,
        surface: "",
        surface_id: 0,
      } as RunwayDataType);

  const tableData = {
    keys: [
      "runway",
      "length_ft",
      "thld_dislp",
      "intersection_departure_length_ft",
      "surface",
    ],
    headers: {
      runway: "Runway",
      length_ft: "Length [ft]",
      thld_displ: "Thld Displ [ft]",
      intersection_departure_length_ft: "Intxn Dep [ft]",
      surface: "Surface",
    },
    rows: runwaysData.map((r) => ({
      id: r.id,
      runway: `${r.number < 10 ? "0" : ""}${r.number}${r.position || ""}`,
      length_ft: r.length_ft,
      thld_displ: r.landing_length_ft ? r.length_ft - r.landing_length_ft : 0,
      intersection_departure_length_ft:
        `${r.intersection_departure_length_ft}` || "",
      surface: r.surface,
      handleEdit: () => {},
      handleDelete: () => {
        setRunwayId(r.id);
        deleteModal.handleOpen();
      },
      permissions: "delete" as "delete",
    })),
    breakingPoint: 1000,
  };

  const sortData = [
    {
      title: "Runway",
      key: "runway",
    },
    {
      title: "Length",
      key: "length_ft",
    },
    {
      title: "Surface",
      key: "surface",
    },
  ];

  return (
    <>
      <Modal isOpen={editModal.isOpen}>
        <EditRunwayForm
          isOpen={editModal.isOpen}
          closeModal={editModal.handleClose}
          runwayData={runwayData}
        />
      </Modal>
      <Modal isOpen={deleteModal.isOpen}>delete form</Modal>
      <HtmlContainer>
        <HtmlTitleContainer>
          <div>
            <ToggleIcon onClick={() => setIsOpen(!isOpen)} $isOpen={isOpen} />
            <h3>Runways</h3>
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
          <Table
            tableData={tableData}
            sortColumnOptions={sortData}
            pageSize={20}
            emptyTableMessage="No Runways saved for this aerodrome..."
          />
        </HtmlTableContainer>
      </HtmlContainer>
    </>
  );
};

export default RunwaysTable;
