import React, { useState, useCallback } from 'react';
import { Input, Button } from 'antd';
import { useMutation } from '@apollo/react-hooks';
import { ADD_REPORT_COMMENT } from './add-comment.mutation';
import { FIND_ALL_COMMENTS } from '../commentList/comment-list.query';
import styled from 'styled-components';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const AddButton = styled(Button)`
  && {
    margin-top: 8px;
    width: 120px;
  }
`;

export const AddComment = (props) => {
  const [addComment] = useMutation(ADD_REPORT_COMMENT, {
    refetchQueries: () => [
      {
        query: FIND_ALL_COMMENTS,
        variables: { id: props.reportId },
      },
    ],
  });
  const [comment, setComment] = useState('');

  const onAddComment = useCallback(async () => {
    if (!comment) return;

    await addComment({
      variables: {
        message: comment,
        reportId: props.reportId,
        answeredTo: null,
      },
    });

    setComment('');
  }, [comment]);

  return (
    <FormContainer>
      <Input onChange={(e) => setComment(e.target.value)} value={comment} placeholder='Write a comment' name='comment' />
      <AddButton onClick={onAddComment} type='primary'>
        Add comment
      </AddButton>
    </FormContainer>
  );
};
