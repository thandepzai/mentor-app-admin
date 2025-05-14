import React from "react";
import styles from "./style.module.css";

export interface RotateLogoLoadingProps {
    shadowOpacity?: number;
    size?: number;
}

const RotateLogoLoading = ({ shadowOpacity = 0.04, size = 64 }: RotateLogoLoadingProps) => {
    return (
        <div className={styles.rotateLogoContainer}>
            <div
                className={styles.rotateLogo}
                style={{
                    width: size + "px",
                    height: size + "px"
                }}
            />
            <div
                className={styles.shadowLogo}
                style={{ opacity: shadowOpacity, width: (7 / 8) * size + "px", height: (1 / 8) * size + "px" }}
            />
        </div>
    );
};

export default RotateLogoLoading;
