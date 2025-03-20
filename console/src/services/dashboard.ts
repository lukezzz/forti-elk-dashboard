// Need to use the React-specific entry point to import createApi
import { baseApi } from './base'

// Define a service using a base URL and expected endpoints
export const dashboardApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Add new endpoint for getRequestsOverTime
        getRequestsOverTime: builder.query<CommonResponse<any>, DashboardSearchParams>({
            query: (q) => ({
                url: `/api/v1/forti_traffic/requests_over_time`,
                method: 'GET',
                params: q
            }),
        }),
        getNetworkBytesOverTime: builder.query<CommonResponse<any>, DashboardSearchParams>({
            query: (q) => ({
                url: `/api/v1/forti_traffic/network_bytes_over_time`,
                method: 'GET',
                params: q
            }),
        }),
        // /forti_traffic/ip_count
        getIpCount: builder.query<CommonResponse<any>, DashboardSearchParams>({
            query: (q) => ({
                url: `/api/v1/forti_traffic/ip_count`,
                method: 'GET',
                params: q
            }),
        }),
        getCountryCount: builder.query<CommonResponse<any>, DashboardSearchParams>({
            query: (q) => ({
                url: `/api/v1/forti_traffic/country_count`,
                method: 'GET',
                params: q
            }),
        }),
        getEventActionCount: builder.query<CommonResponse<any>, DashboardSearchParams>({
            query: (q) => ({
                url: `/api/v1/forti_traffic/event_action_count`,
                method: 'GET',
                params: q
            }),
        }),
        getConnections: builder.query<CommonListResponse<TrafficConnections>, DashboardSearchParams>({
            query: (q) => ({
                url: `/api/v1/forti_traffic/connections`,
                method: 'GET',
                params: q
            }),
        }),

    })
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
    useGetRequestsOverTimeQuery,
    useGetNetworkBytesOverTimeQuery,
    useGetIpCountQuery,
    useGetCountryCountQuery,
    useGetEventActionCountQuery,
    useGetConnectionsQuery,
} = dashboardApi