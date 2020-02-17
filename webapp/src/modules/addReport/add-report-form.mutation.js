import gql from 'graphql-tag';

export const ADD_REPORT = gql`
  mutation addReport($report: AddReportInput!) {
    addReport(report: $report) {
      title
    }
  }
`;
