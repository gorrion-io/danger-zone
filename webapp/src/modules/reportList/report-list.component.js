import { useMutation, useQuery } from '@apollo/react-hooks';
import { Alert, Card, Icon, Spin, Tooltip } from 'antd';
import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/auth.context';
import { ERROR_RESPONSE } from '../../utils/constants/respons-types.const';
import { USER_ROLE } from '../../utils/enums/user-role.enum';
import { openErrorNotification } from '../../utils/notifications';
import { ErrorBox, ErrorMessage } from '../common/error-display';
import { DELETE_REPORT } from './report-list.mutations';
import { GET_ALL_REPORTS } from './report-list.query';

const AdminIcon = ({ id, deleteReport }) => {
  return (
    <Tooltip title='Wydupc'>
      <Icon
        type='delete'
        onClick={() => {
          deleteReport({ variables: { _id: id } });
        }}
      />
    </Tooltip>
  );
};

const AdminCard = ({ isAdmin, report, refetch }) => {
  const [deleteReport] = useMutation(DELETE_REPORT, {
    onCompleted: (data) => {
      if (data.deleteReport.__typename === ERROR_RESPONSE) {
        openErrorNotification(data.deleteReport.message);
      } else {
        refetch();
      }
    },
  });
  const adminProps = isAdmin
    ? {
        actions: [<AdminIcon key={report._id} id={report._id} deleteReport={deleteReport} />],
      }
    : null;

  return (
    <Card
      key={report._id}
      style={{ margin: '30px 0' }}
      type='inner'
      extra={report.reportedBy && `Reported by ${report.reportedBy.userName}`}
      title={report.title}
      {...adminProps}>
      {report.description}
    </Card>
  );
};

export const ReportList = () => {
  const { loading, error, data, refetch } = useQuery(GET_ALL_REPORTS);
  const reports = data ? data.findAllReports : null;
  const authContext = useContext(AuthContext);
  const isAdmin = authContext.payload.role == USER_ROLE.Admin;

  if (error)
    return (
      <ErrorBox>
        <ErrorMessage>An error occured</ErrorMessage>
      </ErrorBox>
    );

  const createList =
    reports && reports.length ? (
      reports.map((report) => {
        return <AdminCard key={report._id} report={report} isAdmin={isAdmin} refetch={refetch} />;
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
