import { DashboardContext } from "@/providers/Dashboard.provider"
import { useGetCountryCountQuery, useGetEventActionCountQuery, useGetIpCountQuery, useGetNetworkBytesOverTimeQuery, useGetRequestsOverTimeQuery } from "@/services/dashboard"
import { useContext, useEffect, useState } from "react"
import { BarChart, EventActionLineChart, LineChart } from "./chart/line"
import { IPBarChart } from "./chart/bar"
import { CountryPieChart } from "./chart/pie"


export const FortiTrafficRequestsOverTime = ({ start_time, end_time }: any) => {

    const { searchDateTimeRange, refreshInterval, themeName } = useContext(DashboardContext)

    const [selectedRange, setSelectedRange] = useState('1 hour')


    const getResult = useGetRequestsOverTimeQuery({
        type: "forti_traffic",
        start_time: start_time || searchDateTimeRange.start_time,
        end_time: end_time || searchDateTimeRange.end_time
    },
        // {
        //     pollingInterval: refreshInterval * 1000
        // }
    )

    useEffect(() => {
        if (!start_time || !end_time) {
            getResult.refetch()
        }
    }, [searchDateTimeRange, refreshInterval, selectedRange])


    if (getResult.isLoading) return <p>Loading...</p>
    if (getResult.isError) return <p>Error</p>


    return (<>
        {
            getResult.data && <LineChart data={getResult.data.data} title="Request Over Time" />
        }
    </>)

}


// /api/v1/forti_traffic/network_bytes_over_time
export const FortiTrafficNetworkBytesOverTime = ({ start_time, end_time }: any) => {

    const { searchDateTimeRange, refreshInterval, themeName } = useContext(DashboardContext)

    const [selectedRange, setSelectedRange] = useState('1 hour')


    const getResult = useGetNetworkBytesOverTimeQuery({
        type: "forti_traffic",
        start_time: start_time || searchDateTimeRange.start_time,
        end_time: end_time || searchDateTimeRange.end_time
    },
        // {
        //     pollingInterval: refreshInterval * 1000
        // }
    )

    useEffect(() => {
        if (!start_time || !end_time) {
            getResult.refetch()
        }
    }, [searchDateTimeRange, refreshInterval, selectedRange])


    if (getResult.isLoading) return <p>Loading...</p>
    if (getResult.isError) return <p>Error</p>


    return (<>
        {
            getResult.data && <BarChart data={getResult.data.data} title="Bytes Over Time" />
        }
    </>)

}

// /forti_traffic/ip_count
export const FortiTrafficIpCount = ({ start_time, end_time, type }: any) => {
    const { searchDateTimeRange, refreshInterval, themeName } = useContext(DashboardContext)

    const [selectedRange, setSelectedRange] = useState('1 hour')


    const getResult = useGetIpCountQuery({
        query_type: type || "source",
        start_time: start_time || searchDateTimeRange.start_time,
        end_time: end_time || searchDateTimeRange.end_time
    },
        // {
        //     pollingInterval: refreshInterval * 1000
        // }
    )

    useEffect(() => {
        if (!start_time || !end_time) {
            getResult.refetch()
        }
    }, [searchDateTimeRange, refreshInterval, selectedRange])


    if (getResult.isLoading) return <p>Loading...</p>
    if (getResult.isError) return <p>Error</p>


    return (<>
        {
            getResult.data && <IPBarChart data={getResult.data.data} title={`Top ${type} IP`} />
        }
    </>)
}

export const FortiTrafficCountryCount = ({ start_time, end_time, type }: any) => {
    const { searchDateTimeRange, refreshInterval, themeName } = useContext(DashboardContext)

    const [selectedRange, setSelectedRange] = useState('1 hour')


    const getResult = useGetCountryCountQuery({
        query_type: type || "source",
        start_time: start_time || searchDateTimeRange.start_time,
        end_time: end_time || searchDateTimeRange.end_time
    },
        // {
        //     pollingInterval: refreshInterval * 1000
        // }
    )

    useEffect(() => {
        if (!start_time || !end_time) {
            getResult.refetch()
        }
    }, [searchDateTimeRange, refreshInterval, selectedRange])


    if (getResult.isLoading) return <p>Loading...</p>
    if (getResult.isError) return <p>Error</p>


    return (<>
        {
            getResult.data && <CountryPieChart data={getResult.data.data} title={`Top ${type} Country`} />
        }
    </>)
}


export const FortiTrafficEventActionCount = ({ start_time, end_time, type }: any) => {
    const { searchDateTimeRange, refreshInterval, themeName } = useContext(DashboardContext)

    const [selectedRange, setSelectedRange] = useState('1 hour')


    const getResult = useGetEventActionCountQuery({
        start_time: start_time || searchDateTimeRange.start_time,
        end_time: end_time || searchDateTimeRange.end_time
    },
        // {
        //     pollingInterval: refreshInterval * 1000
        // }
    )

    useEffect(() => {
        if (!start_time || !end_time) {
            getResult.refetch()
        }
    }, [searchDateTimeRange, refreshInterval, selectedRange])


    if (getResult.isLoading) return <p>Loading...</p>
    if (getResult.isError) return <p>Error</p>


    return (<>
        {
            getResult.data && <EventActionLineChart data={getResult.data.data} title={`Event Action`} />
        }
    </>)
}


