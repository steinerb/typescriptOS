var TSOS;
(function (TSOS) {
    var CPUScheduler = (function () {
        function CPUScheduler(ticks, quantam) {
            if (ticks === void 0) { ticks = 0; }
            if (quantam === void 0) { quantam = 6; }
            this.ticks = ticks;
            this.quantam = quantam;
        }
        return CPUScheduler;
    }());
    TSOS.CPUScheduler = CPUScheduler;
})(TSOS || (TSOS = {}));
