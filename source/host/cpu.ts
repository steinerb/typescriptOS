///<reference path="../globals.ts" />
///<reference path="../utils.ts" />

///<reference path="../os/interrupt.ts" />


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
					public ticks: number = 0,
					public isExecuting: boolean = false) 
		{/*leave this empty*/}

		public init(): void 
		{
			this.PC = 0;
			this.Acc = 0;
			this.Xreg = 0;
			this.Yreg = 0;
			this.Zflag = 0;
			this.ticks = 0;
			this.isExecuting = false;
		}


		public cycle(): void 
		{
			_Kernel.krnTrace('CPU cycle');
			// TODO: Accumulate CPU usage and profiling statistics here.
			// Do the real work here. Be sure to set this.isExecuting appropriately.

			var pcBox             = <HTMLInputElement>document.getElementById("pc");
			var accBox            = <HTMLInputElement>document.getElementById("acc");
			var xRegBox           = <HTMLInputElement>document.getElementById("xReg");
			var yRegBox           = <HTMLInputElement>document.getElementById("yReg");
			var zFlagBox          = <HTMLInputElement>document.getElementById("zFlag");
			var memoryBox         = <HTMLInputElement>document.getElementById("memory");
			var processesBox      = <HTMLInputElement>document.getElementById("readyPCBs");


			//enforce quanta and potentially context switch


			//fetch data from current pcb for cpu			
			var currentPCB: TSOS.Pcb;
			var currentPID: number;
			var currentBase: number;

			currentPCB = _ReadyQueue.q[0];
			currentPID 		= currentPCB.pid;
			this.PC 		= currentPCB.PC;
			this.Acc 		= currentPCB.Acc;
			this.Xreg 		= currentPCB.Xreg;
			this.Yreg 		= currentPCB.Yreg;
			this.Zflag 		= currentPCB.Zflag;
			currentBase 	= currentPCB.base;

			//set state as running and update display
			_ReadyQueue.q[0].state = "RUNNING";
			Utils.updateProcesses();
				
			//get current partition number
			if(currentBase == _Memory.par1Base)
				_CurrentPartition = 0;
			else if (currentBase == _Memory.par2Base)
				_CurrentPartition = 1;
			else if (currentBase == _Memory.par3Base)
				_CurrentPartition = 2;
			else
				_Kernel.krnTrapError("_CurrentPartition not valid!!");


			//get indexes for current op code and parameters
			var indexNextOp: number = this.PC+1;
			var indexTwoOps: number = this.PC+2;

			var currentOp: number = _Memory.getValueAt(this.PC, _CurrentPartition);

			var paramForConstant: number = _Memory.getValueAt(indexNextOp, _CurrentPartition);

			var paramForLocation: number = Number("0x"+_Memory.getValueAt(indexTwoOps, _CurrentPartition).toString(16)+_Memory.getValueAt(indexNextOp, _CurrentPartition).toString(16));
				//Number("0x"+_Memory.getValueAt(indexTwoOps, _CurrentPartition)+_Memory.getValueAt(indexNextOp, _CurrentPartition));

			/*			
			var indexNextOp: number = currentBase+this.PC+1;
			var indexTwoOps: number = currentBase+this.PC+2;

			var currentOp: number = _Memory.registers[currentBase+this.PC];

			var paramForConstant: number = _Memory.registers[indexNextOp];

			var paramForLocation: number = Number("0x"+_Memory.registers[indexTwoOps]+_Memory.registers[indexNextOp]);
			*/



		    //process current op code
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
					_Kernel.krnTrapError("Invalid op code: "+currentOp.toString(16).toUpperCase()+" in program "+String(currentPID)+" with a PC of "+String(this.PC));
			}


		   //check if break (00) was reached/program is finished
		   if(this.isExecuting == false)
		   {
		   		//if program is finished, pop it off the queue
			   	var dequeuedPCB: TSOS.Pcb = _ReadyQueue.dequeue();
				
		   		//if program is finished, remove it from memory
		   		_Memory.wipePartition(_MemoryManager.partitionOfProgram(dequeuedPCB.pid));
				_MemoryManager.wipePartition(_MemoryManager.partitionOfProgram(dequeuedPCB.pid));

				//reset CPU (also resets ticks)
		   		_CPU.init();		   		

		   		//check if there are remaining programs and should keep going
		   		if(_ReadyQueue.getSize() > 0)
		   			this.isExecuting = true;
		   }
		   //if round robin, check if quantum is reached and if there are other programs waiting
		   //else if( (this.ticks == _CPUScheduler.quantum) && (_ReadyQueue.getSize() > 1))
		   else if((_CPUScheduler.schedAlg == "rr") && (this.ticks == (_CPUScheduler.quantum-1)))
		   {
		   		//update current PCB
		   	    _ReadyQueue.q[0].PC		= this.PC;
			    _ReadyQueue.q[0].Acc	= this.Acc;
			    _ReadyQueue.q[0].Xreg	= this.Xreg;
			    _ReadyQueue.q[0].Yreg	= this.Yreg;
			    _ReadyQueue.q[0].Zflag	= this.Zflag;

			    //software interrupt (new context switch method)
			    _KernelInterruptQueue.enqueue(new Interrupt(TIMER_IRQ, 0));

			    //reset ticks for new round robin cycle
		   		this.ticks = 0; 
		   }
		   //program isn't finished and has more cycles to go before finished or quanta reached
		   else
		   {
		   		//update current PCB
		   	    _ReadyQueue.q[0].PC		= this.PC;
			    _ReadyQueue.q[0].Acc	= this.Acc;
			    _ReadyQueue.q[0].Xreg	= this.Xreg;
			    _ReadyQueue.q[0].Yreg	= this.Yreg;
			    _ReadyQueue.q[0].Zflag	= this.Zflag;

			    //tick up
		   		this.ticks++;
		   }
		   

		   //update cpu displays
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

		   //Update processes display
		   Utils.updateProcesses();

		   //update memory display
		   Utils.updateMemory();

		   //update storage display
		   Utils.updateDiskStorage();

		   _CurrentPartition = undefined;
		   
		}


		//CPU operations

		public ldaC(constant): void
		{
			this.PC += 2;
			this.Acc = constant;
		}

		public ldaM(memLocation): void
		{
			this.PC += 3;
			if ((memLocation >= 0) && (memLocation < _Memory.getSize()))
				this.Acc = _Memory.getValueAt(memLocation, _CurrentPartition);
			else
				_Kernel.krnTrapError("Memory location: "+String(memLocation)+" is out of bounds!");
		}

		public sta(memLocation): void
		{
			this.PC += 3;
			_Memory.storeValueAt(memLocation, _CurrentPartition, this.Acc);
		}

		public adc(memLocation): void
		{
			this.PC += 3;
			if ((memLocation >= 0) && (memLocation < _Memory.getSize()))
				this.Acc += _Memory.getValueAt(memLocation, _CurrentPartition);
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
				this.Xreg = _Memory.getValueAt(memLocation, _CurrentPartition);
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
				this.Yreg = _Memory.getValueAt(memLocation, _CurrentPartition);
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
				if (_Memory.getValueAt(memLocation, _CurrentPartition) == this.Xreg)
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
		
	   public inc(memLocation): void
		{
			this.PC += 3;
			if ((memLocation >= 0) && (memLocation < _Memory.getSize()))
				_Memory.storeValueAt(memLocation, 
									_CurrentPartition, 
									(_Memory.getValueAt(memLocation, _CurrentPartition) + 1)
									);
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
				
				while(_Memory.getValueAt(stringIndex, _CurrentPartition) != 0x00)
				{
					toReturn += String.fromCharCode(_Memory.getValueAt(stringIndex, _CurrentPartition));
					stringIndex++;
				}
				_StdOut.putText(toReturn);
			}
		}
		
	}
}
