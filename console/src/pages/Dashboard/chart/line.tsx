import { useEffect, useState } from "react";
import ReactEcharts from 'echarts-for-react';
import { useTheme } from 'antd-style';
import { theme_dark } from '@/data/echarts'


interface ChartProps {
    count: number;
    time: string;
}[]



export const LineChart = ({ data, title }: { data: ChartProps[], title: string }) => {
    const [option, setOption] = useState({
        title: {
            text: title,
            left: "center",
            top: "top"
        },
        grid: {
            left: 0,
            right: 0,
            top: "30%",
            bottom: 0
        },
        tooltip: {
            trigger: 'axis',
            position: ['50%', '50%']
        },
        label: {
            textBorderColor: 'rgba(0, 0, 0, 0.5)'
        },
        xAxis: {
            type: 'category',
            boundaryGap: true,
            show: false
        },
        yAxis: {
            type: 'value',
            show: false
        },
        dataset: {
            source: data
        },
        series: [
            {
                type: "bar",
                smooth: true,
                symbol: 'none',
                color: theme_dark.color[1]
            }
        ]
    });


    useEffect(() => {
        setOption({
            ...option,
            dataset: {
                source: data
            },
            series: [
                {
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    color: theme_dark.color[1]
                }
            ]
        })
    }, [data])


    return (
        <ReactEcharts
            option={option}
            style={{ height: 90, minWidth: "100%" }}
            theme={theme_dark}
        />
    );
};


export const BarChart = ({ data, title }: { data: ChartProps[], title: string }) => {
    const [option, setOption] = useState({
        title: {
            text: title,
            left: "center",
            top: "top"
        },
        grid: {
            left: 0,
            right: 0,
            top: "25%",
            bottom: 0
        },
        tooltip: {
            trigger: 'axis',
            position: ['50%', '50%']
        },
        label: {
            textBorderColor: 'rgba(0, 0, 0, 0.5)'
        },
        // legend: {
        //     left: "center",
        //     data: [] as string[]
        // },
        xAxis: {
            type: 'category',
            boundaryGap: true,
            show: false
        },
        yAxis: {
            type: 'value',
            show: false
        },
        dataset: {
            source: data
        },
        series: [
            {
                type: "bar",
                barMaxWidth: 15,
                color: theme_dark.color[1]
            }
        ]
    });


    useEffect(() => {
        setOption({
            ...option,
            dataset: {
                source: data
            },
            series: [
                {
                    type: 'bar',
                    barMaxWidth: 15,
                    color: theme_dark.color[1]
                }
            ]
        })
    }, [data])


    return (
        <ReactEcharts
            option={option}
            style={{ height: 90, minWidth: "100%" }}
            theme={theme_dark}
        />
    );
};



export const EventActionLineChart = ({ data, title }: { data: any, title: string }) => {
    const theme = useTheme();
    const [option, setOption] = useState({
        title: {
            text: title,
            left: "center",
            top: "top"
        },
        grid: {
            left: 12,
            right: 12,
            top: "20%",
            bottom: 0
        },
        tooltip: {
            trigger: 'axis',
            position: ['20%', 0]
        },
        label: {
            textBorderColor: 'rgba(0, 0, 0, 0.5)'
        },
        xAxis: {
            type: 'category',
            boundaryGap: true,
            show: false,
            data: data['time']
        },
        yAxis: {
            type: 'value',
            show: false
        },
        series: data.data.map((item: any) => {
            return {
                name: item['action'],
                type: 'line',
                stack: 'Total',
                areaStyle: {},
                data: item['count']
            }
        })
    });


    useEffect(() => {

        setOption({
            ...option,
            xAxis: {
                ...option.xAxis,
                data: data['time']
            },
            series: data.data.map((item: any) => {
                return {
                    name: item['action'],
                    type: 'line',
                    stack: 'Total',
                    areaStyle: {},
                    data: item['count']
                }
            })
        })
    }, [data])


    return (
        <ReactEcharts
            option={option}
            style={{ height: 90, minWidth: "100%" }}
            theme={theme_dark}
        />
    );
};
