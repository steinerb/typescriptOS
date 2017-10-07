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

module TSOS 
{

    export class Cpu 
    {

        constructor(public PC: number = 0,
                    public Acc: number = 0,
                    public Xreg: number = 0,
                    public Yreg: number = 0,
                    public Zflag: number = 0,
                    public isExecuting: boolean = false) 
        {/*leave this empty*/}

        public init(): void 
        {
            this.PC = 0;
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        }


        public cycle(): void 
        {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.

            /***A continuation of run shell command***/

            /*if(this.isExecuting)
            {
                //switch(_Memory[this.PC])

            }*/
            
                


        }


        public ldaC(constant): void
        {
            this.PC += 2;
            this.Acc = constant;
        }

        public ldaM(memLocation): void
        {
            this.PC += 3;
            if ((memLocation >= 0) && (memLocation < _Memory.length))
                this.Acc = _Memory[memLocation];
            else
                _Kernel.krnTrapError("Memory location: "+String(memLocation)+" is out of bounds!");
        }

        public sta(): void
        {
            this.PC += 3;
            _Memory[_Memory.length] = this.Acc;
        }

        public adc(memLocation): void
        {
            this.PC += 3;
            if ((memLocation >= 0) && (memLocation < _Memory.length))
                this.Acc += _Memory[memLocation];
            else
                _Kernel.krnTrapError("Memory location: "+String(memLocation)+" is out of bounds!");
        }

        public ldxC(constant): void
        {
            this.PC += 2;
            this.Xreg = constant;
        }

        public ldxM(memLocation): void
        {
            this.PC += 3;
            if ((memLocation >= 0) && (memLocation < _Memory.length))
                this.Xreg = _Memory[memLocation];
            else
                _Kernel.krnTrapError("Memory location: "+String(memLocation)+" is out of bounds!");
        }

        public ldyC(constant): void
        {
            this.PC += 2;
            this.Yreg = constant;
        }

        public ldyM(memLocation): void
        {
            this.PC += 3;
            if ((memLocation >= 0) && (memLocation < _Memory.length))
                this.Yreg = _Memory[memLocation];
            else
                _Kernel.krnTrapError("Memory location: "+String(memLocation)+" is out of bounds!");
        }

        public nop(): void
        {
            this.PC += 1;
        }

        public brk(): void
        {
            this.isExecuting = false;
        }

        public cpx(memLocation): void
        {
            this.PC += 3;
            if ((memLocation >= 0) && (memLocation < _Memory.length))
            {
                if (_Memory[memLocation] == this.Xreg)
                    this.Zflag = 1;
                else
                    this.Zflag = 0;
            }
            else
                _Kernel.krnTrapError("Memory location: "+String(memLocation)+" is out of bounds!");    
        }

        public bne(numBytesToBranch): void
        {
            if(this.Zflag == 0)
                this.PC += numBytesToBranch;
            else
                this.PC += 2;
        }

        public inc(memLocation): void
        {
            this.PC += 3;
            if ((memLocation >= 0) && (memLocation < _Memory.length))
                _Memory[memLocation] += 1;
            else
                _Kernel.krnTrapError("Memory location: "+String(memLocation)+" is out of bounds!");
        }

        public sys(): void
        {
            this.PC += 1;
            if (this.Xreg == 1)
                _StdOut.putText(String(this.Yreg));
            else if (this.Xreg == 2)
            {
                var toReturn: string = "";
                var stringIndex: number = this.Yreg;
                
                while(_Memory[stringIndex] != 0x00)
                {
                    toReturn += String.fromCharCode(_Memory[stringIndex]);
                    stringIndex++;
                }
                _StdOut.putText(toReturn);
            }
        }
        
    }
}
