import styled from 'styled-components';

export const ErrorBox = styled.div`
  padding: 8px 15px;
  margin: ${props =>  props.margin || '0 0 16px 0'};
  background-color: #fff1f0;
  border: 1px solid #ffa39e;
`;

export const ErrorMessage = styled.span`
  color: #111;
`;
