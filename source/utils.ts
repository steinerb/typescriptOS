/* --------
   Utils.ts

   Utility functions.
   -------- */

module TSOS 
{

    export class Utils 
    {

        public static trim(str): string 
        {
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
        }

        public static rot13(str: string): string 
        {
            /*
               This is an easy-to understand implementation of the famous and common Rot13 obfuscator.
               You can do this in three lines with a complex regular expression, but I'd have
               trouble explaining it in the future.  There's a lot to be said for obvious code.
            */
            var retVal: string = "";
            for (var i in <any>str) {    // We need to cast the string to any for use in the for...in construct.
                var ch: string = str[i];
                var code: number = 0;
                if ("abcedfghijklmABCDEFGHIJKLM".indexOf(ch) >= 0) {
                    code = str.charCodeAt(Number(i)) + 13;  // It's okay to use 13.  It's not a magic number, it's called rot13.
                    retVal = retVal + String.fromCharCode(code);
                } else if ("nopqrstuvwxyzNOPQRSTUVWXYZ".indexOf(ch) >= 0) {
                    code = str.charCodeAt(Number(i)) - 13;  // It's okay to use 13.  See above.
                    retVal = retVal + String.fromCharCode(code);
                } else {
                    retVal = retVal + ch;
                }
            }
            return retVal;
        }

        //makes sure a string of hex is good to go. returns true if so, false if not.
        public static isValidHexString(str: string): boolean
        {
            var valid = [" ", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
            var data = str.toLowerCase();
            if(data.length > 0)
            {
                var dataLST = data.split("");
                var current;
                for (var i = 0; i < dataLST.length; i++)
                {
                    current = dataLST[i];
                    //checks to make sure every 3rd char is a space.
                    if( (i%3==2) && (current!=" ") )
                        return false;
                    //checks to make sure every character is a valid hex 
                    if(valid.indexOf(current) === -1)
                        return false;
                }
                return true;
            }
            return false;
        }

        //GUI functions
        public static updateMemory(): void
        {
            var memoryBox = (<HTMLInputElement>document.getElementById("memory"));

            var memString: string = "";
            var current: number;
            for(var i = 0; i < _Memory.getSize(); i++)
            {
                if(i%8==0)
                {
                    memString += "0x";

                    if (i < 0x0010)
                        memString += "000";
                    else if (i < 0x0100)
                        memString += "00";
                    else if (i < 0x1000)
                        memString += "0";

                    memString += (i.toString(16).toUpperCase()+": ");
                }

                current = _Memory.registers[i];
                if(typeof current != "undefined")
                {
                    if(current <= 15)
                        memString += ("0"+_Memory.registers[i].toString(16).toUpperCase()+" ");
                    else
                        memString += (_Memory.registers[i].toString(16).toUpperCase()+" ");
                }
                else
                    memString += "00 ";
            }

            memoryBox.value = memString;
        }

        public static updateProcesses(): void
        {
            var processesBox = (<HTMLInputElement>document.getElementById("readyPCBs"));

            var pcbString: string = "";
            var currentPCB: TSOS.Pcb;
            for(var i = 0; i < _ReadyQueue.q.length; i++)
            {
                currentPCB = _ReadyQueue.q[i];

                pcbString += ("PID "+String(currentPCB.pid)+":\t"+currentPCB.toString()+"\n");
            }
            processesBox.value = pcbString;
        }

        public static updateDiskStorage(): void
        {
            var storageBox = (<HTMLInputElement>document.getElementById("diskStorage"));
            var toReturn: string = "";
            var fileNames: string[] = Object.keys(sessionStorage);

            for(var i = 0; i < fileNames.length; i++)
                toReturn += (fileNames[i] + "\n");

            storageBox.value = toReturn;
        }



    }
}
