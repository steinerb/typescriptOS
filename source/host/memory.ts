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

        
        public storeValueAt(address, partition, value): void
        {
            //if zero, logical address is physical address
            if(partition == 0)
        	    this.registers[address] = value;
            //if valid partition, convert logical to physical address
            else if ((partition >= 1) && (partition <= 3))
                this.registers[(address+(256*(partition-1)))] = value;
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