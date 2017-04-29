export type Note = "Ab" | "A" | "Bb" | "B" | "C" | "C#" | "D" | "Eb" | "E" | "F" | "F#" | "G";
export enum Mode {
    "Ionian" = 1,
    "Dorian" = 2,
    "Phrygian" = 3,
    "Lydian" = 4,
    "Mixolydian" = 5,
    "Aeolian" = 6,
    "Locrian" = 7
}
export type Key = [Note, Mode];
export type BPM = number;
export type MusicInfo = [Key, BPM];

const Gm: Key = ["G", 6];
const Cm: Key = ["C", 6];

export interface SongInfo {
    title: string,
    artist: string,
    tempo: number,
    key: Key,
}
const song = (artist, title, key, tempo) => ({ artist, title, key, tempo }) as SongInfo;

export const songs = {
    "4GCIL6eW6MffcDcwUdCZjY": song("Oliver Heldens", "Ghost", Gm, 128),
    "0g1YVKknDCpMiW9U3m5aFo": song("Pink is Punk", "Ghost", Gm, 128),
    "19u20B0E3KO1copzKVSJxi": song("Knife Party", "Begin Again", Cm, 128),
    "0nI4R9kxFj7yYhM0siYEq2": song("Puppet", "The Fire", Cm, 128),
};


export interface Transition {
    from: keyof (typeof songs);
    to: keyof (typeof songs);
    start: number,
    offset: number,
    bass: number
};

const trans = (from: keyof (typeof songs), to: keyof (typeof songs), start, offset, bass) => ({ from, to, start, offset, bass }) as Transition;


export const transitions: Transition[] = [
    trans("19u20B0E3KO1copzKVSJxi", "0nI4R9kxFj7yYhM0siYEq2", 260.9933, 0, 315.4780),
    trans("4GCIL6eW6MffcDcwUdCZjY", "0g1YVKknDCpMiW9U3m5aFo", 180.3804, 0, 211.3237),
];