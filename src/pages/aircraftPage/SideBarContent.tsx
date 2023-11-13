import { BiSolidEditAlt } from "react-icons/bi";
import { BsSpeedometer } from "react-icons/bs";
import { FaTools } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { styled } from "styled-components";

import SideBarBtnList from "../../components/common/SideBarBtnList";
import SideBarTitle from "../../components/common/SideBarTitle";

const HtmlContainer = styled.div`
  margin: 15px 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 0;
  min-height: 300px;
`;

const ToolsIcon = styled(FaTools)`
  font-size: 20px;
  margin-right: 8px;
  padding-bottom: 3px;
`;

const EditIcon = styled(BiSolidEditAlt)`
  font-size: 20px;
  margin-left: 5px;
`;

const DeleteIcon = styled(RiDeleteBinLine)`
  font-size: 20px;
  margin-left: 5px;
`;

const PerformanceIcon = styled(BsSpeedometer)`
  font-size: 22px;
  margin-left: 5px;
`;

interface Props {
  handleAddProfile: () => void;
  handleEditAircraft: () => void;
  handleDeleteAircraft: () => void;
  canAddProfile: boolean;
}

const SideBarContent = ({
  handleAddProfile,
  handleEditAircraft,
  handleDeleteAircraft,
  canAddProfile,
}: Props) => {
  const commonStyles = {
    width: "100%",
    height: "40px",
    fontSize: 15,
    margin: "10px 0",
    fill: true,
    borderWidth: 3,
    borderRadious: 4,
    color: "var(--color-white)",
    hoverColor: "var(--color-white)",
    backgroundColor: "var(--color-primary-bright)",
    backgroundHoverColor: "var(--color-primary-light)",
  };

  const buttons = [
    {
      text: "Edit Aircraft",
      icon: <EditIcon />,
      styles: commonStyles,
      onClick: handleEditAircraft,
    },
    {
      text: "Add Performance Profile",
      icon: <PerformanceIcon />,
      styles: {
        ...commonStyles,
        disabled: !canAddProfile,
      },
      onClick: canAddProfile ? handleAddProfile : () => {},
    },
    {
      text: "Delete Aircraft",
      icon: <DeleteIcon />,
      styles: {
        ...commonStyles,
        color: "var(--color-white)",
        hoverColor: "var(--color-white)",
        backgroundColor: "var(--color-warning)",
        backgroundHoverColor: "var(--color-warning-hover)",
      },
      onClick: handleDeleteAircraft,
    },
  ];

  return (
    <HtmlContainer>
      <SideBarTitle>Aircraft</SideBarTitle>
      <SideBarBtnList
        titleIcon={<ToolsIcon />}
        title="Edit Aircraft Tools"
        buttons={buttons}
      />
    </HtmlContainer>
  );
};

export default SideBarContent;
