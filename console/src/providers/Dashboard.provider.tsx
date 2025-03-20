/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, createContext, useState, Dispatch, SetStateAction } from 'react';

import useCurrentConfig from '@/hooks/useCurrentConfig';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc)

import enUS from 'antd/lib/locale/en_US';
import zhCN from 'antd/lib/locale/zh_CN';
import { Locale } from 'antd/lib/locale';


interface IDashboardContext {
    themeName: DashboardThemeName
    setTheme: (name: DashboardThemeName) => any
    searchDateTimeRange: DateRangeQueryType;
    setSearchDateTimeRange: Dispatch<SetStateAction<DateRangeQueryType>>;
    refreshInterval: number;
    setRefreshInterval: Dispatch<SetStateAction<number>>;
    searchIPs: string[];
    setSearchIPs: Dispatch<SetStateAction<string[]>>;
    searchRegion: string | undefined
    setSearchRegion: Dispatch<SetStateAction<string | undefined>>;
    currentLocale: Locale;
    setCurrentLocale: Dispatch<SetStateAction<Locale>>;
}

type Props = {
    children?: React.ReactNode;
};

export const DashboardContext = createContext<IDashboardContext>({
    themeName: 'dark',
    setTheme: () => { },
    searchDateTimeRange: {
        start_time: dayjs().subtract(1, 'day').utc().format('YYYY-MM-DD HH:mm:ss'),
        end_time: dayjs().utc().format('YYYY-MM-DD HH:mm:ss'),
    },
    setSearchDateTimeRange: () => { },
    refreshInterval: 60,
    setRefreshInterval: () => { },
    searchIPs: [],
    setSearchIPs: () => { },
    searchRegion: undefined,
    setSearchRegion: () => { },
    currentLocale: enUS,
    setCurrentLocale: () => { },
});

const DashboardProvider: FC<Props> = ({ children }) => {
    const currentConfig = useCurrentConfig();

    // theme
    const [themeName, setThemeName] = useState<DashboardThemeName>(
        currentConfig.theme ? currentConfig.theme : 'dark',
    );
    const setTheme = (name: DashboardThemeName) => {
        setThemeName(name);
    };


    // i18n
    const [currentLocale, setCurrentLocale] = useState<Locale>(
        currentConfig.locale == 'en' ? enUS : zhCN,
    );


    const [searchDateTimeRange, setSearchDateTimeRange] = useState<DateRangeQueryType>({
        start_time: dayjs().subtract(1, 'hour').utc().format('YYYY-MM-DD HH:mm:ss'),
        end_time: dayjs().utc().format('YYYY-MM-DD HH:mm:ss'),
    });


    const [refreshInterval, setRefreshInterval] = useState<number>(60);

    const [searchIPs, setSearchIPs] = useState<string[]>([]);

    const [searchRegion, setSearchRegion] = useState<string | undefined>()



    return (
        <DashboardContext.Provider
            value={{
                themeName,
                setTheme,
                currentLocale,
                setCurrentLocale,
                searchDateTimeRange,
                setSearchDateTimeRange,
                refreshInterval,
                setRefreshInterval,
                searchIPs,
                setSearchIPs,
                searchRegion,
                setSearchRegion
            }}
        >
            {children}
        </DashboardContext.Provider>
    );
};

export default DashboardProvider;
