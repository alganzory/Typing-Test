  //////////////////////////////////////////////////////////////////////
  // useEffect(() => {
  //   if (wordsArray == null) return;
  //   if (started == null) return;
  //   console.log("useeffect where we deal with input");

  //   // local variables -----------------------------------------------------------------------------
  //   const recentlyInputLetter = inputValue[inputValue.length - 1];
  //   const currentWord = wordsArray[arrayIdx.current];
  //   let prevWord = wordsArray[arrayIdx.current <= 0 ? 0 : arrayIdx.current - 1];
  //   let currentLetter = wordsArray[arrayIdx.current][wordIdx.current];
  //   let spanId = isExpectedSpace.current? "space" + spanIndex.current: currentLetter + spanIndex.current;
  //   let currentCharacterSpan = document.getElementById(spanId);
  //   if (currentCharacterSpan == null) return;
  //   const currentBoundingRect = currentCharacterSpan.getBoundingClientRect();
  //   const currentHeight = currentBoundingRect.y;
  //   console.log("currentCharacterSpan", currentBoundingRect);
  //   //-----------------------------------------------------------------------------------------------

  //   // local functions ------------------------------------------------------
  //   const isValid = () => {
  //     // checking if the current inputted letter matches the letter in order and if the whole input
  //     // value matches a substring of the word
  //     return (
  //       recentlyInputLetter === currentLetter &&
  //       currentWord.indexOf(inputValue) === 0
  //     );
  //   };

  //   //-------
  //   const isSpaceValid = () => {
  //     return (
  //       recentlyInputLetter === " " &&
  //       isExpectedSpace.current &&
  //       inputValue === prevWord + " "
  //     );
  //   };

  //   //-------

  //   // set active character-----------------------
  //   currentCharacterSpan.classList.add("active");
  //   if (prevChar.current != null) {
  //     prevChar.current.classList.remove("active");
  //   }
  //   prevChar.current = currentCharacterSpan;
  //   //---------------------------------------------

  //   // slide into line-----------------------
  //   if (currentHeight > prevHeight.current) {
  //     const newSlicedArray = wordsArray.slice(
  //       arrayIdx.current,
  //       wordsArray.length
  //     );
  //     setWordsArray(newSlicedArray);
  //     arrayIdx.current = 0;
  //     spanIndex.current = 0;
  //   } else {
  //   }
  //   prevHeight.current = currentHeight;
  //   //-----------------------------------------

  //   // checking for a mistake --------------------------------------------

  //   if (!isValid() && !isSpaceValid() && inputValue.length) {
  //     if (isBackSpace.current) {
  //       isBackSpace.current = false;
  //       return;
  //     }
  //     currentCharacterSpan.classList.remove("correct");
  //     currentCharacterSpan.classList.add("incorrect");

  //     setIncorrectLetters((prevIncorrectLetters) => {
  //       let newIncorrectLetters = prevIncorrectLetters;

  //       if (isExpectedSpace.current) currentLetter = "space";

  //       if (newIncorrectLetters.has(currentLetter)) {
  //         let oldValue = newIncorrectLetters.get(currentLetter);
  //         newIncorrectLetters.set(currentLetter, (oldValue += 1));
  //         return newIncorrectLetters;
  //       }
  //       newIncorrectLetters.set(currentLetter, 1);

  //       return newIncorrectLetters;
  //     });

  //     return;
  //   }  //-------------------------------------------------------------------

  //   // checking if it's a space---------------------------------------------
  //   if (isSpaceValid()) {
  //     setState((prevState) => ({
  //       ...prevState,
  //       scores: {
  //         ...prevState.scores,
  //         charsCount: prevState.scores.charsCount + 1,
  //       },
  //     }));

  //     currentCharacterSpan.classList.remove("incorrect");
  //     currentCharacterSpan.classList.add("correct");

  //     isExpectedSpace.current = false;
  //     setState((prevState) => ({ ...prevState, inputValue: "" }));
  //     // setInputValue("");
  //     spanIndex.current++;

  //     return;
  //   } //------------------------------------------------------------------

  //   // check if it's a valid non-space letter ---------------------------
  //   if (isValid()) {
  //     // if we are at the last letter of the word
  //     if (inputValue === wordsArray[arrayIdx.current]) {
  //       arrayIdx.current++; //we move on to the next word
  //       wordIdx.current = 0;
  //       isExpectedSpace.current = true;
  //     } else {
  //       isExpectedSpace.current = false;
  //       wordIdx.current++;
  //     }
  //     setState((prevState) => ({
  //       ...prevState,
  //       scores: {
  //         ...prevState.scores,
  //         charsCount: prevState.scores.charsCount + 1,
  //       },
  //     }));

  //     currentCharacterSpan.classList.add("correct");
  //     currentCharacterSpan.classList.remove("incorrect");
  //     // currentCharacterSpan.className = "letter-correct";
  //     spanIndex.current++;
  //   }
  // }, [inputValue, wordsArray, started]);


  // useEffect(() => {
  //   console.log("started useEffect ");
  //   if (wordsArray == null) return;
  //   console.log("phew, wordsArray is not null");
  //   if (started == null) return;
  //   console.log("phew, started is not null");
  //   // we handle if the input changes because of a backspace, i.e: something deleted
  //   if (isBackSpace.current) {
  //     //resetting the flag
  //     isBackSpace.current = false;

  //     // if the user input extra wrong character and then hits backspace, we hanle those first
  //     if (extraWrong.current.count) {
  //       try {
  //         let chosenSpan = document.getElementById(extraWrong.current.id);
  //         chosenSpan.removeChild(chosenSpan.lastChild);
  //         if (extraWrong.current.count > 1)
  //           shiftCaret(
  //             chosenSpan.lastChild.offsetLeft +
  //               chosenSpan.lastChild.offsetWidth,
  //             chosenSpan.lastChild.offsetTop
  //           );
  //         else {
  //           let lastSpan = spans.current[spans.current.length - 2];
  //           shiftCaret(
  //             lastSpan.offsetLeft + lastSpan.offsetWidth,
  //             lastSpan.offsetTop
  //           );
  //         }
  //         extraWrong.current.count--;
  //       } catch (ERR) {
  //         console.log(ERR);
  //       }
  //       return;
  //     }

  //     console.log("deleting non-extra stuff");

  //     // if we are at the end of the word, we expect a space, now if we are deleting that letter
  //     // then we are no longer at the end of the word, so we reset the expecting space
  //     if (isExpectedSpace.current) {
  //       isExpectedSpace.current = false;
  //     }

  //     // spans array stores whatever spans we are done with, so if we are deleting, we need to
  //     // delete from this span array too, and reset the letter appearance
  //     if (spans.current.length) {
  //       spans.current[spans.current.length - 1].className = "letter";

  //       // SPECIAL CASE: if the letter to be deleted is the space, we probably mean to delete
  //       // the item before it, cause the user does not interact with spaces.
  //       // this case is triggered right after we are deleting extras, the spans array usually
  //       // consists of the space that was supposed to be there instead of the extras,
  //       // this seems like a special case that should be eliminated but idk for now

  //       let deletedSpan = spans.current.pop();
  //       if (spanIndex.current > 1) {
  //         // let lastSpan = spans.current[spans.current.length - 1];
  //         shiftCaret(
  //           deletedSpan.offsetLeft,
  //           deletedSpan.offsetTop
  //         );
  //       } else {
  //         shiftCaret(deletedSpan.offsetLeft, deletedSpan.offsetTop);
  //       }
  //       if (deletedSpan.id.includes("space")) {
  //         let lastSpan = spans.current[spans.current.length - 1];
  //         shiftCaret(
  //           lastSpan.offsetLeft + lastSpan.offsetWidth,
  //           lastSpan.offsetTop
  //         );
  //         let tempSpan = spans.current.pop();
  //         tempSpan.className = "letter";
  //         shiftCaret( tempSpan.offsetLeft, tempSpan.offsetTop )
  //       }
  //     }

  //     // since we are deleting stuff, we wanna reduce our indices
  //     if (spanIndex.current > 0) spanIndex.current -= 1;
  //     if (wordIdx.current > 0) wordIdx.current -= 1;

  //     // we don't want to get into the rest of the code
  //     return;
  //   }

  //   console.log("So we are not deleting... now to business");
  //   if (!inputValue.length) return;
  //   console.log("phew, input value length is not zero");

  //   const recentlyInputLetter = inputValue[inputValue.length - 1];
  //   const currentWord = wordsArray[arrayIdx.current];
  //   let currentLetter = wordsArray[arrayIdx.current][wordIdx.current];
  //   let spanId = isExpectedSpace.current
  //     ? "space" + spanIndex.current
  //     : currentLetter + spanIndex.current;
  //   let currentCharacterSpan = document.getElementById(spanId);
  //   // if the selected character span does not exist for whatever reason, exit early
  //   if (currentCharacterSpan == null) {
  //     return;
  //   }

  //   // Now that we have the current span, let's activate it
  //   currentCharacterSpan.classList.add("active");
  //   if (prevChar.current != null) {
  //     prevChar.current.classList.remove("active");
  //   }

  //   // And then push it to the array of spans that have been activated
  //   if (currentCharacterSpan !== spans.current[spans.current.length - 1]) {
  //     spans.current.push(currentCharacterSpan);
    
  //   }  let lastSpan = spans.current[spans.current.length - 1];
      
  //    shiftCaret(
  //       lastSpan.offsetLeft + lastSpan.offsetWidth,
  //       lastSpan.offsetTop
  //     );

  //   // slide into line-----------------------
  //   const currentBoundingRect = currentCharacterSpan.getBoundingClientRect();
  //   const currentHeight = currentBoundingRect.y;

  //   // document.getElementById("caret").style.top= currentBoundingRect.top+"px"
  //   //-----------------------------------------

  //   const isCorrect = () => {
  //     // checking if the current inputted letter matches the letter in order and if the whole input
  //     // value matches a substring of the word
  //     return recentlyInputLetter === currentLetter;
  //   };

  //   //---------------------------------------------

  //   // Now we check if what we inputted was a space
  //   if (recentlyInputLetter === " ") {
    

  //     // if space is expected, meaning it's the correct thing
  //     if (isExpectedSpace.current) {
  //       // toggle the flag back off
  //       isExpectedSpace.current = false;
  //       // make it correct
  //       currentCharacterSpan.classList.add("correct");
  //       currentCharacterSpan.classList.remove("incorrect");
  //       // Increase correct words
  //       if (inputValue === currentWord+" ") {
  //         wordsStats.current.correct++;
  //         charStats.current.correct += currentWord.length + 1;



  //         // if (containerComponent.lastChild)
  //           // containerComponent.removeChild(containerComponent.lastChild);
        
  //       } else {
  //         wordsStats.current.incorrect++;
  
  //       }
  //     }

  //     // if space isnt the correct thing
  //     else if (!isExpectedSpace.current) {
  //       // highlight the character as wrong
  //       currentCharacterSpan.classList.remove("correct");
  //       currentCharacterSpan.classList.add("incorrect");

  //       // mark the rest of the word as wrong too
  //       do {
  //         currentCharacterSpan.classList.add("underline");
  //         spanIndex.current++;
  //         wordIdx.current++;
  //         if (wordIdx.current > wordsArray[arrayIdx.current].length - 1)
  //           currentLetter = "space";
  //         else currentLetter = wordsArray[arrayIdx.current][wordIdx.current];
  //         spanId = currentLetter + spanIndex.current;
  //         currentCharacterSpan = document.getElementById(spanId);
  //       } while (!spanId.includes("space"));
  //       shiftCaret(
  //         currentCharacterSpan.offsetLeft + currentCharacterSpan.offsetWidth
  //       );
  //     }

  //     // move to the next word in the array
  //     arrayIdx.current++;

  //     // move to the next span
  //     spanIndex.current++;

  //     // mark the progress idx as the current span index so as to not allow
  //     // deleting the already done word
  //     progressIdx.current = spanIndex.current;

  //     // reset the inner word index because we are starting a new word
  //     wordIdx.current = 0;

  //     // empty the input field
  //     setState((prevState) => ({ ...prevState, inputValue: "" }));

  //     // reset the extra wrong, cause we are moving to a new word
  //     extraWrong.current = { id: null, count: 0 };
  //     //terminate early cause we don't need to check for anything else
  //     return;
  //   }

  //   // CHECK FOR MISTAKE

  //   // letter not correct
  //   if (!isCorrect()) {
  //     // if the user made a mistake by adding letters to the end of the word instead of a backspace
  //     if (isExpectedSpace.current) {
  //       // we create an element with the letter that was added and append it to the last letter of the senctence
  //       let wrongChar = document.createElement("span");
  //       wrongChar.innerHTML = recentlyInputLetter;
  //       wrongChar.className = "letter incorrect";
  //       prevChar.current.appendChild(wrongChar);
  //       let lastChild = prevChar.current.lastChild;
  //       shiftCaret(lastChild.offsetLeft + lastChild.offsetWidth, lastChild.offsetTop);
  //       if (extraWrong.current.id !== prevChar.current.id) {
  //         extraWrong.current.id = prevChar.current.id;
  //         extraWrong.current.count = 1;
  //       } else extraWrong.current.count++;

  //       // we terminate early cause we don't need to change anythign else but adding these stuff to the end.
  //       return;
  //     }

  //     // make it red
  //     currentCharacterSpan.classList.remove("correct");
  //     currentCharacterSpan.classList.add("incorrect");

  //     // add it to incorrect letters
  //     // setIncorrectLetters((prevIncorrectLetters) => {
  //     //   let newIncorrectLetters = prevIncorrectLetters;
  //     //   if (isExpectedSpace.current) currentLetter = "space";
  //     //   if (newIncorrectLetters.has(currentLetter)) {
  //     //     let oldValue = newIncorrectLetters.get(currentLetter);
  //     //     newIncorrectLetters.set(currentLetter, (oldValue += 1));
  //     //     return newIncorrectLetters;
  //     //   }
  //     //   newIncorrectLetters.set(currentLetter, 1);
  //     //   return newIncorrectLetters;
  //     // });
  //   }

  //   // letter is correct
  //   else {
  //     currentCharacterSpan.classList.add("correct");
  //     currentCharacterSpan.classList.remove("incorrect");
  //   }

  //   // Now that we are happy with this character, we can promote it to prevChar
  //   prevChar.current = currentCharacterSpan;

  //   // Handling when we reach the end of the word
  //   if (inputValue.length === currentWord.length) {
  //     isExpectedSpace.current = true;
  //   }

  //   // Handling when we add extra wrong stuff
  //   else if (inputValue.length > currentWord.length) {
  //     let wrongChar = document.createElement("span");
  //     wrongChar.innerHTML = recentlyInputLetter;
  //     wrongChar.className = "letter incorrect";
  //     currentCharacterSpan.appendChild(wrongChar);
  //     let lastChild = currentCharacterSpan.lastChild;
  //     shiftCaret(lastChild.offsetLeft + lastChild.offsetWidth);
  //     if (extraWrong.current.id !== currentCharacterSpan.id) {
  //       extraWrong.current.id = currentCharacterSpan.id;
  //       extraWrong.current.count = 1;
  //     } else extraWrong.current.count++;
  //     return;
  //   }

  //   // If we get to this point, it means that we got the letter
  //   // either right or wrong, and we are not at the end of
  //   // the word and we did not hit space or backspace

  //   wordIdx.current += 1;
  //   spanIndex.current += 1;

  //   if (currentHeight > prevHeight.current) {
  //     shiftCaret (currentCharacterSpan.offsetLeft, currentCharacterSpan.offsetTop)
      
  //     let newArray = wordsArray;

  //     let doneWords = newArray.splice(
  //       0,
  //       arrayIdx.current
  //     )
  //     newArray= [ ...newArray, ...doneWords ];
      

  //     setWordsArray(newArray);
  //     arrayIdx.current = 0;
  //     spanIndex.current = 0;
  //     wordIdx.current = 0;
  //     progressIdx.current = 0;

  //     //to eliminate repetition of spans 
  //     spans.current.pop();
  //   } else {
  //   }
  //   prevHeight.current = currentHeight;
  //   // document.getElementById("caret").style.left = currentCharacterSpan.offsetLeft+currentCharacterSpan.offsetWidth+"px"
  //   // document.getElementById("caret").style.top = currentCharacterSpan.offsetTop+"px"
  // }, [inputValue, started, wordsArray]);
