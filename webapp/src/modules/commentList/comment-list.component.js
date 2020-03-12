import React, { useCallback, useContext } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Spin } from 'antd';
import { FIND_ALL_COMMENTS } from './comment-list.query';
import { Comment } from '../comment/comment.component';
import { ErrorBox, ErrorMessage } from '../common/error-display';
import { AddComment } from '../addComment/add-comment.component';
import { CommentContext } from '../../contexts/comment.context';

export const CommentList = ({ reportId, parentId, isNested }) => {
  const commentContext = useContext(CommentContext);
  const { loading, error, data, client } = useQuery(FIND_ALL_COMMENTS, {
    variables: {
      id: reportId,
      answeredTo: parentId,
    },
  });
  const comments = data ? data.findAllComments : [];

  const updateComment = useCallback(
    (comment) => {
      const index = comments.findIndex((c) => c._id === comment._id);
      Object.assign(comments[index], comment);

      client.writeQuery({
        query: FIND_ALL_COMMENTS,
        variables: {
          id: reportId,
          answeredTo: parentId,
        },
        data: { findAllComments: comments },
      });
    },
    [comments],
  );

  const generateCommentsList = useCallback(
    () => comments.map((c) => <Comment key={c._id} comment={c} updateComment={updateComment} isNested={isNested} parentId={parentId} />),
    [comments, updateComment, isNested, parentId],
  );

  if (error)
    return (
      <ErrorBox>
        <ErrorMessage>An error occured</ErrorMessage>
      </ErrorBox>
    );

  return (
    <Spin spinning={loading}>
      {generateCommentsList()}
      {!isNested && <AddComment reportId={reportId} replyInfo={commentContext.replyInfo} cancelReply={commentContext.cancelReply} />}
    </Spin>
  );
};
