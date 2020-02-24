import React, { useState, useEffect } from 'react';
import MapGL, { Marker } from 'react-map-gl';
import styled from 'styled-components';

const MapBox = styled.div`
  margin: 20px auto;
  width: 100%;
  div {
    cursor: ${props => props.pointer && 'pointer !important'};
  }
`;
const MAPBOX_TOKEN = process.env.REACT_APP_API_KEY;

const Markers = ({ markers, ...props }) => {
  return (
    <>
      {markers &&
        markers.length &&
        markers.map((marker) => {
          return (
            Object.entries(marker).length !== 0 && (
              <Marker key={(marker._id || (marker.name + marker.longitude)) + marker.longitude} longitude={marker.longitude} latitude={marker.latitude}>
                <img src='marker.png' style={{ width: '20px' }} alt='marker'/>
              </Marker>
            )
          );
        })}
    </>
  );
};

export const MapContainer = (props) => {
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
        <Markers markers={props.markers} />
      </MapGL>
    </MapBox>
  );
};
