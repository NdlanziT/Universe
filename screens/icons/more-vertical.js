import React from 'react';
import { Svg, Circle } from 'react-native-svg';

export const MoreOptionIcon = ({ color = "#000000", size = 24 }) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
    >
      <Circle cx="12" cy="5" r="1" />
      <Circle cx="12" cy="12" r="1" />
      <Circle cx="12" cy="19" r="1" />
    </Svg>
  );
};
