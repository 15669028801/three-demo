import React, { useEffect, useRef } from "react";
import { Scene, WebGLRenderer } from "three";
import * as THREE from "three";
import AxisGridHelper from "./AxisGridHelper";
import { GUI } from "dat.gui";

export interface TmpProps {}

const Tmp: React.FC<TmpProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement>();

  const sphereGeometry = () => {
    //只需使用一个球体
    const radius = 1;
    const widthSegments = 6;
    const heightSegments = 6;
    return new THREE.SphereBufferGeometry(
    radius, widthSegments, heightSegments);
  }

  const resizeRendererToDisplaySize = (renderer) => {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  const init = () => {
    // 渲染器
    const renderer = new WebGLRenderer({canvas: canvasRef.current})
    const objects = [];
    const camera = creatCamera(renderer)
    
    // 场景
    const scene = new Scene();
    
    const solarSystem = creatSolarSystem(scene, objects); // 太阳系
    const earthOrbit = creatEarthOrbit(scene, objects); // 地球轨道
    const moonOrbit = creatMoonOrbit(earthOrbit, objects); // 月亮轨道
    const sunMesh = creatSunMaterial(solarSystem, objects); // 太阳
    const earthMesh = creatEarchMaterial(earthOrbit, objects); // 地球
    const moonMesh = creatMoonMaterial(moonOrbit, objects); // 月亮
    creatLight(scene);

    addAxisGridHelper([solarSystem, sunMesh, earthOrbit, earthMesh, moonOrbit, moonMesh])
    addAxesHelper(objects)
    renderer.render(scene, camera);
    requestAnimationFrame((time) => render(renderer, camera, objects, scene, time));
  }
  // 添加轴线辅助
  const addAxesHelper = (objects) => {
    //向每个节点添加一个AxesHelper（辅助， X(红色),Y(绿色), Z(蓝色)）
    objects.forEach((node) => {
      const axes = new THREE.AxesHelper();
      axes.material.depthTest = false;
      axes.renderOrder = 1;
      node.add(axes);
    });
  }

  // 添加轴线网格辅助
  const addAxisGridHelper = ([solarSystem, sunMesh, earthOrbit, earthMesh, moonOrbit, moonMesh]) => {
    const gui = new GUI();
    function makeAxisGrid(node, label, units = 10) {
      const helper = new AxisGridHelper(node, units);
      gui.add(helper, 'visible').name(label);
    }
     
    makeAxisGrid(solarSystem, 'solarSystem', 25);
    makeAxisGrid(sunMesh, 'sunMesh');
    makeAxisGrid(earthOrbit, 'earthOrbit');
    makeAxisGrid(earthMesh, 'earthMesh');
    makeAxisGrid(moonOrbit, 'moonOrbit');
    makeAxisGrid(moonMesh, 'moonMesh');
  }


  // 相机
  const creatCamera = (renderer) => {
    const fov = 75, aspect = 2,near = 0.1, far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 50, 0);
    camera.up.set(0, 0, 1);
    camera.lookAt(0, 0, 0);
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    return camera;
  }

  // 灯光
  const creatLight = (scene) => {
    const color = 0xFFFFFF;
    const intensity = 3;
    const light = new THREE.PointLight(color, intensity);
    scene.add(light);
  }

  // 太阳系
  const creatSolarSystem = (scene, objects) => {
    const solarSystem = new THREE.Object3D();
    scene.add(solarSystem);
    objects.push(solarSystem);
    return solarSystem;
  }

  // 地球轨道
  const creatEarthOrbit = (scene, objects) => {
    const earthOrbit = new THREE.Object3D();
    earthOrbit.position.x = 10;
    scene.add(earthOrbit);
    objects.push(earthOrbit);
    return earthOrbit;
  }

  // 月亮轨道
  const creatMoonOrbit = (scene, objects) => {
    const moonOrbit = new THREE.Object3D();
    moonOrbit.position.x = 2;
    scene.add(moonOrbit);
    objects.push(moonOrbit);
    return moonOrbit;
  }

  // 太阳物体
  const creatSunMaterial = (scene, objects) => {
    const sunMaterial = new THREE.MeshPhongMaterial({emissive: 0xFFFF00});
    const sunMesh = new THREE.Mesh(sphereGeometry(), sunMaterial);
    sunMesh.scale.set(5, 5, 5);  //使太阳变大
    scene.add(sunMesh);
    objects.push(sunMesh);
    return sunMesh;
  }

  // 地球
  const creatEarchMaterial = (scene, objects) => {
    const earthMaterial = new THREE.MeshPhongMaterial({color: 0x2233FF, emissive: 0x112244});
    const earthMesh = new THREE.Mesh(sphereGeometry(), earthMaterial);
    scene.add(earthMesh);
    objects.push(earthMesh);
    return earthMesh;
  }

  // 月亮
  const creatMoonMaterial = (scene, objects) => {
    const moonMaterial = new THREE.MeshPhongMaterial({color: 0x888888, emissive: 0x222222});
    const moonMesh = new THREE.Mesh(sphereGeometry(), moonMaterial);
    moonMesh.scale.set(.5, .5, .5);
    scene.add(moonMesh);
    objects.push(moonMesh);
    return moonMesh;
  }

  const render = (renderer, camera, objects,  scene,  time) => {
    time *= 0.001;
    
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    objects.forEach((obj) => {
      obj.rotation.y = time;
    });

    renderer.render(scene, camera);

    requestAnimationFrame((time1) => render(renderer, camera, objects,  scene,  time1));
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