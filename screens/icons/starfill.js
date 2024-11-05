import React from 'react';
import { Svg, Path } from 'react-native-svg';

export const StarFill = ({ color = "#000000", size = 24 }) => {
  return (
    <Svg
      height={size}
      width={size}
      viewBox="0 -960 960 960"
      fill={color}
    >
      <Path d="M354-287l126-76 126 77-33-144 111-96-146-13-58-136-58 135-146 13 111 97-33 143ZM233-120l65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-350Z"/>
    </Svg>
  );
};
