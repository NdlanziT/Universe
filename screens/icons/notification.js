import React from 'react';
import { Svg, Path } from 'react-native-svg';

export const NotificationIcon = ({ color = "black", size = 24 }) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></Path>
      <Path d="M13.73 21a2 2 0 0 1-3.46 0"></Path>
    </Svg>
  );
};
