///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
///<reference path="shellCommand.ts" />
///<reference path="userCommand.ts" />
///<reference path="queue.ts" />
///<reference path="pcb.ts" />
/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */
// TODO: Write a base class / prototype for system services and let Shell inherit from it.
var TSOS;
(function (TSOS) {
    var Shell = (function () {
        function Shell() {
            // Properties
            this.promptStr = ">";
            this.commandList = [];
            this.curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
            this.apologies = "[sorry]";
        }
        Shell.prototype.init = function () {
            var sc;
            //
            // Load the command list.
            // ver
            sc = new TSOS.ShellCommand(this.shellVer, "ver", "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;
            // help
            sc = new TSOS.ShellCommand(this.shellHelp, "help", "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;
            // shutdown
            sc = new TSOS.ShellCommand(this.shellShutdown, "shutdown", "- Shuts down the virtual OS but leaves the u  nderlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;
            // cls
            sc = new TSOS.ShellCommand(this.shellCls, "cls", "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;
            // man <topic>
            sc = new TSOS.ShellCommand(this.shellMan, "man", "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;
            // trace <on | off>
            sc = new TSOS.ShellCommand(this.shellTrace, "trace", "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;
            // rot13 <string>
            sc = new TSOS.ShellCommand(this.shellRot13, "rot13", "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;
            // prompt <string>
            sc = new TSOS.ShellCommand(this.shellPrompt, "prompt", "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;
            // roll <int>
            sc = new TSOS.ShellCommand(this.shellRoll, "roll", "<int> - Rolls any amount of D6 dice.");
            this.commandList[this.commandList.length] = sc;
            // date
            sc = new TSOS.ShellCommand(this.shellDate, "date", "- Displays the current time.");
            this.commandList[this.commandList.length] = sc;
            // whereami
            sc = new TSOS.ShellCommand(this.shellWhereAmI, "whereami", "- Description of your current location.");
            this.commandList[this.commandList.length] = sc;
            // clearmem
            sc = new TSOS.ShellCommand(this.shellClearMem, "clearmem", "- Clears memory.");
            this.commandList[this.commandList.length] = sc;
            // quantum
            sc = new TSOS.ShellCommand(this.shellQuantum, "quantum", "<int> - How many CPU cycles per program.");
            this.commandList[this.commandList.length] = sc;
            // setschedule
            sc = new TSOS.ShellCommand(this.shellSetSchedule, "setschedule", "[rr, fcfs, priority] - Sets the CPU schedulin  g alg.");
            this.commandList[this.commandList.length] = sc;
            // getschedule
            sc = new TSOS.ShellCommand(this.shellGetSchedule, "getschedule", "- Displays the current scheduling algorithm.");
            this.commandList[this.commandList.length] = sc;
            // load
            sc = new TSOS.ShellCommand(this.shellLoad, "load", "- Validates the program input.");
            this.commandList[this.commandList.length] = sc;
            // run
            sc = new TSOS.ShellCommand(this.shellRun, "run", "<pid> - Runs a loaded program with an id.");
            this.commandList[this.commandList.length] = sc;
            // runall
            sc = new TSOS.ShellCommand(this.shellRunAll, "runall", "- Runs all loaded programs.");
            this.commandList[this.commandList.length] = sc;
            // ps
            sc = new TSOS.ShellCommand(this.shellPs, "ps", "- Displays all active process pids.");
            this.commandList[this.commandList.length] = sc;
            // kill
            sc = new TSOS.ShellCommand(this.shellKill, "kill", "- <pid> Terminates an active process.");
            this.commandList[this.commandList.length] = sc;
            // create
            sc = new TSOS.ShellCommand(this.shellCreate, "create", "- <filename> Creates a file.");
            this.commandList[this.commandList.length] = sc;
            // read
            sc = new TSOS.ShellCommand(this.shellRead, "read", "- <filename> Reads a file.");
            this.commandList[this.commandList.length] = sc;
            // write
            sc = new TSOS.ShellCommand(this.shellWrite, "write", "- <filename> \"data\" Writes data to a file.");
            this.commandList[this.commandList.length] = sc;
            // delete
            sc = new TSOS.ShellCommand(this.shellDelete, "delete", "- <filename> Deletes a file.");
            this.commandList[this.commandList.length] = sc;
            // format
            sc = new TSOS.ShellCommand(this.shellFormat, "format", "- Clears disk storage.");
            this.commandList[this.commandList.length] = sc;
            // ls
            sc = new TSOS.ShellCommand(this.shellLs, "ls", "- Lists all stored files.");
            this.commandList[this.commandList.length] = sc;
            // status
            sc = new TSOS.ShellCommand(this.shellStatus, "status", "<string> - Prints a message in the task bar.");
            this.commandList[this.commandList.length] = sc;
            //bsod
            sc = new TSOS.ShellCommand(this.shellBSOD, "bsod", "- Blue Screen of Death.");
            this.commandList[this.commandList.length] = sc;
            // test
            sc = new TSOS.ShellCommand(this.shellTest, "test", "- For developer testing.");
            this.commandList[this.commandList.length] = sc;
            // ps  - list the running processes and their IDs
            // kill <id> - kills the specified process id.
            //
            // Display the initial prompt.
            this.putPrompt();
        };
        Shell.prototype.putPrompt = function () {
            _StdOut.putText(this.promptStr);
        };
        Shell.prototype.handleInput = function (buffer) {
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
            var index = 0;
            var found = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                }
                else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args);
            }
            else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + TSOS.Utils.rot13(cmd) + "]") >= 0) {
                    this.execute(this.shellCurse);
                }
                else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {
                    this.execute(this.shellApology);
                }
                else {
                    this.execute(this.shellInvalidCommand);
                }
            }
        };
        // Note: args is an option parameter, ergo the ? which allows TypeScript to understand that.
        Shell.prototype.execute = function (fn, args) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args with some über-cool functional programming ...
            fn(args);
            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }
            // ... and finally write the prompt again.
            this.putPrompt();
        };
        Shell.prototype.parseInput = function (buffer) {
            var retVal = new TSOS.UserCommand();
            // 1. Remove leading and trailing spaces.
            buffer = TSOS.Utils.trim(buffer);
            // 2. Lower-case it.
            buffer = buffer.toLowerCase();
            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");
            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift(); // Yes, you can do that to an array in JavaScript.  See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = TSOS.Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;
            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = TSOS.Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        };
        //
        // Shell Command Functions.  Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        Shell.prototype.shellInvalidCommand = function () {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            }
            else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        };
        Shell.prototype.shellCurse = function () {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        };
        Shell.prototype.shellApology = function () {
            if (_SarcasticMode) {
                _StdOut.putText("I think we can put our differences behind us.");
                _StdOut.advanceLine();
                _StdOut.putText("For science . . . You monster.");
                _SarcasticMode = false;
            }
            else {
                _StdOut.putText("For what?");
            }
        };
        Shell.prototype.shellVer = function (args) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        };
        Shell.prototype.shellHelp = function (args) {
            var oldFontSize = _DefaultFontSize;
            var oldFontHeightMargin = _FontHeightMargin;
            _DefaultFontSize = 8;
            _FontHeightMargin = 2;
            _StdOut.init();
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
            _DefaultFontSize = oldFontSize;
            _FontHeightMargin = oldFontHeightMargin;
        };
        Shell.prototype.shellShutdown = function (args) {
            _StdOut.putText("Shutting down...");
            // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
        };
        Shell.prototype.shellCls = function (args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        };
        Shell.prototype.shellMan = function (args) {
            if (args.length > 0) {
                var topic = args[0];
                switch (topic) {
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
                    //clearmem
                    case "clearmem":
                        _StdOut.putText("Clears all partitions.");
                        break;
                    //quantum
                    case "quantum":
                        _StdOut.putText("How many cycles a cpu will spend on a program before changing.");
                        break;
                    //setschedule
                    case "setschedule":
                        _StdOut.putText("Decides how programs will be run (rr, fcfs, priority).");
                        break;
                    //getschedule
                    case "getschedule":
                        _StdOut.putText("Displays the way programs will be executed.");
                        break;
                    //load
                    case "load":
                        _StdOut.putText("Loads a program from User Program Input.");
                        break;
                    //run
                    case "run":
                        _StdOut.putText("Runs a program loaded into the resident list.");
                        break;
                    //runall
                    case "runall":
                        _StdOut.putText("Runs all programs loaded into the resident list.");
                        break;
                    //ps
                    case "ps":
                        _StdOut.putText("Shows all program ids in the ready queue.");
                        break;
                    //kill
                    case "kill":
                        _StdOut.putText("Kills a program.");
                        break;
                    //create
                    case "create":
                        _StdOut.putText("Adds a file to disk storage.");
                        break;
                    //read
                    case "read":
                        _StdOut.putText("Displays contents of a chosen file in disk storage.");
                        break;
                    //write
                    case "write":
                        _StdOut.putText("Appends text to a chosen file in disk storage.");
                        break;
                    //delete
                    case "delete":
                        _StdOut.putText("Deletes a chosen file in disk storage.");
                        break;
                    //format
                    case "format":
                        _StdOut.putText("Clears disk storage.");
                        break;
                    //ls
                    case "ls":
                        _StdOut.putText("Displays all files saved on disk storage.");
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
            else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        };
        Shell.prototype.shellTrace = function (args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        }
                        else {
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
            else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        };
        Shell.prototype.shellRot13 = function (args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + TSOS.Utils.rot13(args.join(' ')) + "'");
            }
            else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        };
        Shell.prototype.shellPrompt = function (args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            }
            else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        };
        Shell.prototype.shellRoll = function (args) {
            var numDice = args[0];
            var diceVals = [];
            var current;
            var diceSum = 0;
            //gets values of dice and adds to sum
            for (var i = 0; i < numDice; i++) {
                current = Math.floor((Math.random() * 6) + 1);
                diceVals[diceVals.length] = current;
                diceSum += current;
            }
            //prints values of dice
            for (var i = 0; i < diceVals.length; i++) {
                _StdOut.putText("Die " + (i + 1) + ": " + diceVals[i]);
                _StdOut.advanceLine();
            }
            //prints sum of dice
            _StdOut.putText("TOTAL: " + diceSum);
        };
        Shell.prototype.shellDate = function (args) {
            var nowMinutesStr;
            var now = new Date();
            var nowYear = now.getFullYear();
            var nowMonth = now.getMonth();
            var nowDate = now.getDate();
            var nowHours = now.getHours();
            var nowMinutes = now.getMinutes();
            //make sure minutes value is 2 digits long
            if (nowMinutes < 10)
                nowMinutesStr = '0' + String(nowMinutes);
            else
                nowMinutesStr = String(nowMinutes);
            //adjust to 12 hour clock
            if (nowHours >= 12)
                _StdOut.putText(String(nowHours - 12) + ':' + nowMinutesStr + "pm   " + String(nowMonth) + "/" + String(nowDate) + "/" + String(nowYear));
            else
                _StdOut.putText(String(nowHours) + ':' + nowMinutesStr + "am   " + String(nowMonth) + "/" + String(nowDate) + "/" + String(nowYear));
        };
        Shell.prototype.shellWhereAmI = function (args) {
            _StdOut.putText("At the computer.");
        };
        Shell.prototype.shellClearMem = function (args) {
            _Memory.wipe();
            _MemoryManager.init();
            TSOS.Utils.updateMemory();
        };
        Shell.prototype.shellQuantum = function (args) {
            var desiredQuantum = args[0];
            var oldQuantum = _CPUScheduler.quantum;
            if (desiredQuantum > 0) {
                _CPUScheduler.quantum = desiredQuantum;
                _StdOut.putText("Quantum changed from " + String(oldQuantum) + " to " + String(desiredQuantum) + ".");
            }
            else
                _StdOut.putText("Invalid Arguement; Quantum not set.");
        };
        Shell.prototype.shellSetSchedule = function (args) {
            var desiredAlg;
            if (args.length < 1)
                _StdOut.putText("Missing algorithm arguement; scheduling algorithm not set.");
            else if (args.length > 1)
                _StdOut.putText("Too many arguements; scheduling algorithm not set.");
            else if ((args[0] != "fcfs") && (args[0] != "rr") && (args[0] != "priority"))
                _StdOut.putText("Invalid Arguement; scheduling algorithm not set.");
            else {
                desiredAlg = args[0];
                if (_CPUScheduler.schedAlg == desiredAlg)
                    _StdOut.putText(desiredAlg + " is already selected.");
                else {
                    var oldAlg = _CPUScheduler.schedAlg;
                    _CPUScheduler.schedAlg = desiredAlg;
                    _StdOut.putText("Scheduling algorithm changed from " + oldAlg + " to " + _CPUScheduler.schedAlg + ".");
                }
            }
        };
        Shell.prototype.shellGetSchedule = function (args) {
            _StdOut.putText("Current Scheduling Algorithm: " + _CPUScheduler.schedAlg);
        };
        Shell.prototype.shellLoad = function (args) {
            var input = document.getElementById("taProgramInput");
            var dataSTR = input.value.toLowerCase();
            var priority = -1;
            //test to make sure characters are valid and spacing is proper
            if (!TSOS.Utils.isValidHexString(dataSTR))
                _StdOut.putText("Invalid input; failed to load program.");
            else if (input.value.toLowerCase().split(" ").length > 256)
                _StdOut.putText("Input over 256 bytes; failed to load program.");
            else if ((_CPUScheduler.schedAlg == "priority") && (args.length < 1))
                _StdOut.putText("Missing priority arguement; failed to load program.");
            else if ((_CPUScheduler.schedAlg == "priority") && (args.length > 1))
                _StdOut.putText("Too many arguements; failed to load program.");
            else {
                //if priority, set priority
                if (_CPUScheduler.schedAlg == "priority")
                    priority = args[0];
                //test if any partitions are empty
                if (_MemoryManager.hasSpace()) {
                    _StdOut.putText("Program " + String(_NextAvailablePID) + " loaded successfully.");
                    //now load to memory
                    var toLoad = input.value.toLowerCase().split(" ");
                    var current;
                    for (var i = 0; i < toLoad.length; i++) {
                        current = Number(("0x" + toLoad[i]));
                        _Memory.storeValueAt(_NextAvailableIndex, _MemoryManager.nextAvailablePartition(), current);
                        _NextAvailableIndex++;
                    }
                    //reset index for loading to memory
                    _NextAvailableIndex = 0;
                    //add new PCB to Resident List to be called
                    var newBase = _MemoryManager.nextAvailablePartition() * 256;
                    var newLimit = newBase + 255;
                    _ResidentList.push(new TSOS.Pcb("NEW", _NextAvailablePID, 0, 0, 0, 0, 0, newBase, newLimit, priority, "MEMORY"));
                    //now save Program ID for later calling and update Memory Manager 
                    _MemoryManager.fillPartition(_NextAvailablePID);
                    _NextAvailablePID++;
                }
                else
                    _StdOut.putText("Memory full; failed to load program.");
                TSOS.Utils.updateMemory();
                //update disk storage too!!!
            }
            _StdOut.advanceLine();
        };
        Shell.prototype.shellRun = function (args) {
            var desiredPID = args[0];
            //get index of first op code of the program
            var programIndex = -1;
            if (_MemoryManager.indexOfProgram(desiredPID) != -1)
                programIndex = _MemoryManager.indexOfProgram(desiredPID);
            //check if it exists and make use of the cpu cycles if so.
            if (programIndex == -1)
                _StdOut.putText("No program with that PID found.");
            else {
                var pcbToRun;
                var currentPCB;
                for (var i = 0; i < _ResidentList.length; i++) {
                    currentPCB = _ResidentList[i];
                    if (currentPCB.pid == desiredPID) {
                        pcbToRun = currentPCB;
                        break;
                    }
                }
                //remove from resident list
                _ResidentList = _ResidentList.filter(function (pcb) { return pcb.pid != desiredPID; });
                //add to ready queue
                _ReadyQueue.enqueue(pcbToRun);
                TSOS.Utils.updateProcesses();
                _CPU.isExecuting = true;
            }
        };
        Shell.prototype.shellRunAll = function (args) {
            //add all programs from resident list to ready queue
            var currentPCB;
            for (var i = 0; i < _ResidentList.length; i++) {
                currentPCB = _ResidentList[i];
                _ReadyQueue.enqueue(currentPCB);
            }
            //sort the ready queue according to scheduling alg
            _ReadyQueue.sortQFor(_CPUScheduler.schedAlg);
            //empty resident list
            _ResidentList = [];
            TSOS.Utils.updateProcesses();
            _CPU.isExecuting = true;
        };
        Shell.prototype.shellPs = function (args) {
            if (_ReadyQueue.isEmpty())
                _StdOut("No active processes.");
            else {
                var currentPID;
                for (var i = 0; i < _ReadyQueue.getSize() - 1; i++) {
                    currentPID = _ReadyQueue.q[i].pid;
                    _StdOut.putText(String(currentPID) + ", ");
                }
                _StdOut.putText(String(_ReadyQueue.q[_ReadyQueue.getSize() - 1].pid));
            }
        };
        Shell.prototype.shellKill = function (args) {
            var desiredPID = args[0];
            if (_ReadyQueue.q[0].pid == desiredPID) {
                _ReadyQueue.dequeue();
                _CPU.ticks = 0;
            }
            else
                _ReadyQueue.q.filter(function (pcb) { return pcb.pid != desiredPID; });
            TSOS.Utils.updateProcesses();
        };
        Shell.prototype.shellCreate = function (args) {
            var desiredFileName = String(args[0]);
            if (args.length > 1)
                _StdOut.putText("Too many arguements; file not created.");
            else if (args.length < 1)
                _StdOut.putText("Missing filename arguement; file not created.");
            else if (sessionStorage.getItem(desiredFileName) != null)
                _StdOut.putText("File with name \"" + desiredFileName + "\" already exists.");
            else {
                sessionStorage.setItem(desiredFileName, "");
                TSOS.Utils.updateDiskStorage();
                _StdOut.putText("File created successfully.");
            }
        };
        Shell.prototype.shellRead = function (args) {
            var desiredFileName = String(args[0]);
            if (args.length > 1)
                _StdOut.putText("Too many arguements; file not read.");
            else if (args.length < 1)
                _StdOut.putText("Missing filename arguement; file not read.");
            else if (sessionStorage.getItem(desiredFileName) == null)
                _StdOut.putText("File not found; file not read.");
            else {
                _StdOut.putText("\"" + sessionStorage.getItem(desiredFileName) + "\"");
            }
        };
        Shell.prototype.shellWrite = function (args) {
            var desiredFileName = String(args[0]);
            if (args.length > 2)
                _StdOut.putText("Too many arguements; could not write to file.");
            else if (sessionStorage.getItem(desiredFileName) == null)
                _StdOut.putText("File not found; could not write to file.");
            else if (args.length < 2)
                _StdOut.putText("Missing data arguement; could not write to file.");
            else {
                var oldText = sessionStorage.getItem(desiredFileName);
                var data = String(args[1]);
                sessionStorage.setItem(desiredFileName, (oldText + data));
                _StdOut.putText("Written to file successfully.");
            }
        };
        Shell.prototype.shellDelete = function (args) {
            var desiredFileName = String(args[0]);
            if (args.length > 1)
                _StdOut.putText("Too many arguements; file not deleted.");
            else if (args.length < 1)
                _StdOut.putText("Missing filename arguement; file not deleted.");
            else if (sessionStorage.getItem(desiredFileName) == null)
                _StdOut.putText("File not found; file not deleted.");
            else {
                sessionStorage.removeItem(desiredFileName);
                TSOS.Utils.updateDiskStorage();
                _StdOut.putText("File deleted successfully.");
            }
        };
        Shell.prototype.shellFormat = function (args) {
            sessionStorage.clear();
            TSOS.Utils.updateDiskStorage();
            _StdOut.putText("Storage formatted successfully.");
        };
        Shell.prototype.shellLs = function (args) {
            var fileNames = Object.keys(sessionStorage);
            for (var i = 0; i < fileNames.length; i++) {
                _StdOut.putText(fileNames[i]);
                _StdOut.advanceLine();
            }
        };
        Shell.prototype.shellStatus = function (args) {
            var statusBox = document.getElementById("status");
            var statusMessage = args.join(' ');
            statusBox.value = statusMessage;
        };
        Shell.prototype.shellBSOD = function () {
            _StdOut.init();
            _StdOut.putText("IT BROKE!");
        };
        Shell.prototype.shellTest = function () {
            //_StdOut.putText("When in the Course of human events it becomes necessary for one people to dissolve the political bands which have connected them with another and to assume among the powers of the earth, the separate and equal station to which the Laws of Nature and of Nature's God entitle them, a decent respect to the opinions of mankind requires that they should declare the causes which impel them to the separation.");
            var loadBox = document.getElementById("taProgramInput");
            var memoryBox = document.getElementById("memory");
            //stores and prints "ABC"
            //loadBox.value = "A9 41 8D 85 00 A9 42 8D 86 00 A9 43 8D 87 00 A9 00 8D 88 00 A2 02 A0 85 FF 00";
            //test program #1
            //loadBox.value = "A9 03 8D 00 00 A9 04 6D 00 00 8D 01 00 A2 01 AC 01 00 FF 00";
            //test program #2
            //loadBox.value = "A9 03 8D 18 00 A9 04 6D 18 00 8D 19 00 A2 01 AC 19 00 FF 00";
            //test program #2.5: lots of loops
            //loadBox.value = "A9 00 8D EC 00 A9 00 8D EC 00 A9 00 8D ED 00 A9 00 8D ED 00 A9 00 8D EE 00 A9 00 8D EF 00 AD ED 00 8D FF 00 AE FF 00 A9 00 8D FF 00 EC FF 00 D0 BA AD EC 00 8D FF 00 A9 01 6D FF 00 8D EC 00 AD EC 00 8D FF 00 AE FF 00 A9 03 8D FF 00 EC FF 00 D0 05 A9 01 8D ED 00 A9 00 8D EE 00 A9 00 8D EF 00 AD EF 00 8D FF 00 AE FF 00 A9 00 8D FF 00 EC FF 00 D0 49 AD EE 00 8D FF 00 A9 01 6D FF 00 8D EE 00 AD EE 00 8D FF 00 AE FF 00 A9 02 8D FF 00 EC FF 00 D0 05 A9 01 8D EF 00 A9 F8 8D FF 00 A2 02 AC FF 00 FF AD EE 00 A2 01 8D FF 00 AC FF 00 FF A9 00 8D FF 00 A2 01 EC FF 00 D0 A4 A9 F1 8D FF 00 A2 02 AC FF 00 FF AD EC 00 A2 01 8D FF 00 AC FF 00 FF A9 EE 8D FF 00 A2 02 AC FF 00 FF A9 00 8D FF 00 A2 01 EC FF 00 D0 33 00 00 00 20 20 00 20 6F 75 74 65 72 00 20 69 6E 6E 65 72 00 00";
            //test program #3: "12DONE"
            //loadBox.value = "A9 03 8D 41 00 A9 01 8D 40 00 AC 40 00 A2 01 FF EE 40 00 AE 40 00 EC 41 00 D0 EF A9 44 8D 42 00 A9 4F 8D 43 00 A9 4E 8D 44 00 A9 45 8D 45 00 A9 00 8D 46 00 A2 02 A0 42 FF 00";
            //test program #3.5, the big boy: "a0a1a2aDONE"
            loadBox.value = "A9 00 8D 7B 00 A9 00 8D 7B 00 A9 00 8D 7C 00 A9 00 8D 7C 00 A9 01 8D 7A 00 A2 00 EC 7A 00 D0 39 A0 7D A2 02 FF AC 7B 00 A2 01 FF AD 7B 00 8D 7A 00 A9 01 6D 7A 00 8D 7B 00 A9 03 AE 7B 00 8D 7A 00 A9 00 EC 7A 00 D0 02 A9 01 8D 7A 00 A2 01 EC 7A 00 D0 05 A9 01 8D 7C 00 A9 00 AE 7C 00 8D 7A 00 A9 00 EC 7A 00 D0 02 A9 01 8D 7A 00 A2 00 EC 7A 00 D0 AC A0 7F A2 02 FF 00 00 00 00 61 00 61 64 6F 6E 65 00";
            TSOS.Utils.updateProcesses();
            TSOS.Utils.updateMemory();
        };
        return Shell;
    }());
    TSOS.Shell = Shell;
})(TSOS || (TSOS = {}));
