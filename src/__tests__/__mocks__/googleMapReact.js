import React from 'react';

const GoogleMapReact = ({ children, onClick, ...props }) => (
  <div data-testid="google-map-react" onClick={onClick} {...props}>
    {children}
  </div>
);

export default GoogleMapReact;