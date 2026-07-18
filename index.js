import {showRole} from "./overlay.js";


export default {


name:"Gradient Mod Tools",


start(){


console.log(
"Gradient Mod Tools Started"
);


// TEST ROLE

let myRole=[

"1506384120949899316"

];


showRole(myRole);



},



stop(){


let overlay=
document.getElementById(
"gradient-overlay"
);


if(overlay)
overlay.remove();


console.log(
"Gradient Mod Tools Stopped"
);


}


};
