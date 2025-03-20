import { createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../redux/store'
import { UserProps, UserState } from '@/types/user';


const initialState: UserState = {
    data: undefined,
    isSessionTimeout: true,
    access_token: undefined,
    refresh_token: undefined,
    isAuthenticating: false,
};

export const userSlice = createSlice({
    name: 'user',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        userLogin: (state, action: PayloadAction<{
            access_token: string,
            refresh_token: string
        }>) => {
            state.isSessionTimeout = false;
            state.access_token = action.payload.access_token
            state.refresh_token = action.payload.refresh_token
            // wait getSelf result
            state.isAuthenticating = true
            return state
        },
        userLogout: () => initialState,
        setSessionTimeoutModal: (state, action: PayloadAction<boolean>) => {
            state.isSessionTimeout = action.payload
            return state
        },
        setUser: (state, action: PayloadAction<UserProps>) => {
            state.data = { ...action.payload }
        },
        setToken: (state, action: PayloadAction<{
            access_token: string,
            refresh_token: string
        }>) => {
            state.access_token = action.payload.access_token
            state.refresh_token = action.payload.refresh_token
            state.isAuthenticating = true
            state.isSessionTimeout = false
        },
        refreshToken: (state, action: PayloadAction<string>) => {
            state.access_token = action.payload
            state.isAuthenticating = false
            state.isSessionTimeout = false
        }
    }
})

export const { userLogin, userLogout, setUser, setSessionTimeoutModal, setToken, refreshToken } = userSlice.actions


// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: RootState) => state.user

export default userSlice.reducer
