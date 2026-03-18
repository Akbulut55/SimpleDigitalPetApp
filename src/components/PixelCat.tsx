import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Image, View, ViewStyle } from 'react-native';
import {
  Atlas,
  Canvas,
  FilterMode,
  MipmapMode,
  rect,
  Skia,
  useImage,
} from '@shopify/react-native-skia';

import { CAT_FRAME_SIZE, FALLBACK_SPRITE_ID, getAnimationForSprite, getCatSpriteConfig } from '../constants/petSprites';
import { PetSpriteVariant } from '../types/pet';

type PixelCatProps = {
  spriteId?: string;
  mood: PetSpriteVariant;
  scale?: number;
  style?: ViewStyle;
  frameSequence?: number[];
  loop?: boolean;
  onSequenceComplete?: () => void;
  sequenceFps?: number;
  sequenceSpeedMultiplier?: number;
};

const FRAME_COLUMNS = 11;
const ANIMATION_SLOWDOWN = 1;

const normalizeSequence = (sequence: number[]): number[] => {
  if (sequence.length === 0) {
    return [];
  }

  return sequence
    .map(frame => Math.max(0, Math.floor(frame)))
    .filter(frame => Number.isFinite(frame));
};

const buildFrameIndicesFromRanges = (ranges: Array<{ start: number; length: number }>): number[] =>
  ranges.flatMap(range =>
    Array.from({ length: Math.max(0, range.length) }, (_, offset) => range.start + offset),
  );

export const PixelCat = ({
  mood,
  spriteId = FALLBACK_SPRITE_ID,
  scale = 6,
  style,
  frameSequence,
  loop = true,
  sequenceFps,
  sequenceSpeedMultiplier = 1,
  onSequenceComplete,
}: PixelCatProps) => {
  const config = useMemo(() => getCatSpriteConfig(spriteId), [spriteId]);
  const animation = useMemo(() => getAnimationForSprite(mood, config), [config, mood]);
  const explicitSequence = useMemo(() => normalizeSequence(frameSequence ?? []), [frameSequence]);
  const activeFrames = useMemo(
    () => (explicitSequence.length > 0 ? explicitSequence : buildFrameIndicesFromRanges(animation.ranges)),
    [animation.ranges, explicitSequence],
  );
  const resolvedSheet = useMemo(() => {
    const asset = Image.resolveAssetSource(config.sheet);
    return asset?.uri ? asset.uri : '';
  }, [config.sheet]);
  const frameImage = useImage(resolvedSheet);

  const isUsingSequence = explicitSequence.length > 0;
  const shouldLoop = loop;
  const resolvedSequenceFps = Number.isFinite(sequenceFps ?? NaN)
    ? Math.max(1, Math.floor(sequenceFps ?? 1))
    : animation.fps;
  const activeAnimationFps = Math.max(1, isUsingSequence ? resolvedSequenceFps : animation.fps);
  const speedMultiplier = Math.max(1, sequenceSpeedMultiplier);
  const normalizedScale = Math.max(1, Math.round(scale));
  const displaySize = CAT_FRAME_SIZE * normalizedScale;
  const frameLength = Math.max(1, activeFrames.length);
  const intervalMs = Math.max(1, Math.round((1000 / activeAnimationFps) * ANIMATION_SLOWDOWN * speedMultiplier));

  const [step, setStep] = useState(0);
  const timerRef = useRef<number | null>(null);
  const sequenceCompletedRef = useRef(false);

  useEffect(() => {
    setStep(0);
    sequenceCompletedRef.current = false;

    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (frameLength <= 1) {
      if (!shouldLoop && isUsingSequence && onSequenceComplete && !sequenceCompletedRef.current) {
        sequenceCompletedRef.current = true;
        onSequenceComplete();
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setStep(previous => {
        const next = previous + 1;

        if (next < frameLength) {
          return next;
        }

        if (!shouldLoop) {
          if (!sequenceCompletedRef.current) {
            sequenceCompletedRef.current = true;
            onSequenceComplete?.();
          }
          return previous;
        }

        return 0;
      });
    }, intervalMs);

    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [animation.fps, frameLength, intervalMs, isUsingSequence, onSequenceComplete, shouldLoop, sequenceFps, sequenceSpeedMultiplier]);

  const rawFrameIndex = activeFrames[step % frameLength] ?? activeFrames[0] ?? 0;

  const { frameRect, spriteTransforms } = useMemo(() => {
    if (!frameImage) {
      return {
        frameRect: null as ReturnType<typeof rect> | null,
        spriteTransforms: [] as ReturnType<typeof Skia.RSXform>[],
      };
    }

    const sourceWidth = frameImage.width();
    const sourceHeight = frameImage.height();
    const sourceFrameSize = Math.round(sourceWidth / FRAME_COLUMNS);
    const frameCount = Math.max(1, Math.floor(sourceHeight / sourceFrameSize) * FRAME_COLUMNS);

    const safeFrameIndex = Math.max(0, Math.min(rawFrameIndex, frameCount - 1));
    const sourceFrameX = safeFrameIndex % FRAME_COLUMNS;
    const sourceFrameY = Math.floor(safeFrameIndex / FRAME_COLUMNS);

    const sourceX = sourceFrameX * sourceFrameSize;
    const sourceY = sourceFrameY * sourceFrameSize;

    const spriteScale = displaySize / sourceFrameSize;
    const spriteRect = rect(sourceX, sourceY, sourceFrameSize, sourceFrameSize);

    return {
      frameRect: spriteRect,
      spriteTransforms: [Skia.RSXform(spriteScale, 0, 0, 0)],
    };
  }, [displaySize, rawFrameIndex, frameImage]);

  if (!frameImage || !frameRect || !resolvedSheet) {
    return <View style={[{ width: displaySize, height: displaySize }, style]} />;
  }

  return (
    <View style={[{ width: displaySize, height: displaySize }, style]}>
      <Canvas style={{ width: displaySize, height: displaySize }}>
        <Atlas
          image={frameImage}
          sprites={[frameRect]}
          transforms={spriteTransforms}
          sampling={{ filter: FilterMode.Nearest, mipmap: MipmapMode.None }}
        />
      </Canvas>
    </View>
  );
};
