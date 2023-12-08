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
import { BiTargetLock, BiSolidEditAlt } from "react-icons/bi";
import { GoDotFill } from "react-icons/go";
import { LuCircleDotDashed } from "react-icons/lu";
import { TbMapPinOff } from "react-icons/tb";
import L from "leaflet";
import { styled } from "styled-components";
import getDegreeCoordinates, {
  LatLngLiteral,
} from "../../../../utils/getDegreeCoordinates";
import { OfficialAerodromeDataFromAPI } from "../../../../services/officialAerodromeClient";
import { FlightDataFromApi } from "../../../../services/flightsClient";
import { NavLogLegData } from "../../hooks/useNavLogData";
import { VfrWaypointDataFromAPI } from "../../../../services/vfrWaypointClient";
import { WaypointDataFromAPI } from "../../../../services/userWaypointClient";
import {
  MapStateType,
  MapInputStyleType,
} from "../../../../components/SideBarMapOptions";
import Button from "../../../../components/common/button";
import { Modal, useModal } from "../../../../components/common/modal";
import NewMarker from "./NewMarker";
import DropMarkerForm from "./DropMarkerForm";
import getPath from "../../../../utils/getPath";
import useDeleteLeg from "../../hooks/useDeleteLeg";

const HtmlContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 0 0px;
  overflow: hidden;
