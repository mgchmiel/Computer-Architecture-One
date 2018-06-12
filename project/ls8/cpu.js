/**
 * LS-8 v2.0 emulator skeleton code
 */
const operations = require('./operations.js')
/**
 * Class for simulating a simple Computer (CPU & memory)
 */
const mask = 5;
const status = 6;
const pointer= 7;
class CPU {

    /**
     * Initialize the CPU
     */
    constructor(ram) {
        this.ram = ram;

        this.reg = new Array(8).fill(0); // General-purpose registers R0-R7
        // Special-purpose registers
        this.FL_EQ = 0;
        this.FL_GT = 0;
        this. FL_LT = 0;
        this.PC = 0; // Program Counter
    }
    
    /**
     * Store value in memory address, useful for program loading
     */
    poke(address, value) {
        this.ram.write(address, value);
    }

    /**
     * Starts the clock ticking on the CPU
     */
    startClock() {
        this.clock = setInterval(() => {
            this.tick();
        }, 1); // 1 ms delay == 1 KHz clock == 0.000001 GHz
    }

    /**
     * Stops the clock
     */
    stopClock() {
        clearInterval(this.clock);
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
            case 'CMP':
            if (this.reg[regA] === this.reg[regB]) {
              this.FL_EQ = 1;
            } else if (this.reg[regA] < this.reg[regB]) {
              this.FL_LT = 4;
            } else {
              this.FL_GT = 2;
            }
            break;
    
          case 'MUL':
            this.reg[regA] *= this.reg[regB];
            break;
    
          case 'DIV':
            if (this.reg[regB] === 0) {
              console.log('Cant Divide By Zero');
              break;
            } else {
              this.reg[regA] /= this.reg[regB];
              break;
            }
    
          case 'SUB':
            this.reg[regA] -= this.reg[regB];
            break;
    
          case 'ADD':
            this.reg[regA] += this.reg[regB];
            break;
    
          case 'INC':
            this.reg[regA]++;
            break;
    
          case 'DEC':
            this.reg[regA]--;
            break;
        }
      }

    /**
     * Advances the CPU one cycle
     */
    tick() {
        // Load the instruction register (IR--can just be a local variable here)
        // from the memory address pointed to by the PC. (I.e. the PC holds the
        // index into memory of the instruction that's about to be executed
        // right now.)

        // !!! IMPLEMENT ME
        const IR = this.ram.mem[this.PC];
        // Debugging output
        //console.log(`${this.PC}: ${IR.toString(2)}`);

        // Get the two bytes in memory _after_ the PC in case the instruction
        // needs them.

        // !!! IMPLEMENT ME
        const operandA = this.ram.read(PC + 1);
        const operandB = this.ram.read(PC + 2);
        // Execute the instruction. Perform the actions for the instruction as
        // outlined in the LS-8 spec.

        // !!! IMPLEMENT ME
        switch(IR) {
            case 10011001:
                ram.write(operandA, operandB);
                break;
            
            default:
            console.log('error');
        }
        // Increment the PC register to go to the next instruction. Instructions
        // can be 1, 2, or 3 bytes long. Hint: the high 2 bits of the
        // instruction byte tells you how many bytes follow the instruction byte
        // for any particular instruction.
        
        // !!! IMPLEMENT ME
        this.PC = this.PC + parseInt(IR.slice(0, 2), 2);
    }
}

module.exports = CPU;
