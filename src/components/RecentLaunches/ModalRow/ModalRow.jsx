import React from 'react';
import { Row, Col } from 'antd';

export default function ModalRow({ modalData }) {
  return (
    <Row>
      <Col span={50}>{modalData.label}</Col>
      <Col span={50} className={modalData.className || ''}>{modalData.content}</Col>
    </Row>
  );
}
