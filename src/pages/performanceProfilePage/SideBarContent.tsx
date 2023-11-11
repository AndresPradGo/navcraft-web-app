import { styled } from "styled-components";

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

interface Props {
  handleChangeSection: (index: number) => void;
  sectionIndex: number;
  sectionOptions: PageSectionDataType[];
}

const SideBarContent = ({
  handleChangeSection,
  sectionIndex,
  sectionOptions,
}: Props) => {
  return (
    <HtmlContainer>
      <SideBarIndex
        handleChangeSection={handleChangeSection}
        selectedIdx={sectionIndex}
        sectionOptions={sectionOptions}
      />
    </HtmlContainer>
  );
};

export default SideBarContent;
