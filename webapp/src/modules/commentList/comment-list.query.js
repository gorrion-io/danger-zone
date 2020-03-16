import gql from 'graphql-tag';

export const FIND_ALL_COMMENTS = gql`
  query findAllComments($reportId: ObjectId!, $answeredTo: ObjectId, $isNested: Boolean!) {
    findAllComments(findAllComments: { reportId: $reportId, answeredTo: $answeredTo }) {
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
      answersCount @skip(if: $isNested)
    }
  }
`;
