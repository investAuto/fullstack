import React, { createContext, useState } from 'react';

interface IUser {
    name: string;
    id: number;
}

interface IUserContext {
    user: IUser | null;
    setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
}

export const UserContext = createContext<IUserContext | undefined>(undefined);

interface IUserProviderProps {
    children: React.ReactNode;
}

export const UserProvider = ({ children }: IUserProviderProps) => {
    const [user, setUser] = useState<IUser | null>(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
