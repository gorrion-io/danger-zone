import React from 'react';
import { Card } from 'antd';

export const Report = (props) => {
  return (
    <div style={{ marginTop: 15 }}>
      <Card title={props.report.title} style={{ width: '50%', margin: 'auto' }}>
        <p>{props.report.description}</p>
      </Card>
    </div>
  );
};
