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
  NOTAMBriefingData,
  EnrouteRequest,
} from "../services/briefingClient";
import useNotamBriefingRequest from "../hooks/useNotamBriefingRequest";
import Loader from "../../../components/Loader";
import type { OfficialAerodromeDataFromAPI } from "../../../services/officialAerodromeClient";

const RefreshIcon = styled(LuRefreshCw)`
  font-size: 20px;
  margin-left: 5px;
`;

interface Props {
  flightId: number;
  departureAerodrome: OfficialAerodromeDataFromAPI;
  arrivalAerodrome: OfficialAerodromeDataFromAPI;
  isLoading: boolean;
  flightDataIsChanging: boolean;
}
const NotamsBriefingSection = ({
  flightId,
  departureAerodrome,
  arrivalAerodrome,
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
  const aerodromes = queryClient.getQueryData<OfficialAerodromeDataFromAPI[]>([
    "aerodromes",
    "all",
  ]);

  const mutation = useNotamBriefingRequest(flightId);

  const briefingData = queryClient.getQueryData<NOTAMBriefingData>([
    "notamBriefing",
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
        aerodrome: !flightData.departure_aerodrome_is_private
          ? departureAerodrome.code
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
        aerodrome: !flightData.arrival_aerodrome_is_private
          ? arrivalAerodrome.code
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
    return <Loader message="Fetching NOTAMs . . ." margin={50} />;

  if ((flightData?.weather_hours_from_etd || -1) < 0) {
    return (
      <FlightWarningList
        warnings={[
          [
            "NOTAMs are not available for past ETD date-times. To get a NOTAMs briefing, update the ETD to a future date.",
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
        `NOTAMs briefing on ${formatUTCDate(
          briefingData.dateTime,
          true
        )} at ${formatUTCTime(briefingData.dateTime)}`
      );
    }
    headers.push(
      `Departure: ${departureAerodrome.code} on ${etd}`,
      `Arrival: ${arrivalAerodrome.code} on ${eta}`
    );

    return headers;
  };

  const renderDepartureAerodrome = (body: PdfBodySection[]) => {
    body.push({
      components: [{ type: "title1", content: "Departure" }],
      margin: "0 0 20px",
    });

    body.push({
      components: [
        {
          type: "title2",
          content: `${departureAerodrome?.name} (${departureAerodrome?.code})`,
          margin: "5px 0",
        },
      ],
      wrap: true,
      margin: "0 0 0",
    });

    if (!departureAerodrome.registered) {
      body[body.length - 1].components.push({
        type: "text",
        content: `${departureAerodrome?.name}, is not an official aerodormes, so NOTAMs are not published for this aerodrome.`,
      });
    } else if (briefingData && briefingData !== "error") {
      const notams = briefingData.notams.filter(
        (notam) =>
          notam.aerodromes.length === 1 &&
          notam.aerodromes[0].code === departureAerodrome.code
      );
      if (notams.length === 0) {
        body[body.length - 1].components.push({
          type: "text",
          content: `Currently there are no published NOTAMs for ${departureAerodrome?.name}, that could affect this flight.`,
        });
      } else {
        notams.forEach((notam) => {
          body.push({
            components: [
              {
                type: "report",
                content: notam.data,
                margin: "0",
              },
              {
                type: "text",
                content:
                  "_____________________________________________________________________________",
                margin: "0",
              },
            ],
            margin: "10px 0 20px",
            wrap: true,
          });
        });
      }
    }
  };

  const renderArrivalAerodrome = (body: PdfBodySection[]) => {
    body.push({
      components: [{ type: "title1", content: "Arrival" }],
      margin: "0 0 20px",
      break: true,
    });

    body.push({
      components: [
        {
          type: "title2",
          content: `${arrivalAerodrome?.name} (${arrivalAerodrome?.code})`,
          margin: "5px 0",
        },
      ],
      wrap: true,
      margin: "0 0 0",
    });

    if (!arrivalAerodrome.registered) {
      body[body.length - 1].components.push({
        type: "text",
        content: `${arrivalAerodrome?.name}, is not an official aerodormes, so NOTAMs are not published for this aerodrome.`,
      });
    } else if (briefingData && briefingData !== "error") {
      const notams = briefingData.notams.filter(
        (notam) =>
          notam.aerodromes.length === 1 &&
          notam.aerodromes[0].code === arrivalAerodrome.code
      );
      if (notams.length === 0) {
        body[body.length - 1].components.push({
          type: "text",
          content: `Currently there are no published NOTAMs for ${arrivalAerodrome?.name}, that could affect this flight.`,
        });
      } else {
        notams.forEach((notam) => {
          body.push({
            components: [
              {
                type: "report",
                content: notam.data,
                margin: "0",
              },
              {
                type: "text",
                content:
                  "_____________________________________________________________________________",
                margin: "0",
              },
            ],
            margin: "10px 0 20px",
            wrap: true,
          });
        });
      }
    }
  };

  const renderAlternates = (body: PdfBodySection[]) => {
    body.push({
      components: [{ type: "title1", content: "Alternates" }],
      margin: "0",
      break: true,
    });

    if (
      flightData &&
      flightData?.alternates &&
      flightData.alternates.length > 0 &&
      briefingData &&
      briefingData !== "error" &&
      aerodromes
    ) {
      flightData.alternates.forEach((item) => {
        const notams = briefingData.notams.filter(
          (notam) =>
            notam.aerodromes.length === 1 &&
            notam.aerodromes[0].code === item.code
        );
        const aerodrome = aerodromes.find((a) => a.code === item.code);

        body.push({
          components: [
            {
              type: "title2",
              content: `${aerodrome?.name} (${aerodrome?.code})`,
              margin: "20px 0 0",
            },
          ],
          wrap: true,
          margin: notams.length === 0 ? "0 0 5px" : "0",
        });
        if (notams.length === 0) {
          body[body.length - 1].components.push({
            type: "text",
            content: `Currently there are no published NOTAMs for ${aerodrome?.name}, that could affect this flight.`,
          });
        } else {
          notams.forEach((notam) => {
            body.push({
              components: [
                {
                  type: "report",
                  content: notam.data,
                  margin: "0",
                },
                {
                  type: "text",
                  content:
                    "_____________________________________________________________________________",
                  margin: "0",
                },
              ],
              margin: "10px 0 20px",
              wrap: true,
            });
          });
        }
      });
    } else {
      body[body.length - 1].components.push({
        type: "text",
        content: "There are no alternate options available for this flight.",
      });
    }
  };

  const renderEnroute = (body: PdfBodySection[]) => {
    if (
      flightData &&
      flightData.legs.reduce(
        (sum, leg) => sum + leg.briefing_aerodromes.length,
        0
      ) > 0 &&
      briefingData &&
      briefingData !== "error" &&
      aerodromes
    ) {
      body.push({
        components: [{ type: "title1", content: "Enroute" }],
        margin: "0",
        break: true,
      });
      flightData.legs.forEach((leg) => {
        leg.briefing_aerodromes.forEach((item) => {
          const notams = briefingData.notams.filter(
            (notam) =>
              notam.aerodromes.length === 1 &&
              notam.aerodromes[0].code.includes(item.code)
          );
          const aerodrome = aerodromes.find((a) => a.code === item.code);

          body.push({
            components: [
              {
                type: "title2",
                content: `${aerodrome?.name} (${aerodrome?.code})`,
                margin: "20px 0 0",
              },
            ],
            wrap: true,
            margin: notams.length === 0 ? "0 0 5px" : "0",
          });
          if (notams.length === 0) {
            body[body.length - 1].components.push({
              type: "text",
              content: `Currently there are no published NOTAMs for ${aerodrome?.name}, that could affect this flight.`,
            });
          } else {
            notams.forEach((notam) => {
              body.push({
                components: [
                  {
                    type: "report",
                    content: notam.data,
                    margin: "0",
                  },
                  {
                    type: "text",
                    content:
                      "_____________________________________________________________________________",
                    margin: "0",
                  },
                ],
                margin: "10px 0 20px",
                wrap: true,
              });
            });
          }
        });
      });
    }
  };

  const renderOtherStations = (body: PdfBodySection[]) => {
    if (
      flightData &&
      flightData?.alternates &&
      briefingData &&
      briefingData !== "error" &&
      aerodromes
    ) {
      const notams = briefingData.notams.filter(
        (notam) => notam.aerodromes.length > 1
      );
      if (notams.length > 0) {
        body.push({
          components: [{ type: "title1", content: "Other Stations" }],
          margin: "0",
          break: true,
        });
        body[body.length - 1].components.push({
          type: "text",
          content:
            "Other stations include FIRs, NAVAIDs or other nearby aerodromes with NOTAMs that may affect more than one aerodrome along the route of the flight.",
        });

        notams.forEach((notam) => {
          body.push({
            components: [
              {
                type: "report",
                content: notam.data,
                margin: "0",
              },
              {
                type: "text",
                content:
                  "_____________________________________________________________________________",
                margin: "0",
              },
            ],
            margin: "10px 0 20px",
            wrap: true,
          });
        });
      }
    }
  };

  const renderBody = (): PdfBodySection[] => {
    const noDataMessage =
      "Unable to fetch weather data at the moment. This may be a problem with the Nav Canada website, or with our servers. While we look into it, visit the NavCanada website: https://plan.navcanada.ca/wxrecall/";
    const body: PdfBodySection[] = [
      { components: [{ type: "text", content: noDataMessage }] },
    ];

    if (briefingData && briefingData !== "error" && flightData && legsData) {
      body.splice(0);
      renderDepartureAerodrome(body);
      renderEnroute(body);
      renderArrivalAerodrome(body);
      renderAlternates(body);
      renderOtherStations(body);
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

export default NotamsBriefingSection;
