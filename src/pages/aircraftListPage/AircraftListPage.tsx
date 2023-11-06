import { useState } from "react";
import { AiOutlineSwap } from "react-icons/ai";
import { IoAirplane, IoAirplaneOutline } from "react-icons/io5";
import { styled } from "styled-components";

import { ContentLayout } from "../layout";
import useFuelTypes from "../../hooks/useFuelTypes";
import Loader from "../../components/Loader";
import useAircraftDataList from "./useAircraftDataList";
import useAuth from "../../hooks/useAuth";
import Table from "../../components/common/table";
import useAircraftModels from "./useAircraftModels";
import SideBarContent from "./SideBarContent";
import { useModal, Modal } from "../../components/common/modal";
import EditAircraftForm from "../../components/editAircraftForm";
import EditAircraftModelForm from "../../components/editAircraftModelForm";
import DeleteAircraftForm from "../../components/deleteAircraftForm";

const HtmlContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-wrap: wrap;
  text-wrap: nowrap;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

const HtmlTitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 258px;

  & h1:first-of-type {
    display: flex;
    align-items: center;
    margin: 10px 0;
    font-size: 25px;
    text-wrap: wrap;
    line-height: 0.98;

    & svg {
      flex-shrink: 0;
      font-size: 40px;
      margin: 0 5px 0 0;
    }
  }

  @media screen and (min-width: 425px) {
    width: 350px;
    justify-content: flex-end;
    & h1:first-of-type {
      font-size: 35px;

      & svg {
        margin: 0 10px 0 0;
        font-size: 50px;
      }
    }
  }
`;

const HtmlTableContainer = styled.div`
  margin: 50px 0 0;
  width: 100%;
`;

const ChangeIcon = styled(AiOutlineSwap)`
  color: var(--color-contrast);
  cursor: pointer;
  font-size: 30px;
  margin-left: 5px;

  &:hover {
    color: var(--color-contrast-hover);
  }

  @media screen and (min-width: 425px) {
    font-size: 35px;
  }
