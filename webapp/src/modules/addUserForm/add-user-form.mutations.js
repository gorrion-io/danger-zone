import gql from 'graphql-tag';

export const ADD_USER = gql`
  mutation addUser($userName: String!) {
    addUser(user: { userName: $userName }) {
      _id
      userName
    }
  }
`;
