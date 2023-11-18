import { useState, MouseEvent } from "react";
import {
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Label,
  LabelList,
} from "recharts";
import { styled } from "styled-components";
import useSideBar from "./sidebar/useSideBar";

interface HtmlTagProps {
  $SideBarIsOpen: boolean;
}

const HtmlContainer = styled.div<HtmlTagProps>`
  width: 100%;
  max-width: 800px;
  font-size: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  align-self: flex-start;
  margin-top: 35px;

  & ul {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  }

  & h1 {
    color: var(--color-grey-bright);
    margin: 5px 0;
    font-size: 16px;
  }

  @media screen and (min-width: 635px) {
    & h1 {
      font-size: ${(props) => (props.$SideBarIsOpen ? "16px" : "28px")};
    }
    font-size: ${(props) => (props.$SideBarIsOpen ? "10px" : "16px")};
  }

  @media screen and (min-width: 950px) {
    font-size: 16px;
  }
`;

interface WeightBalanceLimits {
  weight_lb: number;
  cg_location_in: number;
  label: string;
}

interface WeightBalanceProfile {
  name: string;
  limits: WeightBalanceLimits[];
}

interface Props {
  profiles: WeightBalanceProfile[];
  maxTakeoff?: number;
  showMTOW?: boolean;
}

const WeightBalanceGraph = ({ profiles, maxTakeoff, showMTOW }: Props) => {
  const { sideBarIsExpanded } = useSideBar();
  const [selected, setSelected] = useState(profiles.map(() => false));
  const [mouseOver, setMouseOver] = useState(profiles.map(() => false));
  const colors = ["#5CD3FF", "#FF33E4", "#31F500", "#FFC71F"];

  const getYDomain = (dataMin: number, dataMax: number): [number, number] => {
    const MTOW = maxTakeoff ? maxTakeoff / 1000 : undefined;
    const range = (MTOW || dataMax) - dataMin;
    const gap = range / 9;
    const top = Math.ceil((dataMin + gap * 10) * 100) / 100;
    return [dataMin, top];
  };

  const handleMouseEnterLegend = (_: {}, index: number) => {
    setSelected((prev) => prev.map((v, i) => (index === i ? true : v)));
  };

  const handleMouseLeaveLegend = (_: {}, index: number) => {
    setSelected((prev) => prev.map((v, i) => (index === i ? false : v)));
  };

  const handleMouseEnterGraph = (e: MouseEvent<SVGElement> | any) => {
    const index = profiles.findIndex((p) => p.name === e.name);
    setMouseOver((prev) => prev.map((v, i) => (index === i ? true : v)));
  };

  const handleMouseLeaveGraph = (e: MouseEvent<SVGElement> | any) => {
    const index = profiles.findIndex((p) => p.name === e.name);
    setMouseOver((prev) => prev.map((v, i) => (index === i ? false : v)));
  };

  const renderCustomizedLabel = (props: any) => {
    const { viewBox, value } = props;

    return (
      <g>
        <text
          x={viewBox.x + 0}
          y={viewBox.y - 12}
          fill="#fff"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {value}
        </text>
      </g>
    );
  };

  return (
    <HtmlContainer $SideBarIsOpen={sideBarIsExpanded}>
      <h1>W&B Profiles</h1>
      <ResponsiveContainer width={"100%"} aspect={1.4} debounce={100}>
        <ComposedChart margin={{ top: 0, right: 25, left: 0, bottom: 15 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            interval="preserveStart"
            tickCount={11}
            minTickGap={7}
            dataKey="cg_location_in"
            type="number"
            allowDuplicatedCategory={false}
            domain={["dataMin", "auto"]}
            allowDataOverflow={true}
          >
            <Label
              height={60}
              value="C.G. Location [in Aft of Datum]"
              offset={-10}
              position="insideBottom"
            />
          </XAxis>
          <YAxis
            interval="preserveStart"
            tickCount={11}
            width={100}
            dataKey="weight_lb"
            type="number"
            domain={([dataMin, dataMax]) => getYDomain(dataMin, dataMax)}
            allowDataOverflow={true}
          >
            <Label
              value="Aircraft Weight [1000 lbs]"
              angle={-90}
              offset={0}
              position="center"
            />
          </YAxis>
          <Legend
            verticalAlign="top"
            height={36}
            wrapperStyle={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
            onMouseOver={handleMouseEnterLegend}
            onMouseOut={handleMouseLeaveLegend}
          />
          {profiles.map((p, i) => (
            <Area
              onMouseEnter={handleMouseEnterGraph}
              onMouseLeave={handleMouseLeaveGraph}
              dataKey="weight_lb"
              data={p.limits}
              name={p.name}
              key={p.name}
              stroke={colors[i]}
              fill={colors[i]}
              dot={
                selected[i] || mouseOver[i]
                  ? {
                      stroke: "var(--color-white)",
                      strokeWidth: 2,
                      fillOpacity: 1,
                      r: 6,
                      fill: colors[i],
                    }
                  : false
              }
              fillOpacity={
                selected[i] ? 0.5 : selected.find((s) => s) ? 0.15 : 0.3
              }
              strokeWidth={selected[i] ? 4 : selected.find((s) => s) ? 0 : 3}
            >
              {mouseOver[i] || selected[i] ? (
                <LabelList
                  dataKey="label"
                  position="right"
                  content={renderCustomizedLabel}
                />
              ) : null}
            </Area>
          ))}
          {showMTOW ? (
            <ReferenceLine
              y={maxTakeoff ? maxTakeoff / 1000 : undefined}
              stroke="var(--color-warning)"
              strokeDasharray="5 5"
              strokeWidth={3}
              isFront={true}
            >
              <Label
                value={`MTOW`}
                offset={0}
                position="insideRight"
                stroke="var(--color-grey-bright)"
                fill="var(--color-grey-bright)"
              />
            </ReferenceLine>
          ) : null}
        </ComposedChart>
      </ResponsiveContainer>
    </HtmlContainer>
  );
};

export default WeightBalanceGraph;
