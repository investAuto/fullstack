// @ts-nocheck
import { IS_AUTH } from '../types';

export const authReducer = (state, action) => {
    switch (action.type) {
        case IS_AUTH:
            return {
                ...state,
                isAuth: action.isAuth,
            };
        default:
            return state;
    }
};
