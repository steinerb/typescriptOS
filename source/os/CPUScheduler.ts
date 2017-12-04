///<reference path="../globals.ts" />
///<reference path="pcb.ts" />


module TSOS
{
	export class CPUScheduler
	{
		constructor(public quantum = 6,
					public schedAlg = "rr"
					)
		{}

		public contextSwitch(): void
		{
			var dequeuedPCB: TSOS.Pcb = _ReadyQueue.dequeue();
            _ReadyQueue.enqueue(new Pcb("WAITING", 
            							dequeuedPCB.pid, 
            							dequeuedPCB.PC, 
            							dequeuedPCB.Acc, 
            							dequeuedPCB.Xreg, 
            							dequeuedPCB.Yreg, 
            							dequeuedPCB.Zflag, 
            							dequeuedPCB.base, 
            							dequeuedPCB.limit)
            					);
		}
		
	}
}