importScripts(
    './data/levelstats.min.js',
    './data/talents.min.js',
    './classes/player.min.js',
    './classes/simulation.min.js',
    './classes/weapon.min.js',
    './globals.min.js',
);

onmessage = (event) => {
    const params = event.data;
    if (params.globals.turtle) {
        importScripts('./data/spells_turtle.min.js');
        importScripts('./data/buffs_turtle.min.js');
        importScripts('./classes/spell_turtle.min.js');
    } else {
        importScripts('./data/spells.min.js');
        importScripts('./data/buffs.min.js');
        importScripts('./classes/spell.min.js');
    }
    if (params.globals.turtle || params.globals.turtleclassic) importScripts('./data/gear_turtle.min.js','./data/enchants_turtle.min.js'); else
    if (params.globals.sod) importScripts('./data/gear_sod.min.js','./data/runes.min.js');
    else importScripts('./data/gear.min.js');
    updateGlobals(params.globals);
    const player = new Player(...params.player);
    const sim = new Simulation(player, (report) => {
        // Finished
        if (params.fullReport) {
            report.player = player.serializeStats();
            report.spread = sim.spread;
        }
        postMessage([TYPE.FINISHED, report]);
    }, (iteration, report) => {
        // Update
        postMessage([TYPE.UPDATE, iteration, report]);
    }, params.sim);
    sim.startSync();
};

