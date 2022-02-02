import React, { useState } from 'react';
import './style.css';
import { SettingFilled, RocketFilled, PaperClipOutlined } from '@ant-design/icons';
import { Modal, Switch } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import {
  useLocation,
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from 'react-router-dom';

import { changeLang, changeWeight, changeDistance } from '../../features/settings/settingsSlice';

export default function Sidebar() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const lang = useSelector((state) => state.settings.lang);
  const weight = useSelector((state) => state.settings.weight);
  const distance = useSelector((state) => state.settings.distance);
  const location = useLocation();

  const dispatch = useDispatch();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleOnChangeLang = (value) => {
    value ? dispatch(changeLang('en')) : dispatch(changeLang('fr'));
  };
  const handleOnChangeWeight = (value) => {
    value ? dispatch(changeWeight('kg')) : dispatch(changeWeight('lb'));
  };
  const handleOnChangeDistance = (value) => {
    value ? dispatch(changeDistance('meters')) : dispatch(changeDistance('feet'));
  };

  return (
    <div className="sidebarContainer">
      <SettingFilled className="icon" onClick={showModal} />

      <Link to="/RecentLaunches" style={{ color: 'inherit', textDecoration: 'inherit' }}>
        <div className={`item ${location.pathname === '/RecentLaunches' && 'selected'}`}>
          <RocketFilled className="icon" />
          Recent Launches
        </div>
      </Link>

      <Link to="/Missions" style={{ color: 'inherit', textDecoration: 'inherit' }}>
        <div className={`item ${location.pathname === '/Missions' && 'selected'}`}>
          <PaperClipOutlined className="icon" />
          Missions
        </div>
      </Link>

      <Modal title="Settings" footer={null} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} width={200}>
        <div className="switches">
          <Switch checkedChildren="En" unCheckedChildren="Fr" defaultChecked={lang === 'en'} onChange={handleOnChangeLang} />
          <Switch checkedChildren="kg" unCheckedChildren="lbs" defaultChecked={weight === 'kg'} onChange={handleOnChangeWeight} />
          <Switch checkedChildren="meters" unCheckedChildren="feet" defaultChecked={distance === 'meters'} onChange={handleOnChangeDistance} />
        </div>
      </Modal>
    </div>
  );
}
