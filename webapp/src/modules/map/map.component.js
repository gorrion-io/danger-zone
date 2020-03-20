import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@apollo/react-hooks';
import MapGL, { Marker, FullscreenControl } from 'react-map-gl';
import { Modal, Result } from 'antd';
import styled from 'styled-components';

import { GET_ALL_REPORTS } from '../reportList/report-list.query';

const MapBox = styled.div`
  margin: 20px auto;
  width: 100%;
  div {
    cursor: ${(props) => props.pointer && 'pointer !important'};
  }
`;

const FullScreen = styled(FullscreenControl)`
  width: 30px;
  position: absolute;
  left: 10px;
  top: 10px;
`;

const MAPBOX_TOKEN = process.env.REACT_APP_API_KEY;

const Markers = ({ markers, ...props }) => {
  const [showModal, setShowModal] = useState(false);
  const [report, setReport] = useState({ title: 'Placeholder', description: 'Placeholder', reportedBy: { userName: 'Placeholder' } });

  const shouldShowModal = (marker) => {
    if (marker.title) {
      setShowModal(true);
      setReport(marker);
    }
  };

  return (
    <>
      {markers &&
        markers.length &&
        markers.map((marker) => {
          return marker.longitude && marker.latitude
            ? Object.entries(marker).length !== 0 && (
                <Marker
                  key={(marker._id || marker.title + marker.longitude) + marker.longitude}
                  longitude={marker.longitude}
                  latitude={marker.latitude}>
                  <img src='marker.png' onClick={() => shouldShowModal(marker)} style={{ width: '20px', cursor: 'pointer' }} alt='marker' />
                </Marker>
              )
            : [];
        })}
      <Modal visible={showModal} onCancel={() => setShowModal(false)} title='Report details' footer={`Added by: ${report.reportedBy.userName}`}>
        <Result status='warning' title={report.title} subTitle={report.description}></Result>
      </Modal>
    </>
  );
};

export const MapContainer = (props) => {
  const { loading, error, data, refetch } = useQuery(GET_ALL_REPORTS);
  const reports = data && !loading && !error ? data.findAllReports : [];
  const markers = props.markers ? props.markers : [];
  const [viewport, setViewport] = useState({
    latitude: 37.8,
    longitude: -122.4,
    zoom: 14,
    bearing: 0,
    pitch: 0,
  });

  const getPosition = async () => {
    await navigator.geolocation.getCurrentPosition(
      (position) =>
        setViewport({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          zoom: 13,
          bearing: 0,
          pitch: 0,
        }),
      (err) => console.log(err),
    );
  };

  useEffect(() => {
    getPosition();
  }, []);

  const resolvedReports = useMemo(() => {
    return reports && reports.length
      ? reports.map((report) => {
          return {
            _id: report.id,
            title: report.title,
            description: report.description,
            latitude: report.latitude,
            longitude: report.longitude,
            reportedBy: report.reportedBy,
          };
        })
      : [];
  }, [reports]);

  return (
    <MapBox pointer={props.pointer}>
      <MapGL
        {...viewport}
        width='100%'
        height='500px'
        margin='auto'
        mapStyle='mapbox://styles/mapbox/dark-v9'
        onViewportChange={setViewport}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        onClick={props.onClick}>
        <Markers markers={[...markers, ...resolvedReports]} />
        <FullScreen />
      </MapGL>
    </MapBox>
  );
};
