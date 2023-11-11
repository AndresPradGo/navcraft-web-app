import { FaTools } from "react-icons/fa";
import { FaUser, FaUserShield } from "react-icons/fa6";
import { IoAirplane, IoAirplaneOutline } from "react-icons/io5";
import { styled } from "styled-components";

import Button from "../../components/common/button";
import SideBarIndex, {
  PageSectionDataType,
} from "../../components/SideBarIndex";

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
  }

  & div {
    width: 100%;
    padding: 10px 8px;
    border-top: 1px solid var(--color-grey);
  }

  & i {
    height: 40px;
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
    color: "var(--color-white)",
    hoverColor: "var(--color-white)",
    backgroundColor: "var(--color-primary-bright)",
    backgroundHoverColor: "var(--color-primary-light)",
  };

  const userButton = {
    text: "Add Aircraft",
    icon: <AddAircraftIcon />,
    styles: baseStyles,
    onClick: handleAddAircraft,
  };

  const adminButton = {
    text: "Add Model",
    icon: <AddModelIcon />,
    styles: baseStyles,
    onClick: handleAddModel,
  };

  return (
    <HtmlContainer>
      <SideBarIndex
        handleChangeSection={handleChangeSection}
        selectedIdx={sectionIndex}
        sectionOptions={sectionOptions}
      />
      {isAdmin ? (
        <>
          <HtmlButtonList>
            <h3>
              <UserIcon />
              {"User Tools"}
            </h3>
            <div>
              <Button {...userButton.styles} handleClick={userButton.onClick}>
                {userButton.text}
                {userButton.icon}
              </Button>
            </div>
          </HtmlButtonList>
          <HtmlButtonList>
            <h3>
              <AdminIcon />
              {"Admin Tools"}
            </h3>
            <div>
              <Button {...adminButton.styles} handleClick={adminButton.onClick}>
                {adminButton.text}
                {adminButton.icon}
              </Button>
            </div>
          </HtmlButtonList>
        </>
      ) : (
        <HtmlButtonList>
          <h3>
            <ToolsIcon />
            {"Tools"}
          </h3>
          <div>
            <Button {...userButton.styles} handleClick={userButton.onClick}>
              {userButton.text}
              {userButton.icon}
            </Button>
          </div>
        </HtmlButtonList>
      )}
    </HtmlContainer>
  );
};

export default SideBarContent;
