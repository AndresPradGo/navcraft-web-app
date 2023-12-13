import { BsDroplet, BsDropletFill, BsDropletHalf } from "react-icons/bs";

interface Props {
  cx?: number;
  cy?: number;

  label: string;
}

const CustomizedDot = ({
  cx,
  cy,

  label,
}: Props) => {
  if (label === "ZFW")
    return <BsDroplet x={cx || 1} y={cy || 1} color="var(--color-white)" />;
  if (label === "Landing")
    return <BsDropletHalf x={cx || 1} y={cy || 1} color="var(--color-white)" />;
  return <BsDropletFill x={cx || 1} y={cy || 1} color="var(--color-white)" />;
};

export default CustomizedDot;
