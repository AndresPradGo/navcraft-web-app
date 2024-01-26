import { useQueryClient } from "@tanstack/react-query";
import { styled } from "styled-components";

import type { FlightDataFromApi } from "../../../services/flightClient";
import type { NavLogLegData } from "../hooks/useNavLogData";
import FlightWarningList from "../../../components/FlightWarningList";
import PdfRenderer from "../../../components/common/pdfRenderer/PdfRenderer";
import formatUTCDate from "../../../utils/formatUTCDate";
import formatUTCTime from "../../../utils/formatUTCTime";

const HtmlLoaderContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

interface Props {
  flightId: number;
  departureCode: string;
  arrivalCode: string;
  isLoading: boolean;
}
const WeatherBriefingSection = ({
  flightId,
  departureCode,
  arrivalCode,
  isLoading,
}: Props) => {
  const queryClient = useQueryClient();

  const flightData = queryClient.getQueryData<FlightDataFromApi>([
    "flight",
    flightId,
  ]);

  const legsData = queryClient.getQueryData<NavLogLegData[]>([
    "navLog",
    flightId,
  ]);

  if ((flightData?.weather_hours_from_etd || -1) < 0) {
    return (
      <FlightWarningList
        warnings={[
          [
            "Weather briefing data is not available for past ETD date-times. To get a weather briefing, update the ETD to a future date.",
          ],
        ]}
      />
    );
  }

  const elapsedTime = legsData
    ? legsData.reduce(
        (sum, leg) => sum + leg.time_to_climb_min + leg.time_enroute_min,
        0
      )
    : 0;
  const eta = flightData
    ? `${formatUTCDate(
        flightData.departure_time,
        true,
        elapsedTime + flightData.added_enroute_time_hours * 60
      )} at ${formatUTCTime(
        flightData.departure_time,
        elapsedTime + flightData.added_enroute_time_hours * 60
      )}`
    : "";
  const etd = flightData
    ? `${formatUTCDate(flightData.departure_time, true)} at ${formatUTCTime(
        flightData.departure_time
      )}`
    : "";

  const headers = [
    "Weather Briefing",
    `Depart: ${departureCode} on ${etd}`,
    `Arrive: ${arrivalCode} on ${eta}`,
  ];

  return (
    <PdfRenderer
      content={{
        headers,
        body: [],
      }}
    />
  );
};

export default WeatherBriefingSection;
