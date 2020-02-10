import { useQuery } from '@apollo/react-hooks';
import { Alert, Card, Skeleton } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { GET_ALL_REPORTS } from './report-list.query';

const ErrorBox = styled.div`
  padding: 8px 15px;
  margin-bottom: 16px;
  background-color: #fff1f0;
  border: 1px solid #ffa39e;
`;

const ErrorMessage = styled.span`
  color: #111;
  ${ErrorBox}:hover & {
    font-weight: bold;
  }
`;

export const ReportList = () => {
  const { loading, error, data } = useQuery(GET_ALL_REPORTS);
  const reports = data ? data.findAllReports : null;

  if (loading) return <Skeleton />;

  if (error)
    return (
      <ErrorBox>
        <ErrorMessage>An error occured</ErrorMessage>
      </ErrorBox>
    );

  const createList =
    reports && reports.length ? (
      reports.map((report) => {
        return (
          <Card key={report._id} style={{ margin: 30 }} type='inner' extra={`Reported by ${report.reportedBy.userName}`} title={report.title}>
            {report.description}
          </Card>
        );
      })
    ) : (
      <Alert type='info' message='There are no reports' showIcon />
    );

  return <div style={{ margin: 'auto' }}>{createList}</div>;
};
