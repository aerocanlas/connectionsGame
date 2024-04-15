import React, { useState, useEffect } from 'react';
import { shuffleGameData } from "../../lib/game-helpers";
import GameGrid from "../GameGrid";
import NumberOfMistakesDisplay from "../NumberOfMistakesDisplay";
import GameLostModal from "../modals/GameLostModal";
import GameWonModal from "../modals/GameWonModal";

import { Separator } from "../ui/separator";
import ConfettiExplosion from "react-confetti-explosion";

import { PuzzleDataContext } from "../../providers/PuzzleDataProvider";
import { GameStatusContext } from "../../providers/GameStatusProvider";
import GameControlButtonsPanel from "../GameControlButtonsPanel";
import { formatDuration, intervalToDuration } from 'date-fns';

import ViewResultsModal from "../modals/ViewResultsModal";

function Game() {
  const { gameData, categorySize, numCategories } =
    React.useContext(PuzzleDataContext);
  const { submittedGuesses, solvedGameData, isGameOver, isGameWon } =
    React.useContext(GameStatusContext);

  const [shuffledRows, setShuffledRows] = React.useState(
    shuffleGameData({ gameData })
  );
  const [isEndGameModalOpen, setisEndGameModalOpen] = React.useState(false);
  const [gridShake, setGridShake] = React.useState(false);
  const [showConfetti, setShowConfetti] = React.useState(false);

  // use effect to update Game Grid after a row has been correctly solved
  React.useEffect(() => {
    const categoriesToRemoveFromRows = solvedGameData.map(
      (data) => data.category
    );
    const dataLeftForRows = gameData.filter((data) => {
      return !categoriesToRemoveFromRows.includes(data.category);
    });
    if (dataLeftForRows.length > 0) {
      setShuffledRows(shuffleGameData({ gameData: dataLeftForRows }));
    }
  }, [solvedGameData]);

  // Handle End Game!
  React.useEffect(() => {
    if (!isGameOver) {
      return;
    }
    // extra delay for game won to allow confetti to show
    const modalDelay = isGameWon ? 2000 : 250;
    const delayModalOpen = window.setTimeout(() => {
      setisEndGameModalOpen(true);
      //unmount confetti after modal opens
      setShowConfetti(false);
    }, modalDelay);

    if (isGameWon) {
      setShowConfetti(true);
    }

    return () => window.clearTimeout(delayModalOpen);
  }, [isGameOver]);

  const [startTime, setStartTime] = useState(Date.now());
  const [currentTime, setCurrentTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(true);

  // Start the timer when the game starts
  useEffect(() => {
    if (timerRunning) {
      const interval = setInterval(() => {
        setCurrentTime(Date.now() - startTime);
      }, 1000);  // Update the timer every second
      return () => clearInterval(interval);
    }
  }, [timerRunning, startTime]);

  // Stop the timer when the game ends
  useEffect(() => {
    if (isGameOver) {
      setTimerRunning(false);
    }
  }, [isGameOver]);

  const formatTime = (time) => {
    return formatDuration(intervalToDuration({ start: 0, end: time }));
  };
  
  return (
    <>
      <h3 className="text-bold text-xl text-center mt-4 uppercase">
        Create {numCategories} groups of {categorySize}
      </h3>

      <div className={`game-wrapper`}>
        {isGameOver && isGameWon ? (
          <GameWonModal
          open={isEndGameModalOpen}
          submittedGuesses={submittedGuesses}
          timeElapsed={formatTime(currentTime)}
        />
        ) : (
          <GameLostModal
            open={isEndGameModalOpen}
            submittedGuesses={submittedGuesses}
          />
        )}
        <GameGrid
          gameRows={shuffledRows}
          shouldGridShake={gridShake}
          setShouldGridShake={setGridShake}
        />
        {showConfetti && isGameOver && (
          <div className="grid place-content-center">
            <ConfettiExplosion
              particleCount={100}
              force={0.8}
              duration={2500}
            />
          </div>
        )}
        <Separator />

        {!isGameOver ? (
          <>
            <NumberOfMistakesDisplay />
            <GameControlButtonsPanel
              shuffledRows={shuffledRows}
              setShuffledRows={setShuffledRows}
              setGridShake={setGridShake}
            />
          </>
        ) : (
          <ViewResultsModal />
        )}
      </div>
    </>
  );
}

export default Game;
