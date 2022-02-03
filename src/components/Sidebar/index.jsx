import React, { useState, useRef } from 'react';
import './style.css';
import {
  Menu, Modal, Switch, Button,
} from 'antd';
import {
  SettingFilled, RocketFilled, PaperClipOutlined, HomeFilled,
} from '@ant-design/icons';

import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { changeLang, changeWeight, changeDistance } from '../../features/settings/settingsSlice';

export default function Sidebar() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const lang = useSelector((state) => state.settings.lang);
  const weight = useSelector((state) => state.settings.weight);
  const distance = useSelector((state) => state.settings.distance);
  const navigate = useNavigate();
  const modalRef = useRef();

  const dispatch = useDispatch();

  const showModal = (e) => {
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
      <div className="settingsButton" onClick={() => showModal()}>
        <SettingFilled className="icon" style={{ color: '#fff' }} />
      </div>
      <Menu
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
        theme="dark"
        style={{ width: '100%', height: '100vh', paddingTop: '60px' }}
        inlineCollapsed
      >
        <Menu.Item key="1" onClick={(e) => navigate('/')} icon={<HomeFilled className="icon" />} title="Home" />
        <Menu.Item key="2" onClick={(e) => navigate('/RecentLaunches')} icon={<RocketFilled className="icon" />} title="Recent Launches" />
        <Menu.Item key="3" onClick={(e) => navigate('/Missions')} icon={<PaperClipOutlined className="icon" />} title="Missions" />
      </Menu>

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
