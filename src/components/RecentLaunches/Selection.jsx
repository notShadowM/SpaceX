import React, { useMemo } from 'react';
import { Select } from 'antd';

const { Option } = Select;

export default function Selection({ field, form, onChange }) {
  const Memo = useMemo(() => (
    <Select value={form[field.name] || field.label} style={field.style} allowClear onChange={(value) => onChange({ [field.name]: value })}>
      {field?.options?.map((x, ind) => <Option key={ind} value={x.value}>{x.text}</Option>)}
    </Select>
  ), [form[field.name]]);
  return Memo;
}
