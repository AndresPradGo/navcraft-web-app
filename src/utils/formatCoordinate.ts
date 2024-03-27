import { CoordinateDataType } from '../pages/flightPage/components/map/DropMarkerForm';

const formatCoordinate = (lat: number, lon: number): CoordinateDataType => {
  const latDegreesNotRounded = Math.abs(lat);
  const lat_degrees = Math.floor(latDegreesNotRounded);
  const latMinutesNotRounded = (latDegreesNotRounded - lat_degrees) * 60;
  const lat_minutes = Math.floor(latMinutesNotRounded);

  const lonDegreesNotRounded = Math.abs(lon);
  const lon_degrees = Math.floor(lonDegreesNotRounded);
  const lonMinutesNotRounded = (lonDegreesNotRounded - lon_degrees) * 60;
  const lon_minutes = Math.floor(lonMinutesNotRounded);

  return {
    lat_degrees,
    lat_minutes,
    lat_seconds: Math.round((latMinutesNotRounded - lat_minutes) * 60),
    lat_direction: lat >= 0 ? 'N' : 'S',
    lon_degrees,
    lon_minutes,
    lon_seconds: Math.round((lonMinutesNotRounded - lon_minutes) * 60),
    lon_direction: lon >= 0 ? 'E' : 'W',
  };
};

export default formatCoordinate;
