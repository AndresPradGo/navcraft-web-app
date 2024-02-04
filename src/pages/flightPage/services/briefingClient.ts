import APIClient from '../../../services/weatherApiClient';


export interface EnrouteRequest {
    dateTime: string;
    aerodromes: {
        code: string;
        nauticalMilesFromPath: number;
    }[]
}

interface DepartureArrivalRequest {
    dateTime: string;
    aerodrome?: string
}

export interface BriefingRequest {
    departure: DepartureArrivalRequest;
    legs: EnrouteRequest[]
    arrival: DepartureArrivalRequest;
    alternates: EnrouteRequest
}

type GFARegion = 'Pacific (GFACN31)'
    | 'Prairies (GFACN32)' 
    | 'Pacific (GFACN33)' 
    | 'Ontario & Quebec (GFACN34)'
    | 'Yukon & NWT (GFACN35)' 
    | 'Nunavut (GFACN36)' 
    | 'Arctic (GFACN37)'

interface GFAGraph {
    src: string; 
    validAt: Date; 
    hoursSpan: number;
}

interface BaseEnrouteBriefingResult {
    dateFrom: Date;
    dateTo?: Date
    data: string;
}

export interface PIREPType extends BaseEnrouteBriefingResult {
    geometryWarning?: boolean;
    isUrgent?: boolean;
    location?: string;
    ftASL?: number;
    aircraft?: string;
    clouds?: string;
    temperature?: number;
    wind?: string;
    turbulence?: string;
    icing?: string;
    remarks?: string;
}

interface BaseAerodromeBriefingResult {
    aerodromeCode: string;
    nauticalMilesFromTarget: number;
    taf?: {
      data: string;
      dateFrom: Date;
      dateTo : Date;
      flightWithinForecast: boolean;
    }
    metar: {
      data: string;
      date: Date;
    }[]
  }

export interface WeatherBriefingFromAPI {
    dateTime: Date;
    regions:{
        region: GFARegion;
        weatherGraphs: GFAGraph[];
        iceGraphs: GFAGraph[];
        airmets: BaseEnrouteBriefingResult[];
        sigmets: BaseEnrouteBriefingResult[];
        pireps: PIREPType[]
      }[],
    aerodromes: {
        departure: {
            dateTimeAt: Date
            aerodrome?: BaseAerodromeBriefingResult
          }
          legs: {
            dateTimeAt: Date;
            aerodromes: BaseAerodromeBriefingResult[]
          }[]
          arrival: {
            dateTimeAt: Date
            aerodrome?: BaseAerodromeBriefingResult
          }
          alternates: BaseAerodromeBriefingResult[]
    }
}

export type WeatherBriefingData = WeatherBriefingFromAPI | "null" | "error" | "mutating"
export interface NOTAMBriefingFromAPI {
  dateTime: Date;
  notams: {
    aerodromes: {
      code: string
      dateTimeAt: Date
      flightWithinNotam: boolean
    }[];
    data: string;
    dateFrom: Date;
    dateTo? : Date;
    isAipSuplement: boolean;
  }[];
}
export type NOTAMBriefingData = NOTAMBriefingFromAPI | "null" | "error" | "mutating"

const apiClient = new APIClient<BriefingRequest, WeatherBriefingFromAPI | unknown>("/briefings")

export default apiClient