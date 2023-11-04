import { MdAddRoad } from "react-icons/md";
import { PiAirTrafficControlFill } from "react-icons/pi";
import { RiDeleteBinLine } from "react-icons/ri";

import { styled } from "styled-components";

import Button from "../../components/common/button";

const HtmlContainer = styled.div`
  margin: 40px 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 0 15px;
`;

const HtmlButtonList = styled.div`
  border-top: 1px solid var(--color-grey);
  border-bottom: 1px solid var(--color-grey);
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 15px;

  @media screen and (min-width: 1280px) {
    padding: 15px 47px;
  }
`;

const AddRunwayIcon = styled(MdAddRoad)`
  font-size: 25px;
  margin-left: 5px;
`;

const AerodromeIcon = styled(PiAirTrafficControlFill)`
  font-size: 25px;
  margin-left: 5px;
`;

const DeleteIcon = styled(RiDeleteBinLine)`
  font-size: 20px;
  margin-left: 5px;
`;

export interface Props {
  handleDeleteAerodrome: () => void;
  handleAddRunway: () => void;
  handleEditAerodrome: () => void;
}

const SideBarContent = ({
  handleDeleteAerodrome,
  handleAddRunway,
  handleEditAerodrome,
}: Props) => {
  const commonStyles = {
    width: "100%",
    height: "40px",
    fontSize: 15,
    margin: "10px 0",
    fill: true,
    borderWidth: 3,
    borderRadious: 4,
  };

  const buttons = [
    {
      text: "Edit Aerodrome",
      icon: <AerodromeIcon />,
      styles: {
        ...commonStyles,
        color: "var(--color-white)",
        hoverColor: "var(--color-white)",
        backgroundColor: "var(--color-primary-bright)",
        backgroundHoverColor: "var(--color-primary-light)",
      },
      onClick: () => {
        handleEditAerodrome();
      },
    },
    {
      text: "Add Runway",
      icon: <AddRunwayIcon />,
      styles: {
        ...commonStyles,
        color: "var(--color-white)",
        hoverColor: "var(--color-white)",
        backgroundColor: "var(--color-primary-bright)",
        backgroundHoverColor: "var(--color-primary-light)",
      },
      onClick: () => {
        handleAddRunway();
      },
    },
    {
      text: "Delete Aerodrome",
      icon: <DeleteIcon />,
      styles: {
        ...commonStyles,
        color: "var(--color-white)",
        hoverColor: "var(--color-white)",
        backgroundColor: "var(--color-warning)",
        backgroundHoverColor: "var(--color-warning-hover)",
      },
      onClick: () => {
        handleDeleteAerodrome();
      },
    },
  ];

  return (
    <HtmlContainer>
      <HtmlButtonList>
        {buttons.map((button, index) => (
          <Button key={index} {...button.styles} handleClick={button.onClick}>
            {button.text}
            {button.icon}
          </Button>
        ))}
      </HtmlButtonList>
    </HtmlContainer>
  );
};

export default SideBarContent;
