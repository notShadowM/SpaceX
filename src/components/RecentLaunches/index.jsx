import React, { useState, useRef, useEffect } from 'react';
import {
  Tag, Space, Input, Modal,
} from 'antd';
import ProTable from '@ant-design/pro-table';
import { useSelector } from 'react-redux';
import './style.css';
import { request } from 'graphql-request';
import {
  endpoint, Names, MissionIds, tableData, modalData,
} from '../../graphql/spaceX';
import Selection from './Selection';
import ModalRow from './ModalRow';
import Loading from './Loading';

const columns = [
  // {
  //   dataIndex: 'index',
  //   valueType: 'indexBorder',
  //   width: 48,
  // },
  {
    title: 'Mission icon',
    dataIndex: 'mission_icon',
    search: false,
    renderFormItem: (_, { defaultRender }) => defaultRender(_),
    render: (_, record) => (
      <Space>
        <img src={record.mission_icon} alt="icon" style={{ width: '40px' }} />
      </Space>
    ),
  },
  {
    title: 'Launch site',
    dataIndex: 'launch_site',
    search: false,
    renderFormItem: (_, {
      type, defaultRender, formItemProps, fieldProps,
    }, form) => <Input {... fieldProps} placeholder="Enter launch site" />,
  },
  {
    title: 'Rocket name',
    dataIndex: 'rocket_name',
    search: false,
    renderFormItem: (_, {
      type, defaultRender, formItemProps, fieldProps,
    }, form) => <Input {... fieldProps} placeholder="Enter rocket name" />,
  },
  {
    title: 'Rocket country',
    dataIndex: 'rocket_country',
    search: false,
    renderFormItem: (_, {
      type, defaultRender, formItemProps, fieldProps,
    }, form) => <Input {... fieldProps} placeholder="Enter rocket country" />,
  },
  {
    title: 'Launch date',
    dataIndex: 'launch_date',
    search: false,
    renderFormItem: (_, {
      type, defaultRender, formItemProps, fieldProps,
    }, form) => <Input {... fieldProps} placeholder="Enter Launch date" />,
  },
  {
    title: 'Mission name',
    dataIndex: 'mission_name',
    renderFormItem: (_, {
      type, defaultRender, formItemProps, fieldProps,
    }, form) => <Input {... fieldProps} placeholder="Enter Mission Name" />,
    search: false,
  },
  {
    title: 'Is upcoming',
    dataIndex: 'is_upcoming',
    search: false,
    renderFormItem: (_, { defaultRender }) => defaultRender(_),
    render: (_, record) => (
      <Space>
        {record.is_upcoming ? 'Yes' : 'No'}
      </Space>
    ),
  },
  {
    title: 'Media',
    dataIndex: 'media',
    search: false,
    renderFormItem: (_, {
      type, defaultRender, formItemProps, fieldProps,
    }, form) => <Input {... fieldProps} placeholder="Please enter test" />,
    render: (_, record) => (
      <Space>
        {record.media.map((text, index) => (
          <Tag color="error" key={index}>
            <a href={text}>Link</a>
          </Tag>
        ))}
      </Space>
    ),
  },
];

const yearOptions = ['2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013', '2012', '2011', '2010', '2009', '2008', '2007', '2006'];

const smallDataModal = (data, weight, distance) => [
  { label: 'Mission icon : ', content: <img src={data?.mission_icon} alt="icon" style={{ width: '40px' }} /> },
  { label: 'Launch site : ', content: data?.launch_site },
  { label: 'Rocket Name : ', content: data?.rocket_name },
  { label: 'Launch date : ', content: data?.launch_date },
  { label: 'Mission name : ', content: data?.mission_name },
  { label: 'Is upcoming : ', content: data?.is_upcoming ? 'Yes' : 'No' },
  { label: 'Media : ', content: data?.media.map((e, index) => <a key={index} href={e}>link </a>) },
  { className: 'grid-container', label: 'Images : ', content: data?.images.map((e, index) => <img className="grid-item" key={index} src={e} alt="rocketImage" style={{ width: '26px' }} />) },
  { label: 'Rocket active : ', content: data?.rocketActive ? 'Yes' : 'No' },
  { label: 'Cost per launch : ', content: data?.cost_per_launch },
  { label: 'Mass : ', content: data?.mass[weight] },
  { label: 'Diameter : ', content: data?.diameter[distance] },
  { label: 'Success rate : ', content: data?.success_rate_pct },
  { label: 'Rocket Description : ', content: data?.description },
];

const selectionData = (names, years, missionsIds, setFormData) => [
  {
    state: 'launch_year', setData: (value) => { setFormData({ launch_year: value }); }, name: 'Year', style: { width: 80, marginLeft: 20 }, contents: years.map((e) => ({ value: e, text: e })),
  },
  {
    state: 'rocket_name', setData: (value) => { setFormData({ rocket_name: value }); }, name: 'Rocket Name', style: { width: 130, marginLeft: 50 }, contents: names.map((e) => ({ value: e, text: e })),
  },
  {
    state: 'core_reuse', setData: (value) => { setFormData({ core_reuse: value }); }, name: 'Core', style: { width: 100, marginLeft: 50 }, contents: [{ value: 'true', text: 'reused' }, { value: 'false', text: 'not reused' }],
  },
  {
    state: 'fairings_reuse', setData: (value) => { setFormData({ fairings_reuse: value }); }, name: 'Fairings', style: { width: 100, marginLeft: 50 }, contents: [{ value: 'true', text: 'reused' }, { value: 'false', text: 'not reused' }],
  },
  {
    state: 'mission_id', setData: (value) => { setFormData({ mission_id: value }); }, name: 'Mission ID', style: { width: 110, marginLeft: 50 }, contents: missionsIds.map((e) => ({ value: e, text: e })),
  },
  {
    state: 'launch_success', setData: (value) => { setFormData({ launch_success: value }); }, name: 'Launching Success', style: { width: 160, marginLeft: 50 }, contents: [{ value: 'true', text: 'Success' }, { value: 'false', text: 'Failed' }],
  },
  {
    state: 'land_success', setData: (value) => { setFormData({ land_success: value }); }, name: 'Landing Success', style: { width: 160, marginLeft: 50 }, contents: [{ value: 'true', text: 'Success' }, { value: 'false', text: 'Failed' }],
  },
];

