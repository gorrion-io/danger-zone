import React, { useState } from 'react';
import { List, Skeleton, Card } from 'antd';
import { GET_ALL_REPORTS } from './report-list.query';
import { useQuery } from '@apollo/react-hooks';

export const ReportList = () => {
  const { loading, error, data } = useQuery(GET_ALL_REPORTS);
  const reports = data ? data.findAllReports : null;
  if (loading) return <Skeleton />;

  const createList = reports ? (
    reports.map((report) => {
      return (
        <Card style={{ margin: 30 }} type='inner' extra='Reported by' title={report.title}>
          {report.description}
        </Card>
      );
    })
  ) : (
    <p>There are no reports</p>
  );

  return <div style={{ margin: 'auto' }}>{createList}</div>;
};
