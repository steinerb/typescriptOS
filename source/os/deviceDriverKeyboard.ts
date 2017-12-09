///<reference path="../globals.ts" />
///<reference path="deviceDriver.ts" />

/* ----------------------------------
   DeviceDriverKeyboard.ts

   Requires deviceDriver.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */

module TSOS 
{

    // Extends DeviceDriver
    export class DeviceDriverKeyboard extends DeviceDriver 
    {

        constructor() 
        {
            // Override the base method pointers.

            // The code below cannot run because "this" can only be
            // accessed after calling super.
            super();
            this.driverEntry = this.krnKbdDriverEntry;
            this.isr = this.krnKbdDispatchKeyPress;
        }

        public krnKbdDriverEntry() 
        {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
            // More?
        }

        public krnKbdDispatchKeyPress(params) 
        {
            // Parse the params.    TODO: Check that the params are valid and osTrapError if not.
            var keyCode = params[0];
            var isShifted = params[1];
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            var chr = "";
            // Check to see if we even want to deal with the key that was pressed.
            if (((keyCode >= 65) && (keyCode <= 90)) ||   		// A..Z
                ((keyCode >= 97) && (keyCode <= 123))) 
            {  // a..z {
                // Determine the character we want to display.
                // Assume it's lowercase...
                chr = String.fromCharCode(keyCode + 32);
                // ... then check the shift key and re-adjust if necessary.
                if (isShifted) 
                    chr = String.fromCharCode(keyCode);
                // TODO: Check for caps-lock and handle as shifted if so.
                _KernelInputQueue.enqueue(chr);
            } 
            else if (keyCode == 48)							// 0 )
            {
            	if(isShifted)
            		chr = String.fromCharCode(41);
            	else
            		chr = String.fromCharCode(48);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 49)								// 1 !
            {
            	if(isShifted)
            		chr = String.fromCharCode(33);
            	else
            		chr = String.fromCharCode(49);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 50)								// 2 @ 
            {
            	if(isShifted)
            		chr = String.fromCharCode(40);
            	else
            		chr = String.fromCharCode(50);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 51)								// 3 #
            {
            	if(isShifted)
            		chr = String.fromCharCode(35);
            	else
            		chr = String.fromCharCode(51);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 52)								// 4 $
            {
            	if(isShifted)
            		chr = String.fromCharCode(36);
            	else
            		chr = String.fromCharCode(52);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 53)								// 5 %
            {
            	if(isShifted)
            		chr = String.fromCharCode(37);
            	else
            		chr = String.fromCharCode(53);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 54)								// 6 ^
            {
            	if(isShifted)
            		chr = String.fromCharCode(94);
            	else
            		chr = String.fromCharCode(54);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 55)								// 7 &
            {
            	if(isShifted)
            		chr = String.fromCharCode(38);
            	else
            		chr = String.fromCharCode(55);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 56)								// 8 *
            {
            	if(isShifted)
            		chr = String.fromCharCode(42);
            	else
            		chr = String.fromCharCode(56);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 57)								// 9 (
            {
            	if(isShifted)
            		chr = String.fromCharCode(40);
            	else
            		chr = String.fromCharCode(57);
                _KernelInputQueue.enqueue(chr);
            }
            else if ((keyCode == 32)                      ||    // space
                      (keyCode == 8)					  ||	// backspace						
                      (keyCode == 9)					  ||	// tab
                      (keyCode == 38)					  ||	// up												
                      (keyCode == 40)					  ||	// down												      												
                      (keyCode == 13))                          // enter
            {                       
                chr = String.fromCharCode(keyCode);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 188)							// , <
            {
            	if(isShifted)
            		chr = String.fromCharCode(60);
            	else
            		chr = String.fromCharCode(44);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 190)							// . >
            {
            	if(isShifted)
            		chr = String.fromCharCode(62);
            	else
            		chr = String.fromCharCode(46);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 191)							// / ?
            {
            	if(isShifted)
            		chr = String.fromCharCode(63);
            	else
            		chr = String.fromCharCode(47);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 219)							// [ {
            {
            	if(isShifted)
            		chr = String.fromCharCode(123);
            	else
            		chr = String.fromCharCode(91);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 221)							// [ }
            {
            	if(isShifted)
            		chr = String.fromCharCode(125);
            	else
            		chr = String.fromCharCode(93);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 220)							// \ |
            {
            	if(isShifted)
            		chr = String.fromCharCode(124);
            	else
            		chr = String.fromCharCode(92);
                _KernelInputQueue.enqueue(chr);
            }

            //BELOW ARE NOT WORKING!!!
            else if (keyCode == 186)							// ; :
            {
            	if(isShifted)
            		chr = String.fromCharCode(58);
            	else
            		chr = String.fromCharCode(59);
                _KernelInputQueue.enqueue(chr);
            }
            else if (keyCode == 192)							// ' "
            {
            	if(isShifted)
            		chr = String.fromCharCode(34);
            	else
            		chr = String.fromCharCode(39);
                _KernelInputQueue.enqueue(chr);
            }
        }


    }
}
