// Need to use the React-specific entry point to import createApi
import { AirflowConnectionProps, AirflowConnectionUpdateProps, AirflowDagProps, AirflowVarsProps, AirflowVarsUpdateProps, SettingSAMLProps } from '@/types/setting';
import { baseApi } from './base'

// Define a service using a base URL and expected endpoints
export const settingApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getSamlConfig: builder.query<CommonResponse<SettingSAMLProps>, void>({
            query: () => `/api/v1/auth/saml_config`,
            providesTags: () => {
                return [{ type: "Setting", id: "SAML" }]
            }
        }),
        updateSamlConfig: builder.mutation<CommonResponse<SettingSAMLProps>, SettingSAMLProps>({
            query: (data) => ({
                url: `/api/v1/auth/saml_config`,
                method: 'POST',
                body: data
            }),
            invalidatesTags: () => [{ type: "Setting", id: "SAML" }]
        }),
        getAirflowVars: builder.query<CommonListResponse<AirflowVarsProps>, void>({
            query: () => ({
                url: `/api/v1/airflow_mgmt/get_vars`,
                method: 'POST'
            }),
            providesTags: ["AirflowVars"]
        }),
        getAirflowVarDetail: builder.mutation<CommonResponse<AirflowVarsProps>, { variable_key: string }>({
            query: (data) => ({
                url: `/api/v1/airflow_mgmt/get_var`,
                method: 'POST',
                body: data
            }),
        }),
        updateAirflowVar: builder.mutation<CommonResponse<AirflowVarsProps>, AirflowVarsUpdateProps>({
            query: (data) => ({
                url: `/api/v1/airflow_mgmt/set_var`,
                method: 'POST',
                body: data
            }),
            invalidatesTags: ["AirflowVars"]
        }),
        getAirflowConnectionDetail: builder.query<CommonResponse<AirflowConnectionProps>, { connection_id: string }>({
            query: (data) => ({
                url: `/api/v1/airflow_mgmt/get_connection`,
                method: 'POST',
                body: data
            }),
        }),
        updateAirflowConnection: builder.mutation<CommonResponse<AirflowConnectionProps>, AirflowConnectionUpdateProps>({
            query: (data) => ({
                url: `/api/v1/airflow_mgmt/set_connection`,
                method: 'POST',
                body: data
            }),
        }),
        getAirflowDags: builder.query<CommonListResponse<AirflowDagProps>, { tag: string }>({
            query: (body) => ({
                url: `/api/v1/airflow_mgmt/get_dags`,
                method: 'POST',
                body
            }),
            providesTags: ["AirflowDags"]
        }),
    })
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useGetSamlConfigQuery,
    useUpdateSamlConfigMutation,
    useGetAirflowVarsQuery,
    useGetAirflowVarDetailMutation,
    useUpdateAirflowVarMutation,
    useGetAirflowConnectionDetailQuery,
    useUpdateAirflowConnectionMutation,
    useGetAirflowDagsQuery
} = settingApi