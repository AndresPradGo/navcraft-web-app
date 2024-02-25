import { BiSolidEditAlt } from "react-icons/bi";
import { FaTools } from "react-icons/fa";
import { MdAddRoad } from "react-icons/md";
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
  flex-shrink: 0;
`;

const ToolsIcon = styled(FaTools)`
  font-size: 20px;
  margin-right: 8px;
  padding-bottom: 3px;
`;

const AddRunwayIcon = styled(MdAddRoad)`
  font-size: 25px;
  margin-left: 5px;
`;

const EditIcon = styled(BiSolidEditAlt)`
  font-size: 20px;
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
    color: "var(--color-grey-bright)",
    hoverColor: "var(--color-white)",
    backgroundColor: "var(--color-primary-bright)",
    backgroundHoverColor: "var(--color-primary-light)",
  };

  const buttons = [
    {
      text: "Edit Aerodrome",
      icon: <EditIcon />,
      styles: {
        ...commonStyles,
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
      <SideBarTitle>Aerodrome</SideBarTitle>
      <SideBarBtnList
        titleIcon={<ToolsIcon />}
        title=" Edit Aerodrome Tools"
        buttons={buttons}
      />
    </HtmlContainer>
  );
};

export default SideBarContent;
