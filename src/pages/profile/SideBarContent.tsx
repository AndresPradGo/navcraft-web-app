import { FaUserPen } from "react-icons/fa6";
import { MdOutlineLogout } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { TbMailCog, TbLockCog } from "react-icons/tb";
import { styled } from "styled-components";
import { useQueryClient } from "@tanstack/react-query";

import Button from "../../components/common/button/index";
import { useNavigate } from "react-router-dom";

const HtmlButtonList = styled.div`
  margin-top: 50px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 25px;
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

const SideBarContent = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const commonStyles = {
    color: "var(--color-white)",
    hoverColor: "var(--color-white)",
    backgroundColor: "var(--color-primary-light)",
    backgroundHoverColor: "var(--color-primary-bright)",
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
      onClick: () => {},
    },
    {
      text: "Change Email",
      icon: <EmailIcon />,
      styles: {
        ...commonStyles,
      },
      onClick: () => {},
    },
    {
      text: "Change Password",
      icon: <PasswordIcon />,
      styles: {
        ...commonStyles,
      },
      onClick: () => {},
    },
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
        margin: "20px 0 5px",
      },
      onClick: () => {
        queryClient.clear();
        localStorage.removeItem("token");
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
      onClick: () => {},
    },
  ];
  return (
    <HtmlButtonList>
      {buttons.map((button, index) => (
        <Button key={index} {...button.styles} handleClick={button.onClick}>
          {button.text}
          {button.icon}
        </Button>
      ))}
    </HtmlButtonList>
  );
};

export default SideBarContent;
