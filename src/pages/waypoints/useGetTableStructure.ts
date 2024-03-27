interface WaypointHeaders {
  code: string;
  name: string;
  type: string;
  latitude: string;
  longitude: string;
  variation: string;
  visible?: string;
  updated: string;
}

interface AerodromeHeaders extends WaypointHeaders {
  status: string;
  runways: string;
}

interface RunwayHeaders {
  aerodrome: string;
  runway: string;
  length_ft: string;
  thld_displ: string;
  intersection_departure_length_ft: string;
  surface: string;
  updated: string;
}

interface SortData {
  key: string;
  title: string;
}

interface FilterData extends SortData {
  value: string;
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

const useGetTableStructure = (
  isAdmin: boolean,
  aerodromeStatus: string[],
): TableDataType[] | [] => {
  const waypointsKeys = [
    'code',
    'name',
    'type',
    'latitude',
    'longitude',
    'variation',
    'updated',
  ];
  const waypointsHeaders = {
    code: 'Code',
    name: 'Name',
    type: 'Type',
    latitude: 'Latitude',
    longitude: 'Longitude',
    variation: 'Magnetic Var.',
    updated: 'Date Updated',
  } as WaypointHeaders;
  const waypointsSortData = [
    {
      key: 'code',
      title: 'Code',
    },
    {
      key: 'name',
      title: 'Name',
    },
    {
      key: 'date',
      title: 'Date Updated',
    },
  ];
  const waypointsSearchBarParameters = {
    placeHolder: 'Search Waypoints',
    columnKeys: ['code', 'name'],
  };
  const waypointsFilterParameters = {
    text: 'Filter Waypoints',
    filters: [
      {
        key: 'type',
        title: 'Type: Official',
        value: 'Official',
      },
      {
        key: 'type',
        title: 'Type: User Added',
        value: 'User Added',
      },
    ],
  };

  const aerodromesKeys = [
    'code',
    'name',
    'type',
    'status',
    'latitude',
    'longitude',
    'runways',
    'variation',
    'weather',
    'updated',
  ];
  const aerodromesHeaders = {
    code: 'Code',
    name: 'Name',
    type: 'Type',
    status: 'Status',
    latitude: 'Latitude',
    longitude: 'Longitude',
    runways: 'Runways',
    variation: 'Magnetic Var.',
    weather: 'Available Weather',
    updated: 'Date Updated',
  } as AerodromeHeaders;
  const aerodromesSortData = [
    {
      key: 'code',
      title: 'Code',
    },
    {
      key: 'name',
      title: 'Name',
    },
    {
      key: 'status',
      title: 'Status',
    },
    {
      key: 'date',
      title: 'Date Updated',
    },
  ];
  const aerodromesSearchBarParameters = {
    placeHolder: 'Search Aerodromes',
    columnKeys: ['code', 'name'],
  };
  const aerodromesFilterParameters = {
    text: 'Filter Aerodromes',
    filters: [
      {
        key: 'type',
        title: 'Type: Official',
        value: 'Official',
      },
      {
        key: 'type',
        title: 'Type: User Added',
        value: 'User Added',
      },
      {
        key: 'has_taf',
        title: 'Has TAF',
        value: 'Yes',
      },
      {
        key: 'has_metar',
        title: 'Has METAR',
        value: 'Yes',
      },
      {
        key: 'has_fds',
        title: 'Has FDs',
        value: 'Yes',
      },
      ...aerodromeStatus.map((item) => ({
        key: 'status',
        title: `Status: ${item}`,
        value: item,
      })),
    ],
  };

  const runwaysKeys = [
    'aerodrome',
    'runway',
    'length_ft',
    'thld_displ',
    'intersection_departure_length_ft',
    'surface',
    'updated',
  ];
  const runwaysHeaders = {
    aerodrome: 'Aerodrome',
    runway: 'Runway',
    length_ft: 'Length [ft]',
    thld_displ: 'Thld Displ [ft]',
    intersection_departure_length_ft: 'Intxn Dep [ft]',
    surface: 'Surface',
    updated: 'Date Updated',
  } as RunwayHeaders;
  const runwaysSortData = [
    {
      key: 'aerodrome',
      title: 'Aerodrome',
    },
    {
      key: 'runway',
      title: 'Runway',
    },
    {
      key: 'length',
      title: 'Length',
    },
    {
      title: 'Surface',
      key: 'surface',
    },
    {
      title: 'Date Updated',
      key: 'updated',
    },
  ];
  const runwaysSearchBarParameters = {
    placeHolder: 'Search Runways',
    columnKeys: ['aerodrome', 'aerodrome_name', 'runway', 'surface'],
  };
  const runwaysFilterParameters = {
    text: 'Filter Runways',
    filters: aerodromeStatus.map((item) => ({
      key: 'status',
      title: `${item} Aerodromes`,
      value: item,
    })),
  };

  if (isAdmin) {
    waypointsKeys.push('visible');
    waypointsHeaders.visible = 'Visible';
    waypointsFilterParameters.filters.push({
      key: 'visible',
      title: 'Visible',
      value: 'Yes',
    });
    waypointsFilterParameters.filters.push({
      key: 'visible',
      title: 'Not Visible',
      value: 'No',
    });

    aerodromesKeys.push('visible');
    aerodromesHeaders.visible = 'Visible';
    aerodromesFilterParameters.filters.push({
      key: 'visible',
      title: 'Visible',
      value: 'Yes',
    });
    aerodromesFilterParameters.filters.push({
      key: 'visible',
      title: 'Not Visible',
      value: 'No',
    });
  }

  const tableData = [
    {
      keys: waypointsKeys,
      headers: waypointsHeaders,
      sortData: waypointsSortData as SortData[],
      searchBarParameters: waypointsSearchBarParameters as SearchParamsType,
      filterParameters: waypointsFilterParameters as FilterParamsType,
    },
    {
      keys: aerodromesKeys,
      headers: aerodromesHeaders,
      sortData: aerodromesSortData as SortData[],
      searchBarParameters: aerodromesSearchBarParameters as SearchParamsType,
      filterParameters: aerodromesFilterParameters as FilterParamsType,
    },
  ] as TableDataType[];

  if (isAdmin) {
    tableData.push({
      keys: runwaysKeys,
      headers: runwaysHeaders,
      sortData: runwaysSortData as SortData[],
      searchBarParameters: runwaysSearchBarParameters as SearchParamsType,
      filterParameters: runwaysFilterParameters as FilterParamsType,
    });
  }

  return tableData;
};

export default useGetTableStructure;
