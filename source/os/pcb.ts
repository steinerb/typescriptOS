///<reference path="../globals.ts" />

module TSOS 
{
	export class Pcb 
	{
		constructor(public message:string = "hello world")
		{}

		public helloWorld(): void
		{
			_StdOut.putText(this.message);
		}

	}
}