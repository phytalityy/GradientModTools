import { showRole } from "./overlay.js";

export const onLoad = () => {
    console.log("Gradient Mod Tools Loaded");

    const roles = [
        "1506384120949899316"
    ];

    showRole(roles);
};


export const onUnload = () => {
    const overlay = document.getElementById(
        "gradient-overlay"
    );

    if (overlay) {
        overlay.remove();
    }

    console.log("Gradient Mod Tools Unloaded");
};
