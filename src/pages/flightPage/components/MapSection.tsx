import { useState, useEffect } from "react";
import { renderToString } from "react-dom/server";
import { useQueryClient } from "@tanstack/react-query";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import { BiTargetLock } from "react-icons/bi";
import { IoMdRadioButtonOn } from "react-icons/io";
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

const HtmlPopupMessage = styled.div`
  display: flex;
  flex-direction: column;

  & h2 {
    font-weight: bold;
    font-size: 16px;
    margin: 0;
    color: var(--color-nav-1-dark);
  }

  & h3 {
    font-size: 12px;
    margin: 0;
    color: var(--color-primary-dark);
  }
`;

const HtmlIcon = styled.div`
  width: 100%;
  height: 100%;
  font-size: 30px;
  font-weight: bold;

  & svg {
    width: 100%;
    height: 100%;
  }
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
                      iconSize: [30, 30],
                    })}
                    key={`showAerodromes-${a.code}`}
                    position={getDegreeCoordinates(a)}
                  >
                    <Popup offset={[0, 0]}>
                      <HtmlPopupMessage>
                        <h3>
                          <b>{`${a.code}: `}</b>
                          {`${a.name}`}
                        </h3>
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
                        <h3>
                          <b>{`${w.code}: `}</b>
                          {`${w.name}`}
                        </h3>
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
                        <h3>
                          <b>{`${a.code}: `}</b>
                          {`${a.name}`}
                        </h3>
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
                        <h3>
                          <b>{`${w.code}: `}</b>
                          {`${w.name}`}
                        </h3>
                      </HtmlPopupMessage>
                    </Popup>
                  </Marker>
                );
              })
            : null}
          <Marker
            icon={L.divIcon({
              className: "custom--icon",
              html: renderToString(
                <HtmlIcon style={{ color: "var(--color-nav-1-dark)" }}>
                  {<BiTargetLock />}
                </HtmlIcon>
              ),
              iconSize: [40, 40],
            })}
            position={getDegreeCoordinates(departureAerodrome)}
          >
            <Popup>
              <HtmlPopupMessage>
                <h2>Departure</h2>
                <h3>
                  <b>{`${departureAerodrome.code}: `}</b>
                  {`${departureAerodrome.name}`}
                </h3>
              </HtmlPopupMessage>
            </Popup>
          </Marker>
          <Marker
            icon={L.divIcon({
              className: "custom--icon",
              html: renderToString(
                <HtmlIcon style={{ color: "var(--color-nav-1-dark)" }}>
                  {<BiTargetLock />}
                </HtmlIcon>
              ),
              iconSize: [40, 40],
            })}
            position={getDegreeCoordinates(arrivalAerodrome)}
          >
            <Popup>
              <HtmlPopupMessage>
                <h2>Arrival</h2>
                <h3>
                  <b>{`${arrivalAerodrome.code}: `}</b>
                  {`${arrivalAerodrome.name}`}
                </h3>
              </HtmlPopupMessage>
            </Popup>
          </Marker>
          {legsData?.map((l, idx) => {
            const fromCoordinates = {
              lat: l.from_waypoint.latitude_degrees,
              lng: l.from_waypoint.longitude_degrees,
            };

            const toCoordinates = {
              lat: l.to_waypoint.latitude_degrees,
              lng: l.to_waypoint.longitude_degrees,
            };
            return (
              <Polyline
                key={`path-${idx}`}
                pathOptions={{ color: "var(--color-nav-2-dark)", weight: 4 }}
                positions={[fromCoordinates, toCoordinates]}
              />
            );
          })}
          {legsData?.map((l, idx) => {
            if (idx) {
              return (
                <Marker
                  key={`waypoint-${idx}`}
                  icon={L.divIcon({
                    className: "custom--icon",
                    html: renderToString(
                      <HtmlIcon style={{ color: "var(--color-nav-1-dark)" }}>
                        {<IoMdRadioButtonOn />}
                      </HtmlIcon>
                    ),
                    iconSize: [30, 30],
                  })}
                  position={{
                    lat: l.from_waypoint.latitude_degrees,
                    lng: l.from_waypoint.longitude_degrees,
                  }}
                >
                  <Popup>
                    <HtmlPopupMessage>
                      <h2>{`WP-${idx}`}</h2>
                      <h3>
                        <b>{`${l.from_waypoint.code}: `}</b>
                        {`${l.from_waypoint.name}`}
                      </h3>
                    </HtmlPopupMessage>
                  </Popup>
                </Marker>
              );
            } else return null;
          })}
        </MapContainer>
      ) : null}
    </HtmlContainer>
  );
};

export default MapSection;
