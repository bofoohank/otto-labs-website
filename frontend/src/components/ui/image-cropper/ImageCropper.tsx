"use client";

/* eslint-disable @next/next/no-img-element */

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { RotateCcw } from "lucide-react";

import { AppButton } from "@/components/ui/AppButton";

type Size = {
  width: number;
  height: number;
};

type Point = {
  x: number;
  y: number;
};

type CropFrame = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type CroppedImage = {
  file: File;
  dataUrl: string;
};

export type ImageCropperHandle = {
  crop: () => Promise<CroppedImage | null>;
  reset: () => void;
};

type Props = {
  file: File;
  aspectRatio?: number;
  outputWidth?: number;
  outputHeight?: number;
  circularGuide?: boolean;
  actions?: React.ReactNode;
};

const DEFAULT_STAGE_SIZE = 420;
const FRAME_PADDING = 24;
const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.0025;

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function centeredFrame(stage: Size, aspectRatio: number): CropFrame {
  const availableWidth = Math.max(1, stage.width - FRAME_PADDING * 2);
  const availableHeight = Math.max(1, stage.height - FRAME_PADDING * 2);
  let width = availableWidth;
  let height = width / aspectRatio;

  if (height > availableHeight) {
    height = availableHeight;
    width = height * aspectRatio;
  }

  return {
    x: (stage.width - width) / 2,
    y: (stage.height - height) / 2,
    width,
    height,
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function isSideways(rotation: number) {
  return Math.abs(rotation % 180) === 90;
}

export const ImageCropper = forwardRef<ImageCropperHandle, Props>(
  function ImageCropper(
    {
      file,
      aspectRatio = 1,
      outputWidth = 512,
      outputHeight = 512,
      circularGuide = false,
      actions,
    },
    ref,
  ) {
    const stageRef = useRef<HTMLDivElement | null>(null);
    const dragStartRef = useRef<{
      pointer: Point;
      offset: Point;
    } | null>(null);
    const pointersRef = useRef<Map<number, Point>>(new Map());
    const pinchStartRef = useRef<{
      distance: number;
      zoom: number;
    } | null>(null);

    const [imageUrl, setImageUrl] = useState("");
    const [imageSize, setImageSize] = useState<Size | null>(null);
    const [stageSize, setStageSize] = useState<Size>({
      width: DEFAULT_STAGE_SIZE,
      height: DEFAULT_STAGE_SIZE,
    });
    const [offset, setOffset] = useState<Point>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [dragging, setDragging] = useState(false);

    useEffect(() => {
      let cancelled = false;

      setImageUrl("");
      setImageSize(null);
      setOffset({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);

      readFileAsDataUrl(file).then((nextUrl) => {
        if (!cancelled) setImageUrl(nextUrl);
      });

      return () => {
        cancelled = true;
      };
    }, [file]);

    useEffect(() => {
      const node = stageRef.current;
      if (!node) return;

      const observer = new ResizeObserver(([entry]) => {
        const width = Math.round(entry.contentRect.width);
        const height = Math.round(entry.contentRect.height);

        if (width && height) {
          setStageSize({ width, height });
        }
      });

      observer.observe(node);

      return () => observer.disconnect();
    }, []);

    const frame = useMemo(
      () => centeredFrame(stageSize, aspectRatio),
      [aspectRatio, stageSize],
    );

    const normalizedRotation = ((rotation % 360) + 360) % 360;
    const sideways = isSideways(normalizedRotation);

    const baseScale = useMemo(() => {
      if (!imageSize) return 1;

      const naturalWidth = sideways ? imageSize.height : imageSize.width;
      const naturalHeight = sideways ? imageSize.width : imageSize.height;

      return Math.max(
        frame.width / naturalWidth,
        frame.height / naturalHeight,
      );
    }, [frame.height, frame.width, imageSize, sideways]);

    const clampOffset = useMemo(() => {
      if (!imageSize) {
        return (nextOffset: Point) => nextOffset;
      }

      const renderedWidth = imageSize.width * baseScale * zoom;
      const renderedHeight = imageSize.height * baseScale * zoom;
      const visualWidth = sideways ? renderedHeight : renderedWidth;
      const visualHeight = sideways ? renderedWidth : renderedHeight;
      const maxX = Math.max(0, (visualWidth - frame.width) / 2);
      const maxY = Math.max(0, (visualHeight - frame.height) / 2);

      return (nextOffset: Point) => ({
        x: clamp(nextOffset.x, -maxX, maxX),
        y: clamp(nextOffset.y, -maxY, maxY),
      });
    }, [
      baseScale,
      frame.height,
      frame.width,
      imageSize,
      sideways,
      zoom,
    ]);

    useEffect(() => {
      setOffset((current) => clampOffset(current));
    }, [clampOffset]);

    const imageLayout = useMemo(() => {
      if (!imageSize) {
        return {
          left: stageSize.width / 2,
          top: stageSize.height / 2,
          width: 0,
          height: 0,
        };
      }

      const width = imageSize.width * baseScale * zoom;
      const height = imageSize.height * baseScale * zoom;

      return {
        width,
        height,
        left: stageSize.width / 2 + offset.x - width / 2,
        top: stageSize.height / 2 + offset.y - height / 2,
      };
    }, [baseScale, imageSize, offset.x, offset.y, stageSize, zoom]);

    const imageStyle = {
      left: imageLayout.left,
      top: imageLayout.top,
      width: imageLayout.width,
      height: imageLayout.height,
      maxWidth: "none",
      maxHeight: "none",
      transform: `rotate(${normalizedRotation}deg)`,
      transformOrigin: `${imageLayout.width / 2}px ${imageLayout.height / 2}px`,
    };

    const stageAspectRatio = imageSize
      ? `${imageSize.width} / ${imageSize.height}`
      : "1 / 1";
    const stageWidth = imageSize
      ? `min(100%, ${Math.min((imageSize.width / imageSize.height) * 58, 92)}dvh, 980px)`
      : "min(100%, 420px)";

    function reset() {
      setOffset(clampOffset({ x: 0, y: 0 }));
      setZoom(1);
      setRotation(0);
    }

    function updateZoom(nextZoom: number) {
      setZoom(clamp(nextZoom, MIN_ZOOM, MAX_ZOOM));
    }

    function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      pointersRef.current.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY,
      });

      if (pointersRef.current.size === 2) {
        const [first, second] = Array.from(pointersRef.current.values());
        pinchStartRef.current = {
          distance: Math.hypot(first.x - second.x, first.y - second.y),
          zoom,
        };
        dragStartRef.current = null;
        return;
      }

      setDragging(true);
      dragStartRef.current = {
        pointer: {
          x: event.clientX,
          y: event.clientY,
        },
        offset,
      };
    }

    function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
      if (pointersRef.current.has(event.pointerId)) {
        pointersRef.current.set(event.pointerId, {
          x: event.clientX,
          y: event.clientY,
        });
      }

      if (pinchStartRef.current && pointersRef.current.size >= 2) {
        const [first, second] = Array.from(pointersRef.current.values());
        const distance = Math.hypot(first.x - second.x, first.y - second.y);

        if (pinchStartRef.current.distance > 0) {
          updateZoom(
            pinchStartRef.current.zoom *
              (distance / pinchStartRef.current.distance),
          );
        }

        return;
      }

      if (!dragStartRef.current) return;

      setOffset(
        clampOffset({
          x:
            dragStartRef.current.offset.x +
            event.clientX -
            dragStartRef.current.pointer.x,
          y:
            dragStartRef.current.offset.y +
            event.clientY -
            dragStartRef.current.pointer.y,
        }),
      );
    }

    function handlePointerEnd(event: React.PointerEvent<HTMLDivElement>) {
      pointersRef.current.delete(event.pointerId);
      pinchStartRef.current = null;

      if (pointersRef.current.size === 0) {
        setDragging(false);
        dragStartRef.current = null;
      }
    }

    function handleWheel(event: React.WheelEvent<HTMLDivElement>) {
      event.preventDefault();
      updateZoom(zoom - event.deltaY * ZOOM_STEP);
    }

    async function crop() {
      if (!imageUrl || !imageSize) return null;

      const image = new Image();
      image.src = imageUrl;
      await image.decode();

      const outputCanvas = document.createElement("canvas");
      outputCanvas.width = outputWidth;
      outputCanvas.height = outputHeight;

      const context = outputCanvas.getContext("2d");
      if (!context) return null;

      const scaleX = outputWidth / frame.width;
      const scaleY = outputHeight / frame.height;

      context.fillStyle = "#000000";
      context.fillRect(0, 0, outputWidth, outputHeight);
      context.setTransform(scaleX, 0, 0, scaleY, -frame.x * scaleX, -frame.y * scaleY);
      context.translate(stageSize.width / 2 + offset.x, stageSize.height / 2 + offset.y);
      context.rotate((rotation * Math.PI) / 180);
      context.scale(baseScale * zoom, baseScale * zoom);
      context.drawImage(image, -image.width / 2, -image.height / 2);
      context.setTransform(1, 0, 0, 1, 0, 0);

      const blob = await new Promise<Blob | null>((resolve) => {
        outputCanvas.toBlob(resolve, "image/jpeg", 0.92);
      });

      if (!blob) return null;

      return {
        file: new File([blob], file.name.replace(/\.\w+$/, ".jpg"), {
          type: "image/jpeg",
        }),
        dataUrl: outputCanvas.toDataURL("image/jpeg", 0.92),
      };
    }

    useImperativeHandle(ref, () => ({ crop, reset }));

    return (
      <div className="flex min-h-0 flex-1 flex-col items-center gap-4">
        <div
          ref={stageRef}
          className={`relative mx-auto touch-none select-none overflow-hidden bg-black ${
            dragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          style={{
            aspectRatio: stageAspectRatio,
            width: stageWidth,
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          onWheel={handleWheel}
        >
          {imageUrl && (
            <img
              src={imageUrl}
              alt=""
              className="absolute select-none"
              draggable={false}
              style={imageStyle}
              onLoad={(event) => {
                setImageSize({
                  width: event.currentTarget.naturalWidth,
                  height: event.currentTarget.naturalHeight,
                });
              }}
            />
          )}

          {circularGuide && (
            <div
              className="pointer-events-none absolute rounded-full shadow-[0_0_0_9999px_rgba(0,0,0,0.58)]"
              style={{
                left: frame.x,
                top: frame.y,
                width: frame.width,
                height: frame.height,
              }}
            />
          )}

          {!circularGuide && (
            <div className="pointer-events-none absolute inset-0 bg-black/55" />
          )}

          <div
            className="pointer-events-none absolute overflow-hidden border-2 border-white"
            style={{
              left: frame.x,
              top: frame.y,
              width: frame.width,
              height: frame.height,
            }}
          >
            {imageUrl && (
              <img
                src={imageUrl}
                alt=""
                className="absolute select-none"
                draggable={false}
                style={{
                  ...imageStyle,
                  left: imageLayout.left - frame.x,
                  top: imageLayout.top - frame.y,
                }}
              />
            )}

            <div className="pointer-events-none absolute inset-0 bg-black/45" />

            {imageUrl && (
              <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
                <img
                  src={imageUrl}
                  alt=""
                  className="absolute select-none"
                  draggable={false}
                  style={{
                    ...imageStyle,
                    left: imageLayout.left - frame.x,
                    top: imageLayout.top - frame.y,
                  }}
                />
              </div>
            )}

            {circularGuide && (
              <div className="pointer-events-none absolute inset-0 rounded-full border-2 border-white/85" />
            )}

            <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3">
              <span className="border-r border-b border-white/45" />
              <span className="border-r border-b border-white/45" />
              <span className="border-b border-white/45" />
              <span className="border-r border-b border-white/45" />
              <span className="border-r border-b border-white/45" />
              <span className="border-b border-white/45" />
              <span className="border-r border-white/45" />
              <span className="border-r border-white/45" />
              <span />
            </div>

            <span className="pointer-events-none absolute -left-0.5 -top-0.5 h-4 w-4 border-l-4 border-t-4 border-white" />
            <span className="pointer-events-none absolute -right-0.5 -top-0.5 h-4 w-4 border-r-4 border-t-4 border-white" />
            <span className="pointer-events-none absolute -bottom-0.5 -left-0.5 h-4 w-4 border-b-4 border-l-4 border-white" />
            <span className="pointer-events-none absolute -bottom-0.5 -right-0.5 h-4 w-4 border-b-4 border-r-4 border-white" />
          </div>
        </div>

        <div className="grid w-full max-w-md gap-3">
          <div className="rounded-xl border border-white/10 bg-neutral-950 p-3">
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={MIN_ZOOM}
                max={MAX_ZOOM}
                step={0.01}
                value={zoom}
                onChange={(event) => updateZoom(Number(event.target.value))}
                className="min-w-0 flex-1 accent-orange-500"
                aria-label="Phóng ảnh"
              />
              <span className="w-12 text-right text-xs font-black text-neutral-400">
                {Math.round(zoom * 100)}%
              </span>
            </div>
          </div>

          <AppButton
            type="button"
            variant="outline"
            onClick={() => setRotation((current) => (current - 90) % 360)}
            className="mx-auto inline-flex h-11 items-center justify-center gap-2 px-5 py-0"
          >
            <RotateCcw size={17} />
            Xoay ảnh
          </AppButton>
        </div>

        {actions && <div className="flex justify-center">{actions}</div>}
      </div>
    );
  },
);
