import React from 'react';
import { Svg, Path } from 'react-native-svg';

export const BackButton = ({ color = "#000000", size = 24 }) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      height={size}
      width={size}
      viewBox="0 -960 960 960"
      fill={color}
    >
      <Path d="m266-466 234 234-20 20-268-268 268-268 20 20-234 234h482v28H266Z" />
    </Svg>
  );
};
