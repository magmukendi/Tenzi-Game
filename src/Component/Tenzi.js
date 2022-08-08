import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import useSound from 'use-sound'
import win from '../assets/weDidIt.mp3'
import suspense from '../assets/suspense.mp3'


function Dice(props) {
  return (
    <div
      onClick={props.toggle}
      style={{ backgroundColor: props.isHeld ? "#59E391" : "white" }}
      className="die-face"
    >
      <h1 className="die-number">{props.value}</h1>
    </div>
  );
}
function Tenzi() {
  
  const [music, setMusic] = useState(false)
  const [winner, {stop}] = useSound(win, {volume: 0.2})
  const [dice, setDice] = useState(createRandNumber());
  const [tenzies, setTenzies] = useState("DidNotStart");
  const [visible, setVisible] = useState(0.5)
  const [timer, setTimer] = useState(0);
  const [bestTime, setBestTime] = useState(JSON.parse(localStorage.getItem("bestTime")) || []);
  const [totalRoll, setTotalRoll] = useState(
    JSON.parse(localStorage.getItem("numberOfRolls")) || []
    );
    const [roll, setRoll] = useState(0)
    useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every((die) => die.value === firstValue);
    if (allHeld && allSameValue) {
      setTenzies("win");
      setTimer(0)
      console.log("You won!");
    }
  }, [dice]);
  
  
  ///Generate new die
  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid()
    };
  }
  useEffect(() => {
    localStorage.setItem("bestTime", JSON.stringify(bestTime));
    localStorage.setItem("numberOfRolls", JSON.stringify(totalRoll))
  }, [totalRoll,bestTime]);
  
  
  useEffect(()=>{

  },[visible])
  
  useEffect(() => {
    setTimeout(function () {
      setTimer((prev) => {
        return (tenzies !== "DidNotStart" && timer >= 1) ? Number(prev) -1 : Number(prev)
      });
      if(tenzies ==="onGoing" && timer === 0 ){
        setTenzies("lost")
      } 
      
    }, 1000);
  }, [timer,]);
  
    useEffect(()=>{
      tenzies==="win"
      ? winner()
      : stop()

    },[tenzies])
  
  function createRandNumber() {
    const newArr = [];
    
    for (let i = 0; i < 10; i++) {
      newArr.push(generateNewDie());
    }
    return newArr;
  }
  function rollDice() {
    setDice((oldDice) =>
    oldDice.map((die) => {
      return die.isHeld ? die : generateNewDie();
    })
    );
    setRoll(prevRoll => Number(prevRoll) + 1)
  }
  function newGame() {
    tenzies!=="won" && setBestTime((prev) => [...prev, Number(timer)]);
    setDice(createRandNumber());
    setTenzies("onGoing");
    setVisible(1)

    setTimer(60);
    tenzies!=="onGoing" && setTotalRoll(prev => [...prev, Number(roll)] )
    setRoll(0)
  }
  function toggleMusic(){
    if (!music){
        setMusic(true)
      }
    else{
      setMusic(false)
    }
  }

  function hold(id) {
    setDice((prevDice) => {
      const d = prevDice.map((item) =>
        item.id === id ? { ...item, isHeld: !item.isHeld } : item
      );
      return d;
    });
  }
  const diceElements = dice.map((die) => (
    <Dice
    className="die-face"
      toggle={() => hold(die.id)}
      value={die.value}
      key={die.id}
      isHeld={die.isHeld}
    />
  ));

  const bestTimes = bestTime.reverse().map(t =>(
    <li>{t} sec.</li>
  ))
    console.log(tenzies)

  const bestRolls = totalRoll.reverse().map(t =>(
    <li>{t} {t>0?"rolls":roll}</li>
  ))
  return (
    <main className="game">
      {tenzies=="win" && <div className="conf-container"><Confetti className="conff"/></div>}
      <div className="timer-container">
        <h1 className="timer">{timer >0 && timer}</h1>
      </div>
      {(tenzies==="win")
      ?<h1>Congratulations</h1>
      :(tenzies !=="win" && tenzies ==="lost" )
      ?<h1>You lost</h1> 
      :<div className="titless">
      <h1>Tenzies</h1>
      <p>
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
    </div>
      }
      <div className="dice-container">{diceElements}</div>
      <button onClick={(tenzies !=="onGoing") ? newGame : rollDice} className="roll">
        {(tenzies!=="onGoing") ? "New Game" : "Roll Dice!"}
      </button>
     {/*} <button className="musicToggle" onClick={toggleMusic}>{music ? "Turn Off" : "Turn On"}</button>*/}
      {/*<div className="hallOfFame">
        <ol>
        <h3>The best Time</h3>
        {bestTimes}
      </ol>
      <ol>
        <h3>The Roll</h3>
        {bestRolls}
      </ol>
      </div> */}
    </main>

  );
}

export default Tenzi;
