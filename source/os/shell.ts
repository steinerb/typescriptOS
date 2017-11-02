///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="shellCommand.ts" />
///<reference path="userCommand.ts" />

///<reference path="pcb.ts" />



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
                                  "- Shuts down the virtual OS but leaves the u  nderlying host / hardware simulation running.");
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

            // run
            sc = new ShellCommand(this.shellRun,
                                  "run",
                                  "<pid> - Runs a program in memory with an id.");
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

            // test
            sc = new ShellCommand(this.shellTest,
                                  "test",
                                  "- For developer testing.");
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
        	_StdOut.init();
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
                    //run
                    case "run":
                        _StdOut.putText("desc of run");
                        break;
                    //status
                    case "status":
                        _StdOut.putText("Status relays a message to the user.");
                        break;
                    //bsod
                    case "bsod":
                        _StdOut.putText("An error screen that stops the OS.");
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
            	_ProgramIDs[_ProgramIDs.length] = [_NextAvailablePID, _NextAvailableIndex];
            	_NextAvailablePID++;


            	//now load to memory
            	var toLoad: string[] = input.value.toLowerCase().split(" ");
            	var current: number;
            	for(var i = 0; i < toLoad.length; i++)
            	{
            		current = Number( ("0x"+toLoad[i]) );
            		_Memory[_NextAvailableIndex] = current;
            		_NextAvailableIndex++;
            	}

            	Utils.updateMemory();
            }
            _StdOut.advanceLine();
        }

        public shellRun(args)
        {
        	//get index of first op code of the program
        	var programIndex: number = -1;
        	for (var i = 0; i < _ProgramIDs.length; i++)
        		if(_ProgramIDs[i][0] == args[0])
        			programIndex = _ProgramIDs[i][1];

        	//check if it exists and make use of the cpu cycles if so.
        	if (programIndex == -1)
        		_StdOut.putText("No program with that PID found.");
        	else
        	{
        		_IndexOfProgramToRun = programIndex;
				_CPU.isExecuting = true;
        	}

        	 

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

        

        public shellTest() 
        {
        	//_StdOut.putText("When in the Course of human events it becomes necessary for one people to dissolve the political bands which have connected them with another and to assume among the powers of the earth, the separate and equal station to which the Laws of Nature and of Nature's God entitle them, a decent respect to the opinions of mankind requires that they should declare the causes which impel them to the separation.");


        	var loadBox = <HTMLInputElement>document.getElementById("taProgramInput");
            var memoryBox = <HTMLInputElement>document.getElementById("memory");

            //stores and prints ABC
        	//loadBox.value = "A9 41 8D 85 00 A9 42 8D 86 00 A9 43 8D 87 00 A9 00 8D 88 00 A2 02 A0 85 FF 00";
            
        	//test program #1
        	//loadBox.value = "A9 03 8D 00 00 A9 04 6D 00 00 8D 01 00 A2 01 AC 01 00 FF 00";

        	//test program #2
        	//loadBox.value = "A9 03 8D 18 00 A9 04 6D 18 00 8D 19 00 A2 01 AC 19 00 FF 00";

        	//test program #2.5: lots of loops
        	//loadBox.value = "A9 00 8D EC 00 A9 00 8D EC 00 A9 00 8D ED 00 A9 00 8D ED 00 A9 00 8D EE 00 A9 00 8D EF 00 AD ED 00 8D FF 00 AE FF 00 A9 00 8D FF 00 EC FF 00 D0 BA AD EC 00 8D FF 00 A9 01 6D FF 00 8D EC 00 AD EC 00 8D FF 00 AE FF 00 A9 03 8D FF 00 EC FF 00 D0 05 A9 01 8D ED 00 A9 00 8D EE 00 A9 00 8D EF 00 AD EF 00 8D FF 00 AE FF 00 A9 00 8D FF 00 EC FF 00 D0 49 AD EE 00 8D FF 00 A9 01 6D FF 00 8D EE 00 AD EE 00 8D FF 00 AE FF 00 A9 02 8D FF 00 EC FF 00 D0 05 A9 01 8D EF 00 A9 F8 8D FF 00 A2 02 AC FF 00 FF AD EE 00 A2 01 8D FF 00 AC FF 00 FF A9 00 8D FF 00 A2 01 EC FF 00 D0 A4 A9 F1 8D FF 00 A2 02 AC FF 00 FF AD EC 00 A2 01 8D FF 00 AC FF 00 FF A9 EE 8D FF 00 A2 02 AC FF 00 FF A9 00 8D FF 00 A2 01 EC FF 00 D0 33 00 00 00 20 20 00 20 6F 75 74 65 72 00 20 69 6E 6E 65 72 00 00";

        	//test program #3: 1 2 DONE
        	loadBox.value = "A9 03 8D 41 00 A9 01 8D 40 00 AC 40 00 A2 01 FF EE 40 00 AE 40 00 EC 41 00 D0 EF A9 44 8D 42 00 A9 4F 8D 43 00 A9 4E 8D 44 00 A9 45 8D 45 00 A9 00 8D 46 00 A2 02 A0 42 FF 00";

        	_StdOut.putText(_memTest.toString());


        	//PCB test
            //var x = new Pcb("new", 0, 0, 0, 0, 0, 0);
            //_StdOut.putText(String(x.state));


        }

    }
}
