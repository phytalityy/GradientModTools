(function (plugin) {
    "use strict";

    const React = vendetta.metro.common.React;
    const { findInReactTree } = vendetta.utils;

    let patches = [];

    function ModPanel() {
        const [open, setOpen] = React.useState(false);

        if (!open) {
            return React.createElement(
                "Button",
                {
                    onPress: () => setOpen(true),
                    style: {
                        marginHorizontal: 8
                    }
                },
                "🛡"
            );
        }

        return React.createElement(
            "View",
            {
                style: {
                    padding: 15,
                    backgroundColor: "#111",
                    borderRadius: 10
                }
            },

            React.createElement(
                "Text",
                null,
                "🛡 Gradient Mod Panel"
            ),

            React.createElement(
                "Text",
                null,
                "Chat History"
            ),

            React.createElement(
                "Text",
                null,
                "• No messages loaded yet"
            ),

            React.createElement(
                "Button",
                null,
                "Warn User"
            ),

            React.createElement(
                "Button",
                null,
                "Timeout User"
            ),

            React.createElement(
                "Button",
                null,
                "View Logs"
            ),

            React.createElement(
                "Button",
                {
                    onPress: () => setOpen(false)
                },
                "Close"
            )
        );
    }


    return {
        onLoad() {

            const ChatInput = vendetta.metro.findByProps(
                "render"
            );

            if (!ChatInput) return;


            patches.push(
                vendetta.patcher.after(
                    ChatInput,
                    "render",
                    (_, ret) => {

                        const tree = findInReactTree(
                            ret,
                            i => i?.children
                        );

                        if (!tree?.children)
                            return ret;


                        tree.children.push(
                            React.createElement(ModPanel)
                        );

                        return ret;
                    }
                )
            );

            console.log(
                "[Gradient Mod Tools] Loaded"
            );
        },


        onUnload() {
            patches.forEach(p => p());
            patches = [];
        }
    };

})(plugin);