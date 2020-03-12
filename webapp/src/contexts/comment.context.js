import React, { useState, useCallback, createContext } from 'react';

export const CommentContext = createContext({
  replyInfo: {},
  reply: () => {},
  cancelReply: () => {},
});

const CommentContextProvider = (props) => {
  const [replyInfo, setReplyInfo] = useState({});

  const replyHandler = useCallback((replyInfo) => {
    setReplyInfo(replyInfo);
  }, []);

  const cancelReplyHandler = useCallback(() => {
    setReplyInfo({});
  }, []);

  return (
    <CommentContext.Provider value={{ reply: replyHandler, cancelReply: cancelReplyHandler, replyInfo: replyInfo }}>
      {props.children}
    </CommentContext.Provider>
  );
};

export default CommentContextProvider;
