import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

export default function Selection({ e, index, formData }) {
  return (
    <Select key={index} value={formData[e.state] || e.name} style={e.style} allowClear onChange={(value) => e.setData(value)}>
      {e.contents.map((x, ind) => <Option key={ind} value={x.value}>{x.text}</Option>)}
    </Select>
  );
}
