import gql from 'graphql-tag';

export const DELETE_REPORT = gql`
  mutation delete($_id: ObjectId!) {
    deleteReport(id: $_id) {
      ... on SuccessResponse {
        message
      }
      ... on ErrorResponse {
        message
      }
    }
  }
`;
