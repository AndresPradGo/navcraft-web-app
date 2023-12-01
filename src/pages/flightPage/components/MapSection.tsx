import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { MapContainer, TileLayer } from "react-leaflet";

import getDegreeCoordinates from "../../../utils/getDegreeCoordinates";
import { OfficialAerodromeDataFromAPI } from "../../../services/officialAerodromeClient";
import { FlightDataFromApi } from "../../../services/flightsClient";
import { styled } from "styled-components";

const HtmlContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 0 0px;
  overflow: hidden;
`;

interface Props {
  flightId: number;
  departureAerodrome: OfficialAerodromeDataFromAPI;
  arrivalAerodrome: OfficialAerodromeDataFromAPI;
}
const MapSection = ({
  flightId,
  departureAerodrome,
  arrivalAerodrome,
}: Props) => {
  const queryClient = useQueryClient();
  const flightData = queryClient.getQueryData<FlightDataFromApi>([
    "flight",
    flightId,
  ]);

  const [renderMap, setRenderMap] = useState(false);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setRenderMap((prev) => !prev);
    }, 500);

    return () => {
      clearTimeout(timeOut);
    };
  }, []);

  const midLeg = flightData
    ? flightData.legs[Math.floor(flightData.legs.length / 2)]
    : null;
  const midWaypoint = midLeg?.waypoint || departureAerodrome;

  const center = getDegreeCoordinates({
    lat_degrees: midWaypoint.lat_degrees,
    lat_minutes: midWaypoint.lat_minutes,
    lat_seconds: midWaypoint.lat_seconds,
    lat_direction: midWaypoint.lat_direction,
    lon_degrees: midWaypoint.lon_degrees,
    lon_minutes: midWaypoint.lon_minutes,
    lon_seconds: midWaypoint.lon_seconds,
    lon_direction: midWaypoint.lon_direction,
  });

  return (
    <HtmlContainer>
      {renderMap ? (
        <MapContainer
          center={center}
          zoom={7}
          scrollWheelZoom={true}
          minZoom={2}
          maxZoom={16}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>
      ) : null}
    </HtmlContainer>
  );
};

export default MapSection;
