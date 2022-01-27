import React, { useState, useRef, useEffect } from 'react';
import { PlusOutlined, EllipsisOutlined } from '@ant-design/icons';
import {
  Button, Tag, Space, Menu, Dropdown, Input, Modal, Row, Col,
  Select,
} from 'antd';
import ProTable, { ProColumns, ActionType, TableDropdown } from '@ant-design/pro-table';
import { useSelector, useDispatch } from 'react-redux';
import './style.css';

// import request from 'umi-request';
import { request, gql } from 'graphql-request';

const { Option } = Select;

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

const columnsX = [
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: '标题',
    dataIndex: 'title',
    copyable: true,
    ellipsis: true,
    tip: '标题过长会自动收缩',
    formItemProps: {
      rules: [
        {
          required: true,
          message: '此项为必填项',
        },
      ],
    },
  },
  {
    title: '状态',
    dataIndex: 'state',
    filters: true,
    onFilter: true,
    valueType: 'select',
    valueEnum: {
      all: { text: '全部', status: 'Default' },
      open: {
        text: '未解决',
        status: 'Error',
      },
      closed: {
        text: '已解决',
        status: 'Success',
        disabled: true,
      },
      processing: {
        text: '解决中',
        status: 'Processing',
      },
    },
  },
  {
    title: '标签',
    dataIndex: 'labels',
    search: false,
    renderFormItem: (_, { defaultRender }) => defaultRender(_),
    render: (_, record) => (
      <Space>
        {record.labels.map(({ name, color }) => (
          <Tag color={color} key={name}>
            {name}
          </Tag>
        ))}
      </Space>
    ),
  },
  {
    title: '创建时间',
    key: 'showTime',
    dataIndex: 'created_at',
    valueType: 'dateTime',
    sorter: true,
    hideInSearch: true,
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    valueType: 'dateRange',
    hideInTable: true,
    search: {
      transform: (value) => ({
        startTime: value[0],
        endTime: value[1],
      }),
    },
  },
  {
    title: '操作',
    valueType: 'option',
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id);
        }}
      >
        编辑
      </a>,
      <a href={record.url} target="_blank" rel="noopener noreferrer" key="view">
        查看
      </a>,
      <TableDropdown
        key="actionGroup"
        onSelect={() => action?.reload()}
        menus={[
          { key: 'copy', name: '复制' },
          { key: 'delete', name: '删除' },
        ]}
      />,
    ],
  },
];

