import { BsPersonFillAdd } from "react-icons/bs";
import { FaUserPen } from "react-icons/fa6";
import { MdOutlineLogout, MdOutlineConnectingAirports } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { TbMailCog, TbLockCog, TbMapPinPlus } from "react-icons/tb";
import { styled } from "styled-components";
import { useQueryClient } from "@tanstack/react-query";

import Button from "../../../components/common/button";
import { useNavigate } from "react-router-dom";

const HtmlContainer = styled.div`
  margin: 15px 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 0 15px;
`;

const HtmlButtonList = styled.div`
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

const HtmlButtonListWithBorder = styled(HtmlButtonList)`
  border-top: 1px solid var(--color-grey);
`;

const EditIcon = styled(FaUserPen)`
  font-size: 20px;
  margin-left: 5px;
`;

const EmailIcon = styled(TbMailCog)`
  font-size: 20px;
  margin-left: 5px;
`;

const PasswordIcon = styled(TbLockCog)`
  font-size: 20px;
  margin-left: 5px;
`;

const LogoutIcon = styled(MdOutlineLogout)`
  font-size: 20px;
  margin-left: 5px;
`;

const DeleteIcon = styled(RiDeleteBinLine)`
  font-size: 20px;
  margin-left: 5px;
`;

const AddPassengerIcon = styled(BsPersonFillAdd)`
  font-size: 20px;
  margin-left: 5px;
`;

const AddAerodromeIcon = styled(MdOutlineConnectingAirports)`
  font-size: 30px;
  margin-left: 5px;
`;

const AddWaypointIcon = styled(TbMapPinPlus)`
  font-size: 20px;
  margin-left: 5px;
`;

export interface Props {
  handleEditProfileOpen: () => void;
  handleChangeEmailOpen: () => void;
  handleChangePasswordOpen: () => void;
  handleDeleteAccountOpen: () => void;
  handleAddPassenger: () => void;
  handleAddAerodrome: () => void;
  handleAddWaypoint: () => void;
}

const SideBarContent = ({
  handleEditProfileOpen,
  handleChangeEmailOpen,
  handleChangePasswordOpen,
  handleDeleteAccountOpen,
  handleAddPassenger,
  handleAddAerodrome,
  handleAddWaypoint,
}: Props) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const commonStyles = {
    color: "var(--color-white)",
    hoverColor: "var(--color-white)",
    backgroundColor: "var(--color-primary-bright)",
    backgroundHoverColor: "var(--color-primary-light)",
    width: "100%",
    height: "40px",
    fontSize: 15,
    margin: "5px 0",
    fill: true,
    borderWidth: 3,
    borderRadious: 4,
  };
  const buttons = [
    {
      text: "Edit Profile",
      icon: <EditIcon />,
      styles: {
        ...commonStyles,
      },
      onClick: () => {
        handleEditProfileOpen();
      },
    },
    {
      text: "Change Email",
      icon: <EmailIcon />,
      styles: {
        ...commonStyles,
      },
      onClick: () => {
        handleChangeEmailOpen();
      },
    },
    {
      text: "Change Password",
      icon: <PasswordIcon />,
      styles: {
        ...commonStyles,
      },
      onClick: () => {
        handleChangePasswordOpen();
      },
    },
  ];

  const tableButtons = [
    {
      text: "Add Passenger",
      icon: <AddPassengerIcon />,
      styles: {
        ...commonStyles,
      },
      onClick: () => {
        handleAddPassenger();
      },
    },
    {
      text: "Add Aerodrome",
      icon: <AddAerodromeIcon />,
      styles: {
        ...commonStyles,
      },
      onClick: () => {
        handleAddAerodrome();
      },
    },
    {
      text: "Add Waypoint",
      icon: <AddWaypointIcon />,
      styles: {
        ...commonStyles,
      },
      onClick: () => {
        handleAddWaypoint();
      },
    },
  ];

  const exitButtons = [
    {
      text: "Logout",
      icon: <LogoutIcon />,
      styles: {
        ...commonStyles,
        color: "var(--color-grey)",
        hoverColor: "var(--color-white)",
        backgroundColor: "var(--color-grey)",
        backgroundHoverColor: "var(--color-white)",
        fill: false,
      },
      onClick: () => {
        queryClient.clear();
        localStorage.removeItem("token");
        localStorage.removeItem("token_type");
        navigate("/login");
      },
    },
    {
      text: "Delete Account",
      icon: <DeleteIcon />,
      styles: {
        ...commonStyles,
        color: "var(--color-white)",
        hoverColor: "var(--color-white)",
        backgroundColor: "var(--color-warning)",
        backgroundHoverColor: "var(--color-warning-hover)",
      },
      onClick: () => {
        handleDeleteAccountOpen();
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
      <HtmlButtonListWithBorder>
        {tableButtons.map((button, index) => (
          <Button key={index} {...button.styles} handleClick={button.onClick}>
            {button.text}
            {button.icon}
          </Button>
        ))}
      </HtmlButtonListWithBorder>
      <HtmlButtonListWithBorder>
        {exitButtons.map((button, index) => (
          <Button key={index} {...button.styles} handleClick={button.onClick}>
            {button.text}
            {button.icon}
          </Button>
        ))}
      </HtmlButtonListWithBorder>
    </HtmlContainer>
  );
};

export default SideBarContent;
