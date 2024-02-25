import { BsFillFuelPumpFill, BsThermometerSun } from "react-icons/bs";
import { useQueryClient } from "@tanstack/react-query";
import { styled } from "styled-components";

import DataTableList from "../../../components/common/DataTableList";
import ExpandibleTable from "../../../components/common/ExpandibleTable";
import { ClimbPerformanceDataFromAPI } from "../../../services/aircraftClimbDataClient";
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

const FuelIcon = styled(BsFillFuelPumpFill)`
  font-size: 20px;
  margin: 0 10px 0 0;

  @media screen and (min-width: 550px) {
    margin: 0 10px 0 10px;
  }
`;

const TemperatureIcon = styled(BsThermometerSun)`
  font-size: 25px;
  margin: 0 5px 0 0;

  @media screen and (min-width: 550px) {
    margin: 0 5px 0 10px;
  }
`;

interface Props {
  profileId: number;
}

const ClimbSection = ({ profileId }: Props) => {
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData<ClimbPerformanceDataFromAPI>([
    "aircraftClimbPerformance",
    profileId,
  ]);

  const { isModel, userIsAdmin } = useModelPermissions();

  const dataList = [
    {
      key: "take_off_taxi_fuel_gallons",
      title: "Fuel for start to takeoff [gal]",
      icon: <FuelIcon />,
      data: `${data?.take_off_taxi_fuel_gallons || "-"}`,
    },
    {
      key: "percent_increase_climb_temperature_c",
      title: "Decrease performance by [% per \u00B0C above standard]:",
      icon: <TemperatureIcon />,
      data: `${data?.percent_increase_climb_temperature_c || "-"}`,
    },
  ];

  const performanceTableData = {
    keys: [
      "data_point",
      "weight_lb",
      "pressure_alt_ft",
      "temperature_c",
      "kias",
      "fpm",
      "time_min",
      "fuel_gal",
      "distance_nm",
    ],
    headers: {
      data_point: "",
      weight_lb: "Weight [lb]",
      pressure_alt_ft: "Pressure Alt [ft]",
      temperature_c: "OAT [\u00B0C]",
      kias: "Climb Speed [KIAS]",
      fpm: "Rate of Climb [FPM]",
      time_min: "Time from S.L. [min]",
      fuel_gal: "Fuel from S.L. [gal]",
      distance_nm: "Distance from S.L. [NM]",
    },
    rows: data
      ? data.performance_data.map((item, idx) => ({
          id: idx + 1,
          data_point: "",
          weight_lb: item.weight_lb || "-",
          pressure_alt_ft: item.pressure_alt_ft || "-",
          temperature_c: item.temperature_c || "-",
          kias: item.kias || "-",
          fpm: item.fpm || "-",
          time_min: item.time_min || "-",
          fuel_gal: item.fuel_gal || "-",
          distance_nm: item.distance_nm || "-",
          handleEdit: () => {},
          handleDelete: () => {},
          permissions: undefined,
        }))
      : [],
    breakingPoint: 1024,
  };

  const dataInstructions = [
    "This is the list of data-points of the climb performance table.",
    "This table is only to display the performance data.",
    "To edit the data, you need to import it from a CSV-file, by opening the form from the sidebar, and following the instructions in the form.",
  ];

  return (
    <HtmlDataContainer>
      <DataTableList dataList={dataList} maxWidth={750} margin="35px 0" />
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

export default ClimbSection;
