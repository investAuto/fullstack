// @ts-nocheck
import { useReducer } from 'react';

import { usersReducer } from './user-reducer';
import { UserAPI } from '../../api/user-api';
import { LOADING, SET_USER, DELETE_CURRENT_USER } from '../types';
import { UsersContext } from './user-context';

export const UsersState = ({ children }) => {
    const initialState = {
        user: {},
        data: [],
        loading: false,
        token: '',
    };
    const [usersState, usersDispatch] = useReducer(usersReducer, initialState);
    const setLoading = (loading) => {
        usersDispatch({ type: LOADING, loading });
    };
    const setUser = async (): Promise<void> => {
        setLoading(true);
        const user = await UserAPI.getCurrentUser();
        usersDispatch({ type: SET_USER, user });
        setLoading(false);
    };
    const deleteCurrentUser = async (): Promise<void> => {
        usersDispatch({ type: DELETE_CURRENT_USER });
    };

    return (
        <UsersContext.Provider
            value={{
                user: usersState.user,
                data: usersState.data,
                loading: usersState.loading,
                setUser,
                deleteCurrentUser,
            }}
        >
            {children}
        </UsersContext.Provider>
    );
};
