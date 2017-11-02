var TSOS;
(function (TSOS) {
    var Memory = (function () {
        function Memory(registers) {
            if (registers === void 0) { registers = new Array(768); }
            this.registers = registers;
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
        Memory.prototype.toString = function () {
            return "***MEMORY toString REACHED***";
        };
        return Memory;
    }());
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
