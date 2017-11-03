var TSOS;
(function (TSOS) {
    var MemoryManager = (function () {
        function MemoryManager(partitions, par1Base, par1Limit, par2Base, par2Limit, par3Base, par3Limit) {
            if (partitions === void 0) { partitions = new Array(3); }
            if (par1Base === void 0) { par1Base = 0; }
            if (par1Limit === void 0) { par1Limit = 255; }
            if (par2Base === void 0) { par2Base = 256; }
            if (par2Limit === void 0) { par2Limit = 511; }
            if (par3Base === void 0) { par3Base = 512; }
            if (par3Limit === void 0) { par3Limit = 767; }
            this.partitions = partitions;
            this.par1Base = par1Base;
            this.par1Limit = par1Limit;
            this.par2Base = par2Base;
            this.par2Limit = par2Limit;
            this.par3Base = par3Base;
            this.par3Limit = par3Limit;
        }
        MemoryManager.prototype.numPartitions = function () {
            return this.partitions.length;
        };
        MemoryManager.prototype.indexOfProgram = function (pid) {
            /*var current;
            for (var i = 0; i < this.numPartitions(); i++)
            {
                current = this.partitions[i];
                if (current[0] == pid)
                    return _Memory

            }*/
            return -1;
        };
        MemoryManager.prototype.toString = function () {
            return "***MEMORY MANAGER toString REACHED***";
        };
        return MemoryManager;
    }());
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
