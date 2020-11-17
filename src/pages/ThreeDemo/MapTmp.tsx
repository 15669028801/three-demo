import React, { useEffect, useRef } from "react";
import MapDemo from "./MapDemo.ts";

export interface MapTmpProps {}

const MapTmp: React.FC<MapTmpProps> = () => {
  const canvasRef = useRef();
  useEffect(() => {
    new MapDemo(canvasRef.current)
  }, [])
  

  return (
    <canvas style={{width: "100%", height: "100%"}} ref={canvasRef}></canvas>
  )
}

MapTmp.defaultProps = {

}

export default MapTmp;