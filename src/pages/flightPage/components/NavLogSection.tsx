import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { MdMoreTime } from 'react-icons/md';
import { BsCalendarCheck, BsWatch, BsStopwatch } from 'react-icons/bs';
import { PiEngineDuotone } from 'react-icons/pi';
import { styled } from 'styled-components';

import { FlightDataFromApi } from '../../../services/flightClient';
import { NavLogLegData } from '../hooks/useNavLogData';
import DataTableList from '../../../components/common/DataTableList';
import formatUTCDate from '../../../utils/formatUTCDate';
import formatUTCTime from '../../../utils/formatUTCTime';
import Table from '../../../components/common/ExpandibleTable';
import FlightWarningList from '../../../components/common/FlightWarningList';
import { Modal, useModal } from '../../../components/common/modal';
import DeleteLegForm from './DeleteLegForm';
import EditLegForm from './EditLegForm';

const BHPIcon = styled(PiEngineDuotone)`
  font-size: 25px;
  margin: 0 10px 0 0;
  flex-shrink: 0;
`;

const DateCheckIcon = styled(BsCalendarCheck)`
  font-size: 25px;
  margin: 0 10px 0 0;
  flex-shrink: 0;
`;

const TimeIcon = styled(BsWatch)`
  font-size: 25px;
  margin: 0 10px 0 0;
  flex-shrink: 0;
`;

const AddedTimeIcon = styled(MdMoreTime)`
  font-size: 25px;
  margin: 0 10px 0 0;
  flex-shrink: 0;
`;

const ChronometerIcon = styled(BsStopwatch)`
  font-size: 25px;
  margin: 0 10px 0 0;
  flex-shrink: 0;
`;

interface Props {
  flightId: number;
  isLoading: boolean;
  handleAdd: () => void;
}

