import React from "react";
import { Composition } from "remotion";
import { Presentation, PresentationProps } from "./Presentation";
import { FPS, TOTAL_FRAMES } from "./slides";

// One composition for every language: render Spanish with --props='{"lang":"es"}'.
export const RemotionRoot: React.FC = () => (
  <Composition id="Presentation" component={Presentation} defaultProps={{ lang: "en" } satisfies PresentationProps}
    durationInFrames={TOTAL_FRAMES} fps={FPS} width={1920} height={1080} />
);
