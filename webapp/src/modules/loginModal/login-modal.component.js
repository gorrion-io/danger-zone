import React, { useState, useCallback } from 'react';
import { Modal, Button } from 'antd';
import { AddUserForm } from '../addUserForm/add-user-form.component';
import { MagicLinkForm } from '../magicLinkForm/magic-link-form.component';
import styled from 'styled-components';

const FormContainer = styled.div`
  margin: auto;
  display: flex;
  width: 75%;
  flex-direction: column;
`;

const Paragraph = styled.p`
  font-size: 1.1em;
  font-weight: 400;
  margin-top: 12px;
  margin-bottom: 12px;
`;

const CancelButton = styled(Button)`
  margin-top: 8px !important;
`;

export const LoginModal = () => {
  const [showMagicLinkBtn, setShowMagicLinkBtn] = useState(false);
  const [title, setTitle] = useState('Create an account');

  const onLogin = useCallback(() => {
    setShowMagicLinkBtn(true);
    setTitle('Login by magic link');
  }, []);

  const onLoginCancel = useCallback(() => {
    setShowMagicLinkBtn(false);
    setTitle('Create an account');
  }, []);

  return (
    <Modal visible={true} title={title} closable={false} centered bodyStyle={{ paddingTop: '40px', paddingBottom: '40px' }} footer={null}>
      {showMagicLinkBtn ? (
        <FormContainer>
          <MagicLinkForm />
          <CancelButton onClick={onLoginCancel}>Cancel</CancelButton>
        </FormContainer>
      ) : (
        <FormContainer>
          <AddUserForm />
          <Paragraph>Already have an account?</Paragraph>
          <Button onClick={onLogin}>Login</Button>
        </FormContainer>
      )}
    </Modal>
  );
};
