import { useQueryClient } from "@tanstack/react-query";
import { BiSolidPlaneLand, BiSolidPlaneTakeOff } from "react-icons/bi";
import { GiRadialBalance } from "react-icons/gi";
import { MdNoLuggage } from "react-icons/md";
import { PiAirplane, PiAirplaneFill } from "react-icons/pi";
import { styled } from "styled-components";

import DataTableList from "../../../components/common/DataTableList";
import ExpandibleTable from "../../../components/common/ExpandibleTable";
import { useModal, Modal } from "../../../components/common/modal";
import { WeightAndBalanceDataFromAPI } from "../../../services/weightBalanceClient";
import formatUTCDate from "../../../utils/formatUTCDate";

const HtmlInstructionsList = styled.ul`
  & ul {
    text-wrap: wrap;
  }
`;

const EmptyIcon = styled(PiAirplane)`
  font-size: 25px;
  margin: 0 5px 0 10px;
`;

const RampIcon = styled(PiAirplaneFill)`
  font-size: 25px;
  margin: 0 5px 0 10px;
`;

const TakeoffIcon = styled(BiSolidPlaneTakeOff)`
  font-size: 25px;
  margin: 0 5px 0 10px;
`;

const LandingIcon = styled(BiSolidPlaneLand)`
  font-size: 25px;
  margin: 0 5px 0 10px;
`;

const LuggageIcon = styled(MdNoLuggage)`
  font-size: 25px;
  margin: 0 5px 0 10px;
`;

const COGIcon = styled(GiRadialBalance)`
  font-size: 25px;
  margin: 0 5px 0 10px;
`;

interface Props {
  profileId: number;
  handlAddWeightBalanceprofile: () => void;
  instructions: string[];
}

const WeightBalanceSection = ({
  profileId,
  handlAddWeightBalanceprofile,
  instructions,
}: Props) => {
  const queryClient = useQueryClient();
  const weightBalanceData =
    queryClient.getQueryData<WeightAndBalanceDataFromAPI>([
      "AircraftWeightBalanceData",
      profileId,
    ]);

  console.log(weightBalanceData);

  const dataList = [
    {
      key: "center_of_gravity_in",
      title: "CoG [in]",
      icon: <COGIcon />,
      data: `${weightBalanceData?.center_of_gravity_in || ""}`,
    },
    {
      key: "empty_weight_lb",
      title: "Empty Weight [lb]",
      icon: <EmptyIcon />,
      data: `${weightBalanceData?.empty_weight_lb || ""}`,
    },
    {
      key: "max_ramp_weight_lb",
      title: "Max Ramp Weight [lb]",
      icon: <RampIcon />,
      data: `${weightBalanceData?.max_ramp_weight_lb || ""}`,
    },
    {
      key: "max_takeoff_weight_lb",
      title: "Max Takeoff Weight [lb]",
      icon: <TakeoffIcon />,
      data: `${weightBalanceData?.max_takeoff_weight_lb || ""}`,
    },
    {
      key: "max_landing_weight_lb",
      title: "Max Landing Weight [lb]",
      icon: <LandingIcon />,
      data: `${weightBalanceData?.max_landing_weight_lb || ""}`,
    },
    {
      key: "baggage_allowance_lb",
      title: "Baggage Allowance [lb]",
      icon: <LuggageIcon />,
      data: `${weightBalanceData?.baggage_allowance_lb || ""}`,
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
          handleEdit: () => {},
          handleDelete: () => {},
          permissions: "delete" as "delete",
        }))
      : [],
  };

  return (
    <>
      <DataTableList dataList={dataList} />
      <ExpandibleTable
        tableData={tableData}
        disableAdd={tableData.rows.length >= 4}
        emptyTableMessage="No W&B Profiles have been added..."
        title="W&B Profiles"
        hanldeAdd={handlAddWeightBalanceprofile}
        otherComponent={
          <HtmlInstructionsList>
            {instructions.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </HtmlInstructionsList>
        }
      />
    </>
  );
};

export default WeightBalanceSection;
