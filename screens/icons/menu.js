import React from 'react';
import { Svg, Path } from 'react-native-svg';

export const MenuIcon = ({ color = "#000000", size = 24 }) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      height={size}
      viewBox="0 -960 960 960"
      width={size}
      fill={color}
    >
      <Path d="M172-278v-28h616v28H172Zm0-188v-28h616v28H172Zm0-188v-28h616v28H172Z" />
    </Svg>
  );
};
