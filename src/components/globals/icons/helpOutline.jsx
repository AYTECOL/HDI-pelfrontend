import React from 'react';
/**
 * Question mark icon with green outline and green sign over white background.
 * @param {React.SVGProps<SVGSVGElement>} props
 */
export const HelpOutline = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24"
    viewBox="0 0 24 24"
    width="24"
    {...props}
  >
    <circle cx="12" cy="12" r="11.25" fill="#fff" stroke="#009c49" strokeWidth="1.5" />
    <path
      transform="translate(7.797 4.998)"
      d="M2.877,13.451V11.6H5.044v1.856Zm.035-3.139V9.478c0-.945.221-2.017,1.843-3.459A2.693,2.693,0,0,0,5.927,3.74a1.669,1.669,0,0,0-1.767-1.7c-1.162,0-1.808.606-2.029,1.9l-.086.5H0l.043-.637A3.951,3.951,0,0,1,4.177,0a3.648,3.648,0,0,1,3.9,3.721A4.661,4.661,0,0,1,6.11,7.561a2.457,2.457,0,0,0-1.1,2.026v.725Z"
      fill="#009c49"
    />
  </svg>
);

export default HelpOutline;
