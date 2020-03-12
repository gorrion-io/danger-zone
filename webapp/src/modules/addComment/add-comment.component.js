import React, { useState, useCallback, useEffect } from 'react';
import { Input, Button } from 'antd';
import { useMutation } from '@apollo/react-hooks';
import { ADD_REPORT_COMMENT } from './add-comment.mutation';
import { FIND_ALL_COMMENTS } from '../commentList/comment-list.query';
import styled from 'styled-components';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const CustomButton = styled(Button)`
  && {
    margin-top: 8px;
    margin-right: 8px;
    width: 120px;
  }
`;

const getReplyUserName = (replyInfo) => {
  return replyInfo && replyInfo.userName ? `@${replyInfo.userName}: ` : '';
};

export const AddComment = ({ reportId, replyInfo, cancelReply }) => {
  const [addComment] = useMutation(ADD_REPORT_COMMENT, {
    refetchQueries: () => [
      {
        query: FIND_ALL_COMMENTS,
        variables: {
          id: reportId,
          answeredTo: replyInfo.answeredTo,
        },
      },
    ],
  });
  const [comment, setComment] = useState('');
  const [isReply, setIsReply] = useState(false);

  useEffect(() => {
    const isReply = !!(replyInfo && replyInfo.userName && replyInfo.answeredTo);
    setIsReply(isReply);
    setComment(isReply ? getReplyUserName(replyInfo) : '');
  }, [replyInfo]);

  const onCancelReply = useCallback(() => {
    cancelReply();
  }, []);

  const onCommentChanged = useCallback(
    ({ target }) => {
      let val = target.value;
      if (isReply) {
        const replyUserName = getReplyUserName(replyInfo);
        const unLength = replyUserName.length;
        if (val.length < unLength || val.substr(0, unLength) !== replyUserName) {
          val = comment;
        }
      }

      setComment(val);
    },
    [isReply, replyInfo, comment],
  );

  const onAddComment = useCallback(async () => {
    if (!comment) return;

    await addComment({
      variables: {
        message: comment,
        reportId: reportId,
        answeredTo: replyInfo.answeredTo,
      },
    });

    cancelReply();
  }, [comment]);

  return (
    <FormContainer>
      <Input onChange={onCommentChanged} value={comment} placeholder='Write a comment' name='comment' />
      <ButtonContainer>
        <CustomButton onClick={onAddComment} type='primary'>
          Add comment
        </CustomButton>
        {isReply && (
          <CustomButton onClick={onCancelReply} type='danger'>
            Cancel
          </CustomButton>
        )}
      </ButtonContainer>
    </FormContainer>
  );
};
