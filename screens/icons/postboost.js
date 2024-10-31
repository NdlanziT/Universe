import React from 'react';
import { Svg, Path } from 'react-native-svg';

export const PostBoost = ({ color = "#000000", size = 24 }) => {
    return (
        <Svg
            xmlns="http://www.w3.org/2000/svg"
            height={size}
            width={size}
            viewBox="0 -960 960 960"
            fill={color}
        >
            <Path d="M296-320l122-122 80 80 142-141v63h80v-200H520v80h63l-85 85-80-80-178 179 56 56Zm-96 200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/>
        </Svg>
    );
};