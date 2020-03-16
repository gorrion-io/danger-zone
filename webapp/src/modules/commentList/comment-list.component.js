import React, { useCallback, useContext, useMemo } from 'react';
import { useQuery, useSubscription } from '@apollo/react-hooks';
import { Spin } from 'antd';
import { FIND_ALL_COMMENTS } from './comment-list.query';
import { COMMENT_ADDED, COMMENT_UPDATE } from './comment-list.subscriptions';
import { Comment } from '../comment/comment.component';
import { ErrorBox, ErrorMessage } from '../common/error-display';
import { AddComment } from '../addComment/add-comment.component';
import { CommentContext } from '../../contexts/comment.context';

export const CommentList = ({ reportId, parentId, isNested }) => {
  const gqlVariable = useMemo(
    () => ({
      reportId,
      answeredTo: parentId,
      isNested: !!isNested,
    }),
    [reportId, parentId, isNested],
  );

  const commentContext = useContext(CommentContext);
  const { loading, error, data } = useQuery(FIND_ALL_COMMENTS, {
    variables: gqlVariable,
  });

  const comments = data ? data.findAllComments : [];

  const updateCommentQuery = (client, data) => {
    client.writeQuery({
      query: FIND_ALL_COMMENTS,
      variables: gqlVariable,
      data: { findAllComments: data },
    });
  };

  useSubscription(COMMENT_ADDED, {
    variables: gqlVariable,
    onSubscriptionData: ({ subscriptionData: { data }, client }) => {
      updateCommentQuery(client, [...comments, data.commentAdded]);
    },
  });

  useSubscription(COMMENT_UPDATE, {
    variables: gqlVariable,
    onSubscriptionData: ({ subscriptionData: { data }, client }) => {
      const comment = data.commentUpdate;

      const index = comments.findIndex((c) => c._id === comment._id);
      Object.assign(comments[index], comment);

      updateCommentQuery(client, comments);
    },
  });

  const generateCommentsList = useCallback(() => comments.map((c) => <Comment key={c._id} comment={c} isNested={isNested} parentId={parentId} />), [
    comments,
    isNested,
    parentId,
  ]);

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
