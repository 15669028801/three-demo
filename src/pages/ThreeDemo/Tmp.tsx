import React, { useEffect, useRef } from "react";
import { Mesh, MeshPhongMaterial, PerspectiveCamera, PlaneGeometry, Scene, WebGLRenderer } from "three";
import * as THREE from "three";

export interface TmpProps {}

const Tmp: React.FC<TmpProps> = () => {
  const canvasRef = useRef();
  
  const init = () => {
    // 渲染器
    const renderer = new WebGLRenderer({canvas: canvasRef.current})
    // 相机（人眼的位置）
    const fov = 75, aspect = 2,near = 0.1, far = 1000;
    const camera = new PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2;
    
    // 场景
    const scene = new Scene();
    creatLight(scene);
    creatMaterial(scene);
    creatFloor(scene);
    renderer.render(scene, camera);
  }

  const creatLight = (scene) => {
    // 灯光
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }

  const creatFloor = (scene) => {
    // 地板
    let floorGeometry = new PlaneGeometry(5000, 5000, 1);
    let floorMaterial = new MeshPhongMaterial({
      color: 0x77f28f,
      shininess: 0,
    });
    let floor = new Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -0.5 * Math.PI;
    floor.position.y = -0.55;
    scene.add(floor);
  }


  const creatMaterial = (scene) => {
    // 要更新其旋转的对象数组
    const objects = [];

    //只需使用一个球体
    const radius = 1;
    const widthSegments = 6;
    const heightSegments = 6;
    const sphereGeometry = new THREE.SphereBufferGeometry(
    radius, widthSegments, heightSegments);
    
    const sunMaterial = new THREE.MeshPhongMaterial({emissive: 0xFFFF00});
    const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
    sunMesh.scale.set(5, 5, 5);  //使太阳变大
    scene.add(sunMesh);
    objects.push(sunMesh);
  }

  useEffect(() => {
    init()
  }, [])

  return (
    <canvas style={{width: "100%", height: "100%"}} ref={canvasRef}></canvas>
  )
}

Tmp.defaultProps = {

}

export default Tmp;