import gql from 'graphql-tag';

export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(loginUserParam: { email: $email, password: $password }) {
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

export const SEND_MAGIC_LINK = gql`
  mutation sendMagicLink($email: String!) {
    sendMagicLink(magicLinkParam: { email: $email }) {
      ... on SuccessResponse {
        message
      }
      ... on ErrorResponse {
        message
      }
    }
  }
`;

export const TOKEN = gql`
  mutation token($userName: String!) {
    token(getToken: { grantType: AccessToken, userName: $userName }) {
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
