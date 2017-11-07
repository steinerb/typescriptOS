var TSOS;
(function (TSOS) {
    var CPUScheduler = (function () {
        function CPUScheduler(ticks, quantum) {
            if (ticks === void 0) { ticks = 1; }
            if (quantum === void 0) { quantum = 6; }
            this.ticks = ticks;
            this.quantum = quantum;
        }
        CPUScheduler.prototype.quantumCyclesReached = function () {
            if (((this.ticks % this.quantum) == 0) && (this.ticks > 0))
                return true;
            return false;
        };
        return CPUScheduler;
    }());
    TSOS.CPUScheduler = CPUScheduler;
})(TSOS || (TSOS = {}));
