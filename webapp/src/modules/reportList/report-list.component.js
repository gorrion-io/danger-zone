import { useQuery } from '@apollo/react-hooks';
import { Alert, Card, Spin } from 'antd';
import React from 'react';
import { GET_ALL_REPORTS } from './report-list.query';
import { ErrorBox, ErrorMessage } from '../common/error-display';
import { AddComment } from '../addComment/add-comment.component';
import { CommentList } from '../commentList/comment-list.component';

export const ReportList = () => {
  const { loading, error, data } = useQuery(GET_ALL_REPORTS);
  const reports = data ? data.findAllReports : null;

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
          <Card
            key={report._id}
            style={{ margin: '30px 0' }}
            type='inner'
            extra={report.reportedBy && `Reported by ${report.reportedBy.userName}`}
            title={report.title}>
            {report.description}

            <CommentList reportId={report._id} style={{ maxHeight: 500 }} />
            <AddComment reportId={report._id} />
          </Card>
        );
      })
    ) : (
      <Alert type='info' message='There are no reports' showIcon />
    );

  return (
    <Spin spinning={loading}>
      <div style={{ margin: 'auto' }}>{createList}</div>
    </Spin>
  );
};
