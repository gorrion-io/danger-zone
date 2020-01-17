import React from 'react';
import styled from 'styled-components';
import { Input } from 'antd';
import PropTypes from 'prop-types';

const Wrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  width: 100%;
  padding: 10px 15px;
`;

export const FormControl = ({ labelText, inputId, inputType, inputValue, inputOnChange, inputPlaceholder, inputPrefix }) => (
  <Wrapper>
    <label htmlFor={inputId}>{labelText}</label>
    <Input
      onChange={(e) => inputOnChange(e)}
      value={inputValue}
      prefix={inputPrefix ? inputPrefix : ''}
      placeholder={inputPlaceholder}
      type={inputType}
      id={inputId}
    />
  </Wrapper>
);

FormControl.propTypes = {
  labelText: PropTypes.string,
  inputId: PropTypes.string,
  inputType: PropTypes.string,
  inputValue: PropTypes.string,
  inputOnChange: PropTypes.func,
  inputPlaceholder: PropTypes.string,
  inputPrefix: PropTypes.string,
};
