import React, { useState } from 'react';
import { Input, Icon, Button, Modal, Form } from 'antd';
import { useMutation } from '@apollo/react-hooks';
import { ADD_REPORT } from './add-report-form.mutation';
import TextArea from 'antd/lib/input/TextArea';
import { Formik } from 'formik';
import styled from 'styled-components';

const AddButton = styled(Button)`
  && {
    display: block;
    margin: 0 0 0 auto;
  }
`;

export const AddReportForm = () => {
  const [showModal, setShowModal] = useState(false);
  const [addReport] = useMutation(ADD_REPORT);

  const submitForm = async (values) => {
    const aaa = {title: values.title, description: values.description, longitude: 23, latitude: 46 };
    await addReport({variables: {report : aaa }});
  };
  return (
    <>
      <div style={{ display: 'flex' }}>
        <Button onClick={() => !showModal && setShowModal(true)}>
          <Icon type='plus' /> Add new report
        </Button>
      </div>
      <Modal visible={showModal} onCancel={() => showModal && setShowModal(false)} title='Add new report' footer={null}>
        <Formik
          initialValues={{
            title: '',
            description: '',
          }}
          onSubmit={async (values, actions) => {
            await submitForm(values);
          }}
          render={(props) => (
            <Form onSubmit={props.handleSubmit}>
              <Form.Item>
                <Input value={props.values.title} name='title' placeholder='Title' onChange={props.handleChange}></Input>
              </Form.Item>
              <Form.Item>
                <TextArea
                  name='description'
                  type='text'
                  rows='4'
                  value={props.values.description}
                  placeholder='Description'
                  onChange={props.handleChange}></TextArea>
              </Form.Item>
              <AddButton type='primary' htmlType='submit'>
                Add
              </AddButton>
            </Form>
          )}
        />
      </Modal>
    </>
  );
};
