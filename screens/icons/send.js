import React from 'react';
import { Svg, Path } from 'react-native-svg';

export const SendIcon = ({ color = "#000000", size = 24 }) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      height={size}
      width={size}
      viewBox="0 -960 960 960"
      fill={color}
    >
      <Path d="M172-238v-196l208-46-208-46v-196l574 242-574 242Z" />
    </Svg>
  );
};
