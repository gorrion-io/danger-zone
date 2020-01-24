import gql from 'graphql-tag';

export const REGISTER = gql`
  mutation register($id: ObjectId!, $email: String!, $password: String!) {
    register(registerUserParam: { _id: $id, email: $email, password: $password }) {
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
