import { useQueryClient } from "@tanstack/react-query";
import { MdMoreTime } from "react-icons/md";
import {
  BsCalendarWeek,
  BsCalendarCheck,
  BsWatch,
  BsStopwatch,
} from "react-icons/bs";
import { PiEngineDuotone } from "react-icons/pi";
import { styled } from "styled-components";

import { OfficialAerodromeDataFromAPI } from "../../../services/officialAerodromeClient";
import { FlightDataFromApi } from "../../../services/flightsClient";
import { NavLogLegData } from "../hooks/useNavLogData";
import DataTableList from "../../../components/common/DataTableList";
import formatUTCDate from "../../../utils/formatUTCDate";
import formatUTCTime from "../../../utils/formatUTCTime";
import Table from "../../../components/common/ExpandibleTable";
import Loader from "../../../components/Loader";

const HtmlContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const BHPIcon = styled(PiEngineDuotone)`
  font-size: 25px;
  margin: 0 10px 0 0;
  flex-shrink: 0;
`;

const DateIcon = styled(BsCalendarWeek)`
  font-size: 25px;
  margin: 0 10px 0 0;
  flex-shrink: 0;
`;

const DateCheckIcon = styled(BsCalendarCheck)`
  font-size: 25px;
  margin: 0 10px 0 0;
  flex-shrink: 0;
`;

const TimeIcon = styled(BsWatch)`
  font-size: 25px;
  margin: 0 10px 0 0;
  flex-shrink: 0;
`;

const AddedTimeIcon = styled(MdMoreTime)`
  font-size: 25px;
  margin: 0 10px 0 0;
  flex-shrink: 0;
`;

const ChronometerIcon = styled(BsStopwatch)`
  font-size: 25px;
  margin: 0 10px 0 0;
  flex-shrink: 0;
`;

interface Props {
  flightId: number;
  isLoading: boolean;
}

const NavLogSection = ({ flightId, isLoading }: Props) => {
  const queryClient = useQueryClient();
  const flightData = queryClient.getQueryData<FlightDataFromApi>([
    "flight",
    flightId,
  ]);

  const legsData = queryClient.getQueryData<NavLogLegData[]>([
    "navLog",
    flightId,
  ]);

  const elapsedTime = legsData
    ? legsData.reduce(
        (sum, leg) => sum + leg.time_to_climb_min + leg.time_enroute_min,
        0
      )
    : 0;
  const elapsedHours = Math.floor(elapsedTime / 60);
  const elapsedMinutes = Math.round((elapsedTime / 60 - elapsedHours) * 60);

  const addedTime = flightData ? flightData.added_enroute_time_hours : 0;
  const addedHours = Math.floor(addedTime);
  const addedMinutes = Math.round((addedTime - addedHours) * 60);

  const dataListData =
    flightData && legsData
      ? [
          {
            key: "bhp_percent",
            title: "Cruise Prower [% of BHP]",
            icon: <BHPIcon />,
            data: `${flightData.bhp_percent}`,
          },
          {
            key: "departure_date",
            title: "Date",
            icon: <DateIcon />,
            data: formatUTCDate(flightData.departure_time, true),
          },
          {
            key: "departure_time",
            title: "ETD [UTC]",
            icon: <TimeIcon />,
            data: formatUTCTime(flightData.departure_time),
          },
          {
            key: "total_time",
            title: "ETE [hh:mm]",
            icon: <ChronometerIcon />,
            data: `${elapsedHours < 10 ? "0" : ""}${elapsedHours}:${
              elapsedMinutes < 10 ? "0" : ""
            }${elapsedMinutes}`,
          },
          {
            key: "added_enroute_time_hours",
            title: "Added Flight Time [hh:mm]",
            icon: <AddedTimeIcon />,
            data: `${addedHours < 10 ? "0" : ""}${addedHours}:${
              addedMinutes < 10 ? "0" : ""
            }${addedMinutes}`,
          },
          {
            key: "arrival_time",
            title: "ETA [UTC]",
            icon: <DateCheckIcon />,
            data: `${formatUTCDate(
              flightData.departure_time,
              false,
              elapsedTime + addedTime * 60
            )}@${formatUTCTime(
              flightData.departure_time,
              elapsedTime + addedTime * 60
            )}`,
          },
        ]
      : [];

  const tableData = {
    keys: [
      "route",
      "desired_altitude_ft",
      "rpm",
      "ktas",
      "kcas",
      "true_track",
      "true_heading",
      "magnetic_heading",
      "ground_speed",
      "total_distance",
      "total_time",
    ],
    headers: {
      route: "From/To",
      desired_altitude_ft: "Altitude [ft]",
      rpm: "RPM",
      temperature_c: "Temp [\u00B0C]",
      ktas: "KTAS",
      kcas: "KCAS",
      true_track: "Track [\u00B0T]",
      wind: "Wind[\u00B0T]",
      true_heading: "Heading [\u00B0T]",
      magnetic_variation: "Var.",
      magnetic_heading: "Heading [\u00B0M]",
      ground_speed: "G.S. [Knots]",
      distance_to_climb: "Climb Dist. [NM]",
      distance_enroute: "Enroute Dist. [NM]",
      total_distance: "Distance [NM]",
      time_to_climb_min: "Climb ETE [min]",
      time_enroute_min: "Enroute ETE [min]",
      total_time: "ETE [min]",
    },
    rows: legsData
      ? legsData.map((leg, idx) => {
          return {
            id: leg.leg_id,
            route: `${leg.from_waypoint.code} / ${leg.to_waypoint.code}`,
            desired_altitude_ft: leg.desired_altitude_ft,
            rpm: leg.rpm,
            temperature_c: leg.temperature_c,
            ktas: leg.ktas,
            kcas: leg.kcas,
            true_track: leg.true_track,
            wind:
              leg.wind_direction && leg.wind_magnitude_knot
                ? `${leg.wind_direction < 100 ? "0" : ""}${
                    leg.wind_direction
                  }/${leg.wind_magnitude_knot}`
                : "-",
            true_heading: leg.true_heading,
            magnetic_variation: `${Math.round(
              Math.abs(leg.magnetic_variation)
            )}\u00B0${
              leg.magnetic_variation < 0
                ? "E"
                : leg.magnetic_variation === 0
                ? ""
                : "W"
            }`,
            magnetic_heading: leg.magnetic_heading,
            ground_speed: leg.ground_speed,
            distance_to_climb: leg.distance_to_climb,
            distance_enroute: leg.distance_enroute,
            total_distance: leg.total_distance,
            time_to_climb_min: leg.time_to_climb_min,
            time_enroute_min: leg.time_enroute_min,
            total_time: leg.time_to_climb_min + leg.time_enroute_min,
            handleEdit: () => {},
            handleDelete: () => {},
            permissions:
              idx < legsData.length - 1
                ? ("edit-delete" as "edit-delete")
                : ("edit" as "edit"),
          };
        })
      : [],
    breakingPoint: 1024,
  };

  return (
    <>
      <DataTableList dataList={dataListData} margin="0 0 40px" />
      <Table
        title="Flight Log"
        hanldeAdd={() => {}}
        otherComponent={""}
        dataIsLoading={isLoading}
        tableData={tableData}
      />
    </>
  );
};

export default NavLogSection;
