import gql from 'graphql-tag';

export const ADD_REPORT_COMMENT = gql`
  mutation addReportComment($reportId: ObjectId!, $message: String!, $answeredTo: ObjectId) {
    addReportComment(comment: { message: $message, reportId: $reportId, answeredTo: $answeredTo }) {
      _id
    }
  }
`;
