import React, { useEffect, useMemo, useState } from 'react';
import { Modal } from 'antd';
import { request } from 'graphql-request';
import { useSelector } from 'react-redux';
import { endpoint, payloadsPart1, payloadsPart2 } from '../../graphql/spaceX';
import Loading from '../Loading';

const gqlData = (payload, weight) => [
  { label: 'Payload id:', content: payload?.id },
  {
    label: 'Payload customers:', content: payload?.customers?.join(' - '),
  },
  { label: 'Payload mass:', content: weight === 'kg' ? payload?.payload_mass_kg : payload?.payload_mass_lbs },
  { label: 'Payload type:', content: payload?.payload_type },
  { label: 'Reused:', content: payload?.reused ? 'Yes' : 'No' },
  { label: 'Orbit:', content: payload?.orbit },
  { label: 'Nationality:', content: payload?.nationality },
  { label: 'Manufacturer:', content: payload?.manufacturer },
];

export default function CardModal({
  openModal, setIsModalVisible, cardData, payloads, name,
}) {
  const weight = useSelector((state) => state.settings.weight);
  const [modalData, setModalData] = useState(payloads.map((payloadObj, index) => ({
    id: payloadObj.id,
    customers: [],
    payload_mass_kg: '',
    payload_mass_lbs: '',
    payload_type: '',
    reused: '',
    orbit: '',
    nationality: '',
    manufacturer: '',
  })));

  const getData = () => {
    const variables = {
      find: { name },
    };

    request(endpoint, payloadsPart1, variables).then((response) => response.missionsResult.data[0].payloads)
      .then((res) => res.map((data, index) => setModalData((prev) => [...prev.slice(0, index), { ...prev[index], ...data }, ...prev.slice(index + 1)])));

    request(endpoint, payloadsPart2, variables).then((response) => response.missionsResult.data[0].payloads)
      .then((res) => res.map((data, index) => setModalData((prev) => [...prev.slice(0, index), { ...prev[index], ...data }, ...prev.slice(index + 1)])));
  };

  useEffect(() => {
    if (openModal) {
      getData();
    }
    return () => { };
  }, [openModal]);

  const cardDataMemo = useMemo(() => (
    <>
      {cardData.map((data, index) => (
        <div key={index} className={data.noRow ? '' : 'cardRow'}>
          <div className="missionLabel">{data.label}</div>
          <div>{data.content}</div>
        </div>
      ))}
    </>
  ));

  const gqlDataMemo = useMemo(() => (
    <div className="payloadContainer">
      {modalData.map((payloadArray, ind) => (
        <div key={ind} className="payloadBlock">
          <div className="payloadTitle">
            Payload
            {' '}
            {ind + 1}
            {' '}
            :
          </div>
          {gqlData(payloadArray, weight).map((payloadData, index) => (
            <div key={index} className="cardRow modalRow">
              <div className="missionLabel">{payloadData.label}</div>
              <div>{payloadData.content}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  ), [modalData]);

  return (
    <Modal visible={openModal} onOk={(e) => setIsModalVisible(false)} onCancel={(e) => setIsModalVisible(false)} footer={null}>
      {cardDataMemo}
      <div className="payloadTitle">Payload List:</div>
      {gqlDataMemo}
    </Modal>
  );
}
