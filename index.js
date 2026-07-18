(function (plugin) {
    "use strict";

    const React = vendetta.metro.common.React;

    const Forms = vendetta.metro.findByProps(
        "FormRow",
        "FormSection"
    );

    if (!Forms) {
        console.log("[Gradient] Forms not found");
        return plugin;
    }


    plugin.storage.role ??= "Entry Level Moderator";


    const ROLES = [
        "Entry Level Moderator",
        "Moderator",
        "Lead Moderator",
        "Head Moderator",
        "Administrator",
        "Staff Manager"
    ];


    plugin.settings = () => {

        return React.createElement(
            Forms.FormSection,
            {
                title: "Gradient Mod Tools"
            },

            ...ROLES.map((role) =>
                React.createElement(
                    Forms.FormRow,
                    {
                        label: role,

                        subLabel:
                            plugin.storage.role === role
                                ? "Selected ✓"
                                : "Select",

                        onPress: () => {

                            plugin.storage.role = role;

                            vendetta.ui.showToast(
                                "Selected " + role
                            );

                        }
                    }
                )
            )
        );

    };


    console.log(
        "[Gradient] Role selector loaded"
    );


    plugin.onUnload = () => {
        console.log("[Gradient] Unloaded");
    };


    return plugin;

})({});