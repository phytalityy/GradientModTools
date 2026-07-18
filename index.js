import { showRole } from "./overlay.js";

export default {
    name: "Gradient Mod Tools",

    start() {
        console.log("Gradient Mod Tools Loaded");

        // TEST ROLE
        const roles = [
            "1506384120949899316"
        ];

        showRole(roles);
    },

    stop() {
        const overlay = document.getElementById(
            "gradient-overlay"
        );

        if (overlay) overlay.remove();

        console.log("Gradient Mod Tools Stopped");
    }
};
