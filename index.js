(function () {
    const React = vendetta.metro.common.React;

    function createOverlay() {

        const box = document.createElement("div");

        box.id = "gradient-role-display";

        box.innerHTML = `
        <div style="
            position:fixed;
            top:20px;
            right:20px;
            background:#111;
            color:white;
            padding:15px;
            border-radius:12px;
            z-index:999999;
            font-family:sans-serif;
        ">
            🛡 Gradient Mod Tools
            <br><br>
            Role:
            <b>Lead Moderator</b>

            <br><br>

            Status:
            ✅ Loaded
        </div>
        `;

        document.body.appendChild(box);
    }


    createOverlay();


    return {
        onUnload() {

            const box =
            document.getElementById(
                "gradient-role-display"
            );

            if(box)
                box.remove();
        }
    };

})();

