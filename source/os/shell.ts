///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="shellCommand.ts" />
///<reference path="userCommand.ts" />


/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */

// TODO: Write a base class / prototype for system services and let Shell inherit from it.

module TSOS 
{
    export class Shell 
    {
        // Properties
        public promptStr = ">";
        public commandList = [];
        public curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
        public apologies = "[sorry]";

        constructor() 
        {
        }

        public init() 
        {
            var sc;
            //
            // Load the command list.

            // ver
            sc = new ShellCommand(this.shellVer,
                                  "ver",
                                  "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;

            // help
            sc = new ShellCommand(this.shellHelp,
                                  "help",
                                  "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;

            // shutdown
            sc = new ShellCommand(this.shellShutdown,
                                  "shutdown",
                                  "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;

            // cls
            sc = new ShellCommand(this.shellCls,
                                  "cls",
                                  "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;

            // man <topic>
            sc = new ShellCommand(this.shellMan,
                                  "man",
                                  "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;

            // trace <on | off>
            sc = new ShellCommand(this.shellTrace,
                                  "trace",
                                  "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;

            // rot13 <string>
            sc = new ShellCommand(this.shellRot13,
                                  "rot13",
                                  "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;

            // prompt <string>
            sc = new ShellCommand(this.shellPrompt,
                                  "prompt",
                                  "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;

            // guess <int>
            sc = new ShellCommand(this.shellGuess,
                                  "guess",
                                  "<int> - Compares your input to a random number, 1-10.");
            this.commandList[this.commandList.length] = sc;

            // roll <int>
            sc = new ShellCommand(this.shellRoll,
                                  "roll",
                                  "<int> - Rolls any amount of D6 dice.");
            this.commandList[this.commandList.length] = sc;

            // date
            sc = new ShellCommand(this.shellDate,
            					"date",
            					"- Displays the current time.");
          	this.commandList[this.commandList.length] = sc;

          	// whereami
            sc = new ShellCommand(this.shellWhereAmI,
                                  "whereami",
                                  "- Description of your current location.");
            this.commandList[this.commandList.length] = sc;

            // load
            sc = new ShellCommand(this.shellLoad,
                                  "load",
                                  "- Validates the program input.");
            this.commandList[this.commandList.length] = sc;

            // status
            sc = new ShellCommand(this.shellStatus,
                                  "status",
                                  "<string> - Prints a message in the task bar.");
            this.commandList[this.commandList.length] = sc;

            //bsod
            sc = new ShellCommand(this.shellBSOD,
                                  "bsod",
                                  "- Blue Screen of Death.");
            this.commandList[this.commandList.length] = sc;

            //dump
            sc = new ShellCommand(this.shellDump,
                                  "dump",
                                  "- Dumps all stored values to the screen.");
            this.commandList[this.commandList.length] = sc;

            // test
            sc = new ShellCommand(this.shellTest,
                                  "test",
                                  "- A shell command for the developer to experiment with new shell commands.");
            this.commandList[this.commandList.length] = sc;

            // ps  - list the running processes and their IDs
            // kill <id> - kills the specified process id.

            //
            // Display the initial prompt.
            this.putPrompt();
        }

        public putPrompt() 
        {
            _StdOut.putText(this.promptStr);
        }

        public handleInput(buffer) 
        {
            _Kernel.krnTrace("Shell Command~" + buffer);
            //
            // Parse the input...
            //
            var userCommand = this.parseInput(buffer);
            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;
            //
            // Determine the command and execute it.
            //
            // TypeScript/JavaScript may not support associative arrays in all browsers so we have to iterate over the
            // command list in attempt to find a match.  TODO: Is there a better way? Probably. Someone work it out and tell me in class.
            var index: number = 0;
            var found: boolean = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) 
            {
                if (this.commandList[index].command === cmd) 
                {
                    found = true;
                    fn = this.commandList[index].func;
                } 
                else 
                {
                    ++index;
                }
            }
            if (found) 
            {
                this.execute(fn, args);
            } 
            else 
            {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + Utils.rot13(cmd) + "]") >= 0) 
                {     // Check for curses.
                    this.execute(this.shellCurse);
                } 
                else if (this.apologies.indexOf("[" + cmd + "]") >= 0) 
                {        // Check for apologies.
                    this.execute(this.shellApology);
                } 
                else 
                { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        }

        // Note: args is an option parameter, ergo the ? which allows TypeScript to understand that.
        public execute(fn, args?) 
        {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args with some über-cool functional programming ...
            fn(args);
            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) 
            {
                _StdOut.advanceLine();
            }
            // ... and finally write the prompt again.
            this.putPrompt();
        }

        public parseInput(buffer): UserCommand 
        {
            var retVal = new UserCommand();

            // 1. Remove leading and trailing spaces.
            buffer = Utils.trim(buffer);

            // 2. Lower-case it.
            buffer = buffer.toLowerCase();

            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");

            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift();  // Yes, you can do that to an array in JavaScript.  See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;

            // 5. Now create the args array from what's left.
            for (var i in tempList) 
            {
                var arg = Utils.trim(tempList[i]);
                if (arg != "") 
                {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        }

        //
        // Shell Command Functions.  Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        public shellInvalidCommand() 
        {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) 
            {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            } 
            else 
            {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        }

        public shellCurse() 
        {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        }

        public shellApology() 
        {
           if (_SarcasticMode) 
           {
              _StdOut.putText("I think we can put our differences behind us.");
              _StdOut.advanceLine();
              _StdOut.putText("For science . . . You monster.");
              _SarcasticMode = false;
           } 
           else 
           {
              _StdOut.putText("For what?");
           }
        }

        public shellVer(args) 
        {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        }

        public shellHelp(args) 
        {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) 
            {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        }

        public shellShutdown(args) 
        {
             _StdOut.putText("Shutting down...");
             // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
        }

        public shellCls(args) 
        {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        }

        public shellMan(args) 
        {
            if (args.length > 0) 
            {
                var topic = args[0];
                switch (topic) 
                {
                	//ver
                	case "ver":
                        _StdOut.putText("Ver displays the version information of this operating system.");
                        break;
                	//help
                    case "help":
                        _StdOut.putText("Help displays a list of (hopefully) valid commands.");
                        break;
                    //shutdown
                    case "shutdown":
                        _StdOut.putText("Shutdown turns off the operating system.");
                        break;
                    //cls
                    case "cls":
                        _StdOut.putText("Cls clears the screan, reseting the cursor to the top left.");
                        break; 
                    //man
                    case "man":
                        _StdOut.putText("You clearly already know how to use this command, but for your information man is a prefix of MANual.");
                        break; 
                    //trace
                    case "trace":
                        _StdOut.putText("Trace on logs OS calls.");
                        break;
                    //rot13
                    case "rot13":
                        _StdOut.putText("Rot13 encrypts a string using the rot13 algorithm.");
                        break;
                    //prompt
                    case "prompt":
                        _StdOut.putText("Prompt changes the prompt from > to whatever you please.");
                        break;
                    //guess
                    case "guess":
                        _StdOut.putText("Guess compares an integer from 1-10 and compares it to a random integer from 1-10.");
                        break;
                    //roll
                    case "roll":
                        _StdOut.putText("Roll rolls an amount of D6 dice.");
                        break;
                    //date
                    case "date":
                        _StdOut.putText("Date displays the current date.");
                        break;
                    //whereami
                    case "whereami":
                        _StdOut.putText("Whereami helps you find where you are.");
                        break;
                    //load
                    case "load":
                        _StdOut.putText("Loads a program from User Program Input.");
                        break;
                    //status
                    case "status":
                        _StdOut.putText("Status relays a message to the user.");
                        break;
                    //bsod
                    case "bsod":
                        _StdOut.putText("An error screen that stops the OS.");
                        break;
                    //dump
                    case "dump":
                    	_StdOut.putText("Dump displays everything in the CPU registers and memory.");
                    	break;
                    //test
                    case "test":
                        _StdOut.putText("For the dev to try and add new stuff.");
                        break;


                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            } 
            else 
            {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        }

        public shellTrace(args) 
        {
            if (args.length > 0) 
            {
                var setting = args[0];
                switch (setting) 
                {
                    case "on":
                        if (_Trace && _SarcasticMode) 
                        {
                            _StdOut.putText("Trace is already on, doofus.");
                        } else 
                        {
                            _Trace = true;
                            _StdOut.putText("Trace ON");
                        }
                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF");
                        break;
                    default:
                        _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
                }
            } 
            else 
            {
                _StdOut.putText("Usage: trace <on | off>");
            }
        }

        public shellRot13(args) 
        {
            if (args.length > 0) 
            {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + Utils.rot13(args.join(' ')) +"'");
            } 
            else 
            {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        }

        public shellPrompt(args) 
        {
            if (args.length > 0) 
            {
                _OsShell.promptStr = args[0];
            } 
            else 
            {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        }

        public shellGuess(args) 
        {
            if (args.length == 1) 
            {
                let guess = args[0];
                let answer = Math.floor((Math.random() * 10) + 1);
                if(guess == answer)
                    _StdOut.putText("You guessed correctly!");
                else
                    _StdOut.putText("Incorrect");
            }
            else
                _StdOut.putText("Invalid Input!");
        }

        public shellRoll(args) 
        {
            let numDice = args[0];
            let diceVals: number[] = [];
            let current: number;
            let diceSum: number = 0;
            //gets values of dice and adds to sum
            for (let i: number = 0; i < numDice; i++)
            {
                current = Math.floor((Math.random() * 6) + 1);
                diceVals[diceVals.length] = current;
                diceSum += current;
            }
            //prints values of dice
            for (let i: number = 0; i < diceVals.length; i++)
            {
                _StdOut.putText("Die " + (i+1) + ": " + diceVals[i]);
                _StdOut.advanceLine();
            }
            //prints sum of dice
            _StdOut.putText("TOTAL: " + diceSum);
        }

        public shellDate(args) 
        {
            let nowMinutesStr: string;
            let now:             Date = new Date();
            let nowYear:       number = now.getFullYear();
            let nowMonth:      number = now.getMonth();
            let nowDate:       number = now.getDate();
            let nowHours:      number = now.getHours();
            let nowMinutes:    number = now.getMinutes();

            //make sure minutes value is 2 digits long
            if (nowMinutes < 10)
                nowMinutesStr = '0'+String(nowMinutes)
            else
                nowMinutesStr = String(nowMinutes)

            //adjust to 12 hour clock
            if (nowHours >= 12)
        	    _StdOut.putText( String(nowHours-12)+':'+nowMinutesStr+"pm   "+String(nowMonth)+"/"+String(nowDate)+"/"+String(nowYear) );
            else
                _StdOut.putText( String(nowHours)+':'+nowMinutesStr+"am   "+String(nowMonth)+"/"+String(nowDate)+"/"+String(nowYear) );
        }

        public shellWhereAmI(args) 
        {
            _StdOut.putText("[A better answer coming soon!]");
        }

        public shellLoad(args) 
        {
            var input = (<HTMLInputElement>document.getElementById("taProgramInput"));
            var dataSTR = input.value.toLowerCase();
            //test to make sure characters are valid and spacing is proper
            if (!Utils.isValidHexString(dataSTR))
            	_StdOut.putText("Invalid input; failed to load program.");
            else
            {
            	_StdOut.putText("Program "+String(_NextAvailablePID)+" loaded successfully.");
            	

            	//now save Program ID for later calling
            	_ProgramIDs[_ProgramIDs.length] = [_NextAvailablePID, _Memory.length];
            	_NextAvailablePID++;

            	//now load to memory
            	var toLoad: string[] = input.value.toLowerCase().split(" ");
            	var current: number;
            	for(var i = 0; i < toLoad.length; i++)
            	{
            		current = Number( ("0x"+toLoad[i]) );
            		_Memory[_Memory.length] = current;
            	}



            }
            _StdOut.advanceLine();
        }

        public shellStatus(args) 
        {
            var statusBox = <HTMLInputElement>document.getElementById("status");
            var statusMessage = args.join(' ');
            
            statusBox.value = statusMessage;
        }

        public shellBSOD() 
        {
            _StdOut.init();
            _StdOut.putText("IT BROKE!");
        }

        public shellDump()
        {
        	_StdOut.putText("CPU Registers:");
        	_StdOut.advanceLine();
        	_StdOut.putText("      PC: "+String(_CPU.PC));
        	_StdOut.advanceLine();
        	_StdOut.putText("     Acc: "+String(_CPU.Xreg));
        	_StdOut.advanceLine();
        	_StdOut.putText("       X: "+String(_CPU.Xreg));
        	_StdOut.advanceLine();
        	_StdOut.putText("       Y: "+String(_CPU.Yreg));
        	_StdOut.advanceLine();
        	_StdOut.putText("   Zflag: "+String(_CPU.Xreg));
        	_StdOut.advanceLine();
        	_StdOut.advanceLine();
        	_StdOut.putText("Memory:");
        	_StdOut.advanceLine();

        	for(let i = 0; i < _Memory.length; i++)
        	{
        		_StdOut.putText("   "+String(i)+": "+_Memory[i].toString(16).toUpperCase());
        		_StdOut.advanceLine();
        	}
        }

        public shellTest(args) 
        {
    		_StdOut.putText("Showing Program ID registry:");
            _StdOut.advanceLine();
            _StdOut.advanceLine()
            var currentPair;
            for (var i = 0; i < _ProgramIDs.length; i++)
            {
            	currentPair = _ProgramIDs[i];
            	_StdOut.putText("PID "+String(currentPair[0])+" starts at "+String(currentPair[1]));
            	_StdOut.advanceLine();
            }

        }

    }
}
