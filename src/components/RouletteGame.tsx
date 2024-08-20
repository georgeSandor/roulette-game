import { useState, useRef, useEffect } from "react";
import RouletteSpin from "../assets/rouletteSpinning.gif";
import RouletteSound from "../assets/rouletteSpinning.wav";
import "./RouletteGame.scss";

const RouletteGame = () => {
  const numbers = Array.from({ length: 36 }, (_, i) => i + 1);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [resultNumber, setResultNumber] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [playerMoney, setPlayerMoney] = useState(1000);
  const [selectedBetAmount, setSelectedBetAmount] = useState<number | null>(
    null
  );
  const rouletteRef = useRef<null | HTMLImageElement>(null);
  const betAmounts = [5, 10, 25, 50, 1000];

  const audio = new Audio(RouletteSound);

  useEffect(() => {
    if (rouletteRef.current) {
      rouletteRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [spinning]);

  const placeBet = () => {
    if (selectedNumber !== null && selectedBetAmount !== null) {
      if (selectedBetAmount <= playerMoney) {
        setPlayerMoney(playerMoney - selectedBetAmount);
        setSpinning(true);
        audio.play();
        setMessage("Roulette is spinning...");

        setTimeout(() => {
          const randomResult = Math.floor(Math.random() * 36) + 1;
          setResultNumber(randomResult);
          setSpinning(false);
          audio.pause();
          if (randomResult === selectedNumber) {
            const winnings = selectedBetAmount;
            setPlayerMoney(playerMoney + winnings);
            setMessage("You Won!");
          } else {
            setMessage("You Lose!");
          }
        }, 7000);
      } else {
        setMessage("You do not have enough money to place this bet.");
      }
    } else {
      setMessage("Please select a number to place a bet.");
    }
  };

  const handleNumberClick = (number: number) => {
    if (!spinning) {
      setSelectedNumber(number);
      setMessage("");
    }
  };

  const handleBetAmountClick = (amount: number) => {
    if (!spinning) {
      setSelectedBetAmount(amount);
      setMessage("");
    }
  };

  const resetGame = () => {
    window.location.reload();
  };

  return (
    <div className="roulette-container">
      <h1>Roulette Casino Game</h1>
      <p className="player-money">Player Money: ${playerMoney}</p>
      <div className="number-board">
        {numbers.map((number) => (
          <button
            key={number}
            onClick={() => handleNumberClick(number)}
            className={`${spinning || playerMoney === 0 ? "disabled" : ""} ${
              selectedNumber === number ? "selected" : ""
            }`}
            disabled={spinning || playerMoney === 0}
          >
            {number}
          </button>
        ))}
      </div>
      <div className="bet-amounts">
        <p>Select Bet Amount:</p>
        {betAmounts.map((amount) => (
          <button
            key={amount}
            onClick={() => handleBetAmountClick(amount)}
            className={`${spinning || playerMoney === 0 ? "disabled" : ""} ${
              selectedBetAmount === amount ? "selected" : ""
            }`}
            disabled={spinning || playerMoney === 0}
          >
            ${amount}
          </button>
        ))}
      </div>
      <div className="action-buttons">
        <button onClick={placeBet} disabled={spinning || playerMoney === 0}>
          Place Bet
        </button>
        <button onClick={resetGame}>Reset Game</button>
      </div>
      <div className="message-container">
        {message && (
          <div className="message-body">
            {message}
            {spinning && (
              <img
                src={RouletteSpin}
                className="roulette-img"
                width={800}
                height={500}
                ref={rouletteRef}
              />
            )}
          </div>
        )}
        {resultNumber && !spinning && <p>Result: {resultNumber}</p>}
        {!spinning && playerMoney === 0 && (
          <p className="game-over">You have no money left. Game over!</p>
        )}
      </div>
    </div>
  );
};

export default RouletteGame;
