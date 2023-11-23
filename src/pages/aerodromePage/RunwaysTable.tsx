import { Dispatch, SetStateAction } from "react";

import { RunwayDataFromAPI } from "../../services/userAerodromeClient";
import { useModal, Modal, UseModalType } from "../../components/common/modal";
import EditRunwayForm, {
  RunwayDataType,
} from "../../components/editRunwayForm/EditRunwayForm";
import DeleteRunwayForm from "../../components/deleteRunwayForm/DeleteRunwayForm";
import formatUTCDate from "../../utils/formatUTCDate";
import ExpandibleTable from "../../components/common/ExpandibleTable";

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
      permissions: canEdit ? ("edit-delete" as "edit-delete") : undefined,
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
      <ExpandibleTable
        tableData={tableData}
        sortColumnOptions={sortData}
        pageSize={20}
        emptyTableMessage="No Runways saved for this aerodrome..."
        title="Runways"
        hanldeAdd={() => {
          setRunwayId(0);
          editModal.handleOpen();
        }}
      />
    </>
  );
};

export default RunwaysTable;
