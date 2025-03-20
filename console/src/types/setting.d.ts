import { ThemeName } from "@/providers/Settings.provider";


export interface ConfigState {
    remember?: boolean;
    theme?: ThemeName
    menuCollapsed?: boolean;
    pageSize?: number;
    dashboardTheme?: DashboardThemeName;
    locale?: string;
}

export interface SettingSAMLProps {
    id: str
    issuer: str
    idp_entityId: str
    sso_url: str
    sso_binding: str
    sso_signing_cert: str
    sp_url: str
    sp_entityId: str
    sp_binding: str
    strict: bool
    debug: bool
}


interface AirflowVarsProps {
    description: string;
    key: string;
    value: string
}


interface AirflowVarsUpdateProps {
    variable_key: string;
    value: string;
    description: string;
}

interface AirflowConnectionProps {
    connection_id: string;
    conn_type: string;
    host: string;
    schema: string;
    login: string;
    port: number;
    extra: string
}

interface AirflowConnectionUpdateProps {
    connection_id: string;
    conn_type: string;
    host?: string;
    schema?: string;
    login?: string;
    port?: number;
    extra?: string
    password?: string
}

interface AirflowTagsProps {
    name: string;
}

interface AirflowDagProps {
    dag_id: string;
    description: string;
    tags: AirflowTagsProps[]

}