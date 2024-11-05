import React from 'react';
import { Svg, Path } from 'react-native-svg';

export const CalendarIcon = ({ color = "#000000", size = 24 }) => {
  return (
    <Svg
      height={size}
      width={size}
      viewBox="0 -960 960 960"
      fill={color}
    >
      <Path d="M580-240q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z"/>
    </Svg>
  );
};
