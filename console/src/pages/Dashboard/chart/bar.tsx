import { useEffect, useState } from "react";
import ReactEcharts from 'echarts-for-react';
import { theme_dark } from '@/data/echarts'



interface IPChartProps {
    ip: string,
    count: number
}

export const IPBarChart = ({ data, title }: { data: IPChartProps[], title: string }) => {

    const [option, setOption] = useState({
        title: {
            text: title,
            left: "center",
            top: "top"
        },
        grid: {
            left: 100,
            top: "12%",
            bottom: 0,
            right: 0
        },
        tooltip: {
            trigger: 'axis'
        },
        label: {
            textBorderColor: 'rgba(0, 0, 0, 0.5)'
        },
        // legend: {
        //     left: "center",
        //     data: [] as string[]
        // },
        yAxis: {
            type: 'category',
            inverse: true
        },
        xAxis: {
            show: false,
        },
        dataset: [data],
        series: [
            {
                type: "bar",
                barMaxWidth: 15,
                // realtimeSort: true,
                color: theme_dark.color[3],
                encode: {
                    x: 'count',
                    y: 'ip'
                }
            }
        ]
    });

    useEffect(() => {

        const sortData = [
            data,
            // {
            //     transform: {
            //         type: 'sort',
            //         config: { dimension: 'count', order: 'desc' }
            //     }
            // }
        ]

        setOption({
            ...option,
            dataset: sortData as any,
            series: [
                {
                    type: 'bar',
                    barMaxWidth: 10,
                    // realtimeSort: true,
                    color: theme_dark.color[3],
                    encode: {
                        x: 'count',
                        y: 'ip'
                    }
                }
            ]
        })
    }, [data])


    return (
        <ReactEcharts option={option} style={{ height: 220, width: "100%" }} theme={theme_dark} />
    );
}