export default function RecentLaunches() {
  const weight = useSelector((state) => state.settings.weight);
  const distance = useSelector((state) => state.settings.distance);
  const [data, setData] = useState();
  const [smallData, setSmallData] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [names, setNames] = useState();
  const [missionsIds, setMissionsIds] = useState();
  const [formData, setFormDatas] = useState({
    launch_year: '',
    rocket_name: '',
    core_reuse: '',
    fairings_reuse: '',
    mission_id: '',
    launch_success: '',
    land_success: '',
  });

  const setFormData = (object) => setFormDatas((prevState) => ({ ...prevState, ...object }));

  const getNames = () => {
    request(endpoint, Names).then((d) => setNames(
      [...new Set(d.launchesPastResult.data.map((e) => e.rocket.rocket_name))],
    ));
  };

  const getMissionIds = () => {
    request(endpoint, MissionIds).then((d) => setMissionsIds([...new Set(d.launchesPastResult.data.map((e) => e.mission_id[0]))].filter((e) => !!e === true)));
  };

  const allData = () => {
    const variables = {
      find: formData,
    };
    request(endpoint, tableData, variables).then((d) => setData(
      d.launchesPastResult.data.map((e) => ({
        mission_icon: e.links.mission_patch_small,
        launch_site: e.launch_site.site_name,
        rocket_name: e.rocket.rocket_name,
        rocket_country: e.rocket.rocket.country,
        launch_date: e.launch_date_utc.substring(0, 10),
        mission_name: e.mission_name,
        is_upcoming: e.upcoming,
        media: [e.links.reddit_campaign, e.links.reddit_launch, e.links.reddit_media, e.links.reddit_recovery, e.links.video_link, e.links.wikipedia],
      })),
    ));
  };

  useEffect(() => {
    allData();
    getNames();
    getMissionIds();
    return () => {
    };
  }, [formData]);

  const showModal = (record) => {
    setIsModalVisible(true);
    let smallName;
    if (record.mission_name.indexOf('(') > -1) {
      smallName = record.mission_name.substring(0, record.mission_name.indexOf('('));
    } else {
      smallName = record.mission_name;
    }
    const variables = {
      find: { mission_name: smallName },
    };
    request(endpoint, modalData, variables).then((d) => d.launchesPastResult.data[0])
      .then((e) => setSmallData({
        mission_icon: e.links.mission_patch_small,
        launch_site: e.launch_site.site_name,
        rocket_name: e.rocket.rocket_name,
        rocket_country: e.rocket.rocket.country,
        launch_date: e.launch_date_utc.substring(0, 10),
        mission_name: e.mission_name,
        is_upcoming: e.upcoming,
        media: [e.links.reddit_campaign, e.links.reddit_launch, e.links.reddit_media, e.links.reddit_recovery, e.links.video_link, e.links.wikipedia],
        images: e.links.flickr_images,
        rocketActive: e.rocket.rocket.active,
        cost_per_launch: e.rocket.rocket.cost_per_launch,
        mass: e.rocket.rocket.mass,
        diameter: e.rocket.rocket.diameter,
        success_rate_pct: e.rocket.rocket.success_rate_pct,
        description: e.rocket.rocket.description,
      }));
  };

  const handleOk = () => {
    setIsModalVisible(false);
    setSmallData();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSmallData();
  };

  const actionRef = useRef();
  return !data ? <Loading />
    : (
      <>
        {selectionData(names, yearOptions, missionsIds, setFormData).map((e, index) => (
          <Selection e={e} index={index} formData={formData} />
        ))}

        <ProTable
          columns={columns}
          actionRef={actionRef}
          dataSource={data}
          editable={{
            type: 'multiple',
          }}
          columnsState={{
            persistenceKey: 'pro-table-singe-demos',
            persistenceType: 'localStorage',
          }}
          rowKey="id"
          search={false}
          form={{
            syncToUrl: (values, type) => {
              if (type === 'get') {
                return {
                  ...values,
                  created_at: [values.startTime, values.endTime],
                };
              }
              return values;
            },
          }}
          pagination={{
            pageSize: 5,
            showLessItems: true,
            showTotal: false,
            locale: { items_per_page: 'items' },
            pageSizeOptions: ['5', '10', '20', '50'],
          }}
          dateFormatter="string"
          headerTitle="SpaceX"
          onRow={(record, rowIndex) => ({
            onClick: (event) => { showModal(record); }, // click row
          })}
        />

        <Modal title="Data" footer={null} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
          <div className="switches">
            {smallDataModal(smallData, weight, distance).map((e) => (
              <ModalRow e={e} />
            ))}
          </div>
        </Modal>
      </>
    );
}
