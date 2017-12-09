var TSOS;
(function (TSOS) {
    var StorageManager = (function () {
        function StorageManager(pidPartitions, parLength) {
            if (pidPartitions === void 0) { pidPartitions = new Array(3); }
            if (parLength === void 0) { parLength = 256; }
            this.pidPartitions = pidPartitions;
            this.parLength = parLength;
        }
        StorageManager.prototype.init = function () {
            this.pidPartitions = new Array(3);
        };
        StorageManager.prototype.numPartitions = function () {
            return this.pidPartitions.length;
        };
        StorageManager.prototype.hasSpace = function () {
            for (var i = 0; i < this.numPartitions(); i++) {
                if ((typeof this.pidPartitions[i]) == 'undefined')
                    return true;
            }
            return false;
        };
        StorageManager.prototype.nextAvailablePartition = function () {
            for (var i = 0; i < this.numPartitions(); i++) {
                if ((typeof this.pidPartitions[i]) == 'undefined')
                    return i;
            }
            return -1;
        };
        StorageManager.prototype.fillPartition = function (pid) {
            this.pidPartitions[this.nextAvailablePartition()] = pid;
        };
        StorageManager.prototype.wipePartition = function (parNum) {
            this.pidPartitions[parNum] = undefined;
        };
        StorageManager.prototype.indexOfProgram = function (pid) {
            var currentPID;
            for (var currentPar = 0; currentPar < this.numPartitions(); currentPar++) {
                currentPID = this.pidPartitions[currentPar];
                if (currentPID == pid)
                    return currentPar * this.parLength;
            }
            return -1;
        };
        StorageManager.prototype.partitionOfProgram = function (desiredPID) {
            var currentPID;
            for (var currentPar = 0; currentPar < this.numPartitions(); currentPar++) {
                currentPID = this.pidPartitions[currentPar];
                if (currentPID == desiredPID)
                    return currentPar;
            }
            return -1;
        };
        StorageManager.prototype.programAtIndex = function (desiredIndex) {
            var currentIndex;
            for (var currentPartition = 0; currentPartition < this.numPartitions(); currentPartition++) {
                currentIndex = currentPartition * this.parLength;
                if ((currentIndex == desiredIndex) && ((typeof this.pidPartitions[currentPartition]) != 'undefined'))
                    return this.pidPartitions[currentPartition];
            }
            return -1;
        };
        StorageManager.prototype.toString = function () {
            return "***MEMORY MANAGER toString REACHED***";
        };
        return StorageManager;
    }());
    TSOS.StorageManager = StorageManager;
})(TSOS || (TSOS = {}));
