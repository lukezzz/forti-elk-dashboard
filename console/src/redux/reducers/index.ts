import { combineReducers } from "redux";
import configReducer from "./configSlice";
// import dagReducer from './dagReducer'
import { baseApi } from '@/services/base'
import userReducer from "./userSlice";

export const rootReducer = combineReducers({
    config: configReducer,
    user: userReducer,
    [baseApi.reducerPath]: baseApi.reducer,
});
