/* eslint-disable no-nested-ternary */
'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import type { Move, PieceSymbol, Square } from 'chess.js';
import type { FC, ReactNode } from 'react';
import type {
  CustomPieceFnArgs,
  CustomPieces,
} from 'react-chessboard/dist/chessboard/types';

const pieces = [
  'wP',
  'wN',
  'wB',
  'wR',
  'wQ',
  'wK',
  'bP',
  'bN',
  'bB',
  'bR',
  'bQ',
  'bK',
];

export const Game: FC = () => {
  const [game, setGame] = useState(new Chess());
  const [turn, setTurn] = useState<'b' | 'w'>('w');

  const customPieces: CustomPieces = useMemo(() => {
    const pieceComponents: Record<
      string,
      ({ squareWidth }: CustomPieceFnArgs) => ReactNode
    > = {};
    pieces.forEach((piece) => {
      pieceComponents[piece] = ({ squareWidth }: CustomPieceFnArgs) => (
        <div
          style={{
            width: squareWidth,
            height: squareWidth,
            backgroundImage: `url(/sprites/${piece}.png)`,
            backgroundSize: '100%',
          }}
        />
      );
    });
    return pieceComponents;
  }, []);

  const handleReset = () => {
    setTurn('w');
    setGame(new Chess());
  };

  const safeMove = useCallback(
    (move: Move) => {
      const gameCopy = new Chess(game.fen());
      try {
        const newMove = gameCopy.move(move);
        setGame(gameCopy);
        return newMove;
      } catch (error) {
        return null;
      }
    },
    [game]
  );

  const onDrop = (
    sourceSquare: Square,
    targetSquare: Square,
    piece: string
  ) => {
    const move = safeMove({
      from: sourceSquare,
      to: targetSquare,
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      promotion: (piece[1].toLowerCase() ?? 'q') as PieceSymbol,
    } as Move);

    // illegal move
    if (move === null) return false;

    // exit if the game is over
    if (game.isGameOver() || game.isDraw()) {
      return false;
    }

    setTurn('b');

    return true;
  };

  useEffect(() => {
    if (turn === 'b') {
      const timeout = setTimeout(() => {
        const possibleMoves = game.moves({ verbose: true });

        // exit if the game is over
        if (game.isGameOver() || game.isDraw() || possibleMoves.length === 0) {
          return;
        }

        const randomIndex = Math.floor(Math.random() * possibleMoves.length);

        safeMove(possibleMoves[randomIndex]);
        setTurn('w');
      }, 500);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [game, safeMove, turn]);

  return (
    <div>
      <div className="max-w-full w-[320px] h-[320px] bg-neutral-800">
        <Chessboard
          position={game.fen()}
          onPieceDrop={onDrop}
          customDarkSquareStyle={{ backgroundColor: '#A3A3A3' }}
          customLightSquareStyle={{ backgroundColor: '#E5E5E5' }}
          customPieces={customPieces}
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="p-1 text-sm text-white">
          {game.isCheckmate()
            ? 'Checkmate!'
            : game.isCheck()
              ? 'Check!'
              : game.isStalemate()
                ? 'Stalemate!'
                : game.isDraw()
                  ? 'Draw!'
                  : ' '}
        </span>
        <button
          type="button"
          onClick={handleReset}
          className="p-1 text-sm text-white opacity-50 hover:underline"
        >
          Restart
        </button>
      </div>
    </div>
  );
};
