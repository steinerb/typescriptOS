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
        {

        }

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
        }


        public ldaC(constant): void
        {
            this.Acc = constant;
        }

        public ldaM(memLocation): void
        {
            if ((memLocation >= 0) && (memLocation < _Memory.length))
                this.Acc = _Memory[memLocation];
        }

        public sta(): void
        {
            _Memory[_Memory.length] = this.Acc;
        }

        public adc(memLocation): void
        {
            if ((memLocation >= 0) && (memLocation < _Memory.length))
                this.Acc += _Memory[memLocation];
        }

        public ldxC(constant): void
        {
            this.Xreg = constant;
        }

        public ldxM(memLocation): void
        {
            if ((memLocation >= 0) && (memLocation < _Memory.length))
                this.Xreg = _Memory[memLocation];
        }

        public ldyC(constant): void
        {
            this.Yreg = constant;
        }

        public ldyM(memLocation): void
        {
            if ((memLocation >= 0) && (memLocation < _Memory.length))
                this.Yreg = _Memory[memLocation];
        }

        //     nop?

        //     brk?

        public cpx(memLocation): void
        {
            if ((memLocation >= 0) && (memLocation < _Memory.length))
            {
                if (_Memory[memLocation] == this.Xreg)
                    this.Zflag = 1;
                else
                    this.Zflag = 0;
            }    
        }

        //     bne?

        public inc(memLocation): void
        {
            if ((memLocation >= 0) && (memLocation < _Memory.length))
                _Memory[memLocation] += 1;
        }

        //INCOMPLETE: NEED TO ADD PRINT STRINGS FOR XREG BEING 2
        public sys(): void
        {
            if (this.Xreg == 1)
                _StdOut.putText(String(this.Yreg));
        }
        
    }
}
