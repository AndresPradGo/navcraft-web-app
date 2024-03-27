import { useState, MouseEvent } from 'react';
import {
  ComposedChart,
  Area,
  Line,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Label,
  LabelList,
} from 'recharts';
import { styled } from 'styled-components';
import useSideBar from './sidebar/useSideBar';

interface HtmlTagProps {
  $SideBarIsOpen: boolean;
  $width: number;
  $margin: string;
}

const HtmlContainer = styled.div<HtmlTagProps>`
  width: 100%;
  max-width: ${(props) => props.$width}px;
  font-size: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: center;
  justify-content: center;
  margin: ${(props) => props.$margin};

  & ul {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  }

  & h1 {
    color: var(--color-grey-bright);
    margin: 5px 0 0;
    font-size: 16px;
  }

  @media screen and (min-width: 635px) {
    & h1 {
      font-size: ${(props) => (props.$SideBarIsOpen ? '16px' : '28px')};
    }
    font-size: ${(props) => (props.$SideBarIsOpen ? '10px' : '16px')};
  }

  @media screen and (min-width: 950px) {
    font-size: 16px;
  }
`;

interface WeightBalanceLimits {
  weight_lb: number;
  cg_location_in: number;
  size: number;
  label?: string;
}

interface WeightBalanceProfile {
  name: string;
  limits: WeightBalanceLimits[];
}

interface WeightBalanceType {
  zfw: WeightBalanceLimits;
  landing: WeightBalanceLimits;
  takeoff: WeightBalanceLimits;
}

interface Props {
  profiles: WeightBalanceProfile[];
  maxTakeoff?: number;
  showMTOW?: boolean;
  title?: string;
  hideLegend?: boolean;
  width?: number;
  margin?: string;
  weightBalance?: WeightBalanceType;
}

const WeightBalanceGraph = ({
  profiles,
  maxTakeoff,
  showMTOW,
  title,
  hideLegend,
  width,
  margin,
  weightBalance,
}: Props) => {
  const { sideBarIsExpanded } = useSideBar();
  const [selected, setSelected] = useState(profiles.map(() => false));
  const [mouseOver, setMouseOver] = useState(profiles.map(() => false));
  const colors = [
    'var(--color-nav-1)',
    'var(--color-nav-2)',
    'var(--color-nav-3)',
    'var(--color-nav-4)',
  ];

  const getYDomain = (dataMin: number, dataMax: number): [number, number] => {
    const MTOW = maxTakeoff ? maxTakeoff / 1000 : undefined;
    const range = (MTOW || dataMax) - dataMin;
    const gap = range / 9;
    const top = Math.ceil((dataMin + gap * 10) * 100) / 100;
    return [Math.ceil(dataMin * 100) / 100, top];
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

  const renderResultCustomizedLabel = (props: any) => {
    const { viewBox, value } = props;

    return (
      <g>
        <text
          x={viewBox.x + 35}
          y={viewBox.y + 10}
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
    <HtmlContainer
      $SideBarIsOpen={sideBarIsExpanded}
      $width={width ? width : 800}
      $margin={margin ? margin : '0'}
    >
      {title ? <h1>{title}</h1> : null}
      <ResponsiveContainer width={'100%'} aspect={1.4} debounce={100}>
        <ComposedChart margin={{ top: 0, right: 25, left: 0, bottom: 15 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-grey" />
          <XAxis
            interval="preserveStart"
            tickCount={11}
            minTickGap={7}
            dataKey="cg_location_in"
            type="number"
            allowDuplicatedCategory={false}
            domain={['dataMin', 'auto']}
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
          <ZAxis type="number" dataKey="size" range={[1, 120]} />
          {!hideLegend ? (
            <Legend
              verticalAlign="top"
              height={36}
              wrapperStyle={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
              onMouseOver={!weightBalance ? handleMouseEnterLegend : () => {}}
              onMouseOut={!weightBalance ? handleMouseLeaveLegend : () => {}}
            />
          ) : null}
          {profiles.map((p, i) => (
            <Area
              onMouseEnter={!weightBalance ? handleMouseEnterGraph : () => {}}
              onMouseLeave={!weightBalance ? handleMouseLeaveGraph : () => {}}
              dataKey="weight_lb"
              data={p.limits}
              name={p.name}
              key={p.name}
              stroke={colors[i]}
              fill={colors[i]}
              dot={
                selected[i] || mouseOver[i]
                  ? {
                      stroke: 'var(--color-white)',
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
          {weightBalance ? (
            <>
              <Line
                dataKey="weight_lb"
                stroke="var(--color-contrast)"
                data={[
                  {
                    cg_location_in: weightBalance.zfw.cg_location_in,
                    weight_lb: weightBalance.zfw.weight_lb,
                  },
                  {
                    cg_location_in: weightBalance.landing.cg_location_in,
                    weight_lb: weightBalance.landing.weight_lb,
                  },
                  {
                    cg_location_in: weightBalance.takeoff.cg_location_in,
                    weight_lb: weightBalance.takeoff.weight_lb,
                  },
                ]}
                dot={false}
                strokeWidth={2}
                legendType="none"
              />
              <Scatter
                name="Zero Fuel"
                data={[weightBalance.zfw]}
                fill="var(--color-contrast)"
                stroke="var(--color-white)"
                strokeWidth={2}
                legendType="square"
                shape="square"
              >
                <LabelList
                  dataKey="label"
                  position="right"
                  content={renderResultCustomizedLabel}
                />
              </Scatter>
              <Scatter
                name="Landing"
                data={[weightBalance.landing]}
                fill="var(--color-contrast)"
                stroke="var(--color-white)"
                strokeWidth={2}
                legendType="cross"
                shape="cross"
              >
                <LabelList
                  dataKey="label"
                  position="right"
                  content={renderResultCustomizedLabel}
                />
              </Scatter>
              <Scatter
                name="Takeoff"
                data={[weightBalance.takeoff]}
                fill="var(--color-contrast)"
                stroke="var(--color-white)"
                strokeWidth={2}
                legendType="circle"
                shape="circle"
              >
                <LabelList
                  dataKey="label"
                  position="right"
                  content={renderResultCustomizedLabel}
                />
              </Scatter>
            </>
          ) : null}
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
