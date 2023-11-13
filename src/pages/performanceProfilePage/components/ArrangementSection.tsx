import { BsFillFuelPumpFill } from "react-icons/bs";
import { GiMolecule } from "react-icons/gi";
import { styled } from "styled-components";

import DataTableList from "../../../components/common/DataTableList";

const FuelIcon = styled(BsFillFuelPumpFill)`
  font-size: 20px;
  margin: 0 10px 0 0;
`;

const DensityIcon = styled(GiMolecule)`
  font-size: 20px;
  margin: 0 10px 0 0;
`;

interface Props {
  fuel: {
    density: number;
    name: string;
  };
}

const ArrangementSection = ({ fuel }: Props) => {
  return (
    <>
      <DataTableList
        dataList={[
          {
            key: "fuel",
            title: "Fuel",
            icon: <FuelIcon />,
            data: fuel.name,
          },
          {
            key: "density",
            title: "Fuel Density [lb/gal]",
            icon: <DensityIcon />,
            data: `${fuel.density}`,
          },
        ]}
      />
    </>
  );
};

export default ArrangementSection;
