import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { LuRefreshCw } from "react-icons/lu";
import { styled } from "styled-components";

import type { FlightDataFromApi } from "../../../services/flightClient";
import type { NavLogLegData } from "../hooks/useNavLogData";
import FlightWarningList from "../../../components/FlightWarningList";
import PdfRenderer from "../../../components/common/pdfRenderer";
import type { PdfBodySection } from "../../../components/common/pdfRenderer";
import formatUTCDate from "../../../utils/formatUTCDate";
import formatUTCTime from "../../../utils/formatUTCTime";
import type {
  WeatherBriefingData,
  EnrouteRequest,
  PIREPType,
} from "../services/briefingClient";
import useWeatherBriefingRequest from "../hooks/useWeatherBriefingRequest";
import Loader from "../../../components/Loader";

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

  const briefingData = queryClient.getQueryData<WeatherBriefingData>([
    "weatherBriefing",
    flightId,
  ]);

  useEffect(() => {
    if (
      briefingData === "null" &&
      !mutation.isLoading &&
      !isLoading &&
      flightData &&
      legsData
    ) {
      refreshBriefing();
    }
  }, [isLoading, flightDataIsChanging]);

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

  if (
    isLoading ||
    mutation.isLoading ||
    briefingData === "mutating" ||
    briefingData === "null"
  )
    return <Loader message="Fetching weather data . . ." margin={50} />;

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

  const renderHeaders = (): string[] => {
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
    const headers = [];
    if (briefingData && briefingData !== "error") {
      headers.push(
        `Weather Briefed on ${formatUTCDate(
          briefingData.dateTime,
          true
        )} at ${formatUTCTime(briefingData.dateTime)}`
      );
    }
    headers.push(
      `Departure: ${departureCode} on ${etd}`,
      `Arrival: ${arrivalCode} on ${eta}`
    );

    return headers;
  };

  const renderPIREPs = (pirep: PIREPType) => {
    const pdfPirep = {
      components: [
        {
          type: "text",
          content: `Issued on ${formatUTCDate(
            pirep.dateFrom,
            true
          )} - ${formatUTCTime(pirep.dateFrom)}`
            .concat(
              pirep.location && !pirep.geometryWarning
                ? `, over ${pirep.location}`
                : ""
            )
            .concat(pirep.ftASL ? ` at ${pirep.ftASL} ft ASL.` : "."),
        },
      ],
      margin: "20px 0 10px",
      wrap: true,
    };
    if (pirep.aircraft)
      pdfPirep.components.push({
        type: "bulletpoint",
        content: `\u2022 \t Aircraft type: ${pirep.aircraft}`,
      });
    if (pirep.clouds)
      pdfPirep.components.push({
        type: "bulletpoint",
        content: `\u2022 \t Clouds: ${pirep.clouds}`,
      });
    if (pirep.temperature)
      pdfPirep.components.push({
        type: "bulletpoint",
        content: `\u2022 \t Temperature: ${pirep.temperature}\u00B0C`,
      });
    if (pirep.wind)
      pdfPirep.components.push({
        type: "bulletpoint",
        content: `\u2022 \t Wind: ${pirep.wind}`,
      });
    if (pirep.turbulence)
      pdfPirep.components.push({
        type: "bulletpoint",
        content: `\u2022 \t Turbulence: ${pirep.turbulence}`,
      });
    if (pirep.icing)
      pdfPirep.components.push({
        type: "bulletpoint",
        content: `\u2022 \t Icing: ${pirep.icing}`,
      });
    if (pirep.remarks)
      pdfPirep.components.push({
        type: "bulletpoint",
        content: `\u2022 \t Remarks: ${pirep.remarks}`,
      });
    pdfPirep.components.push({ type: "report", content: pirep.data });
  };

  const renderRegions = (body: PdfBodySection[], etd: Date, eta: Date) => {
    if (briefingData && briefingData !== "error") {
      briefingData.regions.forEach((region) => {
        // Add Title
        body.push({
          components: [{ type: "title2", content: region.region }],
          margin: "10px 0 0",
        });

        // Add GFAs
        region.weatherGraphs
          .map((g) => ({ ...g, isWeather: true }))
          .concat(region.iceGraphs.map((g) => ({ ...g, isWeather: false })))
          .forEach((gfa) => {
            const dateFrom = new Date(gfa.validAt);
            const dateTo = new Date(
              dateFrom.getTime() + (gfa.hoursSpan * 60 - 1) * 60000
            );
            const timeFrom = formatUTCTime(gfa.validAt);

            let type: "image" | "contrastImage" | "highlightImage" = "image";
            let message = "";
            if (dateFrom <= etd) {
              if (dateTo >= eta) {
                type = "contrastImage";
                message =
                  "The whole flight is performed within this GFA's time frame";
              } else if (dateTo >= etd) {
                type = "highlightImage";
                message =
                  "A portion of the flight is performed within this GFA's time frame";
              }
            } else if (dateFrom <= eta) {
              type = "highlightImage";
              message =
                "A portion of the flight is performed within this GFA's time frame";
            }

            body.push({
              components: [
                {
                  type: "title3",
                  content: gfa.isWeather
                    ? `Clouds & Weather ${timeFrom}`
                    : `Icing, Turbulence & Freezing level ${timeFrom}`,
                },
                {
                  type: "text",
                  content: `Valid from ${formatUTCDate(
                    gfa.validAt,
                    true
                  )} at ${timeFrom} to ${formatUTCDate(
                    dateTo,
                    true
                  )} at ${formatUTCTime(dateTo)}. ${message}`,
                },
                { type, content: gfa.src },
              ],
            });
          });

        // Add AIRMETs
        if (region.airmets.length > 0) {
          body.push({
            components: [{ type: "title3", content: "AIRMETs" }],
            margin: "30px 0 0",
          });
        }
        region.airmets.forEach((airmet) => {
          body.push({
            components: [
              {
                type: "text",
                content: `Valid ${formatUTCDate(
                  airmet.dateFrom,
                  true
                )} at ${formatUTCTime(airmet.dateFrom)}`.concat(
                  airmet.dateTo
                    ? ` to ${formatUTCDate(
                        airmet.dateTo as Date | string,
                        true
                      )} at ${formatUTCTime(airmet.dateTo as Date | string)}.`
                    : "."
                ),
              },
              { type: "report", content: airmet.data },
            ],
            margin: "20px 0 10px",
            wrap: true,
          });
        });

        // Add SIGMETs
        if (region.sigmets.length > 0) {
          body.push({
            components: [{ type: "title3", content: "SIGMETs" }],
            margin: "30px 0 0",
          });
        }
        region.sigmets.forEach((sigmet) => {
          body.push({
            components: [
              {
                type: "text",
                content: `Valid ${formatUTCDate(
                  sigmet.dateFrom,
                  true
                )} at ${formatUTCTime(sigmet.dateFrom)}`.concat(
                  sigmet.dateTo
                    ? ` to ${formatUTCDate(
                        sigmet.dateTo as Date | string,
                        true
                      )} at ${formatUTCTime(sigmet.dateTo as Date | string)}.`
                    : "."
                ),
              },
              { type: "report", content: sigmet.data },
            ],
            margin: "20px 0 10px",
            wrap: true,
          });
        });

        // Add Urgent PIREPs
        if (region.pireps.filter((p) => p.isUrgent).length > 0) {
          body.push({
            components: [{ type: "title3", content: "Urgent Priority PIREPs" }],
            margin: "30px 0 0",
          });
        }
        region.pireps.filter((p) => p.isUrgent).forEach(renderPIREPs);

        // Add PIREPs
        if (region.pireps.filter((p) => !p.isUrgent).length > 0) {
          body.push({
            components: [
              { type: "title3", content: "Regular Priority PIREPs" },
            ],
            margin: "30px 0 0",
          });
        }
        region.pireps.filter((p) => !p.isUrgent).forEach(renderPIREPs);
      });
    }
  };

  const renderBody = (): PdfBodySection[] => {
    const noDataMessage =
      "Unable to fetch weather data at the moment. This may be a problem with the Nav Canada website, or with our servers. While we look into it, visit the NavCanada website: https://plan.navcanada.ca/wxrecall/";
    const body: PdfBodySection[] = [
      { components: [{ type: "text", content: noDataMessage }] },
    ];

    if (briefingData && briefingData !== "error" && flightData && legsData) {
      const etd = new Date(flightData.departure_time);
      const elapsedMinutes =
        legsData.reduce(
          (sum, leg) => sum + leg.time_to_climb_min + leg.time_enroute_min,
          0
        ) +
        flightData.added_enroute_time_hours * 60;
      const eta = new Date(etd.getTime() + elapsedMinutes * 60000);

      body.splice(0);
      body.push({ components: [{ type: "title1", content: "Regions" }] });
      renderRegions(body, etd, eta);
    }

    return body;
  };

  return (
    <>
      {legsData && legsData.find((l) => l.total_distance > 150) ? (
        <FlightWarningList
          warnings={[
            [
              "Enroute Briefing radius will not work for legs that are longer than 150 NM.",
            ],
          ]}
        />
      ) : null}
      <PdfRenderer
        content={{
          headers: renderHeaders(),
          body: renderBody(),
        }}
        btnText={
          <>
            Refresh Data
            <RefreshIcon />
          </>
        }
        handleBtnClick={refreshBriefing}
      />
    </>
  );
};

export default WeatherBriefingSection;
