import { useState } from "react";
import { BiSolidPlaneLand, BiSolidPlaneTakeOff } from "react-icons/bi";
import { GiRadialBalance } from "react-icons/gi";
import { MdNoLuggage } from "react-icons/md";
import { PiAirplane, PiAirplaneFill } from "react-icons/pi";
import { styled } from "styled-components";
import _ from "lodash";

import DataTableList from "../../../components/common/DataTableList";
import ExpandibleTable from "../../../components/common/ExpandibleTable";
import { useModal, Modal } from "../../../components/common/modal";
import { WeightAndBalanceDataFromAPI } from "../../../services/weightBalanceClient";
import formatUTCDate from "../../../utils/formatUTCDate";
import WeightBalanceGraph from "../../../components/WeightBalanceGraph";
import DeleteWeightBalanceProfileForm from "./DeleteWeightBalanceProfileForm";
import EditWeightBalanceProfileForm from "../components/EditWeightBalanceProfileForm";
import { useQueryClient } from "@tanstack/react-query";
import useModelPermissions from "../useModelPermissions";

const HtmlDataContainer = styled.div`
  transition: all 2s;
  width: 100%;
  display: flex;
  margin: 0 0 35px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-evenly;
  align-content: center;
`;

const HtmlInstructionsList = styled.ul`
  & li {
    text-wrap: wrap;
  }
`;

const EmptyIcon = styled(PiAirplane)`
  font-size: 25px;
  margin: 0 5px 0 0;

  @media screen and (min-width: 425px) {
    margin: 0 5px 0 10px;
  }
`;

const RampIcon = styled(PiAirplaneFill)`
  font-size: 25px;
  margin: 0 5px 0 0;

  @media screen and (min-width: 425px) {
    margin: 0 5px 0 10px;
  }
`;

const TakeoffIcon = styled(BiSolidPlaneTakeOff)`
  font-size: 25px;
  margin: 0 5px 0 0;

  @media screen and (min-width: 425px) {
    margin: 0 5px 0 10px;
  }
`;

const LandingIcon = styled(BiSolidPlaneLand)`
  font-size: 25px;
  margin: 0 5px 0 0;

  @media screen and (min-width: 425px) {
    margin: 0 5px 0 10px;
  }
`;

const LuggageIcon = styled(MdNoLuggage)`
  font-size: 25px;
  margin: 0 5px 0 0;

  @media screen and (min-width: 425px) {
    margin: 0 5px 0 10px;
  }
`;

const COGIcon = styled(GiRadialBalance)`
  font-size: 25px;
  margin: 0 5px 0 0;

  @media screen and (min-width: 425px) {
    margin: 0 5px 0 10px;
  }
`;

interface Props {
  handlAddWeightBalanceprofile: () => void;
  instructions: string[];
  profileId: number;
}

