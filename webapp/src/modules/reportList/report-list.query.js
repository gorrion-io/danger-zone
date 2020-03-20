import gql from 'graphql-tag';

export const GET_ALL_REPORTS = gql`
  query {
    findAllReports {
      _id
      title
      description
      reportedBy {
        userName
      }
      latitude
      longitude
    }
  }
`;
