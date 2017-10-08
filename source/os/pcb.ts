///<reference path="../globals.ts" />

module TSOS 
{
	export class Pcb 
	{
		
		//most flexible constructor
		constructor(public state: string,
					public pid: number,
					public PC: number,
					public Acc: number,
                    public Xreg: number,
                    public Yreg: number,
                    public Zflag: number
				   )
		{
			this.state = state;
			this.pid = pid;
			this.PC = PC;
			this.Acc = Acc;
			this.Xreg = Xreg;
			this.Yreg = Yreg;
			this.Zflag = Zflag;
		}

		public helloWorld(): void
		{
			_StdOut.putText("Hello World! Love, a pcb");
		}

	}
}