const WeightBalanceSection = ({
  handlAddWeightBalanceprofile,
  instructions,
  profileId,
}: Props) => {
  const [currentForm, setCurrentForm] = useState<"delete" | "edit">("delete");
  const [selectedId, setSelectedId] = useState<number>(0);

  const { isModel, userIsAdmin } = useModelPermissions();

  const queryClient = useQueryClient();
  const weightBalanceData =
    queryClient.getQueryData<WeightAndBalanceDataFromAPI>([
      "AircraftWeightBalanceData",
      profileId,
    ]);
  const modal = useModal();

  const dataList = [
    {
      key: "center_of_gravity_in",
      title: "CoG [in]",
      icon: <COGIcon />,
      data: `${weightBalanceData?.center_of_gravity_in || "-"}`,
    },
    {
      key: "empty_weight_lb",
      title: "Empty Weight [lb]",
      icon: <EmptyIcon />,
      data: `${weightBalanceData?.empty_weight_lb || "-"}`,
    },
    {
      key: "max_ramp_weight_lb",
      title: "Max Ramp Weight [lb]",
      icon: <RampIcon />,
      data: `${weightBalanceData?.max_ramp_weight_lb || "-"}`,
    },
    {
      key: "max_takeoff_weight_lb",
      title: "Max Takeoff Weight [lb]",
      icon: <TakeoffIcon />,
      data: `${weightBalanceData?.max_takeoff_weight_lb || "-"}`,
    },
    {
      key: "max_landing_weight_lb",
      title: "Max Landing Weight [lb]",
      icon: <LandingIcon />,
      data: `${weightBalanceData?.max_landing_weight_lb || "-"}`,
    },
    {
      key: "baggage_allowance_lb",
      title: "Baggage Allowance [lb]",
      icon: <LuggageIcon />,
      data: `${weightBalanceData?.baggage_allowance_lb || "-"}`,
    },
  ];

  const tableData = {
    keys: ["name", "updated"],
    headers: {
      name: "Name",
      updated: "Date Updated",
    },
    rows: weightBalanceData
      ? weightBalanceData.weight_balance_profiles.map((profile) => ({
          id: profile.id,
          name: profile.name,
          updated: formatUTCDate(profile.last_updated_utc),
          handleEdit: () => {
            setCurrentForm("edit");
            setSelectedId(profile.id);
            modal.handleOpen();
          },
          handleDelete: () => {
            setCurrentForm("delete");
            setSelectedId(profile.id);
            modal.handleOpen();
          },
          permissions: "edit-delete" as "edit-delete",
        }))
      : [],
  };

  const profiles = weightBalanceData
    ? weightBalanceData.weight_balance_profiles.map((profile) => {
        const orderLimits = _.orderBy(profile.limits, ["sequence"], ["asc"]);

        return {
          name: profile.name,
          limits: orderLimits.map((limit) => ({
            cg_location_in: limit.cg_location_in,
            weight_lb: Math.round(limit.weight_lb * 100) / 100000,
            size: 1,
            label: `(${limit.cg_location_in}, ${
              Math.round(limit.weight_lb * 100) / 100000
            })`,
          })),
        };
      })
    : [];

  const displayTable = !!profiles.length && profiles[0].limits.length;

  const profileToEdit = weightBalanceData?.weight_balance_profiles.find(
    (p) => p.id === selectedId
  );

  return (
    <>
      {(isModel && userIsAdmin) || !isModel ? (
        <Modal
          isOpen={modal.isOpen}
          width={currentForm === "edit" ? 718 : 600}
          fullHeight={currentForm === "edit"}
        >
          {currentForm === "delete" ? (
            <DeleteWeightBalanceProfileForm
              closeModal={modal.handleClose}
              name={
                weightBalanceData?.weight_balance_profiles.find(
                  (p) => p.id === selectedId
                )?.name || ""
              }
              id={selectedId}
              profileId={profileId}
            />
          ) : currentForm === "edit" ? (
            <EditWeightBalanceProfileForm
              performanceProfileId={profileId}
              helpInstructions={instructions.slice(1)}
              closeModal={modal.handleClose}
              isOpen={modal.isOpen}
              labelKey="edit"
              data={{
                id: selectedId,
                name: profileToEdit?.name || "",
                limits:
                  profileToEdit?.limits.map((l) => ({
                    weight_lb: l.weight_lb,
                    cg_location_in: l.cg_location_in,
                  })) || [],
              }}
            />
          ) : null}
        </Modal>
      ) : null}
      <HtmlDataContainer>
        <DataTableList dataList={dataList} maxWidth={400} margin="35px 0" />
        {displayTable ? (
          <WeightBalanceGraph
            showMTOW={true}
            profiles={profiles}
            maxTakeoff={weightBalanceData?.max_takeoff_weight_lb}
            title="W&B Profiles"
            margin={"35px 0 0"}
          />
        ) : null}
      </HtmlDataContainer>
      {(isModel && userIsAdmin) || !isModel ? (
        <ExpandibleTable
          tableData={tableData}
          disableAdd={tableData.rows.length >= 4}
          emptyTableMessage="No W&B Profiles have been added..."
          title="List of W&B Profiles"
          hanldeAdd={handlAddWeightBalanceprofile}
          otherComponent={
            <HtmlInstructionsList>
              {instructions.slice(0, 1).map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </HtmlInstructionsList>
          }
        />
      ) : null}
    </>
  );
};

export default WeightBalanceSection;
