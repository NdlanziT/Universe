import React from 'react';
import { Svg, Polyline } from 'react-native-svg';

export const ForwardIcon = ({ color = "#000000", size = 24 }) => {
    return (
        <Svg
            xmlns="http://www.w3.org/2000/svg"
            height={size}
            width={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <Polyline points="9 18 15 12 9 6" />
        </Svg>
    );
};
