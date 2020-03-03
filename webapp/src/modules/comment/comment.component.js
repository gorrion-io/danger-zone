import React, { useCallback } from 'react';
import { Tooltip } from 'antd';
import { useMutation } from '@apollo/react-hooks';
import { DislikeOutlined, LikeOutlined, DislikeFilled, LikeFilled } from '@ant-design/icons';
import styled from 'styled-components';
import moment from 'moment';
import { UPDATE_COMMENT_LIKE } from './comment.mutations';
import { LIKE, DISLIKE, NONE } from '../../utils/constants/like-type.const';
import { FIND_ALL_COMMENTS } from '../commentList/comment-list.query';

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

export const Comment = (props) => {
  const [updateCommentLike] = useMutation(UPDATE_COMMENT_LIKE, {
    refetchQueries: () => [
      {
        query: FIND_ALL_COMMENTS,
        variables: { id: props.comment.reportId },
      },
    ],
  });

  const updateLikeType = useCallback(async (nextLikeType) => {
    await updateCommentLike({
      variables: {
        commentId: props.comment._id,
        likeType: nextLikeType,
      },
    });
  }, []);

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
        <div>
          <ActionButton>Reply</ActionButton>
          <ActionButton>View answers</ActionButton>
        </div>
      </div>
    </CommentContainer>
  );
};
