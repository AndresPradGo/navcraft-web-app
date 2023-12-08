import { useQueryClient } from "@tanstack/react-query";
import { styled } from "styled-components";

import ExpandibleTable from "../../../components/common/ExpandibleTable";
import { CruisePerformanceDataFromAPI } from "../hooks/useCruiseData";
import useModelPermissions from "../useModelPermissions";

const HtmlDataContainer = styled.div`
  transition: all 2s;
  width: 100%;
  display: flex;
  margin: 0 0 35px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-evenly;
  align-content: center;
`;

const HtmlInstructionsList = styled.ul`
  & li {
    text-wrap: wrap;
  }
`;

interface Props {
  profileId: number;
}

const CruiseSection = ({ profileId }: Props) => {
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData<CruisePerformanceDataFromAPI>([
    "aircraftCruisePerformance",
    profileId,
  ]);

  const { isModel, userIsAdmin } = useModelPermissions();

  const performanceTableData = {
    keys: [
      "data_point",
      "weight_lb",
      "pressure_alt_ft",
      "temperature_c",
      "bhp_percent",
      "gph",
      "rpm",
      "ktas",
    ],
    headers: {
      data_point: "",
      weight_lb: "Weight [lb]",
      pressure_alt_ft: "Pressure Alt [ft]",
      temperature_c: "OAT [\u00B0C]",
      bhp_percent: "% BHP",
      gph: "GPH",
      rpm: "RPM",
      ktas: "KTAS",
    },
    rows: data
      ? data.performance_data.map((item, idx) => ({
          id: idx + 1,
          data_point: "",
          weight_lb: item.weight_lb || "-",
          pressure_alt_ft: item.pressure_alt_ft || "-",
          temperature_c: item.temperature_c || "-",
          bhp_percent: item.bhp_percent || "-",
          gph: item.gph || "-",
          rpm: item.rpm || "-",
          ktas: item.ktas || "-",
          handleEdit: () => {},
          handleDelete: () => {},
          permissions: undefined,
        }))
      : [],
    breakingPoint: 1024,
  };

  const dataInstructions = [
    "This is the list of data-points of the cruise performance table.",
    "This table is only to display the performance data.",
    "To edit the data, you need to import it from a CSV-file, by opening the form from the sidebar, and following the instructions in the form.",
  ];

  return (
    <HtmlDataContainer>
      <ExpandibleTable
        tableData={performanceTableData}
        title="Climb Performance Data"
        hanldeAdd={() => {}}
        pageSize={10}
        emptyTableMessage="Climb performance table is empty..."
        disableAdd={true}
        otherComponent={
          (isModel && userIsAdmin) || !isModel ? (
            <HtmlInstructionsList>
              {dataInstructions.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </HtmlInstructionsList>
          ) : null
        }
      />
    </HtmlDataContainer>
  );
};

export default CruiseSection;
