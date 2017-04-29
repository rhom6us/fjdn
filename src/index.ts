import { transitions, songs } from './data';


const song1toSong2TransitionData = {
    startTime: 72.556, //seconds
    skipBeginning: 45.824, //seconds
}

const context = new AudioContext();

const makeHpFilter = (count) => {
    const nodes: BiquadFilterNode[] = [1, 2, 3, 4, 5].slice(5 - count).map(_ => {
        const node = context.createBiquadFilter();
        node.type = "highpass";
        node.frequency.value = 300;
        return node;
    });

    return {
        input: nodes[0],
        output: nodes.reduce((seed, current) => seed.connect(current) as BiquadFilterNode),
        setValueAtTime(value: number, startTime: number) {
            nodes.forEach(n => n.frequency.setValueAtTime(value, startTime))
        }
    }
}

const makeBassCut = () => {
    const hp24 = makeHpFilter(2);
    const enable = startTime => hp24.setValueAtTime(300, startTime);
    const disable = startTime => hp24.setValueAtTime(0, startTime);
    return {
        input: hp24.input,
        output: hp24.output,
        enable, disable
    }
};

const loadSong = (id: string) => fetch(`https://fuckingdj.blob.core.windows.net/spotify/${id}.mp3`)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => context.decodeAudioData(arrayBuffer))
    .then(audioBuffer => {
        const sourceNode = context.createBufferSource();
        sourceNode.buffer = audioBuffer;



        const highPassNode = makeBassCut();

        const gainNode = context.createGain();
        gainNode.gain.value = 0.5;

        sourceNode.connect(highPassNode.input);
        highPassNode.output.connect(gainNode)
        .connect(context.destination);


        return {
            //anchorTime: NaN,
            start(startTime = 0, offset = 0) {
                const now = context.currentTime;
                const start = Math.max(now, startTime);
                console.debug('starting at', start);
                sourceNode.start(start, offset);
                return start;
            },
            enableBass(startTime = 0){
                highPassNode.disable(startTime);
            },
            disableBass(startTime = 0){
                highPassNode.enable(startTime);
            }
        };
    })

const [transition] = transitions.map(t => {
    const song1 = {
        load(){
            return loadSong(t.from)
        },
        tempo: songs[t.from].tempo
    };
    const song2 = {
        load(){
            return loadSong(t.to)
        },
        tempo: songs[t.to].tempo
    };
    //const ready = Promise.all([song1.node, song2.node]).then([song1,song2] => )
    return { 
        song1, 
        song2,
        start: t.start,
        offset: t.offset,
        bass: t.bass,
     };
});

const DEBUG_SKIP = 0;//transition.start - 5;

transition.song1.load().then(node1 => {
        log("***node1***");
    const song1StartTime = node1.start(0,DEBUG_SKIP);
    log(song1StartTime);
    node1.enableBass();
    const begin = context.currentTime;
    transition.song2.load().then(node2 => {
        const requestedSong2StartTime = song1StartTime+transition.start-DEBUG_SKIP;
        const actualSong2StartTime = node2.start(requestedSong2StartTime, transition.offset);
        
        
        const theoreticalSong1StartTime = actualSong2StartTime - transition.start;
        const bassTime = theoreticalSong1StartTime+transition.bass;
        log( {song1StartTime,requestedSong2StartTime, actualSong2StartTime, theoreticalSong1StartTime, bassTime});

        node2.enableBass(bassTime);
        node1.disableBass(bassTime);
    })
});

interface MN {
    start(startTime?:number, offset?: number);
    enableBass(startTime:number);
    disableBass(startTime:number);
}

const scheduleSong = (anchorTime: number, node:MN, startTime=0,offset=0,focus=0) => {
    startTime = node.start(anchorTime + startTime, offset);
    node.enableBass(startTime + focus);
};

function log<T>(val:T, ...args:any[]):T {
    console.log.apply(console, arguments);
    return val;
}