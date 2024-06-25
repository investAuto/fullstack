// @ts-nocheck
import React, { useReducer } from 'react';

import { usersReducer } from './user-reducer';
import { UserAPI } from '../../api/user-api';
import {
    GET_DATA,
    FILTER,
    ADD_USER,
    DELETE_USER,
    UPDATE_USER,
    IS_AUTH,
    LOADING,
    SET_USER,
    SET_TOKEN,
    DELETE_CURRENT_USER,
} from '../types';
import { UsersContext } from './user-context';
import { authReducer } from './auth-reducer';

export const UsersState = ({ children }) => {
    const initialState = {
        user: {},
        data: [],
        loading: false,
        token: '',
    };
    const [usersState, usersDispatch] = useReducer(usersReducer, initialState);
    const [authState, authDispatch] = useReducer(authReducer, {
        isAuth: false,
    });
    const setLoading = (loading) => {
        usersDispatch({ type: LOADING, loading });
    };
    const setUser = async () => {
        setLoading(true);
        const user = await UserAPI.getCurrentUser();
        usersDispatch({ type: SET_USER, user });
        setLoading(false);
    };
    // const setData = async () => {
    //     setLoading(true);
    //     const data = await API.getUsers();
    //     usersDispatch({ type: GET_DATA, data });
    //     setLoading(false);
    // };

    // const addUser = async (user) => {
    //     API.postUser(user);
    //     usersDispatch({ type: ADD_USER, user });
    // };
    // const updateUser = async (user) => {
    //     API.updateUser(user);
    //     usersDispatch({ type: UPDATE_USER, user });
    // };
    const deleteCurrentUser = async () => {
        usersDispatch({ type: DELETE_CURRENT_USER });
    };
    // const usersFilter = (string) => usersDispatch({ type: FILTER, string });

    // const loginUser = async (user) => {
    //     const isAuth = await API.authUser(user);
    //     authDispatch({ type: IS_AUTH, isAuth });
    // };

    return (
        <UsersContext.Provider
            value={{
                user: usersState.user,
                data: usersState.data,
                loading: usersState.loading,
                setUser,
                deleteCurrentUser,
                // isAuth: authState.isAuth,
                // setData,
                // addUser,
                // deleteUser,
                // usersFilter,
                // updateUser,
                // loginUser,
            }}
        >
            {children}
        </UsersContext.Provider>
    );
};