const NavLogSection = ({ flightId, isLoading, handleAdd }: Props) => {
  const queryClient = useQueryClient();
  const flightData = queryClient.getQueryData<FlightDataFromApi>([
    'flight',
    flightId,
  ]);

  const legsData = queryClient.getQueryData<NavLogLegData[]>([
    'navLog',
    flightId,
  ]);

  const [idToEdit, setIdToEdit] = useState(0);

  const deleteModal = useModal();
  const editModal = useModal();

  const elapsedTime = legsData
    ? legsData.reduce(
        (sum, leg) => sum + leg.time_to_climb_min + leg.time_enroute_min,
        0,
      )
    : 0;
  const elapsedHours = Math.floor(elapsedTime / 60);
  const elapsedMinutes = Math.round((elapsedTime / 60 - elapsedHours) * 60);

  const addedTime = flightData ? flightData.added_enroute_time_hours : 0;
  const addedHours = Math.floor(addedTime);
  const addedMinutes = Math.round((addedTime - addedHours) * 60);

  const dataListData =
    flightData && legsData
      ? [
          {
            key: 'bhp_percent',
            title: 'Cruise Prower [% of BHP]',
            icon: <BHPIcon />,
            data: `${flightData.bhp_percent}`,
          },
          {
            key: 'departure_time',
            title: 'ETD [UTC]',
            icon: <TimeIcon />,
            data: `${formatUTCDate(
              flightData.departure_time,
              true,
            )} ${formatUTCTime(flightData.departure_time)}`,
          },
          {
            key: 'total_time',
            title: 'ETE [hh:mm]',
            icon: <ChronometerIcon />,
            data: `${elapsedHours < 10 ? '0' : ''}${elapsedHours}:${
              elapsedMinutes < 10 ? '0' : ''
            }${elapsedMinutes}`,
          },
          {
            key: 'added_enroute_time_hours',
            title: 'Added Flight Time [hh:mm]',
            icon: <AddedTimeIcon />,
            data: `${addedHours < 10 ? '0' : ''}${addedHours}:${
              addedMinutes < 10 ? '0' : ''
            }${addedMinutes}`,
          },
          {
            key: 'arrival_time',
            title: 'ETA [UTC]',
            icon: <DateCheckIcon />,
            data: `${formatUTCDate(
              flightData.departure_time,
              true,
              elapsedTime + addedTime * 60,
            )} ${formatUTCTime(
              flightData.departure_time,
              elapsedTime + addedTime * 60,
            )}`,
          },
        ]
      : [];

  const tableData = {
    keys: [
      'route',
      'desired_altitude_ft',
      'rpm',
      'ktas',
      'kcas',
      'true_track',
      'true_heading',
      'magnetic_heading',
      'ground_speed',
      'total_distance',
      'total_time',
    ],
    headers: {
      route: 'From/To',
      desired_altitude_ft: 'Altitude [ft]',
      rpm: 'RPM',
      ktas: 'KTAS',
      kcas: 'KCAS',
      true_track: 'Track [\u00B0T]',
      true_heading: 'Heading [\u00B0T]',
      magnetic_heading: 'Heading [\u00B0M]',
      ground_speed: 'G.S. [Kts]',
      total_distance: 'Distance [NM]',
      total_time: 'ETE [min]',
    },
    rows: legsData
      ? legsData.map((leg, idx) => {
          return {
            id: leg.leg_id,
            route: `${leg.from_waypoint.code} / ${leg.to_waypoint.code}`,
            desired_altitude_ft: leg.desired_altitude_ft,
            rpm: leg.rpm,
            ktas: leg.ktas,
            kcas: leg.kcas,
            true_track: leg.true_track,
            true_heading: leg.true_heading,
            magnetic_heading: leg.magnetic_heading,
            ground_speed: leg.ground_speed,
            total_distance: leg.total_distance,
            total_time: leg.time_to_climb_min + leg.time_enroute_min,
            handleEdit: () => {
              editModal.handleOpen();
              setIdToEdit(leg.leg_id);
            },
            handleDelete: () => {
              deleteModal.handleOpen();
              setIdToEdit(leg.leg_id);
            },
            permissions:
              idx < legsData.length - 1
                ? ('edit-delete' as const)
                : ('edit' as const),
          };
        })
      : [],
    breakingPoint: 1024,
  };

  const warnings = legsData
    ? legsData.map((leg) => {
        const warning = [];
        if (leg.desired_altitude_ft > leg.actual_altitud_ft)
          warning.push(
            `There may not be enough distance from ${leg.from_waypoint.code} to ${leg.to_waypoint.code}, to climb up to ${leg.truncated_altitude} ft ASL, under the forecasted weather conditions.`,
          );
        if (leg.desired_altitude_ft > leg.truncated_altitude)
          warning.push(
            `Performance from ${leg.from_waypoint.code} to ${leg.to_waypoint.code}, is not guaranteed at altitudes above ${leg.truncated_altitude} ft ASL, under the forecasted weather conditions.`,
          );
        if (leg.temperature_c > leg.truncated_temperature_c)
          warning.push(
            `Performance from ${leg.from_waypoint.code} to ${leg.to_waypoint.code}, is not guaranteed at temperatures above ${leg.truncated_temperature_c}\u00B0C at ${leg.desired_altitude_ft} ft ASL.`,
          );
        return warning;
      })
    : [];

  const legToEdit = legsData?.find((leg) => leg.leg_id === idToEdit);

  return (
    <>
      <Modal isOpen={deleteModal.isOpen}>
        <DeleteLegForm
          closeModal={deleteModal.handleClose}
          id={idToEdit}
          fromWaypoint={legToEdit?.from_waypoint.code || ''}
          toWaypoint={legToEdit?.to_waypoint.code || ''}
          flightId={flightId}
        />
      </Modal>
      <Modal isOpen={editModal.isOpen}>
        <EditLegForm
          closeModal={editModal.handleClose}
          id={idToEdit}
          isOpen={editModal.isOpen}
          route={
            legToEdit
              ? `from ${legToEdit.from_waypoint.code} to ${legToEdit.to_waypoint.code}`
              : ''
          }
          flightId={flightId}
        />
      </Modal>
      <DataTableList dataList={dataListData} margin="0 0 40px" />
      <Table
        title={isLoading ? 'Flight Log' : 'Flight Log'}
        disableAdd={false}
        hanldeAdd={handleAdd}
        otherComponent={<FlightWarningList warnings={warnings} />}
        tableData={tableData}
      />
    </>
  );
};

export default NavLogSection;
