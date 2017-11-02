module TSOS 
{
	export class Memory 
	{
		constructor(public registers = new Array(768))
		{
		}

		/*public getSize(): number
		{
            return this.registers.length;
        }

        public storeValueAt(address, value): void
        {
        	this.registers[address] = value;
        }

        public clear()*/

        public toString()
        {
        	return "***MEMORY toString REACHED***";
        }
	}
}