///<reference path="../globals.ts" />
///<reference path="deviceDriver.ts" />

module TSOS 
{

    // Extends DeviceDriver
    export class DeviceDriverFileSystem extends DeviceDriver 
    {
    	constructor() 
        {
            // Override the base method pointers.

            // The code below cannot run because "this" can only be
            // accessed after calling super.
            //super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            super();
            this.driverEntry = this.krnFileSystemDriverEntry;
            this.isr = this.testISR;
        }

        public krnFileSystemDriverEntry() 
        {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        }

        public testISR()
        {

        }
    }
}