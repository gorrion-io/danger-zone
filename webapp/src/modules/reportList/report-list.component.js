import { useQuery } from '@apollo/react-hooks';
import { Alert, Card, Skeleton } from 'antd';
import React from 'react';
import { GET_ALL_REPORTS } from './report-list.query';
import { ErrorBox, ErrorMessage } from '../common/error-display';


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
          <Card key={report._id} style={{ margin: '30px 0' }} type='inner' extra={report.reportedBy && `Reported by ${report.reportedBy.userName}`} title={report.title}>
            {report.description}
          </Card>
        );
      })
    ) : (
      <Alert type='info' message='There are no reports' showIcon />
    );

  return <div style={{ margin: 'auto' }}>{createList}</div>;
};
