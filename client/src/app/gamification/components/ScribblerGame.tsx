"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { FaEraser, FaUndo, FaRedo, FaPlay, FaStop } from "react-icons/fa";

interface ScribblerGameProps {
  className?: string;
}

interface Point {
  x: number;
  y: number;
}

interface DrawingPath {
  points: Point[];
  color: string;
  width: number;
  tool: "pen" | "eraser";
}

const ScribblerGame: React.FC<ScribblerGameProps> = ({ className = "" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const [drawingPaths, setDrawingPaths] = useState<DrawingPath[]>([]);
  const [currentColor, setCurrentColor] = useState("#000000");
  const [currentWidth, setCurrentWidth] = useState(3);
  const [currentTool, setCurrentTool] = useState<"pen" | "eraser">("pen");
  const [gameStarted, setGameStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [currentWord, setCurrentWord] = useState("");
  const [gamePhase, setGamePhase] = useState<
    "waiting" | "drawing" | "guessing" | "finished"
  >("waiting");
  const [guess, setGuess] = useState("");
  const [showWord, setShowWord] = useState(false);
  const [history, setHistory] = useState<DrawingPath[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "easy"
  );
  const [streak, setStreak] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [totalGames, setTotalGames] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const colors = [
    "#000000",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
    "#FFA500",
  ];

  const words = {
    easy: [
      "CAT",
      "DOG",
      "SUN",
      "MOON",
      "STAR",
      "HEART",
      "BALL",
      "HAT",
      "CUP",
      "CAKE",
      "TREE",
      "CAR",
      "HOUSE",
      "BIRD",
      "FISH",
      "BOOK",
    ],
    medium: [
      "ELEPHANT",
      "BUTTERFLY",
      "MOUNTAIN",
      "RAINBOW",
      "SANDWICH",
      "TELEPHONE",
      "BICYCLE",
      "CAMERA",
      "UMBRELLA",
      "GIRAFFE",
      "PINEAPPLE",
      "TELESCOPE",
      "MICROSCOPE",
      "HELICOPTER",
      "CHOCOLATE",
    ],
    hard: [
      "ARCHAEOLOGIST",
      "PHOTOSYNTHESIS",
      "MAGNIFICENT",
      "EXTRAORDINARY",
      "SOPHISTICATED",
      "REVOLUTIONARY",
      "CONSTELLATION",
      "METAMORPHOSIS",
      "PHILOSOPHICAL",
      "ARCHITECTURAL",
      "PSYCHOLOGICAL",
      "TECHNOLOGICAL",
    ],
  };

  const hints = {
    easy: {
      CAT: "A furry pet that says 'meow'",
      DOG: "Man's best friend, says 'woof'",
      SUN: "Bright star that gives us light",
      MOON: "Shines at night in the sky",
      STAR: "Twinkles in the night sky",
      HEART: "Symbol of love, pumps blood",
      BALL: "Round object used in sports",
      HAT: "Worn on your head",
      CUP: "Used to drink from",
      CAKE: "Sweet dessert for birthdays",
      TREE: "Tall plant with leaves",
      CAR: "Vehicle with four wheels",
      HOUSE: "Place where people live",
      BIRD: "Flies in the sky",
      FISH: "Swims in water",
      BOOK: "Has pages to read",
    },
    medium: {
      ELEPHANT: "Large animal with a trunk",
      BUTTERFLY: "Colorful flying insect",
      MOUNTAIN: "Very tall landform",
      RAINBOW: "Colorful arc after rain",
      SANDWICH: "Food between bread slices",
      TELEPHONE: "Device to make calls",
      BICYCLE: "Two-wheeled vehicle",
      CAMERA: "Takes photographs",
      UMBRELLA: "Protects from rain",
      GIRAFFE: "Tall animal with long neck",
      PINEAPPLE: "Tropical fruit",
      TELESCOPE: "Sees far into space",
      MICROSCOPE: "Sees tiny things",
      HELICOPTER: "Flying vehicle with rotors",
      CHOCOLATE: "Sweet brown treat",
    },
    hard: {
      ARCHAEOLOGIST: "Studies ancient artifacts",
      PHOTOSYNTHESIS: "How plants make food",
      MAGNIFICENT: "Very impressive",
      EXTRAORDINARY: "Beyond ordinary",
      SOPHISTICATED: "Complex and refined",
      REVOLUTIONARY: "Causes major change",
      CONSTELLATION: "Pattern of stars",
      METAMORPHOSIS: "Complete transformation",
      PHILOSOPHICAL: "Related to wisdom",
      ARCHITECTURAL: "Related to building design",
      PSYCHOLOGICAL: "Related to the mind",
      TECHNOLOGICAL: "Related to technology",
    },
  };

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && gamePhase === "drawing") {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gamePhase === "drawing") {
      setGamePhase("guessing");
    }
  }, [timeLeft, gameStarted, gamePhase]);

  const startGame = () => {
    const difficultyWords = words[difficulty];
    const randomWord =
      difficultyWords[Math.floor(Math.random() * difficultyWords.length)];
    setCurrentWord(randomWord);
    setGameStarted(true);
    setGamePhase("drawing");
    setTimeLeft(difficulty === "easy" ? 90 : difficulty === "medium" ? 75 : 60);
    setScore(0);
    setDrawingPaths([]);
    setCurrentPath([]);
    setHistory([]);
    setHistoryIndex(-1);
    setHintsUsed(0);
    setShowHint(false);
    clearCanvas();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const drawPath = (path: DrawingPath) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = path.tool === "eraser" ? "#ffffff" : path.color;
    ctx.lineWidth = path.width;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (path.points.length > 0) {
      ctx.beginPath();
      ctx.moveTo(path.points[0].x, path.points[0].y);

      for (let i = 1; i < path.points.length; i++) {
        ctx.lineTo(path.points[i].x, path.points[i].y);
      }

      ctx.stroke();
    }
  };

  const redrawCanvas = useCallback(() => {
    clearCanvas();
    drawingPaths.forEach((path) => drawPath(path));
  }, [drawingPaths]);

  useEffect(() => {
    redrawCanvas();
  }, [drawingPaths, redrawCanvas]);

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (gamePhase !== "drawing") return;

    setIsDrawing(true);
    const point = getMousePos(e);
    setCurrentPath([point]);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || gamePhase !== "drawing") return;

    const point = getMousePos(e);
    setCurrentPath((prev) => [...prev, point]);

    // Draw immediately for smooth experience
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = currentTool === "eraser" ? "#ffffff" : currentColor;
    ctx.lineWidth = currentWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (currentPath.length > 0) {
      ctx.beginPath();
      ctx.moveTo(
        currentPath[currentPath.length - 1].x,
        currentPath[currentPath.length - 1].y
      );
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    }
  };

  const handleMouseUp = () => {
    if (!isDrawing) return;

    setIsDrawing(false);

    if (currentPath.length > 0) {
      const newPath: DrawingPath = {
        points: [...currentPath],
        color: currentColor,
        width: currentWidth,
        tool: currentTool,
      };

      setDrawingPaths((prev) => [...prev, newPath]);
      setHistory((prev) => [...prev.slice(0, historyIndex + 1), newPath]);
      setHistoryIndex((prev) => prev + 1);
    }

    setCurrentPath([]);
  };

  const undo = () => {
    if (historyIndex >= 0) {
      const newPaths = drawingPaths.slice(0, historyIndex);
      setDrawingPaths(newPaths);
      setHistoryIndex((prev) => prev - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newPaths = [...drawingPaths, history[historyIndex + 1]];
      setDrawingPaths(newPaths);
      setHistoryIndex((prev) => prev + 1);
    }
  };

  const submitGuess = () => {
    if (guess.toUpperCase() === currentWord) {
      const baseScore =
        difficulty === "easy" ? 50 : difficulty === "medium" ? 75 : 100;
      const timeBonus = Math.floor(timeLeft / 10) * 10;
      const streakBonus = streak * 10;
      const hintPenalty = hintsUsed * 5;
      const finalScore = Math.max(
        0,
        baseScore + timeBonus + streakBonus - hintPenalty
      );

      setScore(finalScore);
      setStreak(streak + 1);
      setTotalGames(totalGames + 1);
      if (finalScore > bestScore) {
        setBestScore(finalScore);
      }
      setGamePhase("finished");
    } else {
      setScore(Math.max(0, score - 10));
      setStreak(0);
    }
  };

  const useHint = () => {
    if (hintsUsed < 3 && !showHint) {
      setHintsUsed(hintsUsed + 1);
      setShowHint(true);
      setScore(Math.max(0, score - 5));
    }
  };

  const resetGame = () => {
    setGameStarted(false);
    setGamePhase("waiting");
    setTimeLeft(difficulty === "easy" ? 90 : difficulty === "medium" ? 75 : 60);
    setScore(0);
    setCurrentWord("");
    setGuess("");
    setShowWord(false);
    setHintsUsed(0);
    setShowHint(false);
    clearCanvas();
  };

  return (
    <div className={`scribbler-game ${className}`}>
      {/* Game Controls */}
      <div className="mb-4 space-y-4">
        {!gameStarted ? (
          <div className="text-center space-y-4">
            {/* Difficulty Selection */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-3">Choose Difficulty:</h3>
              <div className="flex justify-center gap-4">
                {(["easy", "medium", "hard"] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      difficulty === level
                        ? level === "easy"
                          ? "bg-green-500 text-white"
                          : level === "medium"
                          ? "bg-yellow-500 text-white"
                          : "bg-red-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
              <div className="mt-2 text-sm text-gray-600">
                {difficulty === "easy" &&
                  "90 seconds • Simple words • 50 base points"}
                {difficulty === "medium" &&
                  "75 seconds • Medium words • 75 base points"}
                {difficulty === "hard" &&
                  "60 seconds • Complex words • 100 base points"}
              </div>
            </div>

            {/* Stats Display */}
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="font-semibold mb-2">Your Stats:</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  Games Played:{" "}
                  <span className="font-semibold">{totalGames}</span>
                </div>
                <div>
                  Best Score:{" "}
                  <span className="font-semibold text-green-600">
                    {bestScore}
                  </span>
                </div>
                <div>
                  Current Streak:{" "}
                  <span className="font-semibold text-blue-600">{streak}</span>
                </div>
                <div>
                  Difficulty:{" "}
                  <span className="font-semibold capitalize">{difficulty}</span>
                </div>
              </div>
            </div>

            <button
              onClick={startGame}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto text-lg"
            >
              <FaPlay /> Start New Game
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="text-sm font-semibold">
                Time: <span className="text-red-600">{timeLeft}s</span>
              </div>
              <div className="text-sm font-semibold">
                Score: <span className="text-green-600">{score}</span>
              </div>
              {gamePhase === "drawing" && (
                <div className="text-sm font-semibold">
                  Word:{" "}
                  <span className="text-blue-600">
                    {showWord ? currentWord : "***"}
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowWord(!showWord)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
              >
                {showWord ? "Hide" : "Show"} Word
              </button>
              {gamePhase === "drawing" && (
                <button
                  onClick={useHint}
                  disabled={hintsUsed >= 3 || showHint}
                  className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white px-3 py-1 rounded text-sm"
                >
                  Hint ({3 - hintsUsed})
                </button>
              )}
              <button
                onClick={resetGame}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
              >
                <FaStop /> Reset
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Hint Display */}
      {showHint && gamePhase === "drawing" && (
        <div className="mb-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <h4 className="font-semibold text-purple-800 mb-2">💡 Hint:</h4>
          <p className="text-purple-700">
            {
              hints[difficulty][
                currentWord as keyof (typeof hints)[typeof difficulty]
              ]
            }
          </p>
        </div>
      )}

      {/* Drawing Tools */}
      {gameStarted && gamePhase === "drawing" && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex flex-wrap items-center gap-4">
            {/* Tool Selection */}
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentTool("pen")}
                className={`px-3 py-1 rounded text-sm ${
                  currentTool === "pen"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Pen
              </button>
              <button
                onClick={() => setCurrentTool("eraser")}
                className={`px-3 py-1 rounded text-sm flex items-center gap-1 ${
                  currentTool === "eraser"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                <FaEraser /> Eraser
              </button>
            </div>

            {/* Color Palette */}
            <div className="flex gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setCurrentColor(color)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    currentColor === color
                      ? "border-gray-800"
                      : "border-gray-300"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            {/* Brush Size */}
            <div className="flex items-center gap-2">
              <span className="text-sm">Size:</span>
              <input
                type="range"
                min="1"
                max="10"
                value={currentWidth}
                onChange={(e) => setCurrentWidth(Number(e.target.value))}
                className="w-20"
              />
              <span className="text-sm w-6">{currentWidth}</span>
            </div>

            {/* Undo/Redo */}
            <div className="flex gap-2">
              <button
                onClick={undo}
                disabled={historyIndex < 0}
                className="p-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
              >
                <FaUndo />
              </button>
              <button
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                className="p-2 bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
              >
                <FaRedo />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Canvas */}
      <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          className="cursor-crosshair block"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>

      {/* Guessing Phase */}
      {gamePhase === "guessing" && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">What did you draw?</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Enter your guess..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === "Enter" && submitGuess()}
            />
            <button
              onClick={submitGuess}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Submit
            </button>
          </div>
        </div>
      )}

      {/* Game Finished */}
      {gamePhase === "finished" && (
        <div className="mt-4 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg text-center border border-green-200">
          <div className="text-4xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-green-800 mb-2">
            Excellent Work!
          </h3>
          <p className="text-green-700 mb-4 text-lg">
            The word was: <strong className="text-xl">{currentWord}</strong>
          </p>

          <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
            <h4 className="font-semibold text-gray-800 mb-3">Game Results:</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{score}</div>
                <div className="text-gray-600">Final Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{streak}</div>
                <div className="text-gray-600">Current Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {hintsUsed}
                </div>
                <div className="text-gray-600">Hints Used</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {difficulty}
                </div>
                <div className="text-gray-600">Difficulty</div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={startGame}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold"
            >
              Play Again
            </button>
            <button
              onClick={resetGame}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold"
            >
              Main Menu
            </button>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!gameStarted && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2">How to Play:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Choose your difficulty level (Easy/Medium/Hard)</li>
            <li>• Draw the given word within the time limit</li>
            <li>
              • Use different colors and brush sizes to enhance your drawing
            </li>
            <li>• Use the eraser to correct mistakes</li>
            <li>• Get hints if you&apos;re stuck (up to 3 per game)</li>
            <li>• Guess what you drew to earn points</li>
            <li>• Build streaks for bonus points!</li>
          </ul>

          <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
            <h5 className="font-semibold text-blue-800 mb-1">
              Scoring System:
            </h5>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Base points: Easy (50), Medium (75), Hard (100)</li>
              <li>• Time bonus: +10 points per 10 seconds remaining</li>
              <li>• Streak bonus: +10 points per consecutive win</li>
              <li>• Hint penalty: -5 points per hint used</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScribblerGame;