`;

const AircraftListPage = () => {
  const {
    data: fuelTypes,
    isLoading: fuelTypesIsLoading,
    error: fuelTypesError,
  } = useFuelTypes();

  const {
    data: aircraftList,
    isLoading: aircraftListIsLoading,
    error: aircraftListError,
  } = useAircraftDataList();

  const {
    data: aircraftModels,
    isLoading: aircraftModelsIsLoading,
    error: aircraftModelsError,
  } = useAircraftModels();

  const [tableIndex, setTableIndex] = useState<number>(0);
  const [modalForm, setModalForm] = useState<
    "addAircraft" | "deleteAircraft" | "addModel" | "deleteModel"
  >("addAircraft");
  const [idRowToDelete, setIdRowToDelete] = useState<number>(0);

  const modal = useModal();

  const user = useAuth();
  const userIsAdmin = user && user.is_active && user.is_admin;

  if (
    fuelTypesIsLoading ||
    aircraftListIsLoading ||
    (aircraftModelsIsLoading && !!userIsAdmin)
  )
    return <Loader />;
  if (
    fuelTypesError ||
    aircraftListError ||
    (aircraftModelsError && !!userIsAdmin)
  )
    throw new Error("");

  const tableOptions = [
    {
      key: "aircraftList",
      title: "Aircraft",
      icon: <IoAirplane />,
    },
  ];

  const usedFuelTypeIds = new Set<number>();
  const models = new Set<string>();
  const makes = new Set<string>();
  aircraftList.forEach((aircraftData) => {
    models.add(aircraftData.abbreviation);
    makes.add(aircraftData.make);
    aircraftData.profiles.forEach((profile) => {
      usedFuelTypeIds.add(profile.fuel_type_id);
    });
  });
  const tableKeys = [
    ["registration", "abbreviation", "make", "model", "state", "fuel"],
  ];
  const tableHeaders = [
    {
      registration: "Registration",
      abbreviation: "Model",
      make: "Make",
      model: "Name",
      state: "Profile State",
      fuel: "Fuel",
    },
  ] as { [key: string]: string }[];

  const sortData = [
    [
      {
        key: "registration",
        title: "Registration",
      },
      {
        key: "abbreviation",
        title: "Model",
      },
      {
        key: "make",
        title: "Make",
      },
    ],
  ];

  const searchBarParameters = [
    {
      placeHolder: "Search Aircraft",
      columnKeys: ["registration", "abbreviation", "make", "model"],
    },
  ];

  const filterParameters = [
    {
      text: "Filter Aircraft",
      filters: [
        ...[...makes].map((make) => ({
          key: "make",
          title: make,
          value: make,
        })),
        ...[...models].map((model) => ({
          key: "abbreviation",
          title: model,
          value: model,
        })),
        ...[...usedFuelTypeIds].map((fuelId) => {
          const fuelType =
            fuelTypes.find((fuel) => fuel.id === fuelId) || fuelTypes[0];
          return {
            key: "fuel",
            title: fuelType.name,
            value: fuelType.name,
          };
        }),

        {
          key: "state",
          title: "Complete",
          value: "Complete",
        },
        {
          key: "state",
          title: "Incomplete",
          value: "Incomplete",
        },
      ],
    },
  ];

  if (userIsAdmin) {
    tableOptions.push({
      key: "aircraftModels",
      title: "Aircraft Models",
      icon: <IoAirplaneOutline />,
    });

    tableKeys.push(["id", "name", "state", "fuel"]);

    tableHeaders.push({
      id: "ID",
      name: "Name",
      state: "Profile State",
      fuel: "Fuel",
    });

    sortData.push([
      {
        key: "id",
        title: "ID",
      },
      {
        key: "name",
        title: "Name",
      },
    ]);

    searchBarParameters.push({
      placeHolder: "Search Models",
      columnKeys: ["name"],
    });

    filterParameters.push({
      text: "Filter Models",
      filters: [
        {
          key: "state",
          title: "Complete",
          value: "Complete",
        },
        {
          key: "state",
          title: "Incomplete",
          value: "Incomplete",
        },
        ...fuelTypes.map((fuelType) => ({
          key: "fuel",
          title: fuelType.name,
          value: fuelType.name,
        })),
      ],
    });
  }

  const tableData = {
    keys: tableKeys[tableIndex],
    headers: tableHeaders[tableIndex],
    rows:
      tableOptions[tableIndex].key === "aircraftModels" &&
      !!userIsAdmin &&
      aircraftModels
        ? aircraftModels.map((model) => ({
            id: model.id,
            name: model.performance_profile_name,
            state: model.is_complete ? "Complete" : "Incomplete",
            fuel:
              fuelTypes.find((fuel) => fuel.id === model.fuel_type_id)?.name ||
              "-",
            handleEdit: `aircraft-model/${model.id}`,
            handleDelete: () => {
              setModalForm("deleteModel");
              setIdRowToDelete(model.id);
              modal.handleOpen();
            },
            permissions: "open-delete" as "open-delete",
          }))
        : aircraftList.map((aircraft) => ({
            id: aircraft.id,
            registration: aircraft.registration,
            abbreviation: aircraft.abbreviation,
            make: aircraft.make,
            model: aircraft.model,
            state: aircraft.profiles.find((profile) => profile.is_complete)
              ? "Complete"
              : "Incomplete",
            fuel:
              fuelTypes.find((fuel) => {
                const id =
                  aircraft.profiles.find((profile) => profile.is_preferred)
                    ?.fuel_type_id ||
                  aircraft.profiles.find((profile) => profile.is_complete)
                    ?.fuel_type_id ||
                  -1;
                return fuel.id === id;
              })?.name || "-",
            handleEdit: `aircraft/${aircraft.id}`,
            handleDelete: () => {
              setModalForm("deleteAircraft");
              setIdRowToDelete(aircraft.id);
              modal.handleOpen();
            },
            permissions: "open-delete" as "open-delete",
          })),
  };

  const handleChangeTable = () => {
    if (tableIndex >= tableOptions.length - 1) setTableIndex(0);
    else setTableIndex(tableIndex + 1);
  };

  return (
    <>
      <Modal isOpen={modal.isOpen} fullHeight={modalForm === "addModel"}>
        {modalForm === "addAircraft" ? (
          <EditAircraftForm
            aircraftData={{
              id: 0,
              make: "",
              model: "",
              abbreviation: "",
              registration: "",
            }}
            closeModal={modal.handleClose}
            isOpen={modal.isOpen}
          />
        ) : modalForm === "addModel" ? (
          <EditAircraftModelForm
            aircraftModelData={{
              id: 0,
              performance_profile_name: "",
              is_complete: false,
              fuel_type: "",
            }}
            closeModal={modal.handleClose}
            isOpen={modal.isOpen}
            fuelOptions={fuelTypes}
          />
        ) : modalForm === "deleteAircraft" ? (
          <DeleteAircraftForm
            registration={
              aircraftList.find((a) => a.id === idRowToDelete)?.registration ||
              ""
            }
            id={idRowToDelete}
            closeModal={modal.handleClose}
          />
        ) : null}
      </Modal>
      <ContentLayout
        sideBarContent={
          <SideBarContent
            handleAddAircraft={() => {
              setModalForm("addAircraft");
              modal.handleOpen();
            }}
            handleAddModel={() => {
              setModalForm("addModel");
              modal.handleOpen();
            }}
            isAdmin={!!userIsAdmin}
            handleSwap={handleChangeTable}
            nextList={
              tableIndex + 1 < tableOptions.length
                ? tableOptions[tableIndex + 1].title
                : tableOptions[0].title
            }
          />
        }
      >
        <HtmlContainer>
          <HtmlTitleContainer>
            <h1>
              {tableOptions[tableIndex].icon}
              {tableOptions[tableIndex].title}
            </h1>
            {userIsAdmin && <ChangeIcon onClick={handleChangeTable} />}
          </HtmlTitleContainer>
          <HtmlTableContainer>
            <Table
              tableData={tableData}
              sortColumnOptions={sortData[tableIndex]}
              pageSize={10}
              searchBarParameters={searchBarParameters[tableIndex]}
              filterParameters={filterParameters[tableIndex]}
              emptyTableMessage={`No ${tableOptions[tableIndex].title}...`}
            />
          </HtmlTableContainer>
        </HtmlContainer>
      </ContentLayout>
    </>
  );
};

export default AircraftListPage;
