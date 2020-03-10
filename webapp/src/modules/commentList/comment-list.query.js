import gql from 'graphql-tag';

export const FIND_ALL_COMMENTS = gql`
  query findAllComments($id: ObjectId!, $answeredTo: ObjectId) {
    findAllComments(findAllComments: { reportId: $id, answeredTo: $answeredTo }) {
      _id
      message
      creationDate
      addedBy {
        userName
      }
      likes
      dislikes
      currentUserLikeType
      reportId
    }
  }
`;
