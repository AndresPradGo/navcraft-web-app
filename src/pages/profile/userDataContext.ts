import React from "react"

interface UserDataType {
    name: string;
    weight: number;
    email: string;
}

const userDataContext = React.createContext<UserDataType>({} as UserDataType);

export default userDataContext;