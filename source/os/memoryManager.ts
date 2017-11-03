module TSOS
{
	export class MemoryManager
	{

		constructor(public partitions: number[][] = new Array(3),
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
			return this.partitions.length;
		}

		public indexOfProgram(pid: number): number
		{
			/*var current;
			for (var i = 0; i < this.numPartitions(); i++)
			{
				current = this.partitions[i];
				if (current[0] == pid)
					return _Memory

			}*/

			return -1;
		}

		public toString()
		{
			return "***MEMORY MANAGER toString REACHED***";
		}

	}
}