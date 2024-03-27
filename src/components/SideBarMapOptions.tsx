import { ReactNode } from 'react';
import { FaMapMarkedAlt } from 'react-icons/fa';
import { GrMapLocation } from 'react-icons/gr';
import { TbMapOff } from 'react-icons/tb';
import { styled } from 'styled-components';

import Button from './common/button';
import type { ReactIconType } from '../services/reactIconEntity';

const HtmlButtonList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 15px 8px;

  & h3 {
    padding: 0 10px;
    color: var(--color-grey-bright);
    margin: 0;
    display: flex;
    align-items: center;
    width: 100%;

    & svg {
      font-size: 24px;
      margin-right: 8px;
      padding-bottom: 3px;
    }
  }

  & div {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    padding: 10px 8px;
    border-top: 1px solid var(--color-grey);
  }

  @media screen and (min-width: 635px) {
    padding: 10px;

    & div {
      padding: 10px 13px;
    }
  }

  @media screen and (min-width: 1280px) {
    padding: 18px;

    & div {
      padding: 10px 18px;
    }
  }
`;

interface InputProps {
  $color: string;
}
const HtmlCheckbox = styled.label<InputProps>`
  display: flex;
  flex-grow: 0;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s linear;
  color: var(--color-grey-bright);
  padding: 10px 10px 10px 20px;
  cursor: pointer;

  &:hover,
  &:focus {
  }

  & input[type='checkbox'] {
    cursor: pointer;
    margin: 0;
    min-height: 15px;
    min-width: 15px;
    transition: all 0.2s linear;
  }

  & span {
    display: flex;
    align-items: center;
    text-align: left;
    flex-grow: 1;
    cursor: pointer;
    margin-left: 10px;
    text-wrap: wrap;
    color: ${(props) => props.$color};

    & svg {
      margin-right: 5px;
      font-size: 25px;
    }
  }
`;

const MapIcon = styled(GrMapLocation as ReactIconType)`
  font-size: 23px;
`;

const CloseMapIcon = styled(TbMapOff as ReactIconType)`
  font-size: 25px;
`;

export interface MapStateType {
  open: boolean;
  showAerodromes: boolean;
  showVfrWaypoints: boolean;
  showSavedAerodromes: boolean;
  showSavedWaypoints: boolean;
  showCharts: boolean;
}

export interface MapInputStyleType {
  key: keyof MapStateType;
  icon: ReactNode;
  text: string;
  color: string;
}

interface Props {
  mapState: MapStateType;
  mapStateSetter: (key: keyof MapStateType, value: boolean) => void;
  inputs: MapInputStyleType[];
  disableBtn: boolean;
}

const SideBarMapOptions = ({
  mapState,
  mapStateSetter,
  inputs,
  disableBtn,
}: Props) => {
  const btnStyles = {
    width: '100%',
    height: '40px',
    fontSize: 15,
    margin: '5px 0',
    fill: true,
    borderWidth: 3,
    borderRadious: 4,
    color: 'var(--color-primary-dark)',
    hoverColor: 'var(--color-grey-dark)',
    backgroundColor: 'var(--color-contrast)',
    backgroundHoverColor: 'var(--color-contrast-hover)',
    onlyHover: true,
  };

  return (
    <HtmlButtonList>
      <h3>
        <FaMapMarkedAlt />
        Map Tools
      </h3>
      <div>
        {mapState.open ? (
          <Button
            {...btnStyles}
            handleClick={() => {
              mapStateSetter('open', false);
            }}
          >
            Close Map
            <CloseMapIcon />
          </Button>
        ) : (
          <Button
            {...btnStyles}
            disabled={disableBtn}
            handleClick={() => {
              mapStateSetter('open', true);
            }}
          >
            Open Map
            <MapIcon />
          </Button>
        )}
        {inputs.map((filter) => (
          <HtmlCheckbox
            key={`checkbox-${filter.key}`}
            htmlFor={`checkbox-${filter.key}`}
            $color={mapState[filter.key] ? filter.color : 'grey'}
          >
            <input
              type="checkbox"
              id={`checkbox-${filter.key}`}
              onChange={() => mapStateSetter(filter.key, !mapState[filter.key])}
              checked={mapState[filter.key]}
            />
            <span>
              {filter.icon}
              {filter.text}
            </span>
          </HtmlCheckbox>
        ))}
      </div>
    </HtmlButtonList>
  );
};

export default SideBarMapOptions;
