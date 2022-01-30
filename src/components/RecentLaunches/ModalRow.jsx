import React from 'react';
import { Row, Col } from 'antd';

export default function ModalRow({ e }) {
  return (
    <Row>
      <Col span={50}>{e.label}</Col>
      <Col span={50} className={e.className || ''}>{e.content}</Col>
    </Row>
  );
}
