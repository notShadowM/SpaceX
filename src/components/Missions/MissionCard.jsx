import React, { useMemo, useState } from 'react';
import { Card } from 'antd';
import { FileWordOutlined, TwitterOutlined, LinkOutlined } from '@ant-design/icons';
import CardModal from './CardModal';

const cardData = (mission) => [
  { label: 'Name:', content: mission.name },
  {
    label: 'Description:', content: mission.description, description: true, noRow: true,
  },
  { label: 'Manufacturers:', content: mission.manufacturers.join(' - '), noRow: true },
  { label: 'Payloads:', content: mission.payloads.map((payloadObj) => payloadObj.id).join(' / '), noRow: true },
  { label: 'Wikipedia:', content: <a aria-label="link" href={mission.wikipedia}><FileWordOutlined style={{ fontSize: '16px' }} /></a> },
  { label: 'Twitter:', content: <a aria-label="link" href={mission.twitter}><TwitterOutlined style={{ fontSize: '16px' }} /></a> },
  { label: 'Website:', content: <a aria-label="link" href={mission.website}><LinkOutlined style={{ fontSize: '16px' }} /></a> },
];

export default function MissionCard({ mission }) {
  const [openModal, setIsModalVisible] = useState(false);
  const Memo = useMemo(() => (
    <Card title="Mission" style={{ flexBasis: '30%', marginTop: '10px', cursor: 'pointer' }} onClick={(e) => setIsModalVisible(true)}>
      {cardData(mission).map((data, index) => (
        <div key={index} className={data.noRow ? '' : 'cardRow'}>
          <div className="missionLabel">{data.label}</div>
          <div className={data.description && 'missionDesc'}>{data.content}</div>
        </div>
      ))}
    </Card>
  ), [mission]);
  return (
    <>
      {Memo}
      <CardModal openModal={openModal} setIsModalVisible={setIsModalVisible} cardData={cardData(mission)} payloads={mission.payloads} name={mission.name} />
    </>
  );
}
