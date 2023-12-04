import { useMapEvents, Marker } from "react-leaflet";
import L from "leaflet";

import { LatLngLiteral } from "../../../../utils/getDegreeCoordinates";

interface Props {
  iconString: string;
  newWaypoint: LatLngLiteral | null;
  handleFocusLegIdx: (idx: number) => void;
  handleNewWaypointCoordinates: (waypoint: LatLngLiteral | null) => void;
  handleMarkerDrop: () => void;
}
const NewMarker = ({
  iconString,
  newWaypoint,
  handleFocusLegIdx,
  handleNewWaypointCoordinates,
  handleMarkerDrop,
}: Props) => {
  const map = useMapEvents({
    click() {
      if (newWaypoint) {
        handleNewWaypointCoordinates(null);
        handleFocusLegIdx(-1);
      }
    },
  });

  return (
    <>
      {newWaypoint ? (
        <Marker
          draggable={true}
          eventHandlers={{
            click: () => {
              handleFocusLegIdx(-1);
              handleNewWaypointCoordinates(null);
            },
            dragend: (e) => {
              handleNewWaypointCoordinates({
                lat: e.target._latlng.lat,
                lng: e.target._latlng.lng,
              });
              handleMarkerDrop();
            },
          }}
          zIndexOffset={999}
          key="newWaypoint"
          icon={L.divIcon({
            className: "custom--icon",
            html: iconString,
            iconSize: [40, 40],
          })}
          position={{
            lat: newWaypoint.lat,
            lng: newWaypoint.lng,
          }}
        ></Marker>
      ) : null}
    </>
  );
};

export default NewMarker;
