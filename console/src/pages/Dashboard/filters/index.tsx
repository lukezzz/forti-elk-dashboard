import { DatePicker, Flex, Select, Typography } from "antd";
import { useContext, useEffect } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import type { Dayjs } from "dayjs";
import { DashboardContext } from "@/providers/Dashboard.provider";
import { useTranslation } from "react-i18next";
import utc from 'dayjs/plugin/utc';
import { HistoryOutlined } from "@ant-design/icons";
dayjs.extend(utc);


// import 'dayjs/locale/zh-cn';

dayjs.extend(customParseFormat);

const { Text } = Typography;

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';


export const AutoRefresh = () => {
    const { refreshInterval, setRefreshInterval } = useContext(DashboardContext)

    const { t } = useTranslation("common")


    const options = [
        { label: t('off'), value: 0 },
        { label: t('30 sec'), value: 30 },
        { label: t('1 minute'), value: 60 },
        { label: t('5 minutes'), value: 300 },
        { label: t('10 minutes'), value: 600 },
    ]


    return (
        <Flex gap="small" align="center">
            <Text type="secondary">{t('Auto Refresh(Last 12 hour)')}:</Text>
            <Select
                defaultValue={refreshInterval || 60}
                value={refreshInterval}
                onChange={(value) => setRefreshInterval(value)}
                style={{ minWidth: 120 }}>
                {options.map((option) => (
                    <Select.Option key={option.value} value={option.value}>
                        {option.label}
                    </Select.Option>
                ))}
            </Select>
        </Flex>
    )

}

export const SearchDateTimeRangePicker = () => {

    const { t } = useTranslation("common")

    const { searchDateTimeRange, setSearchDateTimeRange, refreshInterval } = useContext(DashboardContext);

    const onChange = (dates: null | (Dayjs | null)[], dateStrings: string[]) => {
        if (dates) {
            const utcStart = dayjs(dateStrings[0]).utc().format(dateFormat);
            const utcEnd = dayjs(dateStrings[1]).utc().format(dateFormat);
            setSearchDateTimeRange({
                start_time: utcStart,
                end_time: utcEnd
            });
        } else {
            console.log('Clear');
        }
    };

    const rangePresets: {
        label: string;
        value: [Dayjs, Dayjs];
    }[] = [
            { label: t('today'), value: [dayjs().startOf('day'), dayjs()] },
            { label: t('last24hour'), value: [dayjs().add(-24, 'h'), dayjs()] },
            { label: t('last7Days'), value: [dayjs().add(-7, 'd'), dayjs()] },
            { label: t('last14Days'), value: [dayjs().add(-14, 'd'), dayjs()] },
            { label: t('last30Days'), value: [dayjs().add(-30, 'd'), dayjs()] },
            { label: t('last90Days'), value: [dayjs().add(-90, 'd'), dayjs()] },
        ];

    useEffect(() => {
        if (refreshInterval !== 0) {
            const intervalId = setInterval(() => {
                const newEndTime = dayjs().utc().format(dateFormat);
                const newStartTime = dayjs().utc().subtract(12, 'hour').format(dateFormat);
                setSearchDateTimeRange({
                    start_time: newStartTime,
                    end_time: newEndTime
                });
            }, refreshInterval * 1000);

            return () => clearInterval(intervalId);
        }
    }, [refreshInterval, setSearchDateTimeRange]);

    return (
        <Flex gap="small" align="center">
            {/* <Text type="secondary">{t('Search Date Range')}:</Text> */}
            <Text type="secondary"><HistoryOutlined /></Text>
            <RangePicker
                key="date-range-picker"
                showTime={{ format: 'HH:mm:ss' }}
                defaultValue={[
                    dayjs.utc(searchDateTimeRange.start_time, dateFormat).local() as Dayjs,
                    dayjs.utc(searchDateTimeRange.end_time, dateFormat).local() as Dayjs,
                ]}
                value={[
                    dayjs.utc(searchDateTimeRange.start_time, dateFormat).local() as Dayjs,
                    dayjs.utc(searchDateTimeRange.end_time, dateFormat).local() as Dayjs,
                ]}
                onChange={onChange}
                allowClear={false}
                presets={rangePresets}
            // disabledDate={(current) => {
            //     return current && current > dayjs().endOf("day");
            // }
            // }
            // size="small"
            />
        </Flex>
    );
}