import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './redux/configStore';
import {
  unstable_HistoryRouter as HistoryBrowser,
  Navigate,
  Route,
  Routes
} from 'react-router-dom';
import { history } from './util/config';
import { Login } from './pages/Login/Login';
import { Home } from './pages/Home/Home';

import AuthGuard from './components/AuthGuard';
import AdminPage from './pages/AdminPage/AdminPage';

import IoTPage from './pages/Home/IoTPage/IoTPage';

import DashBoard from './pages/Home/DashBoard/DashBoard';

import BrokerMQTT from './pages/Home/BrokerMQTT/BrokerMQTT';

import Report from './pages/Home/Report/Report';

import DeviceManager from './pages/Home/DeviceManager/DeviceManager';

import Sensor from './pages/Home/DashBoard/Sensor/Sensor';

import Actuator from './pages/Home/DashBoard/Actuator/Actuator';

import NodeBlock from './pages/Home/IoTPage/NodeBlock/NodeBlock';
import DetailNodeBlockPage from './pages/Home/IoTPage/NodeBlock/DetailNodeBlockPage/DetailNodeBlockPage';

import GatewayBlock from './pages/Home/IoTPage/GatewayBlock/GatewayBlock';
import DetailGatewayBlockPage from './pages/Home/IoTPage/GatewayBlock/DetailGatewayBlockPage/DetailGatewayBlockPage';

import CloudBlock from './pages/Home/IoTPage/CloudBlock/CloudBlock';
import DetailCloudBlockPage from './pages/Home/IoTPage/CloudBlock/DetailCloudBlockPage/DetailCloudBlockPage';
// import ChatComponent from './components/BoxChat/ChatComponent';
// import FirebaseAuthGuard from './components/FirebaseAuthGuard';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Provider store={store}>
    <HistoryBrowser history={ history as any}>
      <Routes>
        <Route path="" element={<Login />}></Route>
        <Route path="/home" element={<AuthGuard><Home /></AuthGuard>}></Route>

        <Route path='/admin' element={<AuthGuard><AdminPage /></AuthGuard>}></Route>

        <Route path="/home/IoT" element={<AuthGuard><IoTPage /></AuthGuard>}></Route>

        <Route path="/home/DashBoard" element={<AuthGuard><DashBoard /></AuthGuard>}></Route>

        <Route path="/home/BrokerMQTT" element={<AuthGuard><BrokerMQTT /></AuthGuard>}></Route>

        <Route path="/home/Report" element={<AuthGuard><Report /></AuthGuard>}></Route>

        <Route path="/home/DeviceManager" element={<AuthGuard><DeviceManager /></AuthGuard>}></Route>

        <Route path="/home/DashBoard/Sensor" element={<AuthGuard><Sensor /></AuthGuard>}></Route>

        <Route path="/home/DashBoard/Actuator" element={<AuthGuard><Actuator /></AuthGuard>}></Route>

        <Route path="/home/IoT/IoTNode" element={<AuthGuard><NodeBlock /></AuthGuard>}></Route>
        <Route path="/home/IoT/IoTNode/detailNode" element={<AuthGuard><DetailNodeBlockPage /></AuthGuard>}></Route>

        <Route path="/home/IoT/IoTGateway" element={<AuthGuard><GatewayBlock /></AuthGuard>}></Route>
        <Route path="/home/IoT/IoTGateway/detailGateway" element={<AuthGuard><DetailGatewayBlockPage /></AuthGuard>}></Route>

        <Route path="/home/IoT/IoTCloud" element={<AuthGuard><CloudBlock /></AuthGuard>}></Route>
        <Route path="/home/IoT/IoTCloud/detailCloud" element={<AuthGuard><DetailCloudBlockPage /></AuthGuard>}></Route>

        {/* <Route path='/boxchat' element={<FirebaseAuthGuard><ChatComponent /></FirebaseAuthGuard>}></Route> */}

        <Route path='*' element={<Navigate to="" />}></Route>
      </Routes>
    </HistoryBrowser>
  </Provider >
);

