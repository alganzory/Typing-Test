import React, { useState, useEffect, useRef, useCallback } from "react";
import { TimerComponent } from "./TimerComponent";
import randomWords from "random-words";

const FASTEST_WPM = 100;
const INITIAL_STATE = {
  minutes: 1,
  inputValue: "",
  started: null,
  scores: {
    charsCount: 0,
    wordsCount: 0,
    mistakes: 0,
  },
};

const REFS_INITIAL = {
  arrayIdx: 0,
  wordIdx: 0,
  isExpectedSpace: false,
  isBackSpace: false,
  spanIndex: 0,
  prevHeight: 0,
};
function App() {
  const [{ minutes, inputValue, started, scores }, setState] = useState({
    ...INITIAL_STATE,
  });
  const [wordsArray, setWordsArray] = useState(null);
  // const [minutes, setMinutes] = useState(1);
  // const [inputValue, setInputValue] = useState("");
  const arrayIdx = useRef(0);
  const wordIdx = useRef(0);
  // const slideCount = useRef(false);
  // const [started, setStarted] = useState(null);
  // const [scores, setScores] = useState({
  //   charsCount: 0,
  //   wordsCount: 0,
  //   mistakes: 0,
  // });

  const [incorrectLetters, setIncorrectLetters] = useState(new Map());
  const [restart, setRestart] = useState(0);
  const sentenceContainer = useRef();
  const inputRef = useRef();
  const scoresRef = useRef();
  const timeElapsed = useRef();
  const isExpectedSpace = useRef(false);
  const isBackSpace = useRef(false);
  const spanIndex = useRef(0);
  const prevHeight = useRef(0);

  const resetRefs = () => {
   
    // Object.keys(REFS_INITIAL).forEach ((key, index) => {
    //   console.log([{]);
    // })
    arrayIdx.current = REFS_INITIAL.arrayIdx;
    wordIdx.current = REFS_INITIAL.wordIdx;
    isExpectedSpace.current = REFS_INITIAL.isExpectedSpace;
    isBackSpace.current = REFS_INITIAL.isBackSpace;
    spanIndex.current = REFS_INITIAL.spanIndex;
    prevHeight.current = REFS_INITIAL.prevHeight;
  };
  useEffect(() => {
    // console.log("useEffect where we generate words");
    setWordsArray(() => {
      // console.log("generating new words...");
      // const newWords  = randomWords({ exactly: FASTEST_WPM * minutes });
      // console.log(newWords)

      return randomWords({ exactly: FASTEST_WPM * minutes });
    });
    inputRef.current.focus();
    // inputRef.current.disabled = "false"
  }, [minutes, restart]);

  // useEffect(() => {
  //   console.log("NEW RANDOS: " + wordsArray);
  // }, [wordsArray]);
  useEffect(() => {
    if (wordsArray == null) return;
    if (started == null) return;
    // console.log(wordsArray);
    // slideCount.current = false;
    console.log("useeffect where we deal with input");
    // console.log (incorrectLetters);
    const recentlyInputLetter = inputValue[inputValue.length - 1];
    const currentWord = wordsArray[arrayIdx.current];
    let prevWord = wordsArray[arrayIdx.current <= 0 ? 0 : arrayIdx.current - 1];
    let currentLetter = wordsArray[arrayIdx.current][wordIdx.current];
    let spanId = isExpectedSpace.current
      ? "space" + spanIndex.current
      : currentLetter + spanIndex.current;
    let currentCharacterSpan = document.getElementById(spanId);
    if (currentCharacterSpan == null) return;
    const currentHeight = currentCharacterSpan.getBoundingClientRect().y;
    // console.log(currentHeight, prevHeight.current)
    // let prevLetter = prevWord[prevWord.length-1];

    //  spanIndex= 2*arrayIdx.current+wordIdx.current;

    // console.log(currentHeight, prevHeight.current);
    if (currentHeight > prevHeight.current) {
      const newSlicedArray = wordsArray.slice(
        arrayIdx.current,
        wordsArray.length
      );
      // console.log(newSlicedArray);
      // console.log("setSLICED");
      setWordsArray(newSlicedArray);
      // setWordsArray(newSlicedArray);
      arrayIdx.current = 0;
      spanIndex.current = 0;
      // slideCount.current = true;
      // sentenceContainer.current.className = "original-text slide"
      //  sentenceContainer.current.style.transform = "translateY(100ppx)";
      //  console.log("slide")
    } else {
      // console.log("slide Count should be false")
      // slideCount.current = false;
      // sentenceContainer.current.className = "original-text"
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
        return;
      }
      // } else
      //   setScores((prevScores) => ({
      //     ...prevScores,
      //     mistakes: prevScores.mistakes + 1,
      //   }));

      currentCharacterSpan.className = "letter-incorrect";
      // console.log(currentCharacterSpan.id);
      // if (isExpectedSpace.current) {
      //   // setIncorrectLetter(" ");
      // } else setIncorrectLetter(currentLetter);
      // //  console.log(incorrectLetter.current);

      setIncorrectLetters((prevIncorrectLetters) => {
        let newIncorrectLetters = prevIncorrectLetters;

        if (isExpectedSpace.current) currentLetter = "space";

        if (newIncorrectLetters.has(currentLetter)) {
          let oldValue = newIncorrectLetters.get(currentLetter);
          newIncorrectLetters.set(currentLetter, (oldValue += 1));
          return newIncorrectLetters;
        }
        newIncorrectLetters.set(currentLetter, 1);

        return newIncorrectLetters;
      });

      return;
    }

    if (isSpaceValid()) {
      setState((prevState) => ({
        ...prevState,
        scores: {
          ...prevState.scores,
          charsCount: prevState.scores.charsCount + 1,
        },
      }));
      // setScores((prevScores) => ({
      //   ...prevScores,
      //   charsCount: prevScores.charsCount + 1,
      // }));
      // setCorrectStuff(
      //   (prevCorrectStuff) => (prevCorrectStuff += recentlyInputLetter)
      // );
      currentCharacterSpan.className = "letter-correct";
      isExpectedSpace.current = false;
      setState((prevState) => ({ ...prevState, inputValue: "" }));
      // setInputValue("");
      spanIndex.current++;

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
      setState((prevState) => ({
        ...prevState,
        scores: {
          ...prevState.scores,
          charsCount: prevState.scores.charsCount + 1,
        },
      }));
      // setScores((prevScores) => ({
      //   ...prevScores,
      //   charsCount: prevScores.charsCount + 1,
      // }));
      // setCorrectStuff(
      //   (prevCorrectStuff) => (prevCorrectStuff += recentlyInputLetter)
      // );

      currentCharacterSpan.className = "letter-correct";
      spanIndex.current++;
    }
  }, [inputValue, wordsArray, started]);

  // useEffect(() => {
  //   if (correctStuff[correctStuff.length - 1] === " ")
  //     setScores((prevScores) => ({
  //       ...prevScores,
  //       wordsCount: prevScores.wordsCount + 1,
  //     }));
  // }, [correctStuff]);

  const onTimerFinish = useCallback(() => {
    setState((prevState) => ({ ...prevState, started: false }));
    // setStarted(false);
    inputRef.current.blur();

    return [true, 0];
  }, []);

  const handleRestart = useCallback(() => {
    // alert("RESTART");
    resetRefs();
    setState({ ...INITIAL_STATE });
    setRestart((prevRestart) => (prevRestart += 1));
    //  setRestart(true);
    //  setScores ({});
    //  setStarted ();
    //  setInputValue("")
  }, []);
  const timerComponent = useCallback(
    function ({ remainingTime, elapsedTime }) {
      timeElapsed.current = elapsedTime;
      return started !== false ? (
        <div className="timer">
          <div className="value">{remainingTime}</div>
          <div className="text">seconds</div>
        </div>
      ) : (
        <div className="timer">
          <div style={{ fontSize: ".75rem", color: "#777" }}>
            {remainingTime} seconds
          </div>
          <div onClick={handleRestart} className="restart">
            Restart
          </div>
        </div>
      );
    },
    [started, handleRestart]
  );

  function handleChange({ target }) {
    // setInputValue(target.value);
    console.log("handleChange");
    setState((prevState) => ({ ...prevState, inputValue: target.value }));
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
    setState({ ...INITIAL_STATE });
    setState((prevState) => ({ ...prevState, started: true }));
    // setStarted(true);
    // setScores({ wordsCount: 0, charsCount: 0, mistakes: 0 });
    // setInputValue("");
  }

  const WPM =
    timeElapsed.current === 0
      ? 0
      : scores.charsCount / 5 / (timeElapsed.current / 60.0);
  const accuracy =
    spanIndex.current === 0
      ? 0
      : Math.max((scores.charsCount - scores.mistakes) / spanIndex.current, 0) *
        100;

  function wordsArrayJSX() {
    // console.log("called: ", wordsArray);
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
    <div className="container">
      <div className="header">
        <div className="scores" ref={scoresRef}>
          {/* <div className="score" >
            {" "}
            Mistakes: {scores.mistakes}{" "}
          </div> */}
          <div className="score">
            <label form="CPM">CPM</label>
            <input
            disabled
              id="CPM"
              className="score-input"
              value={scores.charsCount}
            ></input>
          
          </div>
          <div className="score">
            <label form="WPM">WPM</label>
            <input
            disabled
              id="WPM"
              className="score-input"
              value={WPM.toFixed()}
            ></input>
            </div>
          <div className="score">
            <label form="accuracy">Accuracy</label>
            <input
            disabled
              id="accuracy"
              className="score-input"
              value={accuracy.toFixed() + "%"}
            ></input>
          
          </div>

        </div>
        <div className="timer-container">
          <div className="timer-component">
            <TimerComponent
            
              onTimerFinish={onTimerFinish}
              timerComponent={timerComponent}
              startPlaying={started}
              duration={2}
            />
          </div>
        </div>
      </div>

      <div className="paragraph-container noselect">
        <div
          key={wordsArray ? wordsArray[0] : 0}
          className={"original-text"}
          ref={sentenceContainer}
        >
          {wordsArrayJSX()}
          <div className="fade"></div>
        </div>

        <input
          style={started === false ? { display: "none" } : {}}
          className="typing-input"
          onKeyDown={handleKey}
          value={inputValue}
          ref={inputRef}
          onChange={handleChange}
          autoCapitalize = "none"
          autoComplete = "off"
          spellCheck ="false"
          autoCorrect="off"
        ></input>

        <button
          style={started !== false ? { display: "none" } : {}}
          className={"typing-input disabled"}
          onClick={handleRestart}
        >
          Restart
        </button>
      </div>
     
    </div>
  );
}

export default App;
