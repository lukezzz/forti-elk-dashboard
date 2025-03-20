import { useEffect, useState } from "react";
import ReactEcharts from 'echarts-for-react';
import { useTheme } from 'antd-style';
import { theme_dark } from '@/data/echarts'

const randomColor = theme_dark.color[Math.floor(Math.random() * theme_dark.color.length)];


interface CountryChartProps {
    country: string,
    count: number
}

export const CountryPieChart = ({ data, title }: { data: CountryChartProps[], title: string }) => {

    const theme = useTheme();
    const [option, setOption] = useState({
        title: {
            text: title,
            left: "center",
            top: "top"
        },
        grid: {
            left: 0,
            top: 0,
            bottom: 0,
            right: 0
        },
        dataset: data,
        series: [
            {
                type: 'pie',
                radius: '30%',
                center: ['50%', '60%'],
                encode: {
                    itemName: 'country',
                    value: 'count',
                }
            }
        ]
    });

    useEffect(() => {

        setOption({
            ...option,
            dataset: data,
            series: [
                {
                    type: 'pie',
                    radius: '50%',
                    center: ['50%', '55%'],
                    encode: {
                        itemName: 'country',
                        value: 'count',
                    }
                }
            ]
        })
    }, [data])


    return (
        <ReactEcharts option={option} style={{ height: 200, width: "100%" }} theme={theme_dark} />
    );
}

