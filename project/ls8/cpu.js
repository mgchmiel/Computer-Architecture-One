/**
 * LS-8 v2.0 emulator skeleton code
 */
const operations = require('./operations.js')

// Indices of registers reserved by the cpu
const IM = 5
const IS = 6
const SP = 7

/**
 * Class for simulating a simple Computer (CPU & memory)
 */
class CPU {

    /**
     * Initialize the CPU
     */
    constructor(ram) {
        this.ram = ram;
        this.reg = new Array(8).fill(0); // General-purpose registers R0-R7
        // Special-purpose registers
        this.PC = 0; // Program Counter
        this.FL = 0; // Flags
        this.reg[SP] = 0xf3 // Initialize stack pointer
        this.interruptsEnabled = true
    }
    
    /**
     * Store value in memory address, useful for program loading
     */
    poke(address, value) {
        this.ram.write(address, value)
    }

    /**
     * Starts the clock ticking on the CPU
     */
    startClock() {
        // Every millisecond, perform one cpu cycle
        this.clock = setInterval(() => {
            this.tick()
        }, 1) // 1 ms delay == 1 KHz clock == 0.000001 GHz

        // Fire the timer interrupt
        // Every second, set the 0th bit of the Interrupt status to 1
        this.timer = setInterval(() => {
            this.reg[IS] |= 1
        }, 1000)
    }

    /**
     * Stops the clock
     */
    stopClock() {
        clearInterval(this.clock)
        clearInterval(this.timer)
    }

    /**
     * ALU functionality
     *
     * The ALU is responsible for math and comparisons.
     *
     * If you have an instruction that does math, i.e. MUL, the CPU would hand
     * it off to it's internal ALU component to do the actual work.
     *
     * op can be: ADD SUB MUL DIV INC DEC CMP
     */
    alu(op, regA, regB) {
        switch (op) {
            case 'ADD':
                return this.reg[regA] + this.reg[regB] & 0xff;
            case 'SUB':
                return this.reg[regA] - this.reg[regB] & 0xff
            case 'MUL':
                return this.reg[regA] * this.reg[regB] & 0xff
            case 'DIV':
                if (regB === 0) {
                    console.log('Error: Can Not Divide By 0')
                    this.HLT()
                }
                return Math.floor(this.reg[regA] / this.reg[regB]) & 0xff
            case 'INC':
                return this.reg[regA] + 1 & 0xff
            case 'DEC':
                return this.reg[regA] - 1 & 0xff
            case 'CMP':
                if (regA === regB) this.FL = this.HLT;
                if (regA < regB) this.FL = this.LDI;
                if (regA > regB) this.FL = this.PRN;
              break;
                // Set the FL register flags based on comparison
        }
    }

    /**
     * Advances the CPU one cycle
     */
    tick() {
        // Interrupt handling - prior to instruction fetch, check the Interrupt Mask
        // against the Interrupt Status to see if any desired interrupts occurred.
        // If so, suspend the current state by pushing to the stack, and change PC
        // to the location of the handler for the interrupt

        let interrupts = this.reg[IM] & this.reg[IS]
        for (let i = 0; i < 8; i++) {
            if ((interrupts >> i) & 1) {
                this.pushState()
                this.interruptsEnabled = false
                this.reg[IS] &= ~(1 << i)
                this.PC = this.ram.read(0xf8 + i)
                break
            }
        }

        // Load the instruction register (IR--can just be a local variable here)
        // from the memory address pointed to by the PC. (I.e. the PC holds the
        // index into memory of the instruction that's about to be executed
        // right now.)

        const IR = this.ram.read(this.PC)

        // Debugging output
        // console.log(`${this.PC}: ${IR.toString(2)}`);

        // Get the two bytes in memory _after_ the PC in case the instruction
        // needs them.

        const operandA = this.ram.read(this.PC + 1)
        const operandB = this.ram.read(this.PC + 2)

        // Execute the instruction. Perform the actions for the instruction as
        // outlined in the LS-8 spec.

        const operations = operations[IR]
        this[operations](operandA, operandB)

        // Increment the PC register to go to the next instruction. Instructions
        // can be 1, 2, or 3 bytes long. Hint: the high 2 bits of the
        // instruction byte tells you how many bytes follow the instruction byte
        // for any particular instruction.
        
        // Implement the PC unless the instruction was CALL or JMP
        if (!['CALL', 'JMP', 'RET'].includes(operations)) {
            // Increment PC by 1 + the value of the two leftmost bits of the instruction
            this.PC += (IR >> 6) + 1
        }
        // console.log(`new PC: ${this.PC}`)
    }

    LDI(register, immediate) {
        this.reg[register] = immediate
    }

    ST(reg1, reg2) {
        this.ram.write(this.reg[reg1], this.reg[reg2])
    }
    PRA(register) {
        console.log(String.fromCharCode(this.reg[register]))
    }
    PRN(register) {
        console.log(this.reg[register])
    }
    ADD(reg1, reg2) {
        this.reg[reg1] = this.alu('ADD', reg1, reg2)
    }

    MUL(reg1, reg2) {
        this.reg[reg1] = this.alu('MUL', reg1, reg2)
    }
    HLT() {
        console.log('registers: ', this.reg)
        this.stopClock()
    }
    PUSH(register) {
        this.push(this.reg[register])
    }
    POP(register) {
        this.reg[register] = this.pop()
    }
    CALL(register) {
        this.push(this.PC + 2)
        this.PC = this.reg[register]
    }
    RET() {
        this.PC = this.pop()
    }
    IRET() {
        this.PC = this.popState()
        this.interruptsEnabled = true
    }
    JMP(register) {
        this.PC = this.reg[register]
    }

    NOP() {

    }
    
    //
    //  Internal methods
    //

    // Get a new stack frame and write the provided value
    push(value) {
        this.reg[SP]--
        this.ram.write(this.reg[SP], value)
    }

    // Discard the current stack frame and return its value
    pop() {
        const value = this.ram.read(this.reg[SP])
        this.reg[SP]++
        return value
    }
    
    // Push all registers onto the stack in preparation for an interrupt
    pushState() {
        this.push(this.PC)
        this.push(this.FL)
        for (let i = 0; i < 7; i++) {
            this._push(this.reg[i])
        }
    }

    // Recover registers from the stack after an interrupt
    popState() {
        for (let i = 6; i >= 0; i--) {
            this.reg[i] = this.pop()
        }
        this.FL = this.pop()
        return this.pop()
    }
}

module.exports = CPU;
