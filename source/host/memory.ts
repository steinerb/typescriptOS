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
            //if partition is -1, logical address is physical address
            if(partition == -1)
        	    this.registers[address] = value;
            //if valid partition, convert logical to physical address
            else if ((partition >= 0) && (partition <= 2))
                this.registers[(address+(256*partition))] = value;
        }

        public wipe(): void
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
                if(typeof current != 'undefined')
                    toReturn += (String(current)+",");
                else
                    toReturn += ("0,");
            }
            if(typeof current != 'undefined')
                toReturn += (String(this.registers[this.getSize()-1])+"]");
            else
                toReturn += ("0]");
            return toReturn;
        }
	}
}