`;

const HtmlPopupMessage = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 150px;

  & h2 {
    font-weight: bold;
    font-size: 16px;
    margin: 0;
    color: var(--color-highlight);
  }

  & h3 {
    font-size: 12px;
    margin: 0;
    color: var(--color-primary-dark);
  }

  & svg {
    font-size: 20px;
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
  handleEditDeparture: () => void;
  handleEditArrival: () => void;
}

const MapSection = ({
  mapState,
  markers,
  flightId,
  departureAerodrome,
  arrivalAerodrome,
  handleEditDeparture,
  handleEditArrival,
}: Props) => {
  const [focusLegIdx, setFocusLegIdx] = useState(-1);
  const [newWaypoint, setNewWaypoint] = useState<LatLngLiteral | null>(null);
  const [droppedMarker, setDroppedMarker] = useState<boolean>(false);

  const modal = useModal();
  const deleteMutation = useDeleteLeg(flightId);

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

  const userAerodromesToDisplay =
    aerodromes?.filter((a) => !a.registered) || [];

  const officialAerodromesToDisplay =
    aerodromes?.filter((a) => a.registered) || [];

  const vfrWaypointsToDisplay = vfrWaypoints || [];

  const userWaypointsToDisplay = userWaypoints || [];

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

  const path = getPath(departureAerodrome, flightData, arrivalAerodrome);

  return (
    <>
      <Modal isOpen={modal.isOpen} fullHeight={true}>
        <DropMarkerForm
          flightId={flightId}
          sequence={focusLegIdx + 1}
          latitude={newWaypoint ? newWaypoint.lat : center.lat}
          longitude={newWaypoint ? newWaypoint.lng : center.lng}
          closeModal={modal.handleClose}
          isOpen={modal.isOpen}
          restoreFlight={() => {
            setFocusLegIdx(-1);
            setNewWaypoint(null);
            setDroppedMarker(false);
          }}
        />
      </Modal>
      <HtmlContainer>
        {renderMap ? (
          <MapContainer
            dragging={true}
            center={center}
            zoom={zoomLevel}
            scrollWheelZoom={true}
            minZoom={2}
            maxZoom={16}
          >
            <NewMarker
              dropped={droppedMarker}
              handleMarkerDrop={() => {
                setDroppedMarker(true);
              }}
              openModal={modal.handleOpen}
              newWaypoint={newWaypoint}
              iconString={renderToString(
                <HtmlIcon style={{ color: "var(--color-nav-1)" }}>
                  {<LuCircleDotDashed />}
                </HtmlIcon>
              )}
              handleFocusLegIdx={setFocusLegIdx}
              handleNewWaypointCoordinates={setNewWaypoint}
            />
            <TileLayer
              attribution='&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/about" target="_blank">OpenStreetMap</a> contributors'
              url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
            />
            {mapState.showAerodromes
              ? officialAerodromesToDisplay.map((a) => {
                  const marker = markers.find(
                    (m) => m.key === "showAerodromes"
                  );
                  return (
                    <Marker
                      icon={L.divIcon({
                        className: "custom--icon",
                        html: renderToString(
                          <HtmlIcon
                            style={{ color: marker?.color, opacity: "0.6" }}
                          >
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
                          <HtmlIcon
                            style={{ color: marker?.color, opacity: "0.6" }}
                          >
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
                          <HtmlIcon
                            style={{ color: marker?.color, opacity: "0.6" }}
                          >
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
                          <HtmlIcon
                            style={{ color: marker?.color, opacity: "0.6" }}
                          >
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
              zIndexOffset={999}
              icon={L.divIcon({
                className: "custom--icon",
                html: renderToString(
                  <HtmlIcon style={{ color: "var(--color-nav-1)" }}>
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
                  <Button
                    color="var(--color-grey-bright)"
                    hoverColor="var(--color-white)"
                    backgroundColor="var(--color-primary-bright)"
                    backgroundHoverColor="var(--color-primary-light)"
                    borderRadious={40}
                    margin="10px 0 0"
                    alignSelf={"center"}
                    shadow={true}
                    handleClick={handleEditDeparture}
                    width="100px"
                  >
                    Edit
                    <BiSolidEditAlt />
                  </Button>
                </HtmlPopupMessage>
              </Popup>
            </Marker>
            <Marker
              zIndexOffset={999}
              icon={L.divIcon({
                className: "custom--icon",
                html: renderToString(
                  <HtmlIcon style={{ color: "var(--color-nav-1)" }}>
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
                  <Button
                    color="var(--color-grey-bright)"
                    hoverColor="var(--color-white)"
                    backgroundColor="var(--color-primary-bright)"
                    backgroundHoverColor="var(--color-primary-light)"
                    borderRadious={40}
                    margin="10px 0 0"
                    alignSelf={"center"}
                    shadow={true}
                    handleClick={handleEditArrival}
                    width="100px"
                  >
                    Edit
                    <BiSolidEditAlt />
                  </Button>
                </HtmlPopupMessage>
              </Popup>
            </Marker>
            {path?.map((leg, idx) => {
              const fromCoordinates = {
                lat: leg.from_waypoint.latitude_degrees,
                lng: leg.from_waypoint.longitude_degrees,
              };

              const toCoordinates = {
                lat: leg.to_waypoint.latitude_degrees,
                lng: leg.to_waypoint.longitude_degrees,
              };

              const midLegWaypoint =
                newWaypoint && focusLegIdx === idx ? newWaypoint : null;

              return (
                <Polyline
                  key={`path-${idx}`}
                  pathOptions={{
                    color: "var(--color-nav-2)",
                    weight: 6,
                  }}
                  positions={
                    midLegWaypoint
                      ? [fromCoordinates, midLegWaypoint, toCoordinates]
                      : [fromCoordinates, toCoordinates]
                  }
                  eventHandlers={{
                    mouseover: () => {
                      if (!(focusLegIdx + 1)) setFocusLegIdx(idx);
                    },
                    mouseout: () => {
                      if (focusLegIdx === idx && !newWaypoint)
                        setFocusLegIdx(-1);
                    },
                    click: (e) => {
                      setNewWaypoint({
                        lat: e.latlng.lat,
                        lng: e.latlng.lng,
                      });
                      setFocusLegIdx(idx);
                    },
                  }}
                />
              );
            })}
            {flightData?.legs.map((leg, idx) => {
              return leg.waypoint ? (
                <Marker
                  zIndexOffset={999}
                  key={`waypoint-${idx}`}
                  icon={L.divIcon({
                    className: "custom--icon",
                    html: renderToString(
                      <HtmlIcon style={{ color: "var(--color-nav-1)" }}>
                        {<GoDotFill />}
                      </HtmlIcon>
                    ),
                    iconSize: [30, 30],
                  })}
                  position={getDegreeCoordinates(leg.waypoint)}
                >
                  <Popup>
                    <HtmlPopupMessage>
                      <h2>{`WP-${idx + 1}`}</h2>
                      <h3>
                        <b>{`${leg.waypoint.code}: `}</b>
                        {`${leg.waypoint.name}`}
                      </h3>
                      <Button
                        color="var(--color-grey-bright)"
                        hoverColor="var(--color-white)"
                        backgroundColor="var(--color-warning)"
                        backgroundHoverColor="var(--color-warning-hover)"
                        borderRadious={40}
                        margin="10px 0 0"
                        alignSelf={"center"}
                        shadow={true}
                        handleClick={() => {
                          deleteMutation.mutate({
                            id: leg.id,
                            waypoint: leg.waypoint?.name || "",
                          });
                        }}
                        width="120px"
                      >
                        Remove
                        <TbMapPinOff />
                      </Button>
                    </HtmlPopupMessage>
                  </Popup>
                </Marker>
              ) : null;
            })}
          </MapContainer>
        ) : null}
      </HtmlContainer>
    </>
  );
};

export default MapSection;
