/* eslint-disable react/display-name */
import React, { useState, useCallback, useEffect } from 'react';
import { Tooltip } from 'antd';
import { useMutation } from '@apollo/react-hooks';
import { DislikeOutlined, LikeOutlined, DislikeFilled, LikeFilled } from '@ant-design/icons';
import styled from 'styled-components';
import moment from 'moment';
import { UPDATE_COMMENT_LIKE } from './comment.mutations';
import { LIKE, DISLIKE, NONE } from '../../utils/constants/like-type.const';
import { ERROR_RESPONSE } from '../../utils/constants/respons-types.const';
import { openErrorNotification } from '../../utils/notifications';
import { CommentList } from '../commentList/comment-list.component';

const HeaderSection = styled.div`
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

const LikeTooltip = styled(Tooltip)`
  && {
    margin-left: 8px;
  }
`;

const CommentContainer = styled.div`
  &{props => ({
    ...props.style,
  })}
`;

const LikeCounter = styled.span`
  margin-left: 8px;
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

export const Comment = React.memo((props) => {
  const [updateCommentLike] = useMutation(UPDATE_COMMENT_LIKE);
  const [showReply, setShowReply] = useState(props.showReplyForm);
  const [showAnswers, setShowAnswers] = useState(props.showAnswers);

  useEffect(() => {
    props.onShowReplyForm(showReply, props.comment._id);
    props.measure();
  }, [showReply]);

  useEffect(() => {
    props.onShowAnswers(showAnswers, props.comment._id);
    props.measure();
  }, [showAnswers]);

  const updateLikeType = useCallback(async (nextLikeType) => {
    const { data } = await updateCommentLike({
      variables: {
        commentId: props.comment._id,
        likeType: nextLikeType,
      },
    });

    if (data.updateCommentLike.__typename === ERROR_RESPONSE) {
      openErrorNotification(data.updateCommentLike.message);
    } else if (typeof props.updateComment === 'function') {
      props.updateComment(data.updateCommentLike);
    }
  }, []);

  const onReply = useCallback(() => {
    setShowReply(!showReply);
  }, [showReply]);

  const onShowAnswers = useCallback(() => {
    setShowAnswers(!showAnswers);
  }, [showAnswers]);

  return (
    <CommentContainer style={props.style}>
      <div style={{ paddingBottom: 15 }}>
        <HeaderSection>
          {props.comment.addedBy.userName}

          <DateTooltip title={moment(props.comment.creationDate).format('YYYY-MM-DD HH:mm:ss')}>
            <span>{moment(props.comment.creationDate).fromNow()}</span>
          </DateTooltip>

          <LikeTooltip title='Like'>
            {props.comment.currentUserLikeType === LIKE ? (
              <LikeFilled onClick={() => updateLikeType(NONE)}></LikeFilled>
            ) : (
              <LikeOutlined onClick={() => updateLikeType(LIKE)}></LikeOutlined>
            )}
          </LikeTooltip>

          <LikeCounter>{props.comment.likes}</LikeCounter>

          <LikeTooltip title='Dislike'>
            {props.comment.currentUserLikeType === DISLIKE ? (
              <DislikeFilled onClick={() => updateLikeType(NONE)}></DislikeFilled>
            ) : (
              <DislikeOutlined onClick={() => updateLikeType(DISLIKE)}></DislikeOutlined>
            )}
          </LikeTooltip>

          <LikeCounter>{props.comment.dislikes}</LikeCounter>
        </HeaderSection>
        <MessageSection>{props.comment.message}</MessageSection>

        {!props.isNested && (
          <div>
            <ActionButton onClick={onReply}>Reply</ActionButton>
            <ActionButton onClick={onShowAnswers}>View answers</ActionButton>
          </div>
        )}

        {(showAnswers || showReply) && (
          <CommentListContainer>
            <CommentList
              reportId={props.comment.reportId}
              parentId={props.comment._id}
              heightChanged={props.measure}
              style={{ maxHeight: 200 }}
              isNested={true}
              showReplyForm={showReply}
            />
          </CommentListContainer>
        )}
      </div>
    </CommentContainer>
  );
});
