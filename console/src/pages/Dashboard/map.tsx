import { useContext, useEffect, useRef, useState } from 'react';
import ReactEcharts from 'echarts-for-react';
import * as echarts from 'echarts';

import world from './world.json'
import { DashboardContext } from '@/providers/Dashboard.provider';

import { theme_dark } from "@/data/echarts";
import { worldGeoMap } from './worldNameMap';
// import { useGetThreatMapQuery } from '@/services/dashboard';
import { useTranslation } from 'react-i18next';
import { useGetConnectionsQuery } from '@/services/dashboard';
import { nowToDatetimeString } from '@/utils/formatDatetime';

const decals = [
    {
        color: "#006241",
        backgroundColor: "transparent",
        symbol: 'rect',
        dashArrayX: [
            [6, 6],
            [0, 6, 6, 0]
        ],
        dashArrayY: [4, 0],
        symbolSize: 0.5,
        symbolKeepAspect: true
    },

];


// Default Target coordinates
// const paCoord: [number, number] = [-110, 98];
// const wafCoord: [number, number] = [60, 98];
const randomColor = theme_dark.color[Math.floor(Math.random() * theme_dark.color.length)];

const convertData = (
    item: TrafficConnections,
    themeName: string,
    userSymbolScale: number | 1,
    t: any
) => {

    const series = [] as any


    const data = item.source.map(src => {
        const d = [] as any
        d.push({
            coord: [src.lon, src.lat],
            value: src.count,
        });
        d.push({
            coord: [item.dest.split(',')[1], item.dest.split(',')[0]],
        });
        return d;
    });


    series.push({
        type: 'lines',
        zlevel: 2,
        effect: {
            show: true,
            period: 4, // Arrow animation speed
            trailLength: 0.02, // Tail length of the effect
            symbol: 'arrow', // Arrow symbol
            symbolSize: 5, // Size of the arrow
        },
        lineStyle: {
            normal: {
                width: 1, // Width of the lines
                opacity: 1, // Opacity of the lines
                curveness: 0.3, // Curvature of the lines
            },
        },
        data: data
    });

    series.push({
        type: 'effectScatter',
        coordinateSystem: 'geo',
        zlevel: 2,
        rippleEffect: {
            period: 4, // Animation time
            brushType: 'stroke', // Wave drawing method
            scale: 4, // Maximum limit of wave circle
        },
        // label: {
        //     normal: {
        //         show: true,
        //         position: 'right', // Display position
        //         offset: [5, 0], // Offset settings
        //         formatter: function (params) {
        //             return params.data.name; // Circle display text
        //         },
        //         fontSize: 13,
        //     },
        //     emphasis: {
        //         show: true,
        //     },
        // },
        symbol: 'circle',
        symbolSize: function (val) {
            return 5
        },
        data: item.source.map(src => ({
            value: [src.lon, src.lat, src.count],
        })),
    });

    series.push({
        type: 'scatter',
        coordinateSystem: 'geo',
        zlevel: 2,
        rippleEffect: {
            period: 4,
            brushType: 'stroke',
            scale: 4,
        },
        symbol: 'pin',
        symbolSize: 30,
        data: [{
            name: item.dest,
            value: item.dest.split(',').reverse().map(Number).concat([10]),
        }],
        // tooltip: {
        //     trigger: 'item',
        //     formatter: function (params) {
        //         return t("pages:dashboard.trafficTo", { dest: params.name })
        //     }
        // },
    });

    return series;
};

export const CyberMapChart = ({ userSymbolScale }: { userSymbolScale: number | 1 }) => {
    const { t } = useTranslation("pages")
    const { searchDateTimeRange, refreshInterval, themeName, searchIPs, setSearchRegion, searchRegion } = useContext(DashboardContext)
    const [mapData, setMapData] = useState<TrafficConnections[]>([])
    const getResult = useGetConnectionsQuery(
        {
            start_time: searchDateTimeRange.start_time,
            end_time: searchDateTimeRange.end_time,
        },
        // {
        //     pollingInterval: refreshInterval * 1000
        // }
    )

    useEffect(() => {
        getResult.refetch()
    }, [searchDateTimeRange])

    useEffect(() => {
        if (getResult.isSuccess && getResult.data) {
            setMapData(getResult.data.data)
        }
    }, [getResult])

    const chartRef = useRef<any>(null);

    // echarts.registerMap('cyberMap', { svg: mapSvg });
    echarts.registerMap('cyberMap', world as any);
    echarts.registerMap('worldMap', worldGeoMap as any);

    const [option, setOption] = useState({
        title: {},
        // tooltip: {
        //     trigger: 'item',
        //     formatter: '{b}'
        // },
        grid: [
            {
                width: '100%'
            }
        ],
        geo: {
            map: 'cyberMap',
            roam: true,
            center: [0, 0],
            zoom: 1.2,
            zlevel: 0,
            emphasis: {
                label: {
                    show: true,
                },
            },
        },
        // graphic: targetGraphic,
        series: [] as any[]
    })

    useEffect(() => {
        if (mapData) {
            const seriesData = mapData.map(item => convertData(item, themeName, userSymbolScale, t));
            setOption(prevOption => ({
                ...prevOption,
                series: seriesData.flat()
            }));
        }
    }, [themeName, mapData, userSymbolScale])

    useEffect(() => {
        const echarts = chartRef.current.getEchartsInstance();
        echarts.on('click', (params: any) => {
            if (params.componentSubType === "map") {
                setSearchRegion(prevRegion => prevRegion === params.name ? undefined : params.name);
            }
        })
    }, [])

    return (
        <ReactEcharts
            ref={chartRef}
            option={option}
            style={{ height: `${window.innerHeight - 200}px`, width: "100%" }}
            theme={theme_dark}
        />
    );
}