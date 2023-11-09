import { useState, Dispatch, SetStateAction } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";
import { styled } from "styled-components";

import Table from "../../components/common/table";
import Button from "../../components/common/button";
import { RunwayDataFromAPI } from "../../services/userAerodromeClient";
import { useModal, Modal, UseModalType } from "../../components/common/modal";
import EditRunwayForm, {
  RunwayDataType,
} from "../../components/editRunwayForm/EditRunwayForm";
import DeleteRunwayForm from "../../components/deleteRunwayForm/DeleteRunwayForm";
import formatUTCDate from "../../utils/formatUTCDate";

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
  runwaysData: RunwayDataFromAPI[];
  aerodromeId: number;
  runwayId: number;
  setRunwayId: Dispatch<SetStateAction<number>>;
  canEdit: boolean;
  aerodromeName: string;
}

const RunwaysTable = ({
  editModal,
  runwaysData,
  aerodromeId,
  aerodromeName,
  runwayId,
  setRunwayId,
  canEdit,
}: Props) => {
  const [isOpen, setIsOpen] = useState(true);
  const deleteModal = useModal();
  const runwayInCache = runwaysData.find((item) => item.id === runwayId);
  const runwayData = runwayInCache
    ? {
        id: runwayId,
        aerodromeId,
        number: runwayInCache.number,
        position:
          runwayInCache.position === "R"
            ? "Right"
            : runwayInCache.position === "L"
            ? "Left"
            : runwayInCache.position === "C"
            ? "Center"
            : "",
        length_ft: runwayInCache.length_ft,
        thld_displ: runwayInCache.landing_length_ft
          ? runwayInCache.length_ft - runwayInCache.landing_length_ft
          : null,
        intersection_departure_length_ft:
          runwayInCache.intersection_departure_length_ft
            ? runwayInCache.intersection_departure_length_ft
            : null,
        surface: runwayInCache.surface,
      }
    : ({
        id: 0,
        aerodromeId,
        number: NaN,
        position: "",
        length_ft: NaN,
        thld_displ: NaN,
        intersection_departure_length_ft: NaN,
        surface: "",
      } as RunwayDataType);

  const tableData = {
    keys: [
      "runway",
      "length_ft",
      "thld_displ",
      "intersection_departure_length_ft",
      "surface",
      "updated",
    ],
    headers: {
      runway: "Runway",
      length_ft: "Length [ft]",
      thld_displ: "Thld Displ [ft]",
      intersection_departure_length_ft: "Intxn Dep [ft]",
      surface: "Surface",
      updated: "Date Updated",
    },
    rows: runwaysData.map((r) => ({
      id: r.id,
      runway: `${r.number < 10 ? "0" : ""}${r.number}${r.position || ""}`,
      length_ft: r.length_ft,
      thld_displ: r.landing_length_ft ? r.length_ft - r.landing_length_ft : "-",
      intersection_departure_length_ft: `${
        r.intersection_departure_length_ft || "-"
      }`,
      surface: r.surface,
      updated: formatUTCDate(r.last_updated_utc),
      date: r.last_updated_utc,
      handleEdit: () => {
        if (canEdit) {
          setRunwayId(r.id);
          editModal.handleOpen();
        }
      },
      handleDelete: () => {
        if (canEdit) {
          setRunwayId(r.id);
          deleteModal.handleOpen();
        }
      },
      permissions: canEdit ? ("delete" as "delete") : undefined,
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
    {
      title: "Date Updated",
      key: "date",
    },
  ];

  return (
    <>
      {canEdit ? (
        <>
          <Modal isOpen={editModal.isOpen}>
            <EditRunwayForm
              fromAerodrome={true}
              aerodromeName={aerodromeName}
              isOpen={editModal.isOpen}
              closeModal={editModal.handleClose}
              runwayData={runwayData}
            />
          </Modal>
          <Modal isOpen={deleteModal.isOpen}>
            <DeleteRunwayForm
              fromAerodrome={true}
              aerodromeName={aerodromeName}
              closeModal={deleteModal.handleClose}
              name={
                runwayInCache
                  ? `${runwayInCache.number < 10 ? "0" : ""}${
                      runwayInCache.number
                    }${runwayInCache.position || ""}`
                  : ""
              }
              id={runwayId}
              aerodromeId={aerodromeId}
            />
          </Modal>
        </>
      ) : null}
      <HtmlContainer>
        <HtmlTitleContainer>
          <div>
            <ToggleIcon onClick={() => setIsOpen(!isOpen)} $isOpen={isOpen} />
            <h3>Runways</h3>
          </div>
          {canEdit ? (
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
              handleClick={() => {
                setRunwayId(0);
                editModal.handleOpen();
              }}
            >
              <AiOutlinePlus />
            </Button>
          ) : null}
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
