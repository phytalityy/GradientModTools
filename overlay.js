import {getRoleName} from "./roles.js";


export function showRole(roleIDs){


let role = getRoleName(roleIDs);


let box=document.createElement("div");


box.id="gradient-overlay";


box.innerHTML=`

<div style="
position:fixed;
top:20px;
right:20px;
background:#111;
color:white;
padding:20px;
border-radius:15px;
z-index:999999;
font-family:Arial;
">


<h3>
🛡 Gradient Mod Tools
</h3>


Role:

<b>${role}</b>


<br><br>


Status:

✅ Plugin Loaded


</div>

`;


document.body.appendChild(box);


}
