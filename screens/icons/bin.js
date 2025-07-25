import React from 'react';
import { Svg, Polyline, Path, Line } from 'react-native-svg';

export const BinIcon = ({ color = "#000000", size = 24 }) => {
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
            <Polyline points="3 6 5 6 21 6" />
            <Path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <Line x1="10" y1="11" x2="10" y2="17" />
            <Line x1="14" y1="11" x2="14" y2="17" />
        </Svg>
    );
};
