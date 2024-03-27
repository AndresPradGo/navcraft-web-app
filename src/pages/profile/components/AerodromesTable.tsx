import { useState } from 'react';

import useUserAerodromesData from '../hooks/useUserAerodromesData';
import useAuth from '../../../hooks/useAuth';
import EditUserAerodromeForm from '../../../components/editUserAerodromeForm';
import DeleteUserAerodromeForm from '../../../components/deleteUserAerodromeForm';
import formatUTCDate from '../../../utils/formatUTCDate';
import ExpandibleTable from '../../../components/common/ExpandibleTable';
import {
  useModal,
  Modal,
  UseModalType,
} from '../../../components/common/modal';

interface Props {
  editModal: UseModalType;
}

const AerodromesTable = ({ editModal }: Props) => {
  const user = useAuth();
  const userIsAdmin = user && user.is_active && user.is_admin;

  const [aerodromeId, setAerodromeId] = useState<number>(0);
  const deleteModal = useModal();
  const { data: aerodromes, isLoading, error } = useUserAerodromesData();
  const aerodromeData = {
    id: 0,
    code: '',
    name: '',
    lat_degrees: 0,
    lat_minutes: 0,
    lat_seconds: 0,
    lat_direction: 'North' as 'North',
    lon_degrees: 0,
    lon_minutes: 0,
    lon_seconds: 0,
    lon_direction: 'West' as 'West',
    magnetic_variation: NaN,
    elevation_ft: 0,
    status: 6,
  };

  const tableData = {
    keys: [
      'code',
      'name',
      'latitude',
      'longitude',
      'elevation_ft',
      'runways',
      'variation',
      'updated',
    ],
    headers: {
      code: 'Code',
      name: 'Name',
      latitude: 'Latitude',
      longitude: 'Longitude',
      elevation_ft: 'Elevation [ft]',
      runways: 'Runways',
      variation: 'Magnetic Var.',
      updated: 'Date Updated',
    },
    rows:
      !error && aerodromes
        ? aerodromes.map((a) => ({
            id: a.id,
            code: a.code,
            name: a.name,
            latitude: `${a.lat_direction}${a.lat_degrees}\u00B0${a.lat_minutes}'${a.lat_seconds}"`,
            longitude: `${a.lon_direction}${a.lon_degrees}\u00B0${a.lon_minutes}'${a.lon_seconds}"`,
            variation: `${Math.abs(
              a.magnetic_variation ? a.magnetic_variation : 0,
            )}\u00B0${
              a.magnetic_variation
                ? a.magnetic_variation < 0
                  ? 'E'
                  : a.magnetic_variation > 0
                    ? 'W'
                    : ''
                : ''
            }`,
            elevation_ft: a.elevation_ft,
            updated: formatUTCDate(a.last_updated_utc),
            date: a.last_updated_utc,
            runways: a.runways.length
              ? a.runways
                  .map(
                    (r) =>
                      `${r.number.toString().padStart(2, '0')}${
                        r.position ? r.position : ''
                      }`,
                  )
                  .join(', ')
              : '-',
            handleEdit: `/waypoints/private-aerodrome/${a.id}`,
            handleDelete: () => {
              setAerodromeId(a.id);
              deleteModal.handleOpen();
            },
            permissions: 'open-delete' as 'open-delete',
          }))
        : [],
    breakingPoint: 1400,
  };

  const sortData = [
    {
      title: 'Code',
      key: 'code',
    },
    {
      title: 'Name',
      key: 'name',
    },
    {
      title: 'Date Updated',
      key: 'date',
    },
  ];

  return (
    <>
      <Modal isOpen={editModal.isOpen}>
        <EditUserAerodromeForm
          isAdmin={!!userIsAdmin}
          queryKey={'user'}
          closeModal={editModal.handleClose}
          aerodromeData={aerodromeData}
          isOpen={editModal.isOpen}
        />
      </Modal>
      <Modal isOpen={deleteModal.isOpen}>
        <DeleteUserAerodromeForm
          isAdmin={!!userIsAdmin}
          closeModal={deleteModal.handleClose}
          name={aerodromes?.find((item) => item.id === aerodromeId)?.name || ''}
          id={aerodromeId}
          queryKey="user"
        />
      </Modal>
      <ExpandibleTable
        tableData={tableData}
        sortColumnOptions={sortData}
        pageSize={5}
        emptyTableMessage="No Aerodromes saved..."
        title="Saved Aerodromes"
        hanldeAdd={editModal.handleOpen}
        dataIsLoading={isLoading}
      />
    </>
  );
};

export default AerodromesTable;
