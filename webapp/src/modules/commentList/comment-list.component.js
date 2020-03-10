import React, { useState, useCallback, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { List, AutoSizer, CellMeasurer, CellMeasurerCache } from 'react-virtualized';
import { Spin } from 'antd';
import { FIND_ALL_COMMENTS } from './comment-list.query';
import { Comment } from '../comment/comment.component';
import styled from 'styled-components';
import { ErrorBox, ErrorMessage } from '../common/error-display';
import { AddComment } from '../addComment/add-comment.component';

const cache = new CellMeasurerCache({
  fixedWidth: true,
  defaultHeight: 50,
});

const ListContainer = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
  &{props => ({
    ...props.style,
  })}
`;

export const CommentList = (props) => {
  const { loading, error, data, client } = useQuery(FIND_ALL_COMMENTS, {
    variables: {
      id: props.reportId,
      answeredTo: props.parentId,
    },
  });
  const comments = data ? data.findAllComments : [];
  const [listHeight, setListHeight] = useState(1);
  const [showReply, setShowReply] = useState({});
  const [showAnswers, setShowAnswers] = useState({});

  const updateComment = useCallback(
    (comment) => {
      const index = comments.findIndex((c) => c._id === comment._id);
      Object.assign(comments[index], comment);

      client.writeQuery({
        query: FIND_ALL_COMMENTS,
        variables: {
          id: props.reportId,
          answeredTo: props.parentId,
        },
        data: { findAllComments: comments },
      });
    },
    [comments],
  );

  const onShowReply = useCallback(
    (show, id) => {
      showReply[id] = show;
      setShowReply(showReply);
    },
    [showReply],
  );

  const onShowAnswers = useCallback(
    (show, id) => {
      showAnswers[id] = show;
      setShowAnswers(showAnswers);
    },
    [showAnswers],
  );

  const commentList = useCallback(
    ({ index, parent, style }) => (
      <CellMeasurer key={comments[index]._id} cache={cache} parent={parent} columnIndex={0} rowIndex={index}>
        {({ measure }) => {
          return (
            <Comment
              style={style}
              comment={comments[index]}
              updateComment={updateComment}
              onShowReplyForm={(show) => onShowReply(show, comments[index]._id)}
              showReplyForm={!!showReply[comments[index]._id]}
              onShowAnswers={(show) => onShowAnswers(show, comments[index]._id)}
              showAnswers={!!showAnswers[comments[index]._id]}
              measure={measure}
              isNested={props.isNested}
            />
          );
        }}
      </CellMeasurer>
    ),
    [comments, showReply, showAnswers],
  );

  useEffect(() => {
    if (typeof props.heightChanged === 'function') {
      props.heightChanged();
    }
  }, [listHeight]);

  const calcListHeight = () => {
    let height = 0;
    for (let i = 0; i < comments.length; i++) {
      height += cache.getHeight(i, 0);
    }

    let maxHeight = 300;
    if (props && props.maxHeight) maxHeight = props.maxHeight;
    else if (props && props.style && props.style.maxHeight) maxHeight = props.style.maxHeight;

    setListHeight(height - 10 < maxHeight ? height : maxHeight);
  };

  if (error)
    return (
      <ErrorBox>
        <ErrorMessage>An error occured</ErrorMessage>
      </ErrorBox>
    );

  return (
    <Spin spinning={loading}>
      <ListContainer style={{ height: listHeight }}>
        <AutoSizer>
          {({ height, width }) => (
            <List
              width={width}
              height={height}
              rowCount={comments.length}
              rowHeight={cache.rowHeight}
              deferredMeasurementCache={cache}
              rowRenderer={commentList}
              onRowsRendered={() => calcListHeight()}
            />
          )}
        </AutoSizer>
      </ListContainer>
      {props.showReplyForm && <AddComment reportId={props.reportId} answeredTo={props.parentId} />}
    </Spin>
  );
};
