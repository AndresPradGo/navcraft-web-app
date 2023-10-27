import { useState } from "react";
import { Navigate } from "react-router-dom";
import { FaUsersGear } from "react-icons/fa6";
import { styled } from "styled-components";

import { ContentLayout } from "../layout";
import useAuth from "../../hooks/useAuth";
import Loader from "../../components/Loader";
import Table from "../../components/common/table";
import { Modal, useModal } from "../../components/common/modal";
import useUsersData from "./useUsersData";

const HtmlContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-wrap: wrap;
  text-wrap: nowrap;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

const HtmlTitleContainer = styled.div`
  & h1:first-of-type {
    display: flex;
    align-items: center;
    margin: 10px 0;
    font-size: 25px;
    text-wrap: wrap;
    line-height: 0.98;

    & svg {
      flex-shrink: 0;
      font-size: 40px;
      margin: 0 5px 0 0;
    }

    @media screen and (min-width: 425px) {
      font-size: 35px;

      & svg {
        margin: 0 10px 0 0;
        font-size: 50px;
      }
    }
  }
`;

const HtmlTableContainer = styled.div`
  margin: 50px 0 0;
  width: 100%;
`;

const Users = () => {
  const user = useAuth();
  const userIsMaster = user && user.is_master;
  if (!userIsMaster) return <Navigate to="/flights" />;

  const [userId, setUserId] = useState<number>(0);
  const { data: users, isLoading, error } = useUsersData();
  const deleteModal = useModal();
  const editModal = useModal();

  const tableData = {
    keys: ["id", "email", "name", "level", "is_active", "weight_lb"],
    headers: {
      id: "ID",
      email: "Email",
      name: "Name",
      level: "Level",
      is_active: "Active",
      weight_lb: "Weight [lb]",
    },
    rows:
      !error && users
        ? users.map((user) => ({
            id: user.id,
            email: user.email,
            name: user.name,
            level: user.is_master ? "Master" : user.is_admin ? "Admin" : "User",
            is_active: user.is_active ? "Yes" : "No",
            weight_lb: user.weight_lb,
            handleEdit: () => {
              setUserId(user.id);
              editModal.handleOpen();
            },
            handleDelete: () => {
              setUserId(user.id);
              deleteModal.handleOpen();
            },
            permissions: "delete" as "delete",
          }))
        : [],
    breakingPoint: 0,
  };

  const sortData = [
    {
      key: "name",
      title: "Name",
    },
    {
      key: "email",
      title: "Email",
    },
    {
      key: "level",
      title: "Level",
    },
    {
      key: "is_active",
      title: "Active",
    },
    {
      key: "weight_lb",
      title: "Weight",
    },
  ];

  const searchBarParameters = {
    columnKeys: ["name", "email"],
    placeHolder: "Search Users...",
  };

  const filterParameters = {
    text: "Filter Users",
    filters: [
      {
        key: "level",
        title: "Admin Users",
        value: "Admin",
      },
      {
        key: "level",
        title: "Master Users",
        value: "Master",
      },
      {
        key: "level",
        title: "Users",
        value: "User",
      },
      {
        key: "is_active",
        title: "Active Users",
        value: "Yes",
      },
      {
        key: "is_active",
        title: "Inactive Users",
        value: "No",
      },
    ],
  };

  return (
    <ContentLayout>
      <HtmlContainer>
        <HtmlTitleContainer>
          <h1>
            <FaUsersGear />
            Users
          </h1>
        </HtmlTitleContainer>
        <HtmlTableContainer>
          {isLoading ? (
            <Loader />
          ) : (
            <Table
              tableData={tableData}
              sortColumnOptions={sortData}
              pageSize={100}
              searchBarParameters={searchBarParameters}
              filterParameters={filterParameters}
              emptyTableMessage="No Users..."
            />
          )}
        </HtmlTableContainer>
      </HtmlContainer>
    </ContentLayout>
  );
};

export default Users;
