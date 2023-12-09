import { OfficialAerodromeDataFromAPI } from "../services/officialAerodromeClient";
import { FlightDataFromApi } from "../services/flightsClient";
import getDegreeCoordinates from "./getDegreeCoordinates"


interface WaypointType {
  id: number
    code: string,
    name: string,
    latitude_degrees: number,
    longitude_degrees: number
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
        longitude_degrees: degreeCoordinates.lng
      },
      to_waypoint: {
        id: 0,
        code: "",
        name: "",
        latitude_degrees: 0,
        longitude_degrees: 0
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
            longitude_degrees: degreeCoordinates.lng
          }
          path.push({
            from_waypoint: {
              id: waypoint.id,
              code: waypoint.code,
              name: waypoint.name,
              latitude_degrees: degreeCoordinates.lat,
              longitude_degrees: degreeCoordinates.lng
            },
            to_waypoint: {
              id: 0,
              code: "",
              name: "",
              latitude_degrees: 0,
              longitude_degrees: 0
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
        longitude_degrees: degreeCoordinates.lng
    }

    return path
}

export default getPath