import React, { useRef } from "react";

import { CountdownCircleTimer } from "react-countdown-circle-timer";
export const TimerComponent = React.memo(
  (props) => {
    const { onTimerFinish, timerComponent, startPlaying, duration } = props;
    const renders = useRef(0);

    return (
      <>
        {/* <h2>Renders: {renders.current++}</h2> */}
        {/* playing : {startPlaying?"True": "False"} */}
        <CountdownCircleTimer
  
          onComplete={onTimerFinish}
          isPlaying={startPlaying}
          duration={duration}
          colors={[
            ["#5433ff", 0.33],
            ["#20bdff", 0.33],
            ["#a5fecb", 0.33],
          ]}
          children={timerComponent}
          size={125}
          strokeWidth={6}
          strokeLinecap={"square"}
          isLinearGradient={true}
        />
      </>
    );
  },

  (prevProps, nextProps) => {
    if (prevProps.startPlaying !== nextProps.startPlaying) return false;
    if (prevProps.duration !== nextProps.duration) return false;
    return true;
  }
);
