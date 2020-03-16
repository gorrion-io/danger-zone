import gql from 'graphql-tag';

export const COMMENT_ADDED = gql`
  subscription commentAdded($reportId: ObjectId!, $answeredTo: ObjectId, $isNested: Boolean!) {
    commentAdded(ids: { reportId: $reportId, answeredTo: $answeredTo }) {
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

export const COMMENT_UPDATE = gql`
  subscription commentUpdate($reportId: ObjectId!, $answeredTo: ObjectId, $isNested: Boolean!) {
    commentUpdate(ids: { reportId: $reportId, answeredTo: $answeredTo }) {
      _id
      dislikes
      likes
      currentUserLikeType
      answersCount @skip(if: $isNested)
    }
  }
`;
