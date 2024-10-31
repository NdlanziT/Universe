import React from 'react';
import { Svg, Path } from 'react-native-svg';

export const Homeicon = ({ color = "white", size = 40 }) => {
    return (
      <Svg
        xmlns="http://www.w3.org/2000/svg"
        height={size}
        width={size}
        viewBox="0 -960 960 960"
        fill={color}
      >
        <Path d="M205.54-165.54v-412.5L480-785.38l274.46 207.64v412.2H554.04v-252.92H406.35v252.92H205.54Z"/>
      </Svg>
    );
  };