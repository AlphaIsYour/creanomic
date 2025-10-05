// app/maps/components/TourGuide.tsx

import React from "react";
import Joyride, { CallBackProps, Step } from "react-joyride";

interface TourGuideProps {
  steps: Step[];
  run: boolean;
  onCallback: (data: CallBackProps) => void;
}

export const TourGuide: React.FC<TourGuideProps> = ({
  steps,
  run,
  onCallback,
}) => {
  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      disableScrolling={true}
      debug
      callback={onCallback}
      styles={{
        options: {
          zIndex: 10000,
          arrowColor: "#FFFFFF",
          backgroundColor: "#FFFFFF",
          primaryColor: "#0F766E",
          textColor: "#374151",
          width: 380,
        },
        tooltipContainer: { textAlign: "left" },
        buttonNext: { backgroundColor: "#0D9488" },
        buttonBack: { color: "#0D9488" },
      }}
    />
  );
};
