import React from "react";
import styles from "./style.module.css";

interface RotateSpinnerProps {
    size?: number;
    weight?: number;
    color?: string;
}

const RotateSpinner = ({ size = 1.5, weight = 0.15, color = "#000" }: RotateSpinnerProps) => {
    const styleCircle = {
        height: "100%",
        width: "100%",
        borderWidth: weight + "rem",
        borderStyle: "solid",
        borderColor: `${color} transparent transparent transparent`
    };

    return (
        <div
            className={styles.rotateSpinner}
            style={{
                height: size + "rem",
                width: size + "rem"
            }}
        >
            <div style={styleCircle}></div>
            <div style={styleCircle}></div>
            <div style={styleCircle}></div>
            <div style={styleCircle}></div>
        </div>
    );
};

export default RotateSpinner;
