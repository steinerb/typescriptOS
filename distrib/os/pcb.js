var TSOS;
(function (TSOS) {
    var Pcb = (function () {
        //most flexible constructor
        function Pcb(state, pid, PC, Acc, Xreg, Yreg, Zflag) {
            this.state = state;
            this.pid = pid;
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.state = state;
            this.pid = pid;
            this.PC = PC;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
        }
        Pcb.prototype.helloWorld = function () {
            _StdOut.putText("Hello World! Love, a pcb");
        };
        Pcb.prototype.toString = function () {
            var toReturn = "";
            toReturn += ("|state: " + this.state);
            toReturn += ("|pc:    " + String(this.PC));
            toReturn += ("|acc:   " + String(this.Acc));
            toReturn += ("|x:     " + String(this.Xreg));
            toReturn += ("|y:     " + String(this.Yreg));
            toReturn += ("|z:     " + String(this.Zflag) + "|");
        };
        return Pcb;
    }());
    TSOS.Pcb = Pcb;
})(TSOS || (TSOS = {}));
