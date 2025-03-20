
type StatisticsReqType = "alert" | "ey_ticket_count" | "es_siem_rule_count" | "es_siem_rule_action_match" | "es_index_count" | "top_10_ip" | "top_10_user" | "top_10_event" | "top_10_rule" | "top_10_source"

type PieReqType = "alert_category" | "alert_severity"

type StackBarType = "alert_trend"

type RiskScoreType = "rule_score" | "severity"

type ThreatMapType = "threat_map" | "top_10_region" | "ip_intel"

type TopIpType = "source_ip" | "destination_ip"

type DashboardThemeName = 'light' | 'dark' | 'auto'

type ChartType = 'line' | 'bar' | 'pie' | 'scatter' | 'radar' | 'heatmap' | 'treemap' | 'boxplot' | 'candlestick' | 'gauge' | 'funnel' | 'sankey' | 'sunburst' | 'parallel' | 'themeRiver' | 'pictorialBar' | 'custom'


interface DashboardSearchParams {
    start_time?: string;
    end_time?: string;
    chartType?: ChartType;
    top_n?: number;
    type?: string
    query_type?: string;
}

interface DashboardDagRunSearchParams extends DashboardSearchParams {
    dag_id: string;
}

interface DashboardMultiDagRunSearchParams extends DashboardSearchParams {
    dag_ids: string[]
}

interface DashboardPieProps {
    name: string;
    value: number;
}

interface DashboardDataSetProps {
    dimensions: string[];
    source: any[][]
}

interface DashboardDatetimeStackBarProps {
    dimensions: string[];
    source: {
        datetime: string;
        [key: string]: number
    }[]
}


interface DashboardHeatmapProps {
    dimensions: string[];
    source: {
        alert_date: string;
        severity: string;
        count: number
    }[]
}

interface IPRegion {
    country: string;
    country_code: string;
    asn?: string;
    province: string;
    city: string;
    lng: number;
    lat: number;
}

interface DashboardTop10IpProps {
    ip: string;
    count: number;
    region: IPRegion;
    intel: any;
}


interface DashboardTop10UserProps {
    user: string;
    reason: {
        name: string;
        count: number;
    }[];
    count: number;

}

interface DashboardTop10EventProps {
    category: string;
    count: number;
}


interface DashboardTop10RuleProps {
    rule_name: string;
    rule_id: string;
    count: number
}


interface TBIntelProps {
    severity: string;
    judgments: any[];
    geo: IPRegion;
    asn?: {
        info?: string;
        rank?: number;
        number?: number;
    };
    is_malicious: boolean;
    updated_at: string;
}

interface DashboardThreatMapSearchProps {
    start_time?: string;
    end_time?: string;
    type: ThreatMapType;
    ip?: string[]
    top_n?: number;
    region?: string;
}

interface DashboardThreatMapProps {
    ip: string;
    coord: number[];
    target: string;
    matchCount: number;
    intel: TBIntelProps;
}

interface QueryIPIntelSearchParams {
    start_time?: string;
    end_time?: string;
    ip: string;
    type: ThreatMapType;
}

interface IPIntelProps {
    ip: string;
    intel?: TBIntelProps;
    region?: IPRegion;
}

interface DashboardTopRegionProps {
    region: string;
    count: number;
    country_code: string;
}

interface DashboardSearchTopRegionParams extends DashboardSearchParams {
    region?: string;
}

interface DashboardFunnelProps {
    [key: string]: number;
}



interface TrafficConnections {
    source: {
        lat: number;
        lon: number;
        count: number;
    }[];
    dest: string;
}