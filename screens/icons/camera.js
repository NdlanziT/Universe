import React from 'react';
import { Svg, Path } from 'react-native-svg';

export const CameraIcon = ({ color = "#000000", size = 24 }) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      height={size}
      width={size}
      viewBox="0 -960 960 960"
      fill={color}
    >
      <Path d="M440-440ZM152-172q-26 0-43-17t-17-43v-416q0-26 17-43t43-17h116l74-80h198v28H354l-74 80H152q-14 0-23 9t-9 23v416q0 14 9 23t23 9h576q14 0 23-9t9-23v-308h28v308q0 26-17 43t-43 17H152Zm608-508v-80h-80v-28h80v-80h28v80h80v28h-80v80h-28ZM440-300q59 0 99.5-40.5T580-440q0-59-40.5-99.5T440-580q-59 0-99.5 40.5T300-440q0 59 40.5 99.5T440-300Zm0-28q-48 0-80-32t-32-80q0-48 32-80t80-32q48 0 80 32t32 80q0 48-32 80t-80 32Z" />
    </Svg>
  );
};
