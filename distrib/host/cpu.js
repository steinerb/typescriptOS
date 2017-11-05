///<reference path="../globals.ts" />
///<reference path="../utils.ts" />
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
            var memoryBox = document.getElementById("memory");
            /*
            if (this.isExecuting == true)
            {
                if(_ReadyQueue.isEmpty())
                    this.isExecuting = false;
                else
                {
                    _ReadyQueue.dequeue();
                    
                }
            }
            */
            if (this.isExecuting == true) {
                var indexNextOp = _IndexOfProgramToRun + this.PC + 1;
                var indexTwoOps = _IndexOfProgramToRun + this.PC + 2;
                var currentOp = _Memory.registers[_IndexOfProgramToRun + this.PC];
                var paramForConstant = _Memory.registers[indexNextOp];
                var paramForLocation = Number("0x" + _Memory.registers[indexTwoOps] + _Memory.registers[indexNextOp]);
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
                        this.brk();
                        break;
                    case 0xEC:
                        this.cpx(paramForLocation);
                        break;
                    case 0xD0:
                        this.bne(paramForConstant);
                        break;
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
                //set cpu and memory displays
                pcBox.value = String(this.PC);
                if (this.Acc <= 15)
                    accBox.value = "0" + this.Acc.toString(16).toUpperCase();
                else
                    accBox.value = this.Acc.toString(16).toUpperCase();
                if (this.Xreg <= 15)
                    xRegBox.value = "0" + this.Xreg.toString(16).toUpperCase();
                else
                    xRegBox.value = this.Xreg.toString(16).toUpperCase();
                if (this.Yreg <= 15)
                    yRegBox.value = "0" + this.Yreg.toString(16).toUpperCase();
                else
                    yRegBox.value = this.Yreg.toString(16).toUpperCase();
                zFlagBox.value = String(this.Zflag);
                TSOS.Utils.updateMemory();
            }
        };
        Cpu.prototype.ldaC = function (constant) {
            this.PC += 2;
            this.Acc = constant;
        };
        Cpu.prototype.ldaM = function (memLocation) {
            this.PC += 3;
            if ((memLocation >= 0) && (memLocation < _Memory.getSize()))
                this.Acc = _Memory.getValueAt(memLocation, (_MemoryManager.programAtIndex(_IndexOfProgramToRun)));
            else
                _Kernel.krnTrapError("Memory location: " + String(memLocation) + " is out of bounds!");
        };
        Cpu.prototype.sta = function (memLocation) {
            this.PC += 3;
            _Memory.storeValueAt(memLocation, (_MemoryManager.programAtIndex(_IndexOfProgramToRun)), this.Acc);
        };
        Cpu.prototype.adc = function (memLocation) {
            this.PC += 3;
            if ((memLocation >= 0) && (memLocation < _Memory.getSize()))
                this.Acc += _Memory.getValueAt(memLocation, (_MemoryManager.programAtIndex(_IndexOfProgramToRun)));
            else
                _Kernel.krnTrapError("Memory location: " + String(memLocation) + " is out of bounds!");
        };
        Cpu.prototype.ldxC = function (constant) {
            this.PC += 2;
            this.Xreg = constant;
        };
        Cpu.prototype.ldxM = function (memLocation) {
            this.PC += 3;
            if ((memLocation >= 0) && (memLocation < _Memory.getSize()))
                this.Xreg = _Memory.getValueAt(memLocation, (_MemoryManager.programAtIndex(_IndexOfProgramToRun)));
            else
                _Kernel.krnTrapError("Memory location: " + String(memLocation) + " is out of bounds!");
        };
        Cpu.prototype.ldyC = function (constant) {
            this.PC += 2;
            this.Yreg = constant;
        };
        Cpu.prototype.ldyM = function (memLocation) {
            this.PC += 3;
            if ((memLocation >= 0) && (memLocation < _Memory.getSize()))
                this.Yreg = _Memory.getValueAt(memLocation, (_MemoryManager.programAtIndex(_IndexOfProgramToRun)));
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
            if ((memLocation >= 0) && (memLocation < _Memory.getSize())) {
                if (_Memory.getValueAt(memLocation, (_MemoryManager.programAtIndex(_IndexOfProgramToRun))) == this.Xreg)
                    this.Zflag = 1;
                else
                    this.Zflag = 0;
            }
            else
                _Kernel.krnTrapError("Memory location: " + String(memLocation) + " is out of bounds!");
        };
        Cpu.prototype.bne = function (numBytesToBranch) {
            if (this.Zflag == 0) {
                if ((2 + this.PC + numBytesToBranch) > 255)
                    this.PC = (2 + this.PC + numBytesToBranch - 256);
                else
                    this.PC += (2 + numBytesToBranch);
            }
            else
                this.PC += 2;
        };
        Cpu.prototype.inc = function (memLocation) {
            this.PC += 3;
            if ((memLocation >= 0) && (memLocation < _Memory.getSize()))
                //OLDER: _Memory[memLocation] += 1;
                //OLD:   _Memory.storeValueAt(memLocation, -1, (_Memory.registers[memLocation]+1));
                _Memory.storeValueAt(memLocation, (_MemoryManager.programAtIndex(_IndexOfProgramToRun)), (_Memory.getValueAt(memLocation, (_MemoryManager.programAtIndex(_IndexOfProgramToRun))) + 1));
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
                //while(_Memory.registers[stringIndex] != 0x00)
                while (_Memory.getValueAt(stringIndex, _MemoryManager.programAtIndex(_IndexOfProgramToRun)) != 0x00) {
                    toReturn += String.fromCharCode(_Memory.getValueAt(stringIndex, _MemoryManager.programAtIndex(_IndexOfProgramToRun)));
                    stringIndex++;
                }
                _StdOut.putText(toReturn);
            }
        };
        return Cpu;
    }());
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
