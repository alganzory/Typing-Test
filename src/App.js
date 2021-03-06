import React, { useState, useEffect, useRef, useCallback } from "react";
import { TimerComponent } from "./TimerComponent";
import RestartButton from "./RestartButton"
import randomWords from "random-words";
const FASTEST_WPM = 40; // quick google search
const INITIAL_STATE = {
  minutes: 1,
  inputValue: "",
  started: null,
};

const REFS_INITIAL = {
  arrayIdx: 0,
  wordIdx: 0,
  isExpectedSpace: false,
  isBackSpace: false,
  spanIndex: 0,
  prevHeight: Infinity,
  progressIdx: 0,
  wordsStats: { correct: 0, incorrect: 0 },
  charStats: { correct: 0, incorrect: 0 },
  prevChar: null,
  extraWrong: { id: null, count: 0 },
  spans: [],
  wpm: 0,
  cpm: 0,
  accuracy: 0,
};

function App() {
  const [{ minutes, inputValue, started }, setState] = useState({
    ...INITIAL_STATE,
  });
  const [wordsArray, setWordsArray] = useState(null);
  const [restart, setRestart] = useState(0);

  const arrayIdx = useRef(0);
  const wordIdx = useRef(0);
  const progressIdx = useRef(0);
  const paragraphRef = useRef();
  const inputRef = useRef();
  const scoresRef = useRef();
  const timeElapsed = useRef();
  const isExpectedSpace = useRef(false);
  const isBackSpace = useRef(false);
  const spanIndex = useRef(0);
  const prevHeight = useRef(Infinity);
  const caret = useRef();
  const prevChar = useRef();
  const extraWrong = useRef({ id: null, count: 0 });
  const spans = useRef([]);
  const wordsStats = useRef({ correct: 0, incorrect: 0 });
  const charStats = useRef({ correct: 0, incorrect: 0 });

  const resetRefs = () => {
    arrayIdx.current = REFS_INITIAL.arrayIdx;
    wordIdx.current = REFS_INITIAL.wordIdx;
    isExpectedSpace.current = REFS_INITIAL.isExpectedSpace;
    isBackSpace.current = REFS_INITIAL.isBackSpace;
    spanIndex.current = REFS_INITIAL.spanIndex;
    prevHeight.current = REFS_INITIAL.prevHeight;
    charStats.current = REFS_INITIAL.charStats;
    progressIdx.current = REFS_INITIAL.progressIdx;
    wordsStats.current = REFS_INITIAL.wordsStats;
    prevChar.current = REFS_INITIAL.prevChar;
    extraWrong.current = REFS_INITIAL.extraWrong;
    spans.current = REFS_INITIAL.spans;
  };

  const onTimerFinish = useCallback(() => {
    setState((prevState) => ({ ...prevState, started: false }));
    blurParagraph(1);
    console.log(spans.current);
    return [true, 0];
  }, []);

  const handleRestart = useCallback(() => {
    resetRefs();
    setState({ ...INITIAL_STATE });
    setRestart((prevRestart) => (prevRestart += 1));
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
            restart
          </div>
        </div>
      );
    },
    [started, handleRestart]
  );

  useEffect(() => {
    setWordsArray(() => {
      return randomWords({ exactly: FASTEST_WPM * minutes });
    });
    inputRef.current.focus();
  }, [minutes, restart]);

  const increaseWordsArray = () => {
    alert("wordsArray increased");
    setWordsArray(() => {
      return [
        ...wordsArray,
        ...randomWords({ exactly: (FASTEST_WPM / 2) * minutes }),
      ];
    });
  };

  function handleChange({ target }) {
    let localStarted = null;
    console.log("handleChange");
    if (target.value.length === 1 && target.value === " ") return;
    if (!started) {
      startGame();
      localStarted = true;
    }
    if (started) {
      localStarted = true;
    }

    inputRef.current.value = target.value;

    if (wordsArray == null) return;
    console.log("phew, wordsArray is not null");
    if (localStarted == null) return;
    console.log("phew, started is not null");

    // we handle if the input changes because of a backspace, i.e: something deleted
    if (isBackSpace.current) {
      //resetting the flag
      isBackSpace.current = false;

      // if the user input extra wrong character and then hits backspace, we hanle those first
      if (extraWrong.current.count) {
        try {
          let chosenSpan = document.getElementById(extraWrong.current.id);
          chosenSpan.removeChild(chosenSpan.lastChild);
          if (extraWrong.current.count > 1)
            shiftCaret(
              chosenSpan.lastChild.offsetLeft +
                chosenSpan.lastChild.offsetWidth,
              chosenSpan.lastChild.offsetTop
            );
          else {
            let lastSpan = spans.current[spans.current.length - 2];
            shiftCaret(
              lastSpan.offsetLeft + lastSpan.offsetWidth,
              lastSpan.offsetTop
            );
          }
          extraWrong.current.count--;
        } catch (ERR) {
          console.log(ERR);
        }
        return;
      }

      console.log("deleting non-extra stuff");

      // if we are at the end of the word, we expect a space, now if we are deleting that letter
      // then we are no longer at the end of the word, so we reset the expecting space
      if (isExpectedSpace.current) {
        isExpectedSpace.current = false;
      }

      // spans array stores whatever spans we are done with, so if we are deleting, we need to
      // delete from this span array too, and reset the letter appearance
      if (spans.current.length) {
        spans.current[spans.current.length - 1].className = "letter";

        // SPECIAL CASE: if the letter to be deleted is the space, we probably mean to delete
        // the item before it, cause the user does not interact with spaces.
        // this case is triggered right after we are deleting extras, the spans array usually
        // consists of the space that was supposed to be there instead of the extras,
        // this seems like a special case that should be eliminated but idk for now

        let deletedSpan = spans.current.pop();
        if (spanIndex.current > 1) {
          // let lastSpan = spans.current[spans.current.length - 1];
          shiftCaret(deletedSpan.offsetLeft, deletedSpan.offsetTop);
        } else {
          shiftCaret(deletedSpan.offsetLeft, deletedSpan.offsetTop);
        }
        if (deletedSpan.id.includes("space")) {
          let lastSpan = spans.current[spans.current.length - 1];
          shiftCaret(
            lastSpan.offsetLeft + lastSpan.offsetWidth,
            lastSpan.offsetTop
          );
          let tempSpan = spans.current.pop();
          tempSpan.className = "letter";
          shiftCaret(tempSpan.offsetLeft, tempSpan.offsetTop);
        }
      }

      // since we are deleting stuff, we wanna reduce our indices
      if (spanIndex.current > 0) spanIndex.current -= 1;
      if (wordIdx.current > 0) wordIdx.current -= 1;

      // we don't want to get into the rest of the code
      return;
    }

    console.log("So we are not deleting... now to business");
    if (!target.value.length) return;
    console.log("phew, input value length is not zero");

    const recentlyInputLetter = target.value[target.value.length - 1];
    const currentWord = wordsArray[arrayIdx.current];
    let currentLetter = wordsArray[arrayIdx.current][wordIdx.current];
    let spanId = isExpectedSpace.current
      ? "space" + spanIndex.current
      : currentLetter + spanIndex.current;
    let currentCharacterSpan = document.getElementById(spanId);
    // if the selected character span does not exist for whatever reason, exit early
    if (currentCharacterSpan == null) {
      return;
    }

    // Now that we have the current span, let's activate it
    currentCharacterSpan.classList.add("active");
    if (prevChar.current != null) {
      prevChar.current.classList.remove("active");
    }
    const currentBoundingRect = currentCharacterSpan.getBoundingClientRect();
    const currentHeight = currentBoundingRect.y;
    // And then push it to the array of spans that have been activated
    if (currentCharacterSpan !== spans.current[spans.current.length - 1]) {
      spans.current.push(currentCharacterSpan);
    }
    let lastSpan = spans.current[spans.current.length - 1];

    if (lastSpan.offsetWidth === 0 && lastSpan.id.includes("space")) {
      let nextLetter = wordsArray[arrayIdx.current + 1][0];
      let nextSpanId = nextLetter + (spanIndex.current + 1);
      let nextSpan = document.getElementById(nextSpanId);
      if (nextSpan) shiftCaret(nextSpan.offsetLeft, nextSpan.offsetTop);
    } else {
      shiftCaret(
        lastSpan.offsetLeft + lastSpan.offsetWidth,
        lastSpan.offsetTop
      );
    }
    const isCorrect = () => {
      // checking if the current inputted letter matches the letter in order and if the whole input
      // value matches a substring of the word
      return recentlyInputLetter === currentLetter;
    };

    // Now we check if what we inputted was a space
    if (recentlyInputLetter === " ") {
      // if space is expected, meaning it's the correct thing
      if (isExpectedSpace.current) {
        // toggle the flag back off
        isExpectedSpace.current = false;
        // make it correct
        currentCharacterSpan.classList.add("correct");
        currentCharacterSpan.classList.remove("incorrect");
        // Increase correct words
        if (target.value === currentWord + " ") {
          wordsStats.current.correct++;
          charStats.current.correct += currentWord.length + 1;

          // if (containerComponent.lastChild)
          // containerComponent.removeChild(containerComponent.lastChild);
        } else {
          wordsStats.current.incorrect++;
        }
      }

      // if space isnt the correct thing
      else if (!isExpectedSpace.current) {
        // highlight the character as wrong
        currentCharacterSpan.classList.remove("correct");
        currentCharacterSpan.classList.add("incorrect");

        // mark the rest of the word as wrong too
        do {
          currentCharacterSpan.classList.add("underline");
          spanIndex.current++;
          wordIdx.current++;
          if (wordIdx.current > wordsArray[arrayIdx.current].length - 1)
            currentLetter = "space";
          else currentLetter = wordsArray[arrayIdx.current][wordIdx.current];
          spanId = currentLetter + spanIndex.current;
          currentCharacterSpan = document.getElementById(spanId);
        } while (!spanId.includes("space"));

        // to handle shifting the caret to the new line if the rest of the word is wrong
        if (currentCharacterSpan.offsetWidth === 0) {
          let nextLetter = wordsArray[arrayIdx.current + 1][0];
          let nextSpanId = nextLetter + (spanIndex.current + 1);
          let nextSpan = document.getElementById(nextSpanId);
          if (nextSpan) shiftCaret(nextSpan.offsetLeft, nextSpan.offsetTop);
        } else
          shiftCaret(
            currentCharacterSpan.offsetLeft + currentCharacterSpan.offsetWidth
          );
      }

      // move to the next word in the array
      arrayIdx.current++;

      // move to the next span
      spanIndex.current++;

      // mark the progress idx as the current span index so as to not allow
      // deleting the already done word
      progressIdx.current = spanIndex.current;

      // reset the inner word index because we are starting a new word
      wordIdx.current = 0;

      // empty the input field

      inputRef.current.value = "";

      // reset the extra wrong, cause we are moving to a new word
      extraWrong.current = { id: null, count: 0 };
      //terminate early cause we don't need to check for anything else
      return;
    }

    // letter not correct
    if (!isCorrect()) {
      // if the user made a mistake by adding letters to the end of the word instead of a backspace
      if (isExpectedSpace.current) {
        // we create an element with the letter that was added and append it to the last letter of the senctence
        let wrongChar = document.createElement("span");
        wrongChar.innerHTML = recentlyInputLetter;
        wrongChar.className = "letter incorrect";
        prevChar.current.appendChild(wrongChar);
        let lastChild = prevChar.current.lastChild;
        shiftCaret(
          lastChild.offsetLeft + lastChild.offsetWidth,
          lastChild.offsetTop
        );
        if (extraWrong.current.id !== prevChar.current.id) {
          extraWrong.current.id = prevChar.current.id;
          extraWrong.current.count = 1;
        } else extraWrong.current.count++;

        // we terminate early cause we don't need to change anythign else but adding these stuff to the end.
        return;
      }

      // make it red
      currentCharacterSpan.classList.remove("correct");
      currentCharacterSpan.classList.add("incorrect");
    }

    // letter is correct
    else {
      currentCharacterSpan.classList.add("correct");
      currentCharacterSpan.classList.remove("incorrect");
    }

    // Now that we are happy with this character, we can promote it to prevChar
    prevChar.current = currentCharacterSpan;

    // Handling when we reach the end of the word
    if (target.value.length === currentWord.length) {
      isExpectedSpace.current = true;
    }
    // Handling when we add extra wrong stuff
    else if (target.value.length > currentWord.length) {
      let wrongChar = document.createElement("span");
      wrongChar.innerHTML = recentlyInputLetter;
      wrongChar.className = "letter incorrect";
      currentCharacterSpan.appendChild(wrongChar);
      let lastChild = currentCharacterSpan.lastChild;
      shiftCaret(lastChild.offsetLeft + lastChild.offsetWidth);
      if (extraWrong.current.id !== currentCharacterSpan.id) {
        extraWrong.current.id = currentCharacterSpan.id;
        extraWrong.current.count = 1;
      } else extraWrong.current.count++;
      return;
    }
    // If we get to this point, it means that we got the letter
    // either right or wrong, and we are not at the end of
    // the word and we did not hit space or backspace

    wordIdx.current += 1;
    spanIndex.current += 1;

    if (currentHeight > prevHeight.current) {
      shiftCaret(
        currentCharacterSpan.offsetLeft + currentBoundingRect.offsetWidth,
        currentCharacterSpan.offsetTop
      );
      if (arrayIdx.current >= 0.6 * wordsArray.length) {
        increaseWordsArray();
      }

      let offset = -currentCharacterSpan.offsetTop;
      offset += "px";
      paragraphRef.current.style.top = "3.125rem";
      paragraphRef.current.style.transform = "translateY(" + offset + ")";

      prevHeight.current = currentHeight;
      return;
    }
    prevHeight.current = currentHeight;
    // document.getElementById("caret").st
  }

  function handleKey(e) {
    if (e.code === "Backspace" || e.code === "Delete") {
      if (arrayIdx.current === 0 && inputRef.current.value.length === 0) return; // X1 CHANGE TO INPUTVALUE
      if (spanIndex.current <= progressIdx.current) {
        return;
        // console.log (spanIndex.current, progressIdx.current)
      }
      isBackSpace.current = true;
      return;
    }
    if (e.code === "Space") {
      return;
    }
  }

  let blurTimeout;

  function handleOutOfFocus() {
    // alert ("WTF")

    blurTimeout = setTimeout(() => {
      if (!inputRef.current) return;
      if (document.activeElement === inputRef.current) return;
      blurParagraph(5);
      document.getElementById("out-focus").style.display = "block";
    }, 1000);
  }

  function blurParagraph(blurAmount) {
    if (blurAmount === 0) paragraphRef.current.style.filter = "none";
    else paragraphRef.current.style.filter = `blur(${blurAmount}px)`;
  }

  function handleFocus() {
    blurParagraph(0);
    document.getElementById("out-focus").style.display = "none";
  }

  function handleFocusClick() {
    clearTimeout(blurTimeout);
    if (!inputRef.current) return;
    inputRef.current.focus();
  }

  function startGame() {
    setState({ ...INITIAL_STATE });
    setState((prevState) => ({ ...prevState, started: true }));
    inputRef.current.focus();
    // setStarted(true);
    // setScores({ wordsCount: 0, charsCount: 0, mistakes: 0 });
    // setInputValue("");
  }

  function shiftCaret(left, top) {
    left += "px";
    top += "px";
    // alert(left)
    caret.current.style.left = left;
    caret.current.style.top = top;
  }

  const renders = useRef(0);

  const WPM =
    timeElapsed.current === 0
      ? 0
      : charStats.current.correct / 5 / (timeElapsed.current / 60.0);

  const CPM =
    timeElapsed.current === 0
      ? 0
      : charStats.current.correct / (timeElapsed.current / 60.0);

  const accuracyP =
    spanIndex.current === 0
      ? 0
      : Math.max(charStats.current.correct / spans.current.length, 0) * 100;

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
                {idx === 0 ? (
                  <span
                    className={"caret" + (started === null ? " initial" : "")}
                    id="caret"
                    ref={caret}
                  >
                    {" "}
                  </span>
                ) : (
                  ""
                )}
                <span className="character">{character}</span>
              </span>
            );
          });
  }

  useEffect(() => {
    renders.current++;
  });

  return (
    <div className="container">
      <div className="header">
        <h2>Renders: {renders.current}</h2>
        {started !== "ae" ? (
          <div className="scores" ref={scoresRef}>
            {/* <div className="score" >
            {" "}
            Mistakes: {scores.mistakes}{" "}
          </div> */}
            <div className="score">
              <label form="CPM">cpm</label>
              <input
                disabled
                id="CPM"
                className="score-input"
                value={CPM.toFixed()}
              ></input>
            </div>
            <div className="score">
              <label form="WPM">wpm</label>
              <input
                disabled
                id="WPM"
                className="score-input"
                value={WPM.toFixed()}
              ></input>
            </div>
            <div className="score">
              <label form="accuracy">accuracy</label>
              <input
                disabled
                id="accuracy"
                className="score-input"
                value={accuracyP.toFixed() + "%"}
              ></input>
            </div>
          </div>
        ) : (
          ""
        )}
        <div
          className="timer-container"
          style={
            started === null
              ? { animationName: "timer-down", animationDuration: "500ms" }
              : started === false
              ? { animationName: "timer-unfold" }
              : { animationName: "timer-bounce", animationDuration: "300ms" }
          }
          key={started === null ? true : started}
        >
          <div className="timer-component">
            <TimerComponent
              onTimerFinish={onTimerFinish}
              timerComponent={timerComponent}
              startPlaying={started}
              duration={1}
            />
          </div>
        </div>
      </div>

      <div className="paragraph-container noselect" onClick={handleFocusClick}>
        <div id="out-focus"> click to focus</div>
        <div
          key={wordsArray ? wordsArray[0] : 0}
          className={"original-text"}
          id="original-text"
        >
          {/* <span className={"caret" +( started === null? " initial": "")} id="caret" ref={caret}

> </span> */}

          <div id="paragraph" ref={paragraphRef}>
            {wordsArrayJSX()}
            {/* { <div className="caret" ref={caret} id="caret"></div>} */}
          </div>

          {/* <div className="fade" id="fader"></div> */}
        </div>

        {started !== false ? (
          <input
            className="typing-input"
            onKeyDown={handleKey}
            ref={inputRef}
            onChange={handleChange}
            autoCapitalize="none"
            autoComplete="off"
            spellCheck="false"
            autoCorrect="off"
            onBlur={handleOutOfFocus}
            onFocus={handleFocus}
          ></input>
        ) : ""}

        <RestartButton onClick = {handleRestart} started ={started}/>
   
      </div>
    </div>
  );
}

export default App;
