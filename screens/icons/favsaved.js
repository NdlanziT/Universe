import React from 'react';
import { Svg, Path } from 'react-native-svg';

export const FavouritesavedIcon = ({ color = "white", size = 24, fill = "none" }) => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      height={size}
      width={size}
      viewBox="0 -960 960 960"
      fill={fill}
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path d="M200-120v-640q0-33 23.5-56.5T280-840h400q33 0 56.5 23.5T760-760v640L480-240 200-120Z" />
    </Svg>
  );
};
