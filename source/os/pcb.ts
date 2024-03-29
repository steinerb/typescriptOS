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
                    public Zflag: number,
                    public base: number,
                    public limit: number,
                    public priority: number,
                    public location: string
				   )
		{
			this.state = state;
			this.pid = pid;
			this.PC = PC;
			this.Acc = Acc;
			this.Xreg = Xreg;
			this.Yreg = Yreg;
			this.Zflag = Zflag;
			this.base = base;
			this.limit = limit;
			this.priority = priority;
			this.location = location;
		}

		public helloWorld(): void
		{
			_StdOut.putText("Hello World! Love, a pcb");
		}

		public toString()
		{
			var toReturn: string = "";
			toReturn += ("|state:\t"+this.state+"\t");
			toReturn += ("|pc:\t"+this.PC.toString(16).toUpperCase()+"\t");
			toReturn += ("|acc:\t"+this.Acc.toString(16).toUpperCase()+"\t");
			toReturn += ("|x:\t"+this.Xreg.toString(16).toUpperCase()+"\t");
			toReturn += ("|y:\t"+this.Yreg.toString(16).toUpperCase()+"\t");
			toReturn += ("|z:\t"+this.Zflag+"\t");
			if(this.priority == -1)
				toReturn += ("|prior:\tN/A\t");
			else
				toReturn += ("|prior:\t"+String(this.priority)+"\t");
			toReturn += ("|loc:\t"+this.location+"\t|");

			return toReturn;
		}

	}
}