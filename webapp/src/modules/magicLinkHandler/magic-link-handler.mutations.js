import gql from 'graphql-tag';

export const LOGIN_BY_MAGIC_LINK = gql`
  mutation loginML($linkId: String!) {
    loginByMagicLink(magicLinkId: $linkId) {
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
