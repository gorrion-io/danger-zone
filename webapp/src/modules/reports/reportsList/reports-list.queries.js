import gql from 'graphql-tag';

export const GET_REPORTS = gql`
  query getReports {
    findAllReports {
      _id,
      title,
      description,
      reportedBy
    }
  }
`;
