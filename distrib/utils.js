/* --------
   Utils.ts

   Utility functions.
   -------- */
var TSOS;
(function (TSOS) {
    var Utils = (function () {
        function Utils() {
        }
        Utils.trim = function (str) {
            // Use a regular expression to remove leading and trailing spaces.
            return str.replace(/^\s+ | \s+$/g, "");
            /*
            Huh? WTF? Okay... take a breath. Here we go:
            - The "|" separates this into two expressions, as in A or B.
            - "^\s+" matches a sequence of one or more whitespace characters at the beginning of a string.
            - "\s+$" is the same thing, but at the end of the string.
            - "g" makes is global, so we get all the whitespace.
            - "" is nothing, which is what we replace the whitespace with.
            */
        };
        Utils.rot13 = function (str) {
            /*
               This is an easy-to understand implementation of the famous and common Rot13 obfuscator.
               You can do this in three lines with a complex regular expression, but I'd have
               trouble explaining it in the future.  There's a lot to be said for obvious code.
            */
            var retVal = "";
            for (var i in str) {
                var ch = str[i];
                var code = 0;
                if ("abcedfghijklmABCDEFGHIJKLM".indexOf(ch) >= 0) {
                    code = str.charCodeAt(Number(i)) + 13; // It's okay to use 13.  It's not a magic number, it's called rot13.
                    retVal = retVal + String.fromCharCode(code);
                }
                else if ("nopqrstuvwxyzNOPQRSTUVWXYZ".indexOf(ch) >= 0) {
                    code = str.charCodeAt(Number(i)) - 13; // It's okay to use 13.  See above.
                    retVal = retVal + String.fromCharCode(code);
                }
                else {
                    retVal = retVal + ch;
                }
            }
            return retVal;
        };
        //makes sure a string of hex is good to go. returns true if so, false if not.
        Utils.isValidHexString = function (str) {
            var valid = [" ", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
            var data = str.toLowerCase();
            if (data.length > 0) {
                var dataLST = data.split("");
                var current;
                for (var i = 0; i < dataLST.length; i++) {
                    current = dataLST[i];
                    //checks to make sure every 3rd char is a space.
                    if ((i % 3 == 2) && (current != " "))
                        return false;
                    //checks to make sure every character is a valid hex 
                    if (valid.indexOf(current) === -1)
                        return false;
                }
                return true;
            }
            return false;
        };
        Utils.updateMemory = function () {
            var memoryBox = document.getElementById("memory");
            var memString = "";
            var current;
            for (var i = 0; i < _Memory.length; i++) {
                if (i % 8 == 0) {
                    memString += "0x";
                    if (i < 0x0010)
                        memString += "000";
                    else if (i < 0x0100)
                        memString += "00";
                    else if (i < 0x1000)
                        memString += "0";
                    memString += (i.toString(16).toUpperCase() + ": ");
                }
                current = _Memory[i];
                if (typeof current != "undefined") {
                    if (current <= 15)
                        memString += ("0" + _Memory[i].toString(16).toUpperCase() + " ");
                    else
                        memString += (_Memory[i].toString(16).toUpperCase() + " ");
                }
                else
                    memString += "00 ";
            }
            memoryBox.value = memString;
        };
        return Utils;
    }());
    TSOS.Utils = Utils;
})(TSOS || (TSOS = {}));
