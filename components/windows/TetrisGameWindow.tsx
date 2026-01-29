"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";

// function spanToClasses(span?: Span): string {
//   if (!span) return "";
//   const cls: string[] = [];
//   if (span.cols === 1) cls.push("col-span-1");
//   if (span.cols === 2) cls.push("col-span-2");
//   if (span.cols === 3) cls.push("col-span-3");
//   if (span.rows === 1) cls.push("row-span-1");
//   if (span.rows === 2) cls.push("row-span-2");
//   if (span.rows === 3) cls.push("row-span-3");
//   if (span.rows === 4) cls.push("row-span-4");
//   return cls.join(" ");
// }

import { TETRIS_PIECES, BOARD_WIDTH, BOARD_HEIGHT, type Board, type Piece } from "./tetris/constants";

export default function TetrisGameWindow() {
  const [board, setBoard] = useState<Board>(() =>
    Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0))
  );
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);
  const [nextPiece, setNextPiece] = useState<Piece | null>(null);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'paused' | 'over'>('idle');

  // Generate random piece
  const generatePiece = useCallback((): Piece => {
    const pieceIndex = Math.floor(Math.random() * TETRIS_PIECES.length);
    const piece = TETRIS_PIECES[pieceIndex];
    return {
      ...piece,
      x: Math.floor(BOARD_WIDTH / 2) - Math.floor(piece.shape[0].length / 2),
      y: 0,
    };
  }, []);

  // Check if piece can be placed at position
  const canPlacePiece = useCallback((piece: Piece, newX: number, newY: number): boolean => {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const boardX = newX + x;
          const boardY = newY + y;

          if (boardX < 0 || boardX >= BOARD_WIDTH || boardY >= BOARD_HEIGHT) {
            return false;
          }

          if (boardY >= 0 && board[boardY][boardX] > 0) {
            return false;
          }
        }
      }
    }
    return true;
  }, [board]);

  // Move piece down
  const dropPiece = useCallback(() => {
    if (!currentPiece || !nextPiece || gameState === 'over') return;

    if (canPlacePiece(currentPiece, currentPiece.x, currentPiece.y + 1)) {
      setCurrentPiece(prev => prev ? { ...prev, y: prev.y + 1 } : null);
    } else {
      // Place piece and clear lines in one state update
      setBoard(prevBoard => {
        const newBoard = prevBoard.map(row => [...row]);
        const pieceIndex = currentPiece.id;

        // Place the piece
        for (let y = 0; y < currentPiece.shape.length; y++) {
          for (let x = 0; x < currentPiece.shape[y].length; x++) {
            if (currentPiece.shape[y][x]) {
              const boardY = currentPiece.y + y;
              const boardX = currentPiece.x + x;
              if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
                newBoard[boardY][boardX] = pieceIndex;
              }
            }
          }
        }

        // Clear completed lines
        let linesCleared = 0;
        const filteredBoard = newBoard.filter(row => {
          if (row.every(cell => cell > 0)) {
            linesCleared++;
            return false;
          }
          return true;
        });

        // Add empty rows at top
        while (filteredBoard.length < BOARD_HEIGHT) {
          filteredBoard.unshift(Array(BOARD_WIDTH).fill(0));
        }

        // Update score if lines were cleared
        if (linesCleared > 0) {
          const scoreMap = [0, 100, 300, 500, 800];
          setScore(prev => prev + (scoreMap[linesCleared] || linesCleared * 100));
        }

        return filteredBoard;
      });

      // Use next piece
      const pieceToPlay = nextPiece;
      const newNextPiece = generatePiece();

      // Reset position for new piece
      pieceToPlay.x = Math.floor(BOARD_WIDTH / 2) - Math.floor(pieceToPlay.shape[0].length / 2);
      pieceToPlay.y = 0;

      if (!canPlacePiece(pieceToPlay, pieceToPlay.x, pieceToPlay.y)) {
        setIsPlaying(false);
        setGameState('over');
        setCurrentPiece(null); // Clear piece on game over
      } else {
        setCurrentPiece(pieceToPlay);
        setNextPiece(newNextPiece);
      }
    }
  }, [currentPiece, nextPiece, gameState, canPlacePiece, generatePiece]);

  // Move piece horizontally
  const movePiece = useCallback((direction: 'left' | 'right') => {
    if (!currentPiece || gameState === 'over' || !isPlaying) return;

    const newX = direction === 'left' ? currentPiece.x - 1 : currentPiece.x + 1;
    if (canPlacePiece(currentPiece, newX, currentPiece.y)) {
      setCurrentPiece(prev => prev ? { ...prev, x: newX } : null);
    }
  }, [currentPiece, gameState, isPlaying, canPlacePiece]);

  // Fast drop piece (soft drop)
  const softDropPiece = useCallback(() => {
    if (!currentPiece || gameState === 'over' || !isPlaying) return;

    if (canPlacePiece(currentPiece, currentPiece.x, currentPiece.y + 1)) {
      setCurrentPiece(prev => prev ? { ...prev, y: prev.y + 1 } : null);
      setScore(prev => prev + 1); // Bonus point for soft drop
    }
  }, [currentPiece, gameState, isPlaying, canPlacePiece]);

  // Handle Resize Logic
  const containerRef = useRef<HTMLDivElement>(null);
  const [boardConstraint, setBoardConstraint] = useState<'width' | 'height'>('height');

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;

      const { width, height } = entry.contentRect;
      if (width === 0 || height === 0) return;

      const containerAspect = width / height;
      const boardAspect = BOARD_WIDTH / BOARD_HEIGHT;

      if (containerAspect > boardAspect) {
        setBoardConstraint('height');
      } else {
        setBoardConstraint('width');
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Rotate piece
  const rotatePiece = useCallback(() => {
    if (!currentPiece || gameState === 'over' || !isPlaying) return;

    // Don't rotate the square piece (O-piece) - check by ID or shape
    if (currentPiece.id === 2 || (currentPiece.shape.length === 2 && currentPiece.shape[0].length === 2)) return;

    // Rotate shape 90 degrees clockwise
    const rotatedShape = currentPiece.shape[0].map((_, index) =>
      currentPiece.shape.map(row => row[index]).reverse()
    );

    const rotatedPiece = { ...currentPiece, shape: rotatedShape };

    // Try to place at current position first
    if (canPlacePiece(rotatedPiece, currentPiece.x, currentPiece.y)) {
      setCurrentPiece(rotatedPiece);
      return;
    }

    // Try wall kicks (move left/right to accommodate rotation)
    const kicks = [-1, 1, -2, 2];
    for (const kick of kicks) {
      if (canPlacePiece(rotatedPiece, currentPiece.x + kick, currentPiece.y)) {
        setCurrentPiece({ ...rotatedPiece, x: currentPiece.x + kick });
        return;
      }
    }
  }, [currentPiece, gameState, isPlaying, canPlacePiece]);

  // Start game
  const startGame = () => {
    setBoard(Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0)));
    const firstPiece = generatePiece();
    const secondPiece = generatePiece();
    setCurrentPiece(firstPiece);
    setNextPiece(secondPiece);
    setScore(0);
    setIsPlaying(true);
    setGameState('playing');
  };

  // Keyboard controls
  useEffect(() => {
    if (!isPlaying) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          event.preventDefault();
          movePiece('left');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          event.preventDefault();
          movePiece('right');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          event.preventDefault();
          softDropPiece();
          break;
        case 'ArrowUp':
        case 'w':
        case 'W':
          event.preventDefault();
          rotatePiece();
          break;
        case ' ': // Spacebar for rotation as alternative
          event.preventDefault();
          rotatePiece();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, movePiece, softDropPiece, rotatePiece]);

  // Game loop with better state management
  useEffect(() => {
    if (!isPlaying || gameState === 'over') return;

    const gameLoop = setInterval(() => {
      dropPiece();
    }, 800);

    return () => clearInterval(gameLoop);
  }, [isPlaying, gameState, dropPiece]);

  // Render board with current piece
  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);

    // Add current piece to display
    if (currentPiece) {
      const currentPieceIndex = currentPiece.id;
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x]) {
            const boardY = currentPiece.y + y;
            const boardX = currentPiece.x + x;
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              displayBoard[boardY][boardX] = -currentPieceIndex; // Negative for current piece
            }
          }
        }
      }
    }

    return displayBoard;
  };

  // Get piece colors for rendering
  const getCellStyle = (cell: number) => {
    if (cell === 0) {
      return 'bg-white/10 border border-white/20';
    }

    const isCurrentPiece = cell < 0;
    const baseStyle = 'shadow-md';
    const currentPieceStyle = isCurrentPiece ? 'shadow-lg ring-1 ring-gray-400/50' : '';
    return `${baseStyle} ${currentPieceStyle}`;
  };

  // Get piece background color as inline style
  const getCellBackgroundColor = (cell: number) => {
    if (cell === 0) {
      return {};
    }

    const pieceId = Math.abs(cell);
    const piece = TETRIS_PIECES.find(p => p.id === pieceId);

    if (!piece) {
      return {
        backgroundColor: '#991b1b',
        borderColor: '#991b1b'
      };
    }

    // Map piece colors to actual hex values
    const colorMap: { [key: string]: string } = {
      'red': '#dc2626',
      'yellow': '#eab308',
      'purple': '#9333ea',
      'green': '#16a34a',
      'blue': '#2563eb',
      'orange': '#ea580c',
      'cyan': '#0891b2'
    };

    const color = colorMap[piece.color] || '#991b1b';
    return {
      backgroundColor: color,
      borderColor: color
    };
  };

  const displayBoard = renderBoard();

  return (
    <div className="relative h-full w-full flex flex-row p-2 gap-2 overflow-hidden">
      {/* LEFT: Game Board */}
      <div className="h-full flex-grow relative bg-zinc-900 rounded-xl border border-white/5 min-w-0 overflow-hidden">
        {/* Absolute wrapper to decouple size from flex flow */}
        <div ref={containerRef} className="absolute inset-0 flex items-center justify-center p-1">
          <div
            className={`grid gap-px shadow-2xl transition-all duration-75 ${boardConstraint === 'height' ? 'h-full w-auto' : 'w-full h-auto'}`}
            style={{
              gridTemplateColumns: `repeat(${BOARD_WIDTH}, 1fr)`,
              gridTemplateRows: `repeat(${BOARD_HEIGHT}, 1fr)`,
              aspectRatio: `${BOARD_WIDTH}/${BOARD_HEIGHT}`,
            }}
          >
            {displayBoard.map((row, y) =>
              row.map((cell, x) => (
                <div
                  key={`${y}-${x}`}
                  className={`w-full h-full rounded-[1px] transition-all duration-75 ${getCellStyle(cell)}`}
                  style={getCellBackgroundColor(cell)}
                />
              ))
            )}
          </div>
        </div>

        {/* Overlay UI for Start/Game Over handled absolutely over this section */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="text-center pointer-events-auto">
            {gameState === 'idle' && (
              <div className="bg-zinc-900 rounded-2xl p-6 space-y-4 border border-zinc-700 shadow-2xl">
                <div className="text-2xl font-bold text-white tracking-tight">Tetris</div>
                <button
                  onClick={startGame}
                  className="px-6 py-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white rounded-xl transition-all font-semibold shadow-lg hover:shadow-red-500/20 active:scale-95 text-sm"
                >
                  Start Game
                </button>
              </div>
            )}

            {gameState === 'over' && (
              <div className="bg-zinc-900 rounded-2xl p-6 space-y-4 border border-zinc-700 shadow-2xl">
                <div className="text-lg font-bold text-red-400">Game Over</div>
                <div className="text-2xl font-mono text-white tracking-wider">{score}</div>
                <button
                  onClick={startGame}
                  className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-all font-medium border border-zinc-600 hover:border-zinc-500 text-sm"
                >
                  Play Again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT: Sidebar */}
      <div className="w-32 flex flex-col gap-3 min-w-[128px] flex-shrink-0 z-10">

        {/* Next Piece Window */}
        <div className="bg-zinc-900 rounded-xl p-3 border border-white/5 flex flex-col items-center gap-2 aspect-square justify-center">
          <div className="text-xs text-zinc-400 font-medium uppercase tracking-wider">Next</div>
          <div className="grid gap-1 w-16 h-16 items-center justify-center">
            {nextPiece && (
              <div
                className="grid gap-0.5"
                style={{
                  gridTemplateColumns: `repeat(${nextPiece.shape[0].length}, 1fr)`,
                  gridTemplateRows: `repeat(${nextPiece.shape.length}, 1fr)`,
                }}
              >
                {nextPiece.shape.map((row, y) =>
                  row.map((cell, x) => (
                    <div
                      key={`next-${y}-${x}`}
                      className={`w-4 h-4 rounded-[1px] ${cell ? '' : 'invisible'}`}
                      style={cell ? getCellBackgroundColor(nextPiece.id) : undefined}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Score Card */}
        <div className="bg-zinc-900 rounded-xl p-3 border border-white/5 flex flex-col gap-1">
          <div className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Score</div>
          <div className="text-xl text-white font-mono font-bold tracking-tight">{score}</div>
        </div>

        {/* Controls Card */}
        <div className="bg-zinc-900 rounded-xl p-3 border border-white/5 flex flex-col gap-2 flex-grow min-h-0 overflow-y-auto scrollbar-hide">
          <div className="text-xs text-zinc-500 uppercase tracking-widest font-semibold flex items-center gap-2">
            Controls
          </div>
          <div className="space-y-4 text-xs text-zinc-400">
            <div className="flex items-center justify-between">
              <span>Rotate</span>
              <kbd className="px-2 py-1 bg-white/5 rounded border border-white/10 text-white font-mono">W</kbd>
            </div>
            <div className="flex items-center justify-between">
              <span>Left</span>
              <kbd className="px-2 py-1 bg-white/5 rounded border border-white/10 text-white font-mono">A</kbd>
            </div>
            <div className="flex items-center justify-between">
              <span>Drop</span>
              <kbd className="px-2 py-1 bg-white/5 rounded border border-white/10 text-white font-mono">S</kbd>
            </div>
            <div className="flex items-center justify-between">
              <span>Right</span>
              <kbd className="px-2 py-1 bg-white/5 rounded border border-white/10 text-white font-mono">D</kbd>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
