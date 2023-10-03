import { styled } from "styled-components";
import { RiDeleteBinLine, RiEditFill } from "react-icons/ri";

import ContentLayout from "./ContentLayout";
import WithSideBar from "../components/sidebar/WithSideBar";
import Table from "../components/common/table/Table";
import Button from "../components/common/Button";

const DeleteIcon = styled(RiDeleteBinLine)`
  font-size: 14px;
`;

const EditIcon = styled(RiEditFill)`
  font-size: 14px;
`;

const HtmlButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  @media screen and (min-width: 1024px) {
    justify-content: space-evenly;
  }
`;

const flights = () => {
  const flights = [
    {
      id: 1,
      route: "CZBB - CAT1",
      departure: "CZBB",
      destination: "CAT1",
      aircraft: "C-GQSS",
      date: "March 6, 2023",
      etd: "17:00 UTC",
      duration: "00d:03h:30m",
      select: (
        <HtmlButtonGroup>
          <Button
            href="/flights/1"
            height={24}
            spaceChildren={true}
            margin={"5px"}
            borderRadious={40}
          >
            EDIT
            <EditIcon />
          </Button>
          <Button
            color={"var(--color-white)"}
            hoverColor={"var(--color-white)"}
            backgroundColor={"var(--color-warning)"}
            backgroundHoverColor={"var(--color-warning-hover)"}
            height={24}
            spaceChildren={true}
            margin={"5px"}
            borderRadious={40}
          >
            DELETE
            <DeleteIcon />
          </Button>
        </HtmlButtonGroup>
      ),
    },
    {
      id: 2,
      route: "CYXX - CYPW",
      departure: "CYXX",
      destination: "CYPW",
      aircraft: "C-GBJD",
      date: "March 6, 2023",
      etd: "17:00 UTC",
      duration: "00d:02h:40m",
      select: (
        <HtmlButtonGroup>
          <Button
            href="/flights/2"
            height={24}
            spaceChildren={true}
            margin={"5px"}
            borderRadious={40}
          >
            EDIT
            <EditIcon />
          </Button>
          <Button
            color={"var(--color-white)"}
            hoverColor={"var(--color-white)"}
            backgroundColor={"var(--color-warning)"}
            backgroundHoverColor={"var(--color-warning-hover)"}
            height={24}
            spaceChildren={true}
            margin={"5px"}
            borderRadious={40}
          >
            DELETE
            <DeleteIcon />
          </Button>
        </HtmlButtonGroup>
      ),
    },
  ];

  const headings = {
    route: "Route",
    aircraft: "Aircraft",
    date: "Date",
    etd: "ETD",
    duration: "Duration",
    selesct: "",
  };

  const keys = ["route", "aircraft", "date", "etd", "duration", "select"];

  return (
    <WithSideBar>
      <ContentLayout>
        <Table keys={keys} headers={headings} rows={flights} />
      </ContentLayout>
    </WithSideBar>
  );
};

export default flights;
