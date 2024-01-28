import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { LuRefreshCw } from "react-icons/lu";
import { styled } from "styled-components";

import type { FlightDataFromApi } from "../../../services/flightClient";
import type { NavLogLegData } from "../hooks/useNavLogData";
import FlightWarningList from "../../../components/FlightWarningList";
import PdfRenderer from "../../../components/common/pdfRenderer/PdfRenderer";
import formatUTCDate from "../../../utils/formatUTCDate";
import formatUTCTime from "../../../utils/formatUTCTime";
import Button from "../../../components/common/button/index";
import type {
  WeatherBriefingFromAPI,
  EnrouteRequest,
} from "../services/briefingClient";
import useWeatherBriefingRequest from "../hooks/useWeatherBriefingRequest";
import Loader from "../../../components/Loader";

const HtmlLoaderContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 50px 0;

  & p {
    color: var(--color-contrast);
    font-size: 20px;
  }
`;

const RefreshIcon = styled(LuRefreshCw)`
  font-size: 20px;
  margin-left: 5px;
`;

interface Props {
  flightId: number;
  departureCode: string;
  arrivalCode: string;
  isLoading: boolean;
  flightDataIsChanging: boolean;
}
const WeatherBriefingSection = ({
  flightId,
  departureCode,
  arrivalCode,
  isLoading,
  flightDataIsChanging,
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

  const mutation = useWeatherBriefingRequest(flightId);

  const briefingData = queryClient.getQueryData<WeatherBriefingFromAPI | null>([
    "weatherBriefing",
    flightId,
  ]);

  useEffect(() => {
    if (
      (briefingData === null || briefingData === undefined) &&
      flightData &&
      legsData
    ) {
      refreshBriefing();
    }
  }, [
    isLoading,
    flightDataIsChanging,
    flightData?.departure_aerodrome_id,
    flightData?.arrival_aerodrome_id,
    flightData?.arrival_aerodrome_id,
  ]);

  console.log(briefingData);

  const refreshBriefing = () => {
    if (legsData && flightData && flightData.weather_hours_from_etd >= 0) {
      const etd = new Date(flightData.departure_time);
      const departure = {
        dateTime: flightData.departure_time,
        aerodrome: flightData.departure_aerodrome_is_private
          ? departureCode
          : undefined,
      };

      let elapsedFlightMinutes = 0;

      const legs: EnrouteRequest[] = flightData.legs.map((leg, idx) => {
        const legData =
          idx > 0
            ? legsData[idx - 1]
            : {
                time_to_climb_min: 0,
                time_enroute_min: 0,
              };
        elapsedFlightMinutes +=
          legData.time_to_climb_min + legData.time_enroute_min;
        const totalMinutes = etd.getTime() + elapsedFlightMinutes * 60000;
        const date = new Date(totalMinutes);
        return {
          dateTime: date.toISOString(),
          aerodromes: leg.briefing_aerodromes.map((a) => ({
            code: a.code,
            nauticalMilesFromPath: a.distance_from_target_nm,
          })),
        };
      });

      const legData = legsData[legsData.length - 1];
      elapsedFlightMinutes +=
        legData.time_to_climb_min + legData.time_enroute_min;
      elapsedFlightMinutes += flightData.added_enroute_time_hours * 60;
      const totalMinutes = etd.getTime() + elapsedFlightMinutes * 60000;
      const eta = new Date(totalMinutes);
      const arrival = {
        dateTime: eta.toISOString(),
        aerodrome: flightData.arrival_aerodrome_is_private
          ? arrivalCode
          : undefined,
      };

      const alternates: EnrouteRequest = {
        dateTime: eta.toISOString(),
        aerodromes: flightData.alternates.map((alternate) => ({
          code: alternate.code,
          nauticalMilesFromPath: alternate.distance_from_target_nm,
        })),
      };
      const data = { departure, legs, arrival, alternates };
      mutation.mutate(data);
    }
  };

  if (isLoading || mutation.isLoading)
    return (
      <HtmlLoaderContainer>
        <Loader />
        <p>Fetching Weather Data . . .</p>
      </HtmlLoaderContainer>
    );

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
  const headers = ["Weather Briefing"];
  if (briefingData) {
    headers.push(
      `Data from: ${formatUTCDate(
        briefingData.dateTime,
        true
      )} at ${formatUTCTime(briefingData.dateTime)}`
    );
  }
  headers.push(
    `Depart: ${departureCode} on ${etd}`,
    `Arrive: ${arrivalCode} on ${eta}`
  );

  return (
    <>
      <Button
        color="var(--color-primary-dark)"
        hoverColor="var(--color-grey-dark)"
        backgroundColor="var(--color-contrast)"
        backgroundHoverColor="var(--color-contrast-hover)"
        width="250px"
        height="45px"
        fontSize={18}
        shadow={false}
        spaceChildren="space-evenly"
        borderRadious={5}
        margin="20px 10px 0"
        onlyHover={true}
        handleClick={refreshBriefing}
      >
        Refresh Data
        <RefreshIcon />
      </Button>
      <PdfRenderer
        content={{
          headers,
          body: [],
        }}
      />
    </>
  );
};

export default WeatherBriefingSection;
