import React from "react";
import { Composition } from "remotion";
import { Presentation } from "./Presentation";
import { FPS, TOTAL_FRAMES } from "./slides";

export const RemotionRoot: React.FC = () => (
  <Composition id="Presentation" component={Presentation} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1920} height={1080} />
);
