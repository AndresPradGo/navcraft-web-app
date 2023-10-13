import { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";
import { styled } from "styled-components";

import useAerodromesData from "./useAerodromesData";
import Table from "../../components/common/table";
import Loader from "../../components/Loader";
import Button from "../../components/common/button/index";

interface HtmlTagProps {
  $isOpen: boolean;
}
const HtmlContainer = styled.div`
  margin-top: 100px;
  width: 100%;
`;

const HtmlTitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 5px;
  padding: 0 0 10px 5px;
  border-bottom: 1px solid var(--color-grey);

  & div {
    display: flex;
    align-items: center;

    & h3:first-of-type {
      margin: 0;
      color: var(--color-grey-bright);
    }
  }

  @media screen and (min-width: 425px) {
    padding: 0 0 10px 20px;
  }
`;

const ToggleIcon = styled(BsChevronDown)<HtmlTagProps>`
  color: var(--color-grey);
  cursor: pointer;
  margin-right: 5px;
  font-size: 25px;
  transform: rotate(${(props) => (props.$isOpen ? "0deg" : "-90deg")});
  transition: 0.3s transform linear;

  &:hover,
  &:focus {
    color: var(--color-white);
  }

  @media screen and (min-width: 425px) {
    margin-right: 20px;
  }
`;

const HtmlTableContainer = styled.div<HtmlTagProps>`
  transition: max-height 0.3s, padding 0.3s, opacity 0.3s;
  border-bottom: 1px solid var(--color-grey);
  padding: ${(props) => (props.$isOpen ? "15px" : "0px 15px")};
  max-height: ${(props) => (props.$isOpen ? "10000vh" : "0px")};
  opacity: ${(props) => (props.$isOpen ? "1" : "0")};
  overflow: hidden;
`;

const AerodromesTable = ({ userId }: { userId: number }) => {
  const [isOpen, setIsOpen] = useState(true);
  const { data: aerodromes, isLoading } = useAerodromesData(userId);

  const tableData = {
    keys: [
      "code",
      "name",
      "latitude",
      "longitude",
      "elevation",
      "runways",
      "variation",
    ],
    headers: {
      code: "Code",
      name: "Name",
      latitude: "Latitude",
      longitude: "Longitude",
      elevation: "Elevation [ft]",
      runways: "Runways",
      variation: "Magnetic Var",
    },
    rows: aerodromes
      ? aerodromes.map((aerodrome) => ({
          ...aerodrome,
          handleEdit: () => {},
          handleDelete: () => {},
          permissions: "delete" as "delete",
        }))
      : [],
    breakingPoint: 1000,
  };

  const sortData = [
    {
      title: "Code",
      key: "code",
    },
    {
      title: "Name",
      key: "name",
    },
  ];

  return (
    <HtmlContainer>
      <HtmlTitleContainer>
        <div>
          <ToggleIcon onClick={() => setIsOpen(!isOpen)} $isOpen={isOpen} />
          <h3>Saved Aerodromes</h3>
        </div>
        <Button
          borderRadious={100}
          padding="5px"
          height="30px"
          backgroundColor="var(--color-grey)"
          backgroundHoverColor="var(--color-white)"
          color="var(--color-primary-dark)"
          hoverColor="var(--color-primary-dark)"
          margin="0 20px 0 0px"
          fontSize={18}
        >
          <AiOutlinePlus />
        </Button>
      </HtmlTitleContainer>
      <HtmlTableContainer $isOpen={isOpen}>
        {isLoading ? (
          <Loader />
        ) : (
          <Table
            tableData={tableData}
            sortColumnOptions={sortData}
            pageSize={5}
            emptyTableMessage="No Aerodromes saved..."
          />
        )}
      </HtmlTableContainer>
    </HtmlContainer>
  );
};

export default AerodromesTable;
