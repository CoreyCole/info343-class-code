/**
 * application script for index.html
 */

document.addEventListener("DOMContentLoaded", function() {
    "use strict";

    var i;

    function forEachElement(stuff, funcz) {
        for (i = 0; i < stuff.length; i++) {
            funcz(stuff[i]);
        }
    }

    var butts = document.getElementById("click-me");
    butts.addEventListener("click", function() {
        console.log("ayy lmao");
    });

    var closeButts = document.querySelectorAll(".alert .close");
    //cant use foreach becuase query selector all doesn't return iterable array (its a node list)
    for (i = 0; i < closeButts.length; i++) {
        closeButts[i].addEventListener("click", function() {
           this.parentElement.style.display = "none";
        });
    }
});