import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { BoxGeometry, MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderer } from "three";

export interface Demo1Props {}

const Demo1: React.FC<Demo1Props> = () => {
  const canvasRef = useRef();
  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width = canvas.clientWidth * pixelRatio | 0;
    const height = canvas.clientHeight * pixelRatio | 0;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  const init = () => {
    // 渲染器
    const renderer = new WebGLRenderer({canvas: canvasRef.current})

    // 相机（人眼的位置）
    const fov = 75, aspect = 2,near = 0.1, far = 1000;
    const camera = new PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2;

    // 场景
    const scene = new Scene();

    // 几何
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new BoxGeometry(boxWidth, boxHeight, boxDepth);

    // 材料
    // const material = new MeshBasicMaterial({color: 0x44aa88});
    const material = new THREE.MeshPhongMaterial({color: 0x44aa88});

    // 物体/网格（由几何 + 材料组成）
    // const cube = new THREE.Mesh(geometry, material);
    // scene.add(cube);
    function makeInstance(geometry, color, x) {
      const material = new THREE.MeshPhongMaterial({color});
     
      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);
     
      cube.position.x = x;
     
      return cube;
    }
    const cubes = [
      makeInstance(geometry, 0x44aa88,  0),
      makeInstance(geometry, 0x8844aa, -2),
      makeInstance(geometry, 0xaa8844,  2),
    ];
    function render(time) {
      time *= 0.001;  // convert time to seconds
     
      cubes.forEach((cube, ndx) => {
        const speed = 1 + ndx * .1;
        const rot = time * speed;
        cube.rotation.x = rot;
        cube.rotation.y = rot;
      });
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      resizeRendererToDisplaySize(renderer)
      renderer.render(scene, camera);

      requestAnimationFrame(render);
    }
    render(600);

    renderer.render(scene, camera);

    // 动画
    // function render(time) {
    //   time *= 0.001;  // convert time to seconds
     
    //   cube.rotation.x = time;
    //   cube.rotation.y = time;
     
    //   renderer.render(scene, camera);
     
    //   requestAnimationFrame(render);
    // }
    // requestAnimationFrame(render);


    // 灯光
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }
  useEffect(() => {
    init()
  }, [])
  return (
    <canvas style={{width: "100%", height: "100%"}} ref={canvasRef}></canvas>
  )
}

Demo1.defaultProps = {

}

export default Demo1;