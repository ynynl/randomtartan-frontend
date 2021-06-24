import React, { useState, useRef, useEffect, MutableRefObject } from 'react';

import Konva from 'konva';
import { Stage, Layer, Image, Rect } from 'react-konva';
import useImage from 'use-image';

import { selectSrcImg, selectTartan, setResult } from '../home/tartanSlice';
import { useAppSelector, useAppDispatch } from '../../app/hooks';

import Setting from '../setting';
import { useResizeObserver } from 'beautiful-react-hooks';
import { Grid, Paper } from '@material-ui/core';
import { downloadURI } from '../../helpers/downloader';

type ShapeProps = {
  x: number,
  y: number,
  width: number | undefined,
  height: number | undefined,
  scaleX: number,
  scaleY: number
}

const initialRectangle: ShapeProps = {
  x: 150,
  y: 150,
  width: 0,
  height: 600,
  scaleX: 1,
  scaleY: 1
}

type StageProps = {
  width: number,
  height: number,
  x: number,
  y: number,
  offset: {
    x: number,
    y: number
  }
}

const initStage: StageProps = {
  width: 300,
  height: 300,
  x: 0,
  y: 0,
  offset: {
    x: 0,
    y: 0
  }
}



const DisplayCanvas = () => {

  const SrcImg = useAppSelector(selectSrcImg);
  const tartan = useAppSelector(selectTartan)
  const dispatch = useAppDispatch()


  const [idx, setIdx] = useState(0)
  const [image] = useImage(SrcImg);
  const [tartanImg] = useImage(tartan[idx]);

  const stageRef = React.useRef<Konva.Stage>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const rectRef = useRef<Konva.Image>(null)
  const containerSize = useResizeObserver(containerRef as MutableRefObject<HTMLElement>)
  const containerSizeFloor = containerSize ? Math.floor((containerSize as DOMRect).width) : containerSize// Reduce the sensitivity of the resize observer

  const [initImg, setInitImg] = useState<ShapeProps>(initialRectangle)
  const [stageSize, setStageSize] = useState<StageProps>(initStage)
  const [value, setValue] = React.useState<number>(50);
  const [hasNext, setHasNext] = useState(false)
  const [hasPrev, setHasPrev] = useState(false)
  const [showImg, setShowImg] = useState(true)
  const [rect, setRect] = React.useState<ShapeProps>(initialRectangle);

  useEffect(() => {
    setIdx(tartan.length - 1)
  }, [tartan.length])

  useEffect(() => {
    setHasNext(idx < tartan.length - 1)
    setHasPrev(idx > 0)
  }, [idx, tartan.length])

  useEffect(() => {
    if (containerSize && containerSize.width && containerSize.height) {
      const width = containerSize.width
      const height = 600
      setStageSize({
        width: width,
        height: height,
        x: width / 2,
        y: height / 2,
        offset: {
          x: width / 2,
          y: height / 2,
        }
      })
    }
    // eslint-disable-next-line
  }, [containerSizeFloor])

  // Adjust image
  useEffect(() => {
    if (image && stageSize) {
      const width = (stageSize.width > 768) ? stageSize.width * 0.5 : stageSize.width * 0.8
      const height = width / image.width * image.height
      const imgSize = {
        x: stageSize.width / 2,
        y: stageSize.height / 2,
        offset: {
          x: width / 2,
          y: height / 2,
        },
        width: width,
        height: height,
        scaleX: 1,
        scaleY: 1
      }
      setInitImg(imgSize)
      setRect(imgSize)
    }
  }, [image, stageSize])


  useEffect(() => {
    const node = rectRef.current
    if (initImg && initImg.width && initImg.height && node) {
      const width = (initImg.width) * value / 50
      const height = (initImg.height) * value / 50

      const dw = node.width() - width
      const dh = node.height() - height

      node.x(node.x() + dw / 2)
      node.y(node.y() + dh / 2)

      setRect(r => {
        return (
          {
            ...r,
            width: width,
            height: height,
          })
      })
    }

  }, [value, initImg])


  const handleExport = () => {
    const uri = stageRef.current?.toDataURL();
    dispatch(setResult(uri))
  };

  const handleScale = (event: any, newValue: number | number[]) => {
    setValue(newValue as number);
  };

  const handleSave = () => {
    const uri = stageRef.current?.toDataURL();
    if (uri) {
      downloadURI(uri, 'randomtartan.png');
    }
  }

  const handleNext = () => {
    if (idx < tartan.length - 1) {
      setIdx(idx + 1)
    }
  }

  const handlePrev = () => {
    if (idx > 0) {
      setIdx(idx - 1)
    }
  }

  return (
    <>
      <Grid container spacing={3} direction="row"> 
        <Grid item xs md={8}  >
          <Paper color='lightgrey' style={{ backgroundColor: 'lightgrey' }} ref={containerRef}>
            <Grid container
              direction="row"
              justify="center"
              alignItems="center"
            >
              <Grid item>
                <Stage
                  {...stageSize}
                  ref={stageRef}
                >
                  <Layer>
                    {image &&
                      <>
                        <Rect
                          id='bg'
                          {...stageSize}
                          fillPatternImage={tartanImg}
                        />
                        {showImg &&
                          <Image
                            ref={rectRef}
                            image={image}
                            {...rect}
                            draggable
                            onDragEnd={(e) => {
                              setRect({
                                ...rect,
                                x: e.target.x(),
                                y: e.target.y(),
                              });
                            }} />
                        }
                      </>
                    }
                  </Layer>
                </Stage>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs md={4}>
          <Setting
            handleExport={handleExport}
            handleScale={handleScale}
            showImg={showImg}
            handleShowImg={() => setShowImg(!showImg)}
            handleSave={handleSave}
            handleNext={handleNext}
            handlePrev={handlePrev}
            hasPrev={hasPrev}
            hasNext={hasNext}
            index = {idx}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default DisplayCanvas

