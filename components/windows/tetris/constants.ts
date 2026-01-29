export const TETRIS_PIECES = [
    { id: 1, shape: [[1, 1, 1, 1]], color: "red", bgClass: "bg-red-600", borderClass: "border-red-600" }, // I-piece
    { id: 2, shape: [[1, 1], [1, 1]], color: "yellow", bgClass: "bg-yellow-500", borderClass: "border-yellow-500" }, // O-piece
    { id: 3, shape: [[0, 1, 0], [1, 1, 1]], color: "purple", bgClass: "bg-purple-600", borderClass: "border-purple-600" }, // T-piece
    { id: 4, shape: [[0, 1, 1], [1, 1, 0]], color: "green", bgClass: "bg-green-600", borderClass: "border-green-600" }, // S-piece
    { id: 5, shape: [[1, 1, 0], [0, 1, 1]], color: "blue", bgClass: "bg-blue-600", borderClass: "border-blue-600" }, // Z-piece
    { id: 6, shape: [[1, 0, 0], [1, 1, 1]], color: "orange", bgClass: "bg-orange-600", borderClass: "border-orange-600" }, // J-piece
    { id: 7, shape: [[0, 0, 1], [1, 1, 1]], color: "cyan", bgClass: "bg-cyan-600", borderClass: "border-cyan-600" }, // L-piece
];

export const BOARD_WIDTH = 6;
export const BOARD_HEIGHT = 12;

export type Board = number[][];
export type Piece = { id: number; shape: number[][]; color: string; bgClass: string; borderClass: string; x: number; y: number };
