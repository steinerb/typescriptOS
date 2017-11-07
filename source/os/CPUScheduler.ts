module TSOS
{
	export class CPUScheduler
	{
		constructor(public ticks = 1,
					public quantum = 6
					)
		{}

		public quantumCyclesReached(): boolean
		{
			if(((this.ticks%this.quantum) == 0) && (this.ticks > 0))
				return true;
			return false;
		}
	}
}