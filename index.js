(function (plugin) {
    const React = vendetta.metro.common.React;
    const Forms = vendetta.ui.components.Forms;

    plugin.storage.role ??= "Entry Level Moderator";

    const roles = [
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

            ...roles.map((role) =>
                React.createElement(
                    Forms.FormRow,
                    {
                        label: role,
                        subLabel:
                            plugin.storage.role === role
                                ? "Selected ✓"
                                : "Tap to select",

                        onPress: () => {
                            plugin.storage.role = role;

                            vendetta.ui.showToast(
                                `Selected ${role}`
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
        console.log(
            "[Gradient] Unloaded"
        );
    };


    return plugin;

})({});