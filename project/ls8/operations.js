const operations = {
    ADD: 0b10101000, // ALU op
    AND: 0b10110011, // bitwise-AND
    CALL: 0b01001000,
    CMP: 0b10100000, // ALU op
    DEC: 0b01111001, // ALU op
    DIV: 0b10101011, // ALU op
    HLT: 0b00000001,
    INC: 0b01111000, // ALU op
    INT: 0b01001010,
    IRET: 0b00001011,
    JEQ: 0b01010001, // uses flag
    JGT: 0b01010100, // uses flag
    JLT: 0b01010011, // uses flag
    JMP: 0b01010000, // sets PC explicitly
    JNE: 0b01010010, // uses flag
    LD: 0b10011000,
    LDI: 0b10011001,
    MOD: 0b10101100, // ALU op
    MUL: 0b10101010, // ALU op
    NOP: 0b00000000,
    NOT: 0b01110000,
    OR: 0b10110001,
    POP: 0b01001100,
    PRA: 0b01000010,
    PRN: 0b01000011,
    PUSH: 0b01001101,
    RET: 0b00001001,
    ST: 0b10011010,
    SUB: 0b10101001, // ALU op
    XOR: 0b10110010,
  };
  module.exports = operations;