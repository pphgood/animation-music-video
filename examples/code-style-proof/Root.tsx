import React from 'react';
import {Composition} from 'remotion';
import {StyleC_Papercut} from './StyleC_Papercut';
import {StyleD_InkWash} from './StyleD_InkWash';
import {StyleE_CityPopAnime} from './StyleE_CityPopAnime';
import {StyleF_SketchDoodle} from './StyleF_SketchDoodle';
import {StyleG_StickerRap} from './StyleG_StickerRap';

export const ProofRoot: React.FC = () => (
  <>
    <Composition id="StyleC" component={StyleC_Papercut} durationInFrames={90} fps={30} width={1920} height={1080} />
    <Composition id="StyleD" component={StyleD_InkWash} durationInFrames={90} fps={30} width={1920} height={1080} />
    <Composition id="StyleE" component={StyleE_CityPopAnime} durationInFrames={90} fps={30} width={1920} height={1080} />
    <Composition id="StyleF" component={StyleF_SketchDoodle} durationInFrames={90} fps={30} width={1920} height={1080} />
    <Composition id="StyleG" component={StyleG_StickerRap} durationInFrames={90} fps={30} width={1920} height={1080} />
  </>
);
