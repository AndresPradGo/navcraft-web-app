import { FaTools } from "react-icons/fa";
import { FaUser, FaUserShield } from "react-icons/fa6";
import { IoAirplane, IoAirplaneOutline } from "react-icons/io5";
import { styled } from "styled-components";

import SideBarIndex, {
  PageSectionDataType,
} from "../../components/common/SideBarIndex";
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

const AddAircraftIcon = styled(IoAirplane)`
  font-size: 20px;
  margin-left: 5px;
`;

const AddModelIcon = styled(IoAirplaneOutline)`
  font-size: 20px;
  margin-left: 5px;
`;

const UserIcon = styled(FaUser)`
  font-size: 20px;
  margin-right: 8px;
  padding-bottom: 3px;
`;

const AdminIcon = styled(FaUserShield)`
  font-size: 20px;
  margin-right: 8px;
  padding-bottom: 3px;
`;

const ToolsIcon = styled(FaTools)`
  font-size: 20px;
  margin-right: 8px;
  padding-bottom: 3px;
`;

interface Props {
  handleAddAircraft: () => void;
  handleAddModel: () => void;
  isAdmin: boolean;
  handleChangeSection: (index: number) => void;
  sectionIndex: number;
  sectionOptions: PageSectionDataType[];
}

const SideBarContent = ({
  handleAddAircraft,
  handleAddModel,
  isAdmin,
  handleChangeSection,
  sectionIndex,
  sectionOptions,
}: Props) => {
  const baseStyles = {
    width: "100%",
    height: "40px",
    fontSize: 15,
    margin: "5px 0",
    fill: true,
    borderWidth: 3,
    borderRadious: 4,
    color: "var(--color-grey-bright)",
    hoverColor: "var(--color-white)",
    backgroundColor: "var(--color-primary-bright)",
    backgroundHoverColor: "var(--color-primary-light)",
  };

  const userButton = [
    {
      text: "Add Aircraft",
      icon: <AddAircraftIcon />,
      styles: baseStyles,
      onClick: handleAddAircraft,
    },
  ];

  const adminButton = [
    {
      text: "Add Model",
      icon: <AddModelIcon />,
      styles: baseStyles,
      onClick: handleAddModel,
    },
  ];

  return (
    <HtmlContainer>
      <SideBarTitle>Aircraft List</SideBarTitle>
      <SideBarIndex
        handleChangeSection={handleChangeSection}
        selectedIdx={sectionIndex}
        sectionOptions={sectionOptions}
      />
      {isAdmin ? (
        <>
          <SideBarBtnList
            titleIcon={<UserIcon />}
            title="User Tools"
            buttons={userButton}
          />
          <SideBarBtnList
            titleIcon={<AdminIcon />}
            title="Admin Tools"
            buttons={adminButton}
          />
        </>
      ) : (
        <SideBarBtnList
          titleIcon={<ToolsIcon />}
          title="Tools"
          buttons={userButton}
        />
      )}
    </HtmlContainer>
  );
};

export default SideBarContent;
