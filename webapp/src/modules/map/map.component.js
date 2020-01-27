import React from 'react';

import { Map, GoogleApiWrapper } from 'google-maps-react';
import { Skeleton } from 'antd';
import styled from 'styled-components';

const MapBox = styled.div`
  height: 500px;
  margin: 20px 0;
`;

const MapContainer = (props) => {
  if (!props.loaded) return <Skeleton active />;

  const style = {
    width: '95%',
    height: '500px',
    margin: 'auto',
    position: 'relative',
  };
  const map = <Map centerAroundCurrentLocation style={style} google={props.google} zoom={14} />;

  return <MapBox>{map}</MapBox>;
};

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_API_KEY,
})(MapContainer);
