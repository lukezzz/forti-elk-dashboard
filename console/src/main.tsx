import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { LoadingOutlined } from '@ant-design/icons';
import { Provider } from 'react-redux';
import { Spin, notification } from 'antd';
import { store, persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import SettingsProvider from './providers/Setting.provider';
import DashboardProvider from './providers/Dashboard.provider.tsx';
import "./i18n/i18n";

import './index.css';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
Spin.setDefaultIndicator(antIcon);
notification.config({
  placement: 'bottomRight',
  duration: 3,
  bottom: 50,
  maxCount: 1,
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <SettingsProvider>
        <DashboardProvider>
          <App />
        </DashboardProvider>
      </SettingsProvider>
    </PersistGate>
  </Provider>,
);
