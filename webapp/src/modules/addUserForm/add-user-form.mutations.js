import gql from 'graphql-tag';

export const ADD_USER = gql`
  mutation addUser($userName: String!) {
    addUser(user: { userName: $userName }) {
      _id
      userName
    }
  }
`;

export const TOKEN = gql`
  mutation token($userId: ObjectId!) {
    token(getToken: { grantType: AccessToken, userId: $userId }) {
      ... on Token {
        token
        refreshToken
      }
      ... on ErrorResponse {
        message
      }
    }
  }
`;
