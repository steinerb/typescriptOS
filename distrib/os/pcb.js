var TSOS;
(function (TSOS) {
    var Pcb = (function () {
        //most flexible constructor
        function Pcb(state, pid, PC, Acc, Xreg, Yreg, Zflag, base, limit, priority, location) {
            this.state = state;
            this.pid = pid;
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.base = base;
            this.limit = limit;
            this.priority = priority;
            this.location = location;
            this.state = state;
            this.pid = pid;
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.base = base;
            this.limit = limit;
            this.priority = priority;
            this.location = location;
        }
        Pcb.prototype.helloWorld = function () {
            _StdOut.putText("Hello World! Love, a pcb");
        };
        Pcb.prototype.toString = function () {
            var toReturn = "";
            toReturn += ("|state:\t" + this.state + "\t");
            toReturn += ("|pc:\t" + this.PC.toString(16).toUpperCase() + "\t");
            toReturn += ("|acc:\t" + this.Acc.toString(16).toUpperCase() + "\t");
            toReturn += ("|x:\t" + this.Xreg.toString(16).toUpperCase() + "\t");
            toReturn += ("|y:\t" + this.Yreg.toString(16).toUpperCase() + "\t");
            toReturn += ("|z:\t" + this.Zflag + "\t|");
            return toReturn;
        };
        return Pcb;
    }());
    TSOS.Pcb = Pcb;
})(TSOS || (TSOS = {}));
