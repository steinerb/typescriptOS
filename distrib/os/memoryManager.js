var TSOS;
(function (TSOS) {
    var MemoryManager = (function () {
        function MemoryManager(partitions) {
            if (partitions === void 0) { partitions = new Array(3); }
            this.partitions = partitions;
        }
        MemoryManager.prototype.toString = function () {
            return "***MEMORY MANAGER toString REACHED***";
        };
        return MemoryManager;
    }());
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
