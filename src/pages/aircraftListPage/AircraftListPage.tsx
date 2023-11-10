import { useState } from "react";
import { AiOutlineSwap } from "react-icons/ai";
import { IoAirplane, IoAirplaneOutline } from "react-icons/io5";
import { styled } from "styled-components";
import _ from "lodash";

import { ContentLayout } from "../layout";
import useFuelTypes from "../../hooks/useFuelTypes";
import Loader from "../../components/Loader";
import useAircraftDataList from "./useAircraftDataList";
import useAuth from "../../hooks/useAuth";
import Table from "../../components/common/table";
import useAircraftModels from "../../hooks/useAircraftModels";
import SideBarContent from "./SideBarContent";
import { useModal, Modal } from "../../components/common/modal";
import EditAircraftForm from "../../components/editAircraftForm";
import EditAircraftModelForm from "../../components/editAircraftModelForm";
import DeleteAircraftForm from "../../components/deleteAircraftForm";
import DeleteAircraftModelForm from "../../components/deleteAircraftModelForm";
import formatUTCDate from "../../utils/formatUTCDate";

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
  width: 168px;

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
    width: 223px;
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
  const addModelModal = useModal();

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
    {
      key: "aircraftModels",
      title: "Models",
      icon: <IoAirplaneOutline />,
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
    [
      "registration",
      "abbreviation",
      "make",
      "model",
      "state",
      "fuel",
      "updated",
    ],
  ];
  const tableHeaders = [
    {
      registration: "Registration",
      abbreviation: "Model",
      make: "Make",
      model: "Name",
      state: "State",
      fuel: "Fuel",
      updated: "Date Updated",
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
      {
        key: "date",
        title: "Date Updated",
      },
    ],
  ];

  const searchBarParameters = [
    {
      placeHolder: "Search Aircraft",
      columnKeys: ["registration", "abbreviation", "make", "model"],
    },
    {
      placeHolder: "Search Models",
      columnKeys: ["name"],
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
    tableKeys.push(["id", "name", "state", "fuel", "updated"]);

    tableHeaders.push({
      id: "ID",
      name: "Description",
      state: "State",
      fuel: "Fuel",
      updated: "Date Updated",
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
      {
        key: "fuel",
        title: "Fuel",
      },
      {
        key: "date",
        title: "Date Updated",
      },
    ]);

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
  } else {
    tableKeys.push(["name", "fuel"]);

    tableHeaders.push({
      name: "Description",
      fuel: "Fuel",
    });

    sortData.push([
      {
        key: "name",
        title: "Name",
      },
      {
        key: "fuel",
        title: "Fuel",
      },
    ]);

    filterParameters.push({
      text: "Filter Models",
      filters: [
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
      tableOptions[tableIndex].key === "aircraftModels" && aircraftModels
        ? aircraftModels.map((model) => ({
            id: model.id,
            name: model.performance_profile_name,
            state: model.is_complete ? "Complete" : "Incomplete",
            fuel:
              fuelTypes.find((fuel) => fuel.id === model.fuel_type_id)?.name ||
              "-",
            updated: formatUTCDate(model.last_updated_utc),
            date: model.last_updated_utc,
            handleEdit: `model/${model.id}`,
            handleDelete: () => {
              setModalForm("deleteModel");
              setIdRowToDelete(model.id);
              modal.handleOpen();
            },
            permissions: !!userIsAdmin
              ? ("open-delete" as "open-delete")
              : ("open" as "open"),
          }))
        : aircraftList.map((aircraft) => {
            const datesUpdated = aircraft.profiles.map((profile) => ({
              date: profile.last_updated_utc,
            }));
            const dateUpdated = _.orderBy(datesUpdated, ["date"], ["desc"])[0][
              "date"
            ];
            return {
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
              updated: formatUTCDate(dateUpdated),
              date: dateUpdated,
              handleEdit: `${aircraft.id}`,
              handleDelete: () => {
                setModalForm("deleteAircraft");
                setIdRowToDelete(aircraft.id);
                modal.handleOpen();
              },
              permissions: "open-delete" as "open-delete",
            };
          }),
  };

  const handleChangeTable = () => {
    if (tableIndex >= tableOptions.length - 1) setTableIndex(0);
    else setTableIndex(tableIndex + 1);
  };

  return (
    <>
      <Modal isOpen={addModelModal.isOpen} fullHeight={true}>
        <EditAircraftModelForm
          aircraftModelData={{
            id: 0,
            performance_profile_name: "",
            is_complete: false,
            fuel_type: "",
          }}
          closeModal={addModelModal.handleClose}
          isOpen={addModelModal.isOpen}
          fuelOptions={fuelTypes}
        />
      </Modal>
      <Modal isOpen={modal.isOpen}>
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
        ) : modalForm === "deleteAircraft" ? (
          <DeleteAircraftForm
            registration={
              aircraftList.find((a) => a.id === idRowToDelete)?.registration ||
              ""
            }
            id={idRowToDelete}
            closeModal={modal.handleClose}
          />
        ) : modalForm === "deleteModel" ? (
          <DeleteAircraftModelForm
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
              addModelModal.handleOpen();
            }}
            isAdmin={!!userIsAdmin}
            handleChangeSection={setTableIndex}
            sectionIndex={tableIndex}
            sectionOptions={tableOptions}
          />
        }
      >
        <HtmlContainer>
          <HtmlTitleContainer>
            <h1>
              {tableOptions[tableIndex].icon}
              {tableOptions[tableIndex].title}
            </h1>
            <ChangeIcon onClick={handleChangeTable} />
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
