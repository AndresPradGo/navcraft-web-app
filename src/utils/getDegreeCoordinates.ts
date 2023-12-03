

interface Coordinate {
    lat_degrees: number;
    lat_minutes: number;
    lat_seconds: number;
    lat_direction: "N" | "S";
    lon_degrees: number;
    lon_minutes: number;
    lon_seconds: number;
    lon_direction: "E" | "W";
}

interface LatLngLiteral {
    lat: number;
    lng: number;
    alt?: number;
}

const getDegreeCoordinates = (coordinate: Coordinate, offset?: [number, number]): LatLngLiteral => {
  const direction = {N: 1, S: -1, E: 1, W: -1}

  let latitude = coordinate.lat_degrees 
  latitude += coordinate.lat_minutes / 60
  latitude += ((coordinate.lat_seconds ? coordinate.lat_seconds : 0) + (offset ? offset[0] : 0)) / 60 / 60
  latitude = Math.round(latitude * direction[coordinate.lat_direction] * 10000) / 10000

  let longitude = coordinate.lon_degrees 
  longitude += coordinate.lon_minutes / 60
  longitude += ((coordinate.lon_seconds ? coordinate.lon_seconds : 0) + (offset ? offset[1] : 0)) / 60 / 60
  longitude = Math.round(longitude * direction[coordinate.lon_direction] * 10000) / 10000

  return {
    lat: latitude,
    lng: longitude
  }
}

export default getDegreeCoordinates