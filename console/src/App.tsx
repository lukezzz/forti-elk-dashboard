import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { CyberMapContent } from './pages/Dashboard';
import DashboardProvider, { DashboardContext } from './providers/Dashboard.provider';
import { ThemeProvider } from 'antd-style';
import { useContext } from 'react';
import { DashboardThemeComponentsToken, DashboardThemeDarkToken, DashboardThemeDefaultToken } from '@/data/SiteData';
import { ConfigProvider, App as AntdApp, Layout, Typography, Flex, theme } from 'antd';
import jiushiLogo from '@/assets/jiushi.png';
import f1Logo from '@/assets/f1.png';
import { AutoRefresh, SearchDateTimeRangePicker } from './pages/Dashboard/filters';


const publicRoutes = () => {

  return [
    {
      path: '/',
      element: <CyberMapContent />,
      children: [
        // { path: '*', element: <></> }
      ],
    },
    { path: '*', element: <CyberMapContent /> },
    // { path: '*', element: <Navigate to="/login" /> },
  ];
};

const { Header, Content, Footer } = Layout;
const { Title } = Typography

function App() {


  const { themeName, currentLocale } = useContext(DashboardContext);


  return (
    <ThemeProvider
      defaultThemeMode={themeName}
      themeMode={themeName}
      theme={(appearance) => appearance === 'dark' ?
        {
          token: DashboardThemeDarkToken,
          components: DashboardThemeComponentsToken,
        }
        :
        {
          token: DashboardThemeDarkToken,
          components: DashboardThemeComponentsToken,
        }
      }
    >
      <AntdApp>
        <ConfigProvider
          locale={currentLocale}
          theme={{
            algorithm: theme.darkAlgorithm,
          }}
        >
          <DashboardProvider>
            <Layout
              style={{
                height: '100vh',
                width: '100vw',
                backgroundColor: 'black'
              }}>
              <Header>
                <Flex justify="space-between" align="center">
                  <Flex gap="small" align='center'>
                    <img src={f1Logo} alt="F1 Logo" style={{ height: '36px' }} />
                    <img src={jiushiLogo} alt="Jiushi Logo" style={{ height: '68px' }} />
                    <Title level={1}>Cyber Map</Title>
                  </Flex>
                  <Flex gap="small">
                    <SearchDateTimeRangePicker />
                    <AutoRefresh />
                  </Flex>

                </Flex>
              </Header>
              <Content style={{ padding: '0 12px' }}>
                <RouterProvider router={createBrowserRouter([...publicRoutes()])} />
              </Content>
              <Footer style={{ textAlign: 'center' }}>
                ©{new Date().getFullYear()} Created by HFTECH
              </Footer>
            </Layout>
          </DashboardProvider>
        </ConfigProvider>
      </AntdApp>
    </ThemeProvider>
  )
}

export default App
