import React from 'react';
import { REPORTS } from './report-list.query';
import { useQuery } from '@apollo/react-hooks';
import { Report } from './report.component';

export const ReportList = () => {
  const { loading, error, data } = useQuery(REPORTS);

  if (loading) {
    return <div>Loading</div>;
  } else if (error) {
    return <div>Something went wrong :(</div>;
  }

  const reports = data.findAllReports;

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {reports.map((r) => (
        <Report key={r._id} report={r} />
      ))}
    </div>
  );
};
