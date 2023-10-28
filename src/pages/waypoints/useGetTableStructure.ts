
interface WaypointHeaders {
    code: string;
    name: string;
    type: string;
    latitude: string;
    longitude: string;
    variation: string;
    posted?: string;
}

interface AerodromeHeaders extends WaypointHeaders {
    status: string;
    elevation_ft: string;
    runways: string;
}

interface RunwayHeaders {
    aerodrome: string;
    runway: string;
    length_ft: string;
    thld_displ: string;
    intersection_departure_length_ft: string;
    surface: string;
}

interface SortData {
    key: string;
    title: string;
}

interface FilterData extends SortData {
    value: string
}

interface SearchParamsType {
    columnKeys: string[];
    placeHolder: string;
}

interface FilterParamsType {
    text: string;
    filters: FilterData[];
}

interface TableDataType {
    keys: string[];
    headers: WaypointHeaders | AerodromeHeaders | RunwayHeaders;
    sortData: SortData[];
    searchBarParameters: SearchParamsType;
    filterParameters: FilterParamsType;
}

const useGetTableStructure = (isAdmin: boolean, aerodromeStatus: string[]): TableDataType[] | [] => {
    const waypointsKeys = ["code", "name", "type", "latitude", "longitude", "variation"]
    const waypointsHeaders = {
        code: "Code",
        name: "Name",
        type: "Type",
        latitude: "Latitude",
        longitude: "Longitude",
        variation: "Magnetic Var",
    } as WaypointHeaders
    const waypointsSortData = [
        {
          key: "code",
          title: "Code",
        },
        {
          key: "name",
          title: "Name",
        }
    ];
    const waypointsSearchBarParameters = {
        placeHolder: "Search Waypoints",
        columnKeys: ["code", "name"]
    }
    const waypointsFilterParameters = {
        text: "Filter Wypoints",
        filters: [
            {
                key: "type",
                title: "Official",
                value: "Official"
            },
            {
                key: "type",
                title: "User Added",
                value: "User Added"
            }
        ]
    }

    const aerodromesKeys = [ 
        "code",
        "name",
        "type",
        "status",
        "latitude",
        "longitude",
        "elevation_ft",
        "runways",
        "variation"
    ]
    const aerodromesHeaders = {
        code: "Code",
        name: "Name",
        type: "Type",
        status: "Status",
        latitude: "Latitude",
        longitude: "Longitude",
        elevation_ft: "Elevation [ft]",
        runways: "Runways",
        variation: "Magnetic Var",
    } as AerodromeHeaders
    const aerodromesSortData = [
        {
          key: "code",
          title: "Code",
        },
        {
          key: "name",
          title: "Name",
        },
        {
            key: "status",
            title: "Status",
        }
    ];
    const aerodromesSearchBarParameters = {
        placeHolder: "Search Aerodromes",
        columnKeys: ["code", "name"]
    }
    const aerodromesFilterParameters = {
        text: "Filter Wypoints",
        filters: [
            {
                key: "type",
                title: "Official",
                value: "Official"
            },
            {
                key: "type",
                title: "User Added",
                value: "User Added"
            },
            ...aerodromeStatus.map(item => ({
                key: "status",
                title: item,
                value: item
            }))
        ]
    }

    const runwaysKeys = [
        "aerodrome",
        "aerodrome_name",
        "aerodrome_status",
        "runway",
        "length_ft",
        "thld_displ",
        "intersection_departure_length_ft",
        "surface",
    ]
    const runwaysHeaders = {
        aerodrome: "Aerodrome",
        runway: "Runway",
        length_ft: "Length [ft]",
        thld_displ: "Thld Displ [ft]",
        intersection_departure_length_ft: "Intxn Dep [ft]",
        surface: "Surface"
    } as RunwayHeaders
    const runwaysSortData = [
        {
            key: "aerodrome",
            title: "Aerodrome",
        },
        {
            key: "runway",
            title: "Runway",
        },
        {
            key: "length",
            title: "Length",
        },
        {
            title: "Surface",
            key: "surface",
        },
    ]
    const runwaysSearchBarParameters = {
        placeHolder: "Search Runways",
        columnKeys: ["aerodrome", "aerodrome_name", "runway", "surface"]
        
    }
    const runwaysFilterParameters = {
        text: "Filter Wypoints",
        filters: aerodromeStatus.map(item => ({
            key: "status",
            title: `${item} Aerodrome`,
            value: item
        }))
    }

    if (isAdmin) {
        waypointsKeys.push("posted")
        waypointsHeaders.posted = "Posted"
        waypointsFilterParameters.filters.push({
            key: "posted",
            title: "Posted",
            value: "Yes"
        })
        waypointsFilterParameters.filters.push({
            key: "posted",
            title: "Not Posted",
            value: "No"
        })

        aerodromesKeys.push("posted")
        aerodromesHeaders.posted = "Posted"
        aerodromesFilterParameters.filters.push({
            key: "posted",
            title: "Posted",
            value: "Yes"
        })
        aerodromesFilterParameters.filters.push({
            key: "posted",
            title: "Not Posted",
            value: "No"
        })
    }

    const tableData = [
        {
            keys: waypointsKeys as string[],
            headers: waypointsHeaders,
            sortData: waypointsSortData as SortData[],
            searchBarParameters: waypointsSearchBarParameters as SearchParamsType,
            filterParameters: waypointsFilterParameters as FilterParamsType
        },
        {
            keys: aerodromesKeys as string[],
            headers: aerodromesHeaders,
            sortData: aerodromesSortData as SortData[],
            searchBarParameters: aerodromesSearchBarParameters as SearchParamsType,
            filterParameters: aerodromesFilterParameters as FilterParamsType
        }
    ] as TableDataType[]

    if (isAdmin) {
        tableData.push({
            keys: runwaysKeys as string[],
            headers: runwaysHeaders,
            sortData: runwaysSortData as SortData[],
            searchBarParameters: runwaysSearchBarParameters as SearchParamsType,
            filterParameters: runwaysFilterParameters as FilterParamsType
        })
    }

    return tableData

}

export default useGetTableStructure