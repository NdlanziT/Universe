import React from 'react';
import { Svg, Polyline, Path } from 'react-native-svg';

export const Undo = ({ color = "#000000", size = 24 }) => {
    return (
        <Svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <Polyline points="9 14 4 9 9 4" />
            <Path d="M20 20v-7a4 4 0 0 0-4-4H4" />
        </Svg>
    );
};