export default function RecentLaunches() {
  const [data, setData] = useState();
  const [smallData, setSmallData] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [year, setYear] = useState();
  const [name, setName] = useState();
  const [names, setNames] = useState();

  const weight = useSelector((state) => state.settings.weight);
  const distance = useSelector((state) => state.settings.distance);

  const getNames = () => {
    const req = 'http://api.spacex.land/graphql/';

    const query = gql`
    {
      launchesPastResult {
        data {
          rocket {
            rocket_name
          }
        }
      }
    }
  `;

    request(req, query).then((d) => setNames(
      [...new Set(d.launchesPastResult.data.map((e) => e.rocket.rocket_name))],
    ));
  };

  const allData = () => {
    const req = 'http://api.spacex.land/graphql/';

    const query = gql`
  {
    launchesPastResult {
      data {
        links {
          mission_patch_small
          wikipedia
          video_link
          reddit_media
          reddit_recovery
          reddit_launch
          reddit_campaign
        }
        launch_site {
          site_name
        }
        rocket {
          rocket_name
          rocket {
            country
          }
        }
        launch_date_utc
        mission_name
        upcoming
      }
    }
  }
  `;

    request(req, query).then((d) => setData({
      data: d.launchesPastResult.data.map((e) => ({
        mission_icon: e.links.mission_patch_small,
        launch_site: e.launch_site.site_name,
        rocket_name: e.rocket.rocket_name,
        rocket_country: e.rocket.rocket.country,
        launch_date: e.launch_date_utc.substring(0, 10),
        mission_name: e.mission_name,
        is_upcoming: e.upcoming,
        media: [e.links.reddit_campaign, e.links.reddit_launch, e.links.reddit_media, e.links.reddit_recovery, e.links.video_link, e.links.wikipedia],
      })),
    }));
  };

  const nameData = (value) => {
    const req = 'http://api.spacex.land/graphql/';

    const query = gql`
  {
    launchesPastResult (find: {rocket_name:"${value}" ${year ? `,launch_year:"${year}"` : ''}}){
      data {
        links {
          mission_patch_small
          wikipedia
          video_link
          reddit_media
          reddit_recovery
          reddit_launch
          reddit_campaign
        }
        launch_site {
          site_name
        }
        rocket {
          rocket_name
          rocket {
            country
          }
        }
        launch_date_utc
        mission_name
        upcoming
      }
    }
  }
  `;

    request(req, query).then((d) => setData({
      data: d.launchesPastResult.data.map((e) => ({
        mission_icon: e.links.mission_patch_small,
        launch_site: e.launch_site.site_name,
        rocket_name: e.rocket.rocket_name,
        rocket_country: e.rocket.rocket.country,
        launch_date: e.launch_date_utc.substring(0, 10),
        mission_name: e.mission_name,
        is_upcoming: e.upcoming,
        media: [e.links.reddit_campaign, e.links.reddit_launch, e.links.reddit_media, e.links.reddit_recovery, e.links.video_link, e.links.wikipedia],
      })),
    }));
  };

  const yearData = (value) => {
    const req = 'http://api.spacex.land/graphql/';

    const query = gql`
  {
    launchesPastResult (find: {launch_year:"${value}" ${name ? `,rocket_name:"${name}"` : ''}}){
      data {
        links {
          mission_patch_small
          wikipedia
          video_link
          reddit_media
          reddit_recovery
          reddit_launch
          reddit_campaign
        }
        launch_site {
          site_name
        }
        rocket {
          rocket_name
          rocket {
            country
          }
        }
        launch_date_utc
        mission_name
        upcoming
      }
    }
  }
  `;

    request(req, query).then((d) => setData({
      data: d.launchesPastResult.data.map((e) => ({
        mission_icon: e.links.mission_patch_small,
        launch_site: e.launch_site.site_name,
        rocket_name: e.rocket.rocket_name,
        rocket_country: e.rocket.rocket.country,
        launch_date: e.launch_date_utc.substring(0, 10),
        mission_name: e.mission_name,
        is_upcoming: e.upcoming,
        media: [e.links.reddit_campaign, e.links.reddit_launch, e.links.reddit_media, e.links.reddit_recovery, e.links.video_link, e.links.wikipedia],
      })),
    }));
  };

  const handleOnYearChange = (value) => {
    setYear(value);
    setData();
    if (value) {
      yearData(value);
    } else if (name) {
      nameData(name);
    } else {
      allData();
    }
  };
  const handleOnNameChange = (value) => {
    setName(value);
    setData();
    if (value) {
      nameData(value);
    } else if (year) {
      yearData(year);
    } else {
      allData();
    }
  };

  useEffect(() => {
    allData();
    getNames();

    return () => {
    };
  }, []);

  const showModal = (record) => {
    setIsModalVisible(true);
    // console.log(record.mission_name);
    const req = 'http://api.spacex.land/graphql/';

    const query = gql`
    {
      launchesPastResult(find: {mission_name:"${record.mission_name}"}){
        data {
          links {
            mission_patch_small
            wikipedia
            video_link
            reddit_media
            reddit_recovery
            reddit_launch
            reddit_campaign
            flickr_images
          }
          launch_site {
            site_name
          }
          rocket {
            rocket_name
            rocket {
              country
              active
              cost_per_launch
              mass {
                kg
                lb
              }
              diameter {
                feet
                meters
              }
              success_rate_pct
              description
            }
          }
          launch_date_utc
          mission_name
          upcoming
        }
      }
    }
  `;

    request(req, query).then((d) => d.launchesPastResult.data[0])
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
  return !data ? <div>loading....</div>
    : (
      <>
        <Select defaultValue={year || 'Year'} style={{ width: 120, marginLeft: 20 }} allowClear onChange={handleOnYearChange}>
          <Option value="2020">2020</Option>
          <Option value="2019">2019</Option>
          <Option value="2018">2018</Option>
          <Option value="2017">2017</Option>
          <Option value="2016">2016</Option>
          <Option value="2015">2015</Option>
          <Option value="2014">2014</Option>
          <Option value="2013">2013</Option>
          <Option value="2012">2012</Option>
          <Option value="2011">2011</Option>
          <Option value="2010">2010</Option>
          <Option value="2009">2009</Option>
          <Option value="2008">2008</Option>
        </Select>

        <Select defaultValue={name || 'Rocket Name'} style={{ width: 140, marginLeft: 50 }} allowClear onChange={handleOnNameChange}>
          {names.map((e, index) => <Option key={index} value={e}>{e}</Option>)}
        </Select>

        <ProTable
          columns={columns}
          actionRef={actionRef}
          request={async (params = {}, sort, filter) => data}
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
            // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
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
            // showSizeChanger: false,
            locale: { items_per_page: 'items' },
            pageSizeOptions: ['5', '10', '20', '50'],
          }}
          dateFormatter="string"
          headerTitle="SpaceX"
          onRow={(record, rowIndex) => ({
            onClick: (event) => { showModal(record); }, // click row
          })}
        />
        <Modal title="Settings" footer={null} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
          <div className="switches">
            <Row>
              <Col span={50}>Mission icon : </Col>
              <Col span={50}>{smallData?.mission_icon}</Col>
            </Row>
            <Row>
              <Col span={50}>Launch site : </Col>
              <Col span={50}>{smallData?.launch_site}</Col>
            </Row>
            <Row>
              <Col span={50}>Rocket Name : </Col>
              <Col span={50}>{smallData?.rocket_name}</Col>
            </Row>
            <Row>
              <Col span={50}>Launch date : </Col>
              <Col span={50}>{smallData?.launch_date}</Col>
            </Row>
            <Row>
              <Col span={50}>Mission name : </Col>
              <Col span={50}>{smallData?.mission_name}</Col>
            </Row>
            <Row>
              <Col span={50}>Is upcoming : </Col>
              <Col span={50}>{smallData?.is_upcoming ? 'Yes' : 'No'}</Col>
            </Row>
            <Row>
              <Col span={50}>Media : </Col>
              <Col span={50}>{smallData?.media.map((e, index) => <a key={index} href={e}>link </a>)}</Col>
            </Row>
            <Row>
              <Col span={50}>Images  : </Col>
              <Col span={50} className="grid-container">{smallData?.images.map((e, index) => <img className="grid-item" key={index} src={e} alt="rocketImage" style={{ width: '26px' }} />)}</Col>
            </Row>
            <Row>
              <Col span={50}>Rocket active  : </Col>
              <Col span={50}>{smallData?.rocketActive ? 'Yes' : 'No'}</Col>
            </Row>
            <Row>
              <Col span={50}>Cost per launch  : </Col>
              <Col span={50}>{smallData?.cost_per_launch}</Col>
            </Row>
            <Row>
              <Col span={50}>Mass  : </Col>
              <Col span={50}>{smallData?.mass[weight]}</Col>
            </Row>
            <Row>
              <Col span={50}>Diameter  : </Col>
              <Col span={50}>{smallData?.diameter[distance]}</Col>
            </Row>
            <Row>
              <Col span={50}>Success rate  : </Col>
              <Col span={50}>{smallData?.success_rate_pct}</Col>
            </Row>
            <Row>
              <Col span={50}>Rocket Description  : </Col>
              <Col span={50}>{smallData?.description}</Col>
            </Row>
          </div>
        </Modal>
      </>
    );
}
