import React from "react";
import styles from "./style.module.css";

interface ThreeDotLoadingProps {
    size?: number;
    color?: string;
}

const ThreeDotLoading = ({ size = 14, color }: ThreeDotLoadingProps) => {
    const spaceBetween = 0.1 * size;

    const styleDot = {
        background: color,
        marginLeft: spaceBetween + "rem",
        marginRight: spaceBetween + "rem",
        height: 0.5 * size + "rem",
        width: 0.5 * size + "rem"
    };

    return (
        <>
            <div
                className={styles.threeDotLoadingContainer}
                style={{
                    height: size + "rem",
                    width: 2 * size + spaceBetween * 6 + "rem"
                }}
            >
                <div style={styleDot}></div>
                <div style={styleDot}></div>
                <div style={styleDot}></div>
            </div>
        </>
    );
};

export default ThreeDotLoading;
