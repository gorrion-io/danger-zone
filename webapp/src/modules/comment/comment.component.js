import React, { useState, useCallback } from 'react';
import { Tooltip } from 'antd';
import { useMutation } from '@apollo/react-hooks';
import { DislikeOutlined, LikeOutlined, DislikeFilled, LikeFilled } from '@ant-design/icons';
import styled from 'styled-components';
import moment from 'moment';
import { UPDATE_COMMENT_LIKE } from './comment.mutations';
import { LIKE, DISLIKE, NONE } from '../../utils/constants/like-type.const';

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
  margin-bottom: 10px;
  &{props => ({
    ...props.style,
  })}
`;

const LikeCounter = styled.span`
  margin-left: 8px;
`;

export const Comment = (props) => {
  const [updateCommentLike] = useMutation(UPDATE_COMMENT_LIKE);
  const [userLikeType, setUserLikeType] = useState(props.comment.currentUserLikeType);
  const [likes, setLikes] = useState(props.comment.likes);
  const [dislikes, setDislikes] = useState(props.comment.dislikes);

  const updateLikeType = useCallback(async (nextLikeType) => {
    await updateCommentLike({ variables: { commentId: props.comment._id, likeType: nextLikeType } });
    setUserLikeType(nextLikeType);
  }, []);

  const onLike = useCallback(async () => {
    const previousLikeType = userLikeType;
    const nextLikeType = userLikeType !== LIKE ? LIKE : NONE;

    if (previousLikeType === DISLIKE) {
      setDislikes(dislikes - 1);
    }

    setLikes(previousLikeType !== LIKE ? likes + 1 : likes - 1);
    await updateLikeType(nextLikeType);
  }, [userLikeType, likes, dislikes]);

  const onDislike = useCallback(async () => {
    const previousLikeType = userLikeType;
    const nextLikeType = userLikeType !== DISLIKE ? DISLIKE : NONE;

    if (previousLikeType === LIKE) {
      setLikes(likes - 1);
    }

    setDislikes(previousLikeType !== DISLIKE ? dislikes + 1 : dislikes - 1);
    await updateLikeType(nextLikeType);
  }, [userLikeType, likes, dislikes]);

  return (
    <CommentContainer style={props.style}>
      <HeaderSection>
        {props.comment.addedBy.userName}

        <DateTooltip title={moment(props.comment.creationDate).format('YYYY-MM-DD HH:mm:ss')}>
          <span>{moment(props.comment.creationDate).fromNow()}</span>
        </DateTooltip>

        <LikeTooltip title='Like'>{React.createElement(userLikeType === LIKE ? LikeFilled : LikeOutlined, { onClick: onLike })}</LikeTooltip>

        <LikeCounter>{likes}</LikeCounter>

        <LikeTooltip title='Dislike'>
          {React.createElement(userLikeType === DISLIKE ? DislikeFilled : DislikeOutlined, { onClick: onDislike })}
        </LikeTooltip>

        <LikeCounter>{dislikes}</LikeCounter>
      </HeaderSection>
      <MessageSection>{props.comment.message}</MessageSection>
    </CommentContainer>
  );
};
