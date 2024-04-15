import React from "react";
import BaseModal from "../BaseModal";

import { generateEmojiGrid } from "../../../lib/game-helpers";
import ShareScoreButton from "../../ShareScoreButton";
import { PuzzleDataContext } from "../../../providers/PuzzleDataProvider";

function GameWonModal({ open, submittedGuesses, timeElapsed  }) {
  const { gameData } = React.useContext(PuzzleDataContext);

  return (
    <BaseModal
      title="You won the game!"
      initiallyOpen={open}
      footerElements={<ShareScoreButton />}
      showActionButton={false}
    >
      <p>{"Great job, share your results!"}</p>
      <div className="justify-center">
        <span className="text-center whitespace-pre">
          {"\n"}
          {generateEmojiGrid(gameData, submittedGuesses)}
        </span>
        <div className="mt-4 text-lg">
          {`Time Taken: ${timeElapsed}`}
        </div>
      </div>
    </BaseModal>
  );
}

export default GameWonModal;
