import { OfficialAerodromeDataFromAPI } from "../services/officialAerodromeClient";
import { FlightDataFromApi } from "../services/flightClient";
import getDegreeCoordinates from "./getDegreeCoordinates"


interface WaypointType {
  id: number
  code: string,
  name: string,
  latitude_degrees: number,
  longitude_degrees: number,
  from_user_waypoint: boolean,
  from_vfr_waypoint: boolean
}

interface ReturnType {
  from_waypoint: WaypointType
  to_waypoint: WaypointType
}

const getPath = (
  departureAerodrome: OfficialAerodromeDataFromAPI, 
  flightData: FlightDataFromApi | undefined, 
  arrivalAerodrome: OfficialAerodromeDataFromAPI
): ReturnType[] => {

    let degreeCoordinates = getDegreeCoordinates(departureAerodrome)
    const path = [{
      from_waypoint: {
        id: departureAerodrome.id,
        code: departureAerodrome.code,
        name: departureAerodrome.name,
        latitude_degrees: degreeCoordinates.lat,
        longitude_degrees: degreeCoordinates.lng,
        from_user_waypoint: !departureAerodrome.registered,
        from_vfr_waypoint: departureAerodrome.registered
      },
      to_waypoint: {
        id: 0,
        code: "",
        name: "",
        latitude_degrees: 0,
        longitude_degrees: 0,
        from_user_waypoint: false,
from_vfr_waypoint: false
      },
    }]
  
    if (flightData) {
      for (let i = 0; i < flightData.legs.length; i++) {
        const waypoint = flightData.legs[i].waypoint
        if(waypoint) {
          degreeCoordinates = getDegreeCoordinates(waypoint)
          path[i].to_waypoint = {
            id: waypoint.id,
            code: waypoint.code,
            name: waypoint.name,
            latitude_degrees: degreeCoordinates.lat,
            longitude_degrees: degreeCoordinates.lng,
            from_user_waypoint: waypoint.from_user_waypoint,
from_vfr_waypoint: waypoint.from_vfr_waypoint,
          }
          path.push({
            from_waypoint: {
              id: waypoint.id,
              code: waypoint.code,
              name: waypoint.name,
              latitude_degrees: degreeCoordinates.lat,
              longitude_degrees: degreeCoordinates.lng,
              from_user_waypoint: waypoint.from_user_waypoint,
              from_vfr_waypoint: waypoint.from_vfr_waypoint
            },
            to_waypoint: {
              id: 0,
              code: "",
              name: "",
              latitude_degrees: 0,
              longitude_degrees: 0,
              from_user_waypoint: false,
              from_vfr_waypoint: false
            },
          })
        }
      }
    }

    degreeCoordinates = getDegreeCoordinates(arrivalAerodrome)
    path[path.length - 1].to_waypoint = {
      id: arrivalAerodrome.id,
        code: arrivalAerodrome.code,
        name: arrivalAerodrome.name,
        latitude_degrees: degreeCoordinates.lat,
        longitude_degrees: degreeCoordinates.lng,
        from_user_waypoint: !arrivalAerodrome.registered,
        from_vfr_waypoint:  arrivalAerodrome.registered
    }

    return path
}

export default getPath