module TSOS
{
	export class MemoryManager
	{
		constructor(public partitions = new Array(3))
		{
		}

		public toString()
		{
			return "***MEMORY MANAGER toString REACHED***";
		}

	}
}