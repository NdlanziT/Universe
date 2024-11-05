import React from 'react';
import { Svg, Path } from 'react-native-svg';

export const FullFill = ({ color = "#000000", size = 24 }) => {
  return (
    <Svg
      height={size}
      width={size}
      viewBox="0 -960 960 960"
      fill={color}
    >
      <Path d="M233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Z"/>
    </Svg>
  );
};
