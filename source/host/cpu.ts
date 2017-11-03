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

            var pcBox     = <HTMLInputElement>document.getElementById("pc");
            var accBox    = <HTMLInputElement>document.getElementById("acc");
            var xRegBox   = <HTMLInputElement>document.getElementById("xReg");
            var yRegBox   = <HTMLInputElement>document.getElementById("yReg");
            var zFlagBox  = <HTMLInputElement>document.getElementById("zFlag");
            var memoryBox = <HTMLInputElement>document.getElementById("memory");



            if (this.isExecuting == true)
            {

               var indexNextOp: number = _IndexOfProgramToRun+this.PC+1;
               var indexTwoOps: number = _IndexOfProgramToRun+this.PC+2;

               var currentOp: number = _Memory.registers[_IndexOfProgramToRun+this.PC];

               var paramForConstant: number = _Memory.registers[indexNextOp];
               /*var paramForLocation: number = _Memory[( 
                                                       _IndexOfProgramToRun +
                                                       Number ( "0x"+(this.PC+1).toString(16)+(this.PC+2).toString(16) )
                                                     )];*/
               var paramForLocation: number = Number("0x"+_Memory.registers[indexTwoOps]+_Memory.registers[indexNextOp]);

               
               switch(currentOp)
               {

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
                       break

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
                       _Kernel.krnTrapError("Invalid op code: "+currentOp.toString(16).toUpperCase());
               }

               
               //set cpu and memory displays
               pcBox.value = String(this.PC);

               if(this.Acc <= 15)
                   accBox.value = "0"+this.Acc.toString(16).toUpperCase();
               else
                   accBox.value = this.Acc.toString(16).toUpperCase();

               if(this.Xreg <= 15)
                   xRegBox.value = "0"+this.Xreg.toString(16).toUpperCase();
               else
                   xRegBox.value = this.Xreg.toString(16).toUpperCase();

               if(this.Yreg <= 15)
                   yRegBox.value = "0"+this.Yreg.toString(16).toUpperCase();
               else
                   yRegBox.value = this.Yreg.toString(16).toUpperCase();

               zFlagBox.value = String(this.Zflag);

               Utils.updateMemory();
               

            }
            

        }


        public ldaC(constant): void
        {
            this.PC += 2;
            this.Acc = constant;
        }

        public ldaM(memLocation): void
        {
            this.PC += 3;
            if ((memLocation >= 0) && (memLocation < _Memory.getSize()))
                this.Acc = _Memory.registers[memLocation];
            else
                _Kernel.krnTrapError("Memory location: "+String(memLocation)+" is out of bounds!");
        }

        //NOT FINISHED: account for logical and physical addresses!!!
        public sta(memLocation): void
        {
            this.PC += 3;
            //OLD:  _Memory[memLocation] = this.Acc;
            _Memory.storeValueAt(memLocation, 0, this.Acc);
        }

        public adc(memLocation): void
        {
            this.PC += 3;
            if ((memLocation >= 0) && (memLocation < _Memory.getSize()))
                this.Acc += _Memory.registers[memLocation];
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
            if ((memLocation >= 0) && (memLocation < _Memory.getSize()))
                this.Xreg = _Memory.registers[memLocation];
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
            if ((memLocation >= 0) && (memLocation < _Memory.getSize()))
                this.Yreg = _Memory.registers[memLocation];
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
            if ((memLocation >= 0) && (memLocation < _Memory.getSize()))
            {
                if (_Memory.registers[memLocation] == this.Xreg)
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
            {
                if ((2 + this.PC + numBytesToBranch) > 255)
                    this.PC = (2 + this.PC + numBytesToBranch - 256);
                else
                    this.PC += (2 + numBytesToBranch);
            }
            else
                this.PC += 2;
        }
        
        //NOT FINISHED: account for logical and physical addresses!!!
        public inc(memLocation): void
        {
            this.PC += 3;
            if ((memLocation >= 0) && (memLocation < _Memory.getSize()))
                //_Memory[memLocation] += 1;
                _Memory.storeValueAt(memLocation, 0, (_Memory.registers[memLocation]+1))
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
                
                while(_Memory.registers[stringIndex] != 0x00)
                {
                    toReturn += String.fromCharCode(_Memory.registers[stringIndex]);
                    stringIndex++;
                }
                _StdOut.putText(toReturn);
            }
        }
        
    }
}
