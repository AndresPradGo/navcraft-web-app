import { LuCircleDotDashed } from "react-icons/lu";
import {
  PiMapPinDuotone,
  PiChartPolarDuotone,
  PiCircleDuotone,
} from "react-icons/pi";
import { RiMapPinUserFill } from "react-icons/ri";
import { styled } from "styled-components";

import { NearbyWaypointType } from "./DropMarkerForm";
import getDegreeCoordinates, {
  LatLngLiteral,
} from "../../../../utils/getDegreeCoordinates";

const HtmlContainer = styled.div`
  align-self: center;
  width: 100%;
  color: var(--color-grey-bright);
  background-color: var(--color-primary-dark);
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: nowrap;
  padding: 0 10px 10px;
  margin: 10px 0 2px;
  border: 1px solid var(--color-grey);
  border-radius: 3px;
  flex-shrink: 0;

  & h3 {
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 14px;
    align-self: flex-start;
    margin: 20px 10px 10px;
    color: var(--color-grey);
  }
`;

interface WaypointTagProps {
  $selected: boolean;
}
const HtmlWaypointTag = styled.div<WaypointTagProps>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  margin: 5px 0;
  padding: 10px;
  border: 1px solid
    ${(props) => (props.$selected ? "var(--color-white)" : "var(--color-grey)")};
  background-color: ${(props) =>
    props.$selected
      ? "var(--color-primary-light)"
      : "var(--color-primary-bright)"};
  cursor: ${(props) => (props.$selected ? "default" : "pointer")};
  border-radius: 3px;

  &:hover {
    background-color: var(--color-primary-light);

    & span i:last-of-type {
      color: var(--color-grey-bright);
    }
  }

  & span {
    display: flex;
    flex-direction: column;
    margin-left: 20px;

    & i:first-of-type {
      font-size: 16px;
      color: var(--color-white);
    }

    & i:last-of-type {
      font-size: 12px;
      color: ${(props) =>
        props.$selected ? "var(--color-grey-bright)" : "var(--color-grey)"};
    }
  }
`;

const LocationIcon = styled(LuCircleDotDashed)`
  color: var(--color-nav-1);
  font-size: 35px;
  flex-shrink: 0;
`;

const AerodromeIcon = styled(PiChartPolarDuotone)`
  color: var(--color-nav-3);
  font-size: 35px;
  flex-shrink: 0;
`;

const WaypointIcon = styled(PiMapPinDuotone)`
  color: var(--color-nav-4);
  font-size: 35px;
  margin: 0 100p 0 0
  flex-shrink: 0;
`;

const UserAerodromeIcon = styled(PiCircleDuotone)`
  color: var(--color-nav-3);
  font-size: 35px;
  flex-shrink: 0;
`;

const UserWaypointIcon = styled(RiMapPinUserFill)`
color: var(--color-nav-4);
  font-size: 35px;
  flex-shrink: 0;
  }
`;

interface Props {
  latitude: number;
  longitude: number;
  waypoints: NearbyWaypointType[];
  selectedId: number | null;
  handleSelectedId: (id: number) => void;
}

const WaypointsList = ({
  latitude,
  longitude,
  waypoints,
  selectedId,
  handleSelectedId,
}: Props) => {
  const styleCoordinates = (coordinate: LatLngLiteral): string => {
    const styledLat = Math.round(Math.abs(coordinate.lat) * 100) / 100;
    const latDir = coordinate.lat >= 0 ? "N" : "S";

    const styledLng = Math.round(Math.abs(coordinate.lng) * 100) / 100;
    const lngDir = coordinate.lng >= 0 ? "E" : "W";

    return `${latDir}${styledLat}\u00B0 / ${lngDir}${styledLng}\u00B0`;
  };
  return (
    <HtmlContainer>
      <h3>Location:</h3>
      <HtmlWaypointTag
        $selected={selectedId === 0}
        onClick={() => {
          handleSelectedId(0);
        }}
      >
        <LocationIcon />
        <span>
          <i>{styleCoordinates({ lat: latitude, lng: longitude })}</i>
          <i></i>
        </span>
      </HtmlWaypointTag>
      <h3>Nearby:</h3>
      {waypoints.map((w) => {
        return (
          <HtmlWaypointTag
            key={w.id}
            $selected={selectedId === w.id}
            onClick={() => {
              handleSelectedId(w.id);
            }}
          >
            {w.type === "aerodrome" ? (
              <AerodromeIcon />
            ) : w.type === "waypoint" ? (
              <WaypointIcon />
            ) : w.type === "user aerodrome" ? (
              <UserAerodromeIcon />
            ) : (
              <UserWaypointIcon />
            )}
            <span>
              <i>{`${w.code}: ${w.name}`}</i>
              <i>{`${styleCoordinates(
                getDegreeCoordinates(w)
              )} (${w.distance.toFixed(1)}nm away)`}</i>
            </span>
          </HtmlWaypointTag>
        );
      })}
    </HtmlContainer>
  );
};

export default WaypointsList;
