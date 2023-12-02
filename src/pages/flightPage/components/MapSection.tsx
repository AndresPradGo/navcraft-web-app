import { useState, useEffect } from "react";
import { renderToString } from "react-dom/server";
import { useQueryClient } from "@tanstack/react-query";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { styled } from "styled-components";

import getDegreeCoordinates from "../../../utils/getDegreeCoordinates";
import { OfficialAerodromeDataFromAPI } from "../../../services/officialAerodromeClient";
import { FlightDataFromApi } from "../../../services/flightsClient";
import { NavLogLegData } from "../hooks/useNavLogData";
import { VfrWaypointDataFromAPI } from "../../../services/vfrWaypointClient";
import { WaypointDataFromAPI } from "../../../services/userWaypointClient";
import {
  MapStateType,
  MapInputStyleType,
} from "../../../components/SideBarMapOptions";

const HtmlContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 0 0px;
  overflow: hidden;
`;

const HtmlPopupMessage = styled.h2`
  color: var(--color-primary-dark);
`;

const HtmlIcon = styled.span`
  width: 100%;
  height: 100%;
  font-size: 30px;
  font-weight: bold;
`;

interface Props {
  mapState: MapStateType;
  markers: MapInputStyleType[];
  flightId: number;
  departureAerodrome: OfficialAerodromeDataFromAPI;
  arrivalAerodrome: OfficialAerodromeDataFromAPI;
}
const MapSection = ({
  mapState,
  markers,
  flightId,
  departureAerodrome,
  arrivalAerodrome,
}: Props) => {
  const queryClient = useQueryClient();
  const flightData = queryClient.getQueryData<FlightDataFromApi>([
    "flight",
    flightId,
  ]);

  const aerodromes = queryClient.getQueryData<OfficialAerodromeDataFromAPI[]>([
    "aerodromes",
    "all",
  ]);

  const vfrWaypoints = queryClient.getQueryData<VfrWaypointDataFromAPI[]>([
    "waypoints",
    "vfr",
  ]);

  const userWaypoints = queryClient.getQueryData<WaypointDataFromAPI[]>([
    "waypoints",
    "user",
  ]);

  const legsData = queryClient.getQueryData<NavLogLegData[]>([
    "navLog",
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

  const flightWaypoints = new Set(
    (legsData?.map((l) => l.from_waypoint.code) || []).concat(
      legsData?.map((l) => l.to_waypoint.code) || []
    )
  );

  const userAerodromesToDisplay =
    aerodromes?.filter((a) => !a.registered && !flightWaypoints.has(a.code)) ||
    [];

  const officialAerodromesToDisplay =
    aerodromes?.filter((a) => a.registered && !flightWaypoints.has(a.code)) ||
    [];

  const vfrWaypointsToDisplay =
    vfrWaypoints?.filter((w) => !flightWaypoints.has(w.code)) || [];

  const userWaypointsToDisplay =
    userWaypoints?.filter((w) => !flightWaypoints.has(w.code)) || [];

  const midLeg = flightData
    ? flightData.legs[Math.floor(flightData.legs.length / 2)]
    : null;
  const midWaypoint = midLeg?.waypoint || departureAerodrome;

  const center = getDegreeCoordinates(midWaypoint);
  const totalDistance = legsData
    ? legsData.reduce((sum, obj) => sum + obj.total_distance, 0)
    : 0;
  const zoomLevel = Math.round(
    Math.log2(
      (40008000 * Math.cos((center.lat * Math.PI) / 180)) / (totalDistance / 2)
    ) - 11
  );

  return (
    <HtmlContainer>
      {renderMap ? (
        <MapContainer
          center={center}
          zoom={zoomLevel}
          scrollWheelZoom={true}
          minZoom={2}
          maxZoom={16}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {mapState.showAerodromes
            ? officialAerodromesToDisplay.map((a) => {
                const marker = markers.find((m) => m.key === "showAerodromes");
                return (
                  <Marker
                    icon={L.divIcon({
                      className: "custom--icon",
                      html: renderToString(
                        <HtmlIcon style={{ color: marker?.color }}>
                          {marker?.icon}
                        </HtmlIcon>
                      ),
                      iconSize: [45, 45],
                    })}
                    key={`showAerodromes-${a.code}`}
                    position={getDegreeCoordinates(a)}
                  >
                    <Popup offset={[-6.7, 0]}>
                      <HtmlPopupMessage>
                        <b>{`${a.code}: `}</b>
                        {`${a.name}`}
                      </HtmlPopupMessage>
                    </Popup>
                  </Marker>
                );
              })
            : null}
          {mapState.showVfrWaypoints
            ? vfrWaypointsToDisplay.map((w) => {
                const marker = markers.find(
                  (m) => m.key === "showVfrWaypoints"
                );
                return (
                  <Marker
                    icon={L.divIcon({
                      className: "custom--icon",
                      html: renderToString(
                        <HtmlIcon style={{ color: marker?.color }}>
                          {marker?.icon}
                        </HtmlIcon>
                      ),
                      iconSize: [30, 30],
                    })}
                    key={`showVfrWaypoints-${w.code}`}
                    position={getDegreeCoordinates(w)}
                  >
                    <Popup>
                      <HtmlPopupMessage>
                        <b>{`${w.code}: `}</b>
                        {`${w.name}`}
                      </HtmlPopupMessage>
                    </Popup>
                  </Marker>
                );
              })
            : null}
          {mapState.showSavedAerodromes
            ? userAerodromesToDisplay.map((a) => {
                const marker = markers.find(
                  (m) => m.key === "showSavedAerodromes"
                );
                return (
                  <Marker
                    icon={L.divIcon({
                      className: "custom--icon",
                      html: renderToString(
                        <HtmlIcon style={{ color: marker?.color }}>
                          {marker?.icon}
                        </HtmlIcon>
                      ),
                      iconSize: [30, 30],
                    })}
                    key={`showSavedAerodromes-${a.code}`}
                    position={getDegreeCoordinates(a)}
                  >
                    <Popup>
                      <HtmlPopupMessage>
                        <b>{`${a.code}: `}</b>
                        {`${a.name}`}
                      </HtmlPopupMessage>
                    </Popup>
                  </Marker>
                );
              })
            : null}
          {mapState.showSavedWaypoints
            ? userWaypointsToDisplay.map((w) => {
                const marker = markers.find(
                  (m) => m.key === "showSavedWaypoints"
                );
                return (
                  <Marker
                    icon={L.divIcon({
                      className: "custom--icon",
                      html: renderToString(
                        <HtmlIcon style={{ color: marker?.color }}>
                          {marker?.icon}
                        </HtmlIcon>
                      ),
                      iconSize: [30, 30],
                    })}
                    key={`showSavedWaypoints-${w.code}`}
                    position={getDegreeCoordinates(w)}
                  >
                    <Popup>
                      <HtmlPopupMessage>
                        <b>{`${w.code}: `}</b>
                        {`${w.name}`}
                      </HtmlPopupMessage>
                    </Popup>
                  </Marker>
                );
              })
            : null}
        </MapContainer>
      ) : null}
    </HtmlContainer>
  );
};

export default MapSection;
