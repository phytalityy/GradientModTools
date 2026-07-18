(function (plugin, metro, patcher, storage, ui) {
    "use strict";

    const React = metro.common.React;

    const STAFF_ROLES = {
        "1506385513181872149": {
            level: 1,
            name: "Entry Level Moderator",
            permissions: [
                "kick",
                "move",
                "disconnect",
                "serverMute",
                "serverDeafen"
            ]
        },

        "1516768057677058220": {
            level: 2,
            name: "Moderator",
            permissions: [
                "warn",
                "timeout",
                "jail",
                "imute",
                "rmute"
            ]
        },

        "1506384120949899316": {
            level: 3,
            name: "Lead Moderator",
            permissions: [
                "ban"
            ]
        },

        "1506419619089350759": {
            level: 4,
            name: "Head Moderator",
            permissions: [
                "serverManagement"
            ]
        },

        "1516752884539195515": {
            level: 5,
            name: "Administrator",
            permissions: [
                "administrator"
            ]
        },

        "1515499498279800936": {
            level: 6,
            name: "Staff Manager",
            permissions: [
                "*"
            ]
        }
    };


    function getHighestStaffRole(userRoles) {

        let highest = null;

        for (const roleID of userRoles) {

            const role = STAFF_ROLES[roleID];

            if (!role) continue;

            if (!highest || role.level > highest.level) {
                highest = role;
            }
        }

        return highest;
    }


    // TEST ROLE
    // Replace this later with automatic Discord role detection
    const testRoles = [
        "1516768057677058220"
    ];


    const currentRole = getHighestStaffRole(testRoles);


    function Settings() {

        const Forms = ui.components.Forms;

        return React.createElement(
            Forms.FormSection,
            {
                title: "Gradient Mod Tools"
            },

            React.createElement(
                Forms.FormRow,
                {
                    label: "Detected Role",
                    subLabel: currentRole
                        ? currentRole.name
                        : "No staff role detected"
                }
            ),

            React.createElement(
                Forms.FormRow,
                {
                    label: "Permissions",
                    subLabel: currentRole
                        ? currentRole.permissions.join(", ")
                        : "None"
                }
            )
        );
    }


    plugin.settings = Settings;


    console.log(
        "[Gradient Mod Tools]",
        currentRole
            ? `Loaded as ${currentRole.name}`
            : "No staff role detected"
    );


    plugin.onUnload = () => {
        console.log("[Gradient Mod Tools] Unloaded");
    };


    return plugin;


})(
    {},
    vendetta.metro,
    vendetta.patcher,
    vendetta.storage,
    vendetta.ui
);