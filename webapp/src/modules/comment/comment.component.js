import React from 'react';
import { Tooltip } from 'antd';
import styled from 'styled-components';
import moment from 'moment';

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
const CommentContainer = styled.div`
  margin-bottom: 10px;
  &{props => ({
    ...props.style,
  })}
`;

export const Comment = (props) => {
  return (
    <CommentContainer style={props.style}>
      <HeaderSection>
        {props.comment.addedBy.userName}

        <DateTooltip title={moment(props.comment.creationDate).format('YYYY-MM-DD HH:mm:ss')}>
          <span>{moment(props.comment.creationDate).fromNow()}</span>
        </DateTooltip>
      </HeaderSection>
      <MessageSection>{props.comment.message}</MessageSection>
    </CommentContainer>
  );
};
