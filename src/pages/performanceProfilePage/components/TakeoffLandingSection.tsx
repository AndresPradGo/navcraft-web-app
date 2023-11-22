import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { styled } from "styled-components";

import DataTableList from "../../../components/common/DataTableList";
import ExpandibleTable from "../../../components/common/ExpandibleTable";
import { useModal, Modal } from "../../../components/common/modal";

interface Props {
  profileId: number;
  isTakeoff: boolean;
}

const TakeoffLandingSection = ({ profileId, isTakeoff }: Props) => {
  const dataList = [
    {
      key: "percent_decrease_knot_headwind",
      title: "Per knot of headwind, decrease distance by:",
      data: `${"5.32%" || "-"}`,
    },
    {
      key: "percent_increase_knot_tailwind",
      title: "Per knot of tailwind, increase distance by:",
      data: `${"10%" || "-"}`,
    },
  ];

  return (
    <>
      <DataTableList dataList={dataList} maxWidth={800} margin="35px 0 0" />
    </>
  );
};

export default TakeoffLandingSection;
