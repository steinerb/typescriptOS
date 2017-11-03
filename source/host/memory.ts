module TSOS 
{
	export class Memory 
	{
		constructor(public registers: number[] = new Array(768))
		{
		}

		public getSize(): number
		{
            return this.registers.length;
        }

        public isEmpty(): boolean
        {
            for(let i = 0; i < this.getSize(); i++)
                if(typeof this.registers[i] != 'undefined')
                    return false;
            return true;
        }

        //TO ADD: properly convert logical to physical addresses
        public storeValueAt(address, partition, value): void
        {
        	this.registers[address] = value;
        }

        public wipe()
        {
            this.registers = new Array(768);
        }

        public toString()
        {
            var toReturn: string = "[";
            var current: number;
        	for(var i = 0; i < this.getSize()-1; i++)
            {
                current = this.registers[i];
                toReturn += (String(current)+",");
            }
            toReturn += (String(this.registers[this.getSize()-1])+"]");
            return toReturn;
        }
	}
}