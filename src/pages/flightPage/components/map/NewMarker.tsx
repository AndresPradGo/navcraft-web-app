import { useMapEvents, Marker } from 'react-leaflet';
import L from 'leaflet';

import { LatLngLiteral } from '../../../../utils/getDegreeCoordinates';

interface Props {
  dropped: boolean;
  iconString: string;
  newWaypoint: LatLngLiteral | null;
  handleFocusLegIdx: (idx: number) => void;
  handleNewWaypointCoordinates: (waypoint: LatLngLiteral | null) => void;
  handleMarkerDrop: () => void;
  openModal: () => void;
}
const NewMarker = ({
  dropped,
  iconString,
  newWaypoint,
  handleFocusLegIdx,
  handleNewWaypointCoordinates,
  handleMarkerDrop,
  openModal,
}: Props) => {
  useMapEvents({
    click() {
      if (newWaypoint) {
        if (dropped) openModal();
        else {
          handleNewWaypointCoordinates(null);
          handleFocusLegIdx(-1);
        }
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
              if (dropped) openModal();
              else {
                handleNewWaypointCoordinates(null);
                handleFocusLegIdx(-1);
              }
            },
            dragend: (e: L.DragEndEvent) => {
              handleNewWaypointCoordinates({
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                lat: e.target._latlng.lat as number,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                lng: e.target._latlng.lng as number,
              });
              handleMarkerDrop();
              openModal();
            },
          }}
          zIndexOffset={999}
          key="newWaypoint"
          icon={L.divIcon({
            className: 'custom--icon',
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
