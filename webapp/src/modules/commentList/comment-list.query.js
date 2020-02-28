import gql from 'graphql-tag';

export const FIND_ALL_COMMENTS = gql`
  query findAllComments($id: ObjectId!) {
    findAllComments(id: $id) {
      _id
      message
      creationDate
      addedBy {
        userName
      }
    }
  }
`;
