"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Trophy, Zap } from "lucide-react";

const SimpleScrabbleGame = () => {
  const [board, setBoard] = useState(
    Array(5)
      .fill()
      .map(() => Array(5).fill(""))
  );
  const [playerTiles, setPlayerTiles] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [selectedTile, setSelectedTile] = useState(null);
  const [selectedBoardPosition, setSelectedBoardPosition] = useState(null);
  const [currentWord, setCurrentWord] = useState("");
  const [wordScore, setWordScore] = useState(0);

  // Letter values for scoring
  const letterValues = {
    A: 1,
    B: 3,
    C: 3,
    D: 2,
    E: 1,
    F: 4,
    G: 2,
    H: 4,
    I: 1,
    J: 8,
    K: 5,
    L: 1,
    M: 3,
    N: 1,
    O: 1,
    P: 3,
    Q: 10,
    R: 1,
    S: 1,
    T: 1,
    U: 1,
    V: 4,
    W: 4,
    X: 8,
    Y: 4,
    Z: 10,
  };

  // Initialize game
  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    // Generate random tiles for player
    const tiles = [];
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < 7; i++) {
      tiles.push(letters[Math.floor(Math.random() * letters.length)]);
    }
    setPlayerTiles(tiles);
    setBoard(
      Array(5)
        .fill()
        .map(() => Array(5).fill(""))
    );
    setScore(0);
    setGameOver(false);
    setCurrentWord("");
    setWordScore(0);
  };

  const handleTileClick = (tileIndex) => {
    if (gameOver) return;
    setSelectedTile(tileIndex);
    setSelectedBoardPosition(null);
  };

  const handleBoardClick = (row, col) => {
    if (gameOver || selectedTile === null) return;

    const newBoard = [...board];
    const tile = playerTiles[selectedTile];

    if (newBoard[row][col] === "") {
      newBoard[row][col] = tile;
      setBoard(newBoard);

      // Remove tile from player's hand
      const newTiles = [...playerTiles];
      newTiles.splice(selectedTile, 1);
      setPlayerTiles(newTiles);

      // Add new random tile
      const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      newTiles.push(letters[Math.floor(Math.random() * letters.length)]);
      setPlayerTiles(newTiles);

      setSelectedTile(null);
      calculateWordScore();
    }
  };

  const calculateWordScore = () => {
    let word = "";
    let totalScore = 0;

    // Check horizontal words
    for (let row = 0; row < 5; row++) {
      let rowWord = "";
      let rowScore = 0;
      for (let col = 0; col < 5; col++) {
        if (board[row][col] !== "") {
          rowWord += board[row][col];
          rowScore += letterValues[board[row][col]] || 0;
        } else {
          if (rowWord.length > 1) {
            word = rowWord;
            totalScore = rowScore;
          }
          rowWord = "";
          rowScore = 0;
        }
      }
      if (rowWord.length > 1) {
        word = rowWord;
        totalScore = rowScore;
      }
    }

    // Check vertical words
    for (let col = 0; col < 5; col++) {
      let colWord = "";
      let colScore = 0;
      for (let row = 0; row < 5; row++) {
        if (board[row][col] !== "") {
          colWord += board[row][col];
          colScore += letterValues[board[row][col]] || 0;
        } else {
          if (colWord.length > 1) {
            if (colWord.length > word.length) {
              word = colWord;
              totalScore = colScore;
            }
          }
          colWord = "";
          colScore = 0;
        }
      }
      if (colWord.length > 1) {
        if (colWord.length > word.length) {
          word = colWord;
          totalScore = colScore;
        }
      }
    }

    setCurrentWord(word);
    setWordScore(totalScore);

    if (word.length > 0) {
      setScore((prev) => prev + totalScore);
    }
  };

  const shuffleTiles = () => {
    const shuffled = [...playerTiles].sort(() => Math.random() - 0.5);
    setPlayerTiles(shuffled);
  };

  const resetGame = () => {
    initializeGame();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 mb-6"
    >
      {/* Game Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-blue-500" />
          <h3 className="text-lg font-bold text-gray-900">Mini Scrabble</h3>
        </div>
        <div className="text-sm text-gray-600">
          Score: <span className="font-bold text-green-600">{score}</span>
        </div>
      </div>

      {/* Game Board */}
      <div className="mb-4">
        <div className="grid grid-cols-5 gap-1 mb-2">
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <motion.button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleBoardClick(rowIndex, colIndex)}
                className={`w-8 h-8 text-xs font-bold rounded border-2 transition-all duration-200 ${
                  cell === ""
                    ? "bg-gray-100 border-gray-300 hover:border-blue-400 hover:bg-blue-50"
                    : "bg-green-100 border-green-400 text-green-800"
                } ${
                  selectedBoardPosition?.row === rowIndex &&
                  selectedBoardPosition?.col === colIndex
                    ? "ring-2 ring-blue-500"
                    : ""
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {cell}
              </motion.button>
            ))
          )}
        </div>
      </div>

      {/* Current Word Display */}
      {currentWord && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-3"
        >
          <div className="text-center">
            <div className="text-sm text-blue-800">
              Word: <span className="font-bold">{currentWord}</span>
            </div>
            <div className="text-xs text-blue-600">Points: {wordScore}</div>
          </div>
        </motion.div>
      )}

      {/* Player Tiles */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-gray-700">Your Tiles</h4>
          <button
            onClick={shuffleTiles}
            className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            <RotateCcw className="w-3 h-3 inline mr-1" />
            Shuffle
          </button>
        </div>
        <div className="flex gap-1 flex-wrap">
          {playerTiles.map((tile, index) => (
            <motion.button
              key={index}
              onClick={() => handleTileClick(index)}
              className={`w-6 h-6 text-xs font-bold rounded border-2 transition-all duration-200 ${
                selectedTile === index
                  ? "bg-blue-500 border-blue-600 text-white"
                  : "bg-yellow-100 border-yellow-400 text-yellow-800 hover:bg-yellow-200"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {tile}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Game Controls */}
      <div className="flex justify-between items-center">
        <div className="text-xs text-gray-500">Click tile → Click board</div>
        <button
          onClick={resetGame}
          className="inline-flex items-center gap-1 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 hover:shadow-md"
        >
          <RotateCcw className="w-3 h-3" />
          New Game
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-3 text-xs text-gray-500 bg-gray-50 rounded-lg p-2">
        <div className="font-semibold mb-1">How to Play:</div>
        <div>1. Click a tile from your rack</div>
        <div>2. Click an empty board space to place it</div>
        <div>3. Form words horizontally or vertically</div>
        <div>4. Longer words score more points!</div>
      </div>
    </motion.div>
  );
};

export default SimpleScrabbleGame;
