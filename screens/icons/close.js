import React from 'react';
import { Svg, Path } from 'react-native-svg';

export const CloseButton = ({ color = "#000000", size = 24 }) => {
    return (
        <Svg
            xmlns="http://www.w3.org/2000/svg"
            height={size}
            width={size}
            viewBox="0 -960 960 960"
            fill={color}
        >
            <Path d="M256-200l-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
        </Svg>
    );
};
