import React, { useState, useCallback, useContext } from 'react';
import { Tooltip } from 'antd';
import styled from 'styled-components';
import moment from 'moment';
import { CommentList } from '../commentList/comment-list.component';
import { CommentContext } from '../../contexts/comment.context';
import { LikeButtons } from '../likeButtons/like-buttons.component';

const HeaderSection = styled.div`
  display: flex;
  font-size: 0.85em;
  color: #545557;
`;

const MessageSection = styled.div`
  word-wrap: break-word;
  padding: 8px;
`;

const DateTooltip = styled(Tooltip)`
  && {
    margin-left: 8px;
    color: #b0b2b5;
  }
`;

const CommentContainer = styled.div`
  &{props => ({
    ...props.style,
  })}
`;

const ActionButton = styled.span`
  padding-right: 10px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 12px;
  cursor: pointer;
  -webkit-transition: color 0.3s;
  transition: color 0.3s;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;

const CommentListContainer = styled.div`
  padding-left: 30px;
  padding-top: 8px;
  padding-right: 10px;
`;

export const Comment = ({ comment, updateComment, style, isNested, parentId }) => {
  const commentContext = useContext(CommentContext);
  const [showAnswers, setShowAnswers] = useState(false);

  const onReply = useCallback(() => {
    const answeredTo = isNested ? parentId : comment._id;
    commentContext.reply({
      answeredTo,
      userName: comment.addedBy.userName,
    });
  }, []);

  const onShowAnswers = useCallback(() => {
    setShowAnswers(!showAnswers);
  }, [showAnswers]);

  return (
    <CommentContainer style={style}>
      <div style={{ paddingBottom: 15 }}>
        <HeaderSection>
          {comment.addedBy.userName}

          <DateTooltip title={moment(comment.creationDate).format('YYYY-MM-DD HH:mm:ss')}>
            <span>{moment(comment.creationDate).fromNow()}</span>
          </DateTooltip>

          <LikeButtons comment={comment} updateComment={updateComment} />
        </HeaderSection>
        <MessageSection>{comment.message}</MessageSection>

        <ActionButton onClick={onReply}>Reply</ActionButton>
        {!isNested && <ActionButton onClick={onShowAnswers}>View answers</ActionButton>}

        {showAnswers && !isNested && (
          <CommentListContainer>
            <CommentList reportId={comment.reportId} parentId={comment._id} isNested={true} />
          </CommentListContainer>
        )}
      </div>
    </CommentContainer>
  );
};
