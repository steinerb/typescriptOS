///<reference path="../globals.ts" />
/* ------------
     CPU.ts

     Requires global.ts.

     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */
var TSOS;
(function (TSOS) {
    var Cpu = (function () {
        function Cpu(PC, Acc, Xreg, Yreg, Zflag, isExecuting) {
            if (PC === void 0) { PC = 0; }
            if (Acc === void 0) { Acc = 0; }
            if (Xreg === void 0) { Xreg = 0; }
            if (Yreg === void 0) { Yreg = 0; }
            if (Zflag === void 0) { Zflag = 0; }
            if (isExecuting === void 0) { isExecuting = false; }
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
        }
        Cpu.prototype.init = function () {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        };
        Cpu.prototype.cycle = function () {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
            var pcBox = document.getElementById("pc");
            var accBox = document.getElementById("acc");
            var xRegBox = document.getElementById("xReg");
            var yRegBox = document.getElementById("yReg");
            var zFlagBox = document.getElementById("zFlag");
            if (this.isExecuting == true) {
                var indexNextOp = _IndexOfProgramToRun + this.PC + 1;
                var indexTwoOps = _IndexOfProgramToRun + this.PC + 2;
                var currentOp = _Memory[_IndexOfProgramToRun + this.PC];
                var paramForConstant = _Memory[indexNextOp];
                /*var paramForLocation: number = _Memory[(
                                                        _IndexOfProgramToRun +
                                                        Number ( "0x"+(this.PC+1).toString(16)+(this.PC+2).toString(16) )
                                                      )];*/
                var paramForLocation = Number("0x" + _Memory[indexTwoOps] + _Memory[indexNextOp]);
                switch (currentOp) {
                    case 0xA9:
                        this.ldaC(paramForConstant);
                        break;
                    case 0xAD:
                        this.ldaM(paramForLocation);
                        break;
                    case 0x8D:
                        this.sta(paramForLocation);
                        break;
                    case 0x6D:
                        this.adc(paramForLocation);
                        break;
                    case 0xA2:
                        this.ldxC(paramForConstant);
                        break;
                    case 0xAE:
                        this.ldxM(paramForLocation);
                        break;
                    case 0xA0:
                        this.ldyC(paramForConstant);
                        break;
                    case 0xAC:
                        this.ldyM(paramForLocation);
                        break;
                    case 0xEA:
                        this.nop();
                        break;
                    case 0x00:
                        this.init();
                        _StdOut.advanceLine();
                        _OsShell.putPrompt();
                        break;
                    case 0xEC:
                        this.cpx(paramForLocation);
                        break;
                    //case 0xD0:
                    //    this.bne()
                    //    break;
                    case 0xEE:
                        this.inc(paramForLocation);
                        break;
                    case 0xFF:
                        this.sys();
                        break;
                    //error: op code not recognized
                    default:
                        _Kernel.krnTrapError("Invalid op code: " + currentOp.toString(16).toUpperCase());
                }
                pcBox.value = String(this.PC);
                accBox.value = String(this.Acc);
                xRegBox.value = String(this.Xreg);
                yRegBox.value = String(this.Yreg);
                zFlagBox.value = String(this.Zflag);
            }
        };
        Cpu.prototype.ldaC = function (constant) {
            this.PC += 2;
            this.Acc = constant;
        };
        Cpu.prototype.ldaM = function (memLocation) {
            this.PC += 3;
            if ((memLocation >= 0) && (memLocation < _Memory.length))
                this.Acc = _Memory[memLocation];
            else
                _Kernel.krnTrapError("Memory location: " + String(memLocation) + " is out of bounds!");
        };
        Cpu.prototype.sta = function (memLocation) {
            this.PC += 3;
            _Memory[memLocation] = this.Acc;
        };
        Cpu.prototype.adc = function (memLocation) {
            this.PC += 3;
            if ((memLocation >= 0) && (memLocation < _Memory.length))
                this.Acc += _Memory[memLocation];
            else
                _Kernel.krnTrapError("Memory location: " + String(memLocation) + " is out of bounds!");
        };
        Cpu.prototype.ldxC = function (constant) {
            this.PC += 2;
            this.Xreg = constant;
        };
        Cpu.prototype.ldxM = function (memLocation) {
            this.PC += 3;
            if ((memLocation >= 0) && (memLocation < _Memory.length))
                this.Xreg = _Memory[memLocation];
            else
                _Kernel.krnTrapError("Memory location: " + String(memLocation) + " is out of bounds!");
        };
        Cpu.prototype.ldyC = function (constant) {
            this.PC += 2;
            this.Yreg = constant;
        };
        Cpu.prototype.ldyM = function (memLocation) {
            this.PC += 3;
            if ((memLocation >= 0) && (memLocation < _Memory.length))
                this.Yreg = _Memory[memLocation];
            else
                _Kernel.krnTrapError("Memory location: " + String(memLocation) + " is out of bounds!");
        };
        Cpu.prototype.nop = function () {
            this.PC += 1;
        };
        Cpu.prototype.brk = function () {
            this.isExecuting = false;
        };
        Cpu.prototype.cpx = function (memLocation) {
            this.PC += 3;
            if ((memLocation >= 0) && (memLocation < _Memory.length)) {
                if (_Memory[memLocation] == this.Xreg)
                    this.Zflag = 1;
                else
                    this.Zflag = 0;
            }
            else
                _Kernel.krnTrapError("Memory location: " + String(memLocation) + " is out of bounds!");
        };
        Cpu.prototype.bne = function (numBytesToBranch) {
            if (this.Zflag == 0)
                this.PC += numBytesToBranch;
            else
                this.PC += 2;
        };
        Cpu.prototype.inc = function (memLocation) {
            this.PC += 3;
            if ((memLocation >= 0) && (memLocation < _Memory.length))
                _Memory[memLocation] += 1;
            else
                _Kernel.krnTrapError("Memory location: " + String(memLocation) + " is out of bounds!");
        };
        Cpu.prototype.sys = function () {
            this.PC += 1;
            if (this.Xreg == 1)
                _StdOut.putText(String(this.Yreg));
            else if (this.Xreg == 2) {
                var toReturn = "";
                var stringIndex = this.Yreg;
                while (_Memory[stringIndex] != 0x00) {
                    toReturn += String.fromCharCode(_Memory[stringIndex]);
                    stringIndex++;
                }
                _StdOut.putText(toReturn);
            }
        };
        return Cpu;
    }());
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
