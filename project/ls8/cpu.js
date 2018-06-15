/**
 * LS-8 v2.0 emulator skeleton code
 */

//(NOTE: case numbers written in binary when '0b' in front)
//LDI register immediate 
const LDI = 0b10011001;
const PRN = 0b01000011;
const HLT = 0b00000001;
const MUL = 0b10101010;
const PUSH = 0b01001101;
const POP = 0b01001100;
const CALL = 0b01001000;
const RET = 0b00001001;
const ADD = 0b10101000;
const SUB = 0b10101001;
const DIV = 0b10101011;
const ST = 0b10011010;
const PRA = 0b01000010;
const IRET = 0b00001011;
const JMP = 0b01010000;

const SP = 7;

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
        this.FL = 0;
        this.reg[SP] = 0xF4;
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
            this.tick() }, 1); // 1 ms delay == 1 KHz clock == 0.000001 GHz
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
            case 'MUL':
                // !!! IMPLEMENT ME
                this.reg[regA] *= this.reg[regB];
                break;

            case "DIV":
                if (this.reg[regB] === 0) this.stopClock();
                else this.reg[regA] /= this.reg[regB];
                break;

            case "ADD":
                this.reg[regA] += this.reg[regB];
                break;

            case "SUB": 
                this.reg[regA] -= this.reg[regB];
                break;

            case "INC":
                this.reg[regA] += 1;
                break;

            case "DEC":
                this.reg[regA] -= 1;
                break;

            case 'CMP':
                if (regA === regB) this.FL = this.HLT;
                if (regA < regB) this.FL = this.LDI;
                if (regA > regB) this.FL = this.PRN;
              break;

            default:
                console.log("Error");
                this.stopClock();
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
        // let increment = true;
        const IR = this.ram.read(this.PC);

        // Debugging output

        // Get the two bytes in memory _after_ the PC in case the instruction
        // needs them.

        // !!! IMPLEMENT ME
        const operandA = this.ram.read(this.PC + 1);
        const operandB = this.ram.read(this.PC + 2);

        // Execute the instruction. Perform the actions for the instruction as
        // outlined in the LS-8 spec.

        let advance = true;

        // !!! IMPLEMENT ME 
        switch(IR) {
            case LDI: 
                this.reg[operandA] = operandB;
                break;

            case PRN:
                console.log(this.reg[operandA]);
                break;

            case HLT:
                this.stopClock();
                // this.PC += 1;
                break;

            case MUL:
                this.alu("MUL", operandA, operandB);
                break;

            case PUSH:
                this.reg[SP]--;
                this.ram.write(this.reg[SP], this.reg[operandA]);
                break;

            case POP:    
                this.reg[operandA] = this.ram.read(this.reg[SP]);
                this.reg[SP]++;
                break;

            case CALL: 
                this.reg[SP]--;
                this.ram.write(this.reg[SP], this.PC + 2);
                this.PC = this.reg[operandA];
                advance = false;
                break;

            case RET: 
                this.PC = this.ram.read(this.reg[SP]);
                this.reg[SP]++;
                advance = false;
                break;

            case ADD: 
                this.alu("ADD", operandA, operandB);
                break;

            case DIV: 
                this.alu("DIV", operandA, operandB); 
                break;

            case SUB: 
                this.alu("SUB", operandA, operandB); 
                break;

            case ST:
                this.ram.write(this.reg[reg1], this.reg[reg2]);
                break;

            case PRA:
                console.log(String.fromCharCode(this.reg[register]));
                break;

            case IRET:
                this.PC = this.popState()
                this.interruptsEnabled = true;
                break;

            case JMP:
                this.PC = this.reg[register];
                break;

            case JEQ:
                if (this.FL === 1) {
                  this.PC = this.reg[operandA];
                } else {
                  this.PC += 2;
                }
                break;
        
            case JNE:
                if (this.FL === 0) {
                  this.PC = this.reg[operandA];
                } else {
                  this.PC += 2;
                }
                break;
                
            default:
                console.log("Error" + IR.toString(2));
                this.stopClock();
                return;
        }

        // Increment the PC register to go to the next instruction. Instructions
        // can be 1, 2, or 3 bytes long. Hint: the high 2 bits of the
        // instruction byte tells you how many bytes follow the instruction byte
        // for any particular instruction.

        // !!! IMPLEMENT ME
        if (advance) this.PC += (IR >> 6) + 1;
        }
    }

module.exports = CPU;