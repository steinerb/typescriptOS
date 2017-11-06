module TSOS
{
	export class MemoryManager
	{

		constructor(public pidPartitions: number[] = new Array(3),
					public parLength: number = 256
				   )
		{
		}

		public init(): void
		{
			this.pidPartitions = new Array(3);
		}

		public numPartitions(): number
		{
			return this.pidPartitions.length;
		}

		public hasSpace(): boolean
		{
			for(var i = 0; i < this.numPartitions(); i++)
			{
				if ((typeof this.pidPartitions[i]) == 'undefined')
					return true;
			}
			return false;
		}

		public nextAvailablePartition(): number
		{
			for(var i = 0; i < this.numPartitions(); i++)
			{
				if ((typeof this.pidPartitions[i]) == 'undefined')
					return i;
			}
			return -1;
		}

		public fillPartition(pid: number): void
		{
			this.pidPartitions[this.nextAvailablePartition()] = pid;
		}

		public wipePartition(parNum: number): void
		{
			this.pidPartitions[parNum] = undefined;
		}

		public indexOfProgram(pid: number): number
		{
			var current;
			for (var i = 0; i < this.numPartitions(); i++)
			{
				current = this.pidPartitions[i];
				if (current == pid)
					return current*this.parLength;
			}

			return -1;
		}

		public programAtIndex(desiredIndex: number): number
		{
			var currentIndex;
			for (var currentPartition = 0; currentPartition < this.numPartitions(); currentPartition++)
			{
				currentIndex = currentPartition*this.parLength;
				if((currentIndex == desiredIndex) && ((typeof this.pidPartitions[currentPartition]) != 'undefined'))
					return this.pidPartitions[currentIndex];
			}

			return -1;
		}

		public toString()
		{
			return "***MEMORY MANAGER toString REACHED***";
		}

	}
}