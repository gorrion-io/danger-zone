import React from 'react';
import { Collapse, Icon, Typography } from 'antd';
import { useQuery } from '@apollo/react-hooks';
import { GET_REPORTS } from './reports-list.queries';

const Panel = Collapse.Panel;
const { Title } = Typography;

export const ReportsList = () => {
  const { data, loading, error } = useQuery(GET_REPORTS);
  return (
    <div style={{ padding: '20px' }}>
      <Title level={2} style={{ margin: '20px 0' }} strong>
        Reports' List:
      </Title>
      {!loading && !error && (
        <Collapse style={{ width: '100%' }} bordered={false}>
          {data.findAllReports.map((report, index) => {
            return (
              <Panel header={report.title} key={index}>
                <p>
                  <Icon type='info-circle' style={{ marginRight: '5px', marginLeft: '20px' }} />
                  {report.description}
                </p>
                <p>
                  <Icon type='user' style={{ marginRight: '5px', marginLeft: '20px' }} />
                  {report.reportedBy}
                </p>
              </Panel>
            );
          })}
        </Collapse>
      )}
    </div>
  );
};
