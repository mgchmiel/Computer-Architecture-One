const RAM = require('./ram');
const CPU = require('./cpu');
const fs = require('fs');

/**
 * Load an LS8 program into memory
 *
 * TODO: load this from a file on disk instead of having it hardcoded
 */
function loadMemory() {
    const prog = [];
    const filename = process.argv[2];
    const file = fs.readFileSync(filename, 'utf8');
    file.split(/[\r\n]+/g).forEach(x => {
        const op = x.split(' ')[0];
        if(op.length === 8) prog.push(op);
    });
    for (let i = 0; i < prog.length; i++) {
        cpu.poke(i, parseInt(prog[i], 2));
    }
} 
/**
 * Main
 */

let ram = new RAM(256);
let cpu = new CPU(ram);

// TODO: get name of ls8 file to load from command line
loadMemory(cpu);

cpu.startClock();