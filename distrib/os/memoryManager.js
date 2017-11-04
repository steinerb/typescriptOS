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
        MemoryManager.prototype.init = function () {
            this.pidPartitions = new Array(3);
        };
        MemoryManager.prototype.numPartitions = function () {
            return this.pidPartitions.length;
        };
        MemoryManager.prototype.hasSpace = function () {
            for (var i = 0; i < this.numPartitions(); i++) {
                if ((typeof this.pidPartitions[i]) == 'undefined')
                    return true;
            }
            return false;
        };
        MemoryManager.prototype.nextAvailablePID = function () {
            for (var i = 0; i < this.numPartitions(); i++) {
                if ((typeof this.pidPartitions[i]) == 'undefined')
                    return i;
            }
            return -1;
        };
        MemoryManager.prototype.fillPartition = function () {
            this.pidPartitions[this.nextAvailablePID()] = this.nextAvailablePID();
        };
        MemoryManager.prototype.indexOfProgram = function (pid) {
            var current;
            for (var i = 0; i < this.numPartitions(); i++) {
                current = this.pidPartitions[i];
                if (current == pid)
                    return current * this.parLength;
            }
            return -1;
        };
        MemoryManager.prototype.programAtIndex = function (index) {
            var current;
            for (var currentPID = 0; currentPID < this.numPartitions(); currentPID++) {
                current = currentPID * this.parLength;
                if ((current == index) && ((typeof this.pidPartitions[currentPID]) != 'undefined'))
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
