var TSOS;
(function (TSOS) {
    var MemoryManager = (function () {
        function MemoryManager(pidPartitions, parLength) {
            if (pidPartitions === void 0) { pidPartitions = new Array(3); }
            if (parLength === void 0) { parLength = 256; }
            this.pidPartitions = pidPartitions;
            this.parLength = parLength;
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
        MemoryManager.prototype.nextAvailablePartition = function () {
            for (var i = 0; i < this.numPartitions(); i++) {
                if ((typeof this.pidPartitions[i]) == 'undefined')
                    return i;
            }
            return -1;
        };
        MemoryManager.prototype.fillPartition = function (pid) {
            this.pidPartitions[this.nextAvailablePartition()] = pid;
        };
        MemoryManager.prototype.wipePartition = function (parNum) {
            this.pidPartitions[parNum] = undefined;
        };
        MemoryManager.prototype.indexOfProgram = function (pid) {
            var currentPID;
            for (var currentPar = 0; currentPar < this.numPartitions(); currentPar++) {
                currentPID = this.pidPartitions[currentPar];
                if (currentPID == pid)
                    return currentPar * this.parLength;
            }
            return -1;
        };
        MemoryManager.prototype.partitionOfProgram = function (desiredPID) {
            var currentPID;
            for (var currentPar = 0; currentPar < this.numPartitions(); currentPar++) {
                currentPID = this.pidPartitions[currentPar];
                if (currentPID == desiredPID)
                    return currentPar;
            }
            return -1;
        };
        MemoryManager.prototype.programAtIndex = function (desiredIndex) {
            var currentIndex;
            for (var currentPartition = 0; currentPartition < this.numPartitions(); currentPartition++) {
                currentIndex = currentPartition * this.parLength;
                if ((currentIndex == desiredIndex) && ((typeof this.pidPartitions[currentPartition]) != 'undefined'))
                    return this.pidPartitions[currentPartition];
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
