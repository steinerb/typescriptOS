var TSOS;
(function (TSOS) {
    var Memory = (function () {
        function Memory(registers, par1Base, par1Limit, par2Base, par2Limit, par3Base, par3Limit) {
            if (registers === void 0) { registers = new Array(768); }
            if (par1Base === void 0) { par1Base = 0; }
            if (par1Limit === void 0) { par1Limit = 255; }
            if (par2Base === void 0) { par2Base = 256; }
            if (par2Limit === void 0) { par2Limit = 511; }
            if (par3Base === void 0) { par3Base = 512; }
            if (par3Limit === void 0) { par3Limit = 767; }
            this.registers = registers;
            this.par1Base = par1Base;
            this.par1Limit = par1Limit;
            this.par2Base = par2Base;
            this.par2Limit = par2Limit;
            this.par3Base = par3Base;
            this.par3Limit = par3Limit;
        }
        Memory.prototype.getSize = function () {
            return this.registers.length;
        };
        Memory.prototype.isEmpty = function () {
            for (var i = 0; i < this.getSize(); i++)
                if (typeof this.registers[i] != 'undefined')
                    return false;
            return true;
        };
        Memory.prototype.getValueAt = function (address, partition) {
            if (partition == -1)
                return this.registers[address];
            else if ((partition >= 0) && (partition <= 2))
                return this.registers[(address + (256 * partition))];
            return -1;
        };
        Memory.prototype.storeValueAt = function (address, partition, value) {
            //if partition is -1, logical address is physical address
            if (partition == -1)
                this.registers[address] = value;
            else if ((partition >= 0) && (partition <= 2))
                this.registers[(address + (256 * partition))] = value;
        };
        Memory.prototype.wipe = function () {
            this.registers = new Array(768);
        };
        Memory.prototype.wipePartition = function (parNum) {
            for (var i = (parNum * 256); i < 256; i++)
                _Memory.registers[i] = undefined;
        };
        Memory.prototype.toString = function () {
            var toReturn = "[";
            var current;
            for (var i = 0; i < this.getSize() - 1; i++) {
                current = this.registers[i];
                if (typeof current != 'undefined')
                    toReturn += (String(current) + ",");
                else
                    toReturn += ("0,");
            }
            if (typeof current != 'undefined')
                toReturn += (String(this.registers[this.getSize() - 1]) + "]");
            else
                toReturn += ("0]");
            return toReturn;
        };
        return Memory;
    }());
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
