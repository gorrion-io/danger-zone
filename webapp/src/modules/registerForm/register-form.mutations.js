import gql from 'graphql-tag';

export const REGISTER = gql`
  mutation register($_id: ObjectId!, $email: String!, $password: String!) {
    register(registerUserParam: { _id: $_id, email: $email, password: $password }) {
      ... on Token {
        refreshToken
        token
      }
      ... on ErrorResponse {
        message
      }
    }
  }
`;
