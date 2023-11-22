import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { styled } from "styled-components";

import DataTableList from "../../../components/common/DataTableList";
import ExpandibleTable from "../../../components/common/ExpandibleTable";
import { useModal, Modal } from "../../../components/common/modal";
import { TakeoffLandingDataFromAPI } from "../../../services/takeoffLandingPerformanceDataClient";

interface Props {
  profileId: number;
  isTakeoff: boolean;
}

const TakeoffLandingSection = ({ profileId, isTakeoff }: Props) => {
  const queryClient = useQueryClient();
  const data = queryClient.getQueryData<TakeoffLandingDataFromAPI>([
    isTakeoff ? "takeoffPerformance" : "landingPerformance",
    profileId,
  ]);

  const dataList = [
    {
      key: "percent_decrease_knot_headwind",
      title: "For every knot of headwind, decrease distance by:",
      data: `${
        data?.percent_decrease_knot_headwind
          ? `${data?.percent_decrease_knot_headwind}%`
          : "-"
      }`,
    },
    {
      key: "percent_increase_knot_tailwind",
      title: "For every knot of tailwind, increase distance by:",
      data: `${
        data?.percent_increase_knot_tailwind
          ? `${data?.percent_increase_knot_tailwind}%`
          : "-"
      }`,
    },
  ];

  return (
    <>
      <DataTableList dataList={dataList} maxWidth={800} margin="35px 0 0" />
    </>
  );
};

export default TakeoffLandingSection;
