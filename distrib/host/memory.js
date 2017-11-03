var TSOS;
(function (TSOS) {
    var Memory = (function () {
        function Memory(registers) {
            if (registers === void 0) { registers = new Array(768); }
            this.registers = registers;
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
        Memory.prototype.storeValueAt = function (address, partition, value) {
            //if zero, logical address is physical address
            if (partition == 0)
                this.registers[address] = value;
            else if ((partition >= 1) && (partition <= 3))
                this.registers[(address + (256 * (partition - 1)))] = value;
        };
        Memory.prototype.wipe = function () {
            this.registers = new Array(768);
        };
        Memory.prototype.toString = function () {
            var toReturn = "[";
            var current;
            for (var i = 0; i < this.getSize() - 1; i++) {
                current = this.registers[i];
                toReturn += (String(current) + ",");
            }
            toReturn += (String(this.registers[this.getSize() - 1]) + "]");
            return toReturn;
        };
        return Memory;
    }());
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
