import gql from 'graphql-tag';

export const ACTIVATE_ACCOUNT = gql`
  mutation activateAccount($linkId: String!) {
    activateAccount(activationLinkId: $linkId) {
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
