var TSOS;
(function (TSOS) {
    var MemoryManager = (function () {
        function MemoryManager(pidPartitions, parLength, par1Base, par1Limit, par2Base, par2Limit, par3Base, par3Limit) {
            if (pidPartitions === void 0) { pidPartitions = new Array(3); }
            if (parLength === void 0) { parLength = 256; }
            if (par1Base === void 0) { par1Base = 0; }
            if (par1Limit === void 0) { par1Limit = 255; }
            if (par2Base === void 0) { par2Base = 256; }
            if (par2Limit === void 0) { par2Limit = 511; }
            if (par3Base === void 0) { par3Base = 512; }
            if (par3Limit === void 0) { par3Limit = 767; }
            this.pidPartitions = pidPartitions;
            this.parLength = parLength;
            this.par1Base = par1Base;
            this.par1Limit = par1Limit;
            this.par2Base = par2Base;
            this.par2Limit = par2Limit;
            this.par3Base = par3Base;
            this.par3Limit = par3Limit;
        }
        MemoryManager.prototype.numPartitions = function () {
            return this.pidPartitions.length;
        };
        MemoryManager.prototype.indexOfProgram = function (pid) {
            var current;
            for (var i = 0; i < this.numPartitions(); i++) {
                current = this.pidPartitions[i];
                if (current == pid)
                    return (current - 1) * this.parLength;
            }
            return -1;
        };
        MemoryManager.prototype.programAtIndex = function (index) {
            var current;
            var currentPID;
            for (var i = 0; i < this.numPartitions(); i++) {
                currentPID = i + 1;
                current = i * this.parLength;
                if ((current == index) && ((typeof this.pidPartitions[i]) != 'undefined'))
                    return currentPID;
            }
            return -1;
        };
        MemoryManager.prototype.toString = function () {
            return "***MEMORY MANAGER toString REACHED***";
        };
        return MemoryManager;
    }());
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
