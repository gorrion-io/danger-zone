import gql from 'graphql-tag';

export const REPORTS = gql`
  query getReportList {
    findAllReports {
      _id
      title
      description
    }
  }
`;
