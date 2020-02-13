import gql from 'graphql-tag';

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
