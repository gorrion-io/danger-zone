import gql from 'graphql-tag';

export const REGISTER = gql`
  mutation register($_id: ObjectId!, $email: String!) {
    register(registerUserParam: { _id: $_id, email: $email }) {
      ... on SuccessResponse {
        message
      }
      ... on ErrorResponse {
        message
      }
    }
  }
`;
