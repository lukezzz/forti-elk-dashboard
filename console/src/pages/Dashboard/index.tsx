import { useState } from "react";
import { Col, Flex, Row, Slider, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { CyberMapChart } from "./map";
import { FortiTrafficCountryCount, FortiTrafficEventActionCount, FortiTrafficIpCount, FortiTrafficNetworkBytesOverTime, FortiTrafficRequestsOverTime } from "./traffic";

const { Text } = Typography;

export const CyberMapContent = () => {

    const { t } = useTranslation("pages")

    const [userSymbolScale, setUserSymbolScale] = useState(1);

    return (
        <Row align="middle" style={{ marginTop: '2%' }}>
            <Col span={5}>
                <Flex vertical gap="small">
                    <FortiTrafficRequestsOverTime />
                    <FortiTrafficNetworkBytesOverTime />
                    <FortiTrafficIpCount type="source" />
                    <FortiTrafficIpCount type="destination" />
                </Flex>
            </Col>
            <Col span={14}>
                <CyberMapChart userSymbolScale={userSymbolScale} />
            </Col>
            <Col span={5}>
                <Flex vertical gap="small" justify="space-between">
                    <FortiTrafficCountryCount type="source" />
                    <FortiTrafficCountryCount type="destination" />
                    <FortiTrafficEventActionCount />
                </Flex>
            </Col>
        </Row>
    );
}