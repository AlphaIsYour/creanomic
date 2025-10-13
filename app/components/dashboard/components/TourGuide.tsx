/* eslint-disable @typescript-eslint/no-unused-vars */
// app/maps/components/TourGuide.tsx

import React, { useEffect, useRef } from "react";
import { driver, DriveStep, Config } from "driver.js";
import "driver.js/dist/driver.css";

interface TourGuideProps {
  steps: DriveStep[];
  run: boolean;
  onComplete?: () => void;
  onSkip?: () => void;
}

export const TourGuide: React.FC<TourGuideProps> = ({
  steps,
  run,
  onComplete,
  onSkip,
}) => {
  const driverObjRef = useRef<ReturnType<typeof driver> | null>(null);

  useEffect(() => {
    if (run && steps.length > 0) {
      // Initialize driver with custom config
      driverObjRef.current = driver({
        showProgress: true,
        showButtons: ["next", "previous", "close"],
        nextBtnText: "Selanjutnya",
        prevBtnText: "Sebelumnya",
        doneBtnText: "Selesai",
        progressText: "{{current}} dari {{total}}",
        steps: steps,
        onDestroyStarted: () => {
          // Called when user clicks close/skip
          if (onSkip) {
            onSkip();
          }
          driverObjRef.current?.destroy();
        },
        onDestroyed: () => {
          // Called when tour is completed or destroyed
          if (onComplete) {
            onComplete();
          }
        },
      });

      // Start the tour
      driverObjRef.current.drive();
    }

    // Cleanup on unmount or when run changes to false
    return () => {
      if (driverObjRef.current) {
        driverObjRef.current.destroy();
        driverObjRef.current = null;
      }
    };
  }, [run, steps, onComplete, onSkip]);

  // Driver.js doesn't render any component, it manipulates DOM directly
  return null;
};
