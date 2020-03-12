import gql from 'graphql-tag';

export const UPDATE_COMMENT_LIKE = gql`
  mutation updateCommentLike($commentId: ObjectId!, $likeType: LikeType!) {
    updateCommentLike(commentLike: { commentId: $commentId, likeType: $likeType }) {
      ... on ReportComment {
        _id
        currentUserLikeType
        likes
        dislikes
      }
      ... on ErrorResponse {
        message
      }
    }
  }
`;
