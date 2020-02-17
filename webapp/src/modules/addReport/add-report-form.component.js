import React, { useState } from 'react';
import { Input, Icon, Button, Modal, Form } from 'antd';
import { useMutation } from '@apollo/react-hooks';
import { ADD_REPORT } from './add-report-form.mutation';
import TextArea from 'antd/lib/input/TextArea';
import { Formik } from 'formik';
import styled from 'styled-components';
import { MapContainer } from '../map/map.component';
import { ErrorBox, ErrorMessage } from '../common/error-display';
import { GET_ALL_REPORTS } from '../reportList/report-list.query';

const AddButton = styled(Button)`
  && {
    display: block;
    margin: 0 0 0 auto;
  }
`;

const AddReportButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const AddReportForm = () => {
  const [showModal, setShowModal] = useState(false);
  const [addReport] = useMutation(ADD_REPORT,  {refetchQueries: () => [{
    query: GET_ALL_REPORTS
}]});
  const [marker, setMarker] = useState({});
  const [error, setError] = useState(false);
  const handleClick = ({ lngLat: [longitude, latitude] }) => {
    setMarker({ longitude: longitude, latitude: latitude });
  };

  const submitForm = async (values) => {
    try {
      await addReport({
        variables: { report: { title: values.title, description: values.description, longitude: marker.longitude, latitude: marker.latitude } },
      });
      !error && setError(false);
      setShowModal(false);
      setMarker({});
    } catch (error) {
      setError(true);
    }
  };
  return (
    <>
      <AddReportButtonContainer>
        <Button type='primary' onClick={() => !showModal && setShowModal(true)}>
          <Icon type='plus' /> Add new report
        </Button>
      </AddReportButtonContainer>
      <Modal visible={showModal} onCancel={() => showModal && setShowModal(false)} title='Add new report' footer={null}>
        <MapContainer pointer width='100%' markers={[marker]} onClick={(e) => handleClick(e)} />
        <Formik
          initialValues={{
            title: '',
            description: '',
          }}
          onSubmit={async (values, {resetForm}) => {
            await submitForm(values);
            resetForm({})
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
              {error && (
                <ErrorBox margin={'16px 0'}>
                  <ErrorMessage>An error occured</ErrorMessage>
                </ErrorBox>
              )}
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
