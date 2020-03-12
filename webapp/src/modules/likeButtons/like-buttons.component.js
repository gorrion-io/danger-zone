import React, { useCallback } from 'react';
import { Tooltip } from 'antd';
import { useMutation } from '@apollo/react-hooks';
import { DislikeOutlined, LikeOutlined, DislikeFilled, LikeFilled } from '@ant-design/icons';
import styled from 'styled-components';
import { UPDATE_COMMENT_LIKE } from './like-buttons.mutations';
import { LIKE, DISLIKE, NONE } from '../../utils/constants/like-type.const';
import { ERROR_RESPONSE } from '../../utils/constants/respons-types.const';
import { openErrorNotification } from '../../utils/notifications';

const LikeTooltip = styled(Tooltip)`
  && {
    margin-left: 8px;
  }
`;

const LikeCounter = styled.span`
  margin-left: 8px;
`;

export const LikeButtons = ({ comment, updateComment }) => {
  const [updateCommentLike] = useMutation(UPDATE_COMMENT_LIKE);

  const updateLikeType = useCallback(
    async (nextLikeType) => {
      const { data } = await updateCommentLike({
        variables: {
          commentId: comment._id,
          likeType: nextLikeType,
        },
      });

      if (data.updateCommentLike.__typename === ERROR_RESPONSE) {
        openErrorNotification(data.updateCommentLike.message);
      } else if (typeof updateComment === 'function') {
        updateComment(data.updateCommentLike);
      }
    },
    [updateComment],
  );

  return (
    <div>
      <LikeTooltip title='Like'>
        {comment.currentUserLikeType === LIKE ? (
          <LikeFilled onClick={() => updateLikeType(NONE)}></LikeFilled>
        ) : (
          <LikeOutlined onClick={() => updateLikeType(LIKE)}></LikeOutlined>
        )}
      </LikeTooltip>

      <LikeCounter>{comment.likes}</LikeCounter>

      <LikeTooltip title='Dislike'>
        {comment.currentUserLikeType === DISLIKE ? (
          <DislikeFilled onClick={() => updateLikeType(NONE)}></DislikeFilled>
        ) : (
          <DislikeOutlined onClick={() => updateLikeType(DISLIKE)}></DislikeOutlined>
        )}
      </LikeTooltip>

      <LikeCounter>{comment.dislikes}</LikeCounter>
    </div>
  );
};
