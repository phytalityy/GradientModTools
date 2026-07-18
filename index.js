(function (plugin) {
    "use strict";

    console.log("[Gradient] Plugin loaded");

    plugin.settings = () => null;

    plugin.onUnload = () => {
        console.log("[Gradient] Plugin unloaded");
    };

    return plugin;

})({});