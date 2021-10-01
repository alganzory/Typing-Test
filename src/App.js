import React, { useState, useEffect, useRef, useCallback } from "react";
import { TimerComponent } from "./TimerComponent";
import randomWords from "random-words";
import words from "random-words";

const FASTEST_WPM = 100;

function App() {
  const [wordsArray, setWordsArray] = useState(null);
  const [minutes, setMinutes] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const arrayIdx = useRef(0);
  const wordIdx = useRef(0);
  const [started, setStarted] = useState(false);
  const [scores, setScores] = useState({
    charsCount: 0,
    wordsCount: 0,
    mistakes: 0,
  });

  const sentenceContainer = useRef();
  const inputRef = useRef();
  const scoresRef = useRef();
  const timeElapsed = useRef();
  const isExpectedSpace = useRef(false);
  const isBackSpace = useRef(false);
  const spanIndex = useRef(0);
  const prevHeight = useRef (0);
  useEffect(() => {
    setWordsArray(randomWords({ exactly: FASTEST_WPM * minutes }));
    inputRef.current.focus();
  }, [minutes]);

  useEffect(() => {
    if (wordsArray == null) return;
    // console.log(wordsArray);
    const recentlyInputLetter = inputValue[inputValue.length - 1];
    const currentWord = wordsArray[arrayIdx.current];
    let prevWord = wordsArray[arrayIdx.current <= 0 ? 0 : arrayIdx.current - 1];
    let currentLetter = wordsArray[arrayIdx.current][wordIdx.current];
    // let prevLetter = prevWord[prevWord.length-1];

    //  spanIndex= 2*arrayIdx.current+wordIdx.current;

    let spanId = isExpectedSpace.current
      ? "space" + spanIndex.current
      : currentLetter + spanIndex.current;
    const currentCharacterSpan = document.getElementById(spanId)
    const currentHeight = currentCharacterSpan.getBoundingClientRect().y;
    console.log(currentHeight, prevHeight.current)
    if (currentHeight> prevHeight.current) {
      const newSlicedArray = wordsArray.slice(
        arrayIdx.current,
        wordsArray.length
      );
      // console.log(newSlicedArray);
      setWordsArray(newSlicedArray);
      arrayIdx.current = 0;
      spanIndex.current = 0;
    }
    prevHeight.current = currentHeight;
    // console.log(currentCharacterSpan.getBoundingClientRect())
    // currentLetter= currentLetter == null? " ": currentLetter;
    // console.log(currentLetter)
    // console.log(spanIndex)
    // console.log(spanId)
    // console.log(currentCharacterSpan)
    // currentCharacterSpan.style.color ="red";
    // wordIdx.current++;
    // console.log("Array idx: " , arrayIdx)
    // console.log("current word: ", currentWord);
    // console.log("current Letter: " , currentLetter)

    const isValid = () => {
      // checking if the current inputted letter matches the letter in order and if the whole input
      // value matches a substring of the word
      return (
        recentlyInputLetter === currentLetter &&
        currentWord.indexOf(inputValue) === 0
      );
    };

    const isSpaceValid = () => {
      // console.log("inside isSpaceValid, value of recentlyInputLetter: ", recentlyInputLetter);
      // console.log("inside isSpaceValid, value of  isExpectedSpace", isExpectedSpace.current );
      // checking if the current inputted letter is space and if space is the letter expected
      // console.log(prevWord)
      return (
        recentlyInputLetter === " " &&
        isExpectedSpace.current &&
        inputValue === prevWord + " "
      );
    };

    // checking for a mistake first
    if (!isValid() && !isSpaceValid() && inputValue.length) {
      //  console.table(recentlyInputLetter, currentLetter, currentWord)
      if (isBackSpace.current) {
        isBackSpace.current = false;
      } else
        setScores((prevScores) => ({
          ...prevScores,
          mistakes: prevScores.mistakes + 1,
        }));

      currentCharacterSpan.className = "letter-incorrect";
      
      // if (isExpectedSpace.current) {
      //   // setIncorrectLetter(" ");
      // } else setIncorrectLetter(currentLetter);
      // //  console.log(incorrectLetter.current);

      return;
    }

    if (isSpaceValid()) {
      setScores((prevScores) => ({
        ...prevScores,
        charsCount: prevScores.charsCount + 1,
      }));
      // setCorrectStuff(
      //   (prevCorrectStuff) => (prevCorrectStuff += recentlyInputLetter)
      // );
      currentCharacterSpan.className = "letter-correct";
      isExpectedSpace.current = false;
      setInputValue("");
      spanIndex.current++;

      console.log(currentCharacterSpan.getBoundingClientRect().left);

      return;
    }
    if (isValid()) {
      // if we are at the last letter of the word
      if (inputValue === wordsArray[arrayIdx.current]) {
        arrayIdx.current++; //we move on to the next word
        wordIdx.current = 0;
        isExpectedSpace.current = true;
        // previousSpanIndex.current = spanIndex.current;
        // console.log ("at the end of the word and isExpedctedSpace: ", isExpectedSpace.current);
      } else {
        isExpectedSpace.current = false;
        wordIdx.current++;
      }

      setScores((prevScores) => ({
        ...prevScores,
        charsCount: prevScores.charsCount + 1,
      }));
      // setCorrectStuff(
      //   (prevCorrectStuff) => (prevCorrectStuff += recentlyInputLetter)
      // );

      currentCharacterSpan.className = "letter-correct";
      spanIndex.current++;
    }
  }, [inputValue, wordsArray]);

  // useEffect(() => {
  //   if (correctStuff[correctStuff.length - 1] === " ")
  //     setScores((prevScores) => ({
  //       ...prevScores,
  //       wordsCount: prevScores.wordsCount + 1,
  //     }));
  // }, [correctStuff]);

  const onTimerFinish = useCallback(() => {
    setStarted(false);
    inputRef.current.blur();

    return [true, 0];
  }, []);

  const timerComponent = useCallback(function ({ remainingTime, elapsedTime }) {
    timeElapsed.current = elapsedTime;
    return (
      <div className="timer">
        <div className="value">{remainingTime}</div>
        <div className="text">seconds</div>
      </div>
    );
  }, []);

  function handleChange({ target }) {
    setInputValue(target.value);
  }

  function handleKey(e) {
    if (e.code === "Backspace" || e.code === "Delete") {
      isBackSpace.current = true;
    }
    if (!started) {
      startGame();
    }
  }

  function startGame() {
    setStarted(true);
    setScores({ wordsCount: 0, charsCount: 0, mistakes: 0 });
    setInputValue("");
  }

  const WPM = timeElapsed.current ===0? 0: scores.charsCount / 5 / (timeElapsed.current / 60.0) ;
  const accuracy = spanIndex.current === 0? 0: Math.max(
    (scores.charsCount - scores.mistakes) / (spanIndex.current),
    0
  ) * 100;

  function wordsArrayJSX() {
    return wordsArray == null
      ? ""
      : wordsArray
          .join(" ")
          .split("")
          .map((character, idx) => {
            let format;
            if (character === " ") format = "space" + idx;
            else {
              format = character + idx;
            }


            return (
              <span className="letter" id={format} key={format}>
                {character}
              </span>
            );
          });
  }
  return (
    <>
      <div className="header">
        <div className="scores" ref={scoresRef}>
          <div className="score" style={{ color: "red" }}>
            {" "}
            Mistakes: {scores.mistakes}{" "}
          </div>
          <div className="score" style={{ color: "green" }}>
            {" "}
            CPM: {scores.charsCount}{" "}
          </div>
          <div className="score" style={{ color: "green" }}>
            {" "}
            WPM: {WPM.toFixed()}{" "}
          </div>
          <div className="score" style={{ color: "green" }}>
            {" "}
            Accuracy: {accuracy.toFixed()}%
          </div>
        </div>
        <div className="timer-container">
          <TimerComponent
            className
            onTimerFinish={onTimerFinish}
            timerComponent={timerComponent}
            startPlaying={started}
            duration={60}
          />
        </div>
      </div>

      <div className="paragraph-container noselect" ref={sentenceContainer}>
        <div key={wordsArray ? wordsArray[0] : 0} className="original-text">
          {wordsArrayJSX()}
          <div className="fade"></div>
        </div>

        <input
          className="typing-input"
          onKeyDown={handleKey}
          value={inputValue}
          ref={inputRef}
          onChange={handleChange}
        ></input>
      </div>
    </>
  );
}

export default App;
