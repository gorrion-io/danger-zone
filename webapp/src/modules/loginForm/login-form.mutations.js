import gql from 'graphql-tag';

export const LOGIN = gql`
  mutation loginUser($userName: String!) {
    addUser(user: { userName: $userName }) {
      token
    }
  }
`;
