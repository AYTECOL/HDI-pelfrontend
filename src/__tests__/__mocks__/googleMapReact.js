import React from 'react';

const GoogleMapReact = ({ children, onClick, ...props }) => (
  <div 
    data-testid="google-map-react" 
    onClick={onClick}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => e.key === 'Enter' && onClick && onClick(e)}
    {...props}
  >
    {children}
  </div>
);

export default GoogleMapReact;