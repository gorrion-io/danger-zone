import React, { useState, useCallback } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { List, AutoSizer, CellMeasurer, CellMeasurerCache } from 'react-virtualized';
import { Spin } from 'antd';
import { FIND_ALL_COMMENTS } from './comment-list.query';
import { Comment } from '../comment/comment.component';
import styled from 'styled-components';
import { ErrorBox, ErrorMessage } from '../common/error-display';

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
  const { loading, error, data } = useQuery(FIND_ALL_COMMENTS, { variables: { id: props.reportId } });
  const comments = data ? data.findAllComments : [];
  const [listHeight, setListHeight] = useState(1);

  const commentList = useCallback(
    ({ index, parent, style }) => (
      <CellMeasurer key={comments[index]._id} cache={cache} parent={parent} columnIndex={0} rowIndex={index}>
        {() => <Comment style={style} comment={comments[index]}></Comment>}
      </CellMeasurer>
    ),
    [comments],
  );

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
    </Spin>
  );
};
