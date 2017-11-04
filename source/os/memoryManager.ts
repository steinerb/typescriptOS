module TSOS
{
	export class MemoryManager
	{

		constructor(public pidPartitions: number[] = new Array(3),
					public parLength: number = 256,
					public par1Base:  number = 0,
					public par1Limit: number = 255,
					public par2Base:  number = 256,
					public par2Limit: number = 511,
					public par3Base:  number = 512,
					public par3Limit: number = 767
				   )
		{
		}

		public numPartitions(): number
		{
			return this.pidPartitions.length;
		}

		public indexOfProgram(pid: number): number
		{
			var current;
			for (var i = 0; i < this.numPartitions(); i++)
			{
				current = this.pidPartitions[i];
				if (current == pid)
					return (current-1)*this.parLength;
			}

			return -1;
		}

		public programAtIndex(index: number): number
		{
			var current;
			var currentPID;
			for (var i = 0; i < this.numPartitions(); i++)
			{
				currentPID = i+1;
				current = i*this.parLength;
				if(current == index)
					return currentPID;
			}

			return -1;
		}

		public toString()
		{
			return "***MEMORY MANAGER toString REACHED***";
		}

	}
}