import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { styled } from "styled-components";

import DataTableList from "../../../components/common/DataTableList";
import ExpandibleTable from "../../../components/common/ExpandibleTable";
import { useModal, Modal } from "../../../components/common/modal";
import { TakeoffLandingDataFromAPI } from "../../../services/takeoffLandingPerformanceDataClient";
import { RunwaySurfaceData } from "../../../hooks/useRunwaySurfaces";
import EditSurfaceAdjustmentForm from "./EditSurfaceAdjustmentForm";

const HtmlInstructionsList = styled.ul`
  & li {
    text-wrap: wrap;
  }
`;

interface Props {
  profileId: number;
  isTakeoff: boolean;
}

const TakeoffLandingSection = ({ profileId, isTakeoff }: Props) => {
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData<TakeoffLandingDataFromAPI>([
    isTakeoff ? "takeoffPerformance" : "landingPerformance",
    profileId,
  ]);

  const [surfaceToEditId, setSurfaceToEditId] = useState<number>(0);

  const editModal = useModal();
  const deleteModal = useModal();

  const surfaces = queryClient.getQueryData<RunwaySurfaceData[]>([
    "runwaySurface",
  ]);

  const dataList = [
    {
      key: "percent_decrease_knot_headwind",
      title: `For every knot of headwind, decrease ${
        isTakeoff ? "takeoff" : "landing"
      } distance by:`,
      data: `${
        data?.percent_decrease_knot_headwind
          ? `${data?.percent_decrease_knot_headwind}%`
          : "-"
      }`,
    },
    {
      key: "percent_increase_knot_tailwind",
      title: `For every knot of tailwind, increase ${
        isTakeoff ? "takeoff" : "landing"
      } distance by:`,
      data: `${
        data?.percent_increase_knot_tailwind
          ? `${data?.percent_increase_knot_tailwind}%`
          : "-"
      }`,
    },
  ];

  const surfaceTableData = {
    keys: ["surface", "percent"],
    headers: {
      surface: "Runway Surface",
      percent: "% of Ground Roll",
    },
    rows:
      data && surfaces
        ? data.percent_increase_runway_surfaces.map((item) => ({
            id: item.surface_id,
            surface:
              surfaces.find((s) => s.id === item.surface_id)?.surface || "-",
            percent: item.percent,
            handleEdit: () => {
              setSurfaceToEditId(item.surface_id);
              editModal.handleOpen();
            },
            handleDelete: () => {},
            permissions: "delete" as "delete",
          }))
        : [],
  };

  const performanceTableData = {
    keys: [
      "data_point",
      "weight_lb",
      "pressure_alt_ft",
      "temperature_c",
      "groundroll_ft",
      "obstacle_clearance_ft",
    ],
    headers: {
      data_point: "",
      weight_lb: "Weight [Lb]",
      pressure_alt_ft: "Pressure alt [ft]",
      temperature_c: "Air Temperature [\u00B0C]",
      groundroll_ft: "Ground Roll [ft]",
      obstacle_clearance_ft: "Clear 50ft Obs [ft]",
    },
    rows: data
      ? data.performance_data.map((item, idx) => ({
          id: idx + 1,
          data_point: "",
          weight_lb: item.weight_lb,
          pressure_alt_ft: item.pressure_alt_ft,
          temperature_c: item.temperature_c,
          groundroll_ft: item.groundroll_ft,
          obstacle_clearance_ft: item.obstacle_clearance_ft,
          handleEdit: () => {},
          handleDelete: () => {},
          permissions: undefined,
        }))
      : [],
  };

  const surfaceInstructions = [
    `These are the percentages of the ground roll, by which the ${
      isTakeoff ? "takeoff" : "landing"
    } distances will be increased, for different runway surfaces.`,
  ];

  const dataInstructions = [
    `This is the list of data-points of the ${
      isTakeoff ? "takeoff" : "landing"
    } performance table.`,
    "This list is only to display the data. To edit the data, you need to import it from a CSV-file.",
    "To import the data, open the form from the sidebar, and follow the instructions in the form.",
  ];

  const surfaceToEdit = data?.percent_increase_runway_surfaces.find(
    (item) => item.surface_id === surfaceToEditId
  ) || { surface_id: 0, percent: NaN };

  return (
    <>
      <Modal isOpen={editModal.isOpen} fullHeight={true}>
        <EditSurfaceAdjustmentForm
          closeModal={editModal.handleClose}
          isOpen={editModal.isOpen}
          profileId={profileId}
          surface_id={surfaceToEdit.surface_id}
          percent={surfaceToEdit.percent}
          isTakeoff={isTakeoff}
        />
      </Modal>
      <DataTableList dataList={dataList} maxWidth={800} margin="35px 0 0" />
      <ExpandibleTable
        tableData={surfaceTableData}
        title="Surface Adjustments"
        hanldeAdd={() => {
          setSurfaceToEditId(0);
          editModal.handleOpen();
        }}
        otherComponent={
          <HtmlInstructionsList>
            {surfaceInstructions.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </HtmlInstructionsList>
        }
      />
      <ExpandibleTable
        tableData={performanceTableData}
        title={`${isTakeoff ? "Takeoff" : "Landing"} Performance Data`}
        hanldeAdd={() => {}}
        pageSize={10}
        emptyTableMessage={`${
          isTakeoff ? "Takeoff" : "Landing"
        } performance table is empty...`}
        disableAdd={true}
        otherComponent={
          <HtmlInstructionsList>
            {dataInstructions.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </HtmlInstructionsList>
        }
      />
    </>
  );
};

export default TakeoffLandingSection;
