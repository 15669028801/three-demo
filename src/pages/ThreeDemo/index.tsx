import React, { useEffect, useRef } from 'react';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import * as THREE from 'three';
import {
  Color,
  DirectionalLight,
  DirectionalLightHelper,
  HemisphereLight,
  HemisphereLightHelper,
  Mesh,
  MeshPhongMaterial,
  PlaneGeometry,
  Raycaster,
  Scene,
  Vector2,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export interface ThreeDemoProps {}

const ThreeDemo: React.FC<ThreeDemoProps> = () => {
  const ref = useRef<HTMLCanvasElement>();
  const initThree = () => {
    const scene = new Scene();
    const loader = new GLTFLoader();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.2, 2000);
    const renderer = new THREE.WebGLRenderer({ canvas: ref.current });
    camera.position.z = 4;
    const { clientWidth, clientHeight } = ref.current;
    renderer.setSize(clientWidth, clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio * 2);

    // 灯光
    // const color = 0xFFFFFF;
    // const intensity = 1;
    // const light = new THREE.DirectionalLight(color, intensity);
    // light.position.set(-1, 2, 4);
    // scene.add(light);

    let directionalLight = new DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(-1, 2, 4);
    let dhelper = new DirectionalLightHelper(directionalLight, 5, 0xff0000);

    let hemisphereLight = new HemisphereLight(0xffffff, 0xffffff, 0.4);
    hemisphereLight.position.set(0, 8, 0);
    let hHelper = new HemisphereLightHelper(hemisphereLight, 5);

    scene.add(directionalLight);
    scene.add(hemisphereLight);

    // animate();
    loader.load(
      'http://127.0.0.1:3000/scene/car/scene.gltf',
      (gltf) => {
        console.log('😋🙃: initThree -> gltf', gltf);
        console.log('加载成功！！！');
        scene.add(gltf.scene);
        // 模型Mesh开启阴影
        gltf.scene.traverse((obj) => {
          if (obj.isMesh) {
            obj.castShadow = true;
            obj.receiveShadow = true;
          }
        });

        let controls = new OrbitControls(camera, renderer.domElement);
        controls.enablePan = false;
        controls.maxPolarAngle = Math.PI / 2;
        controls.minPolarAngle = Math.PI / 3;
        controls.enableZoom = false;

        controls.update();

        let raycaster = new Raycaster();

        let mouse = new Vector2();

        const selectHandler = function (ev) {
          mouse.x = (ev.clientX / window.innerWidth) * 2 - 1;
          mouse.y = -(ev.clientY / window.innerHeight) * 2 + 1;
          raycaster.setFromCamera(mouse, camera);

          // 这里我们只检测模型的选中情况
          let intersects = raycaster.intersectObjects(gltf.scene.children, true);

          if (intersects.length > 0) {
            console.log(2222222222);
            let selectedObjects = intersects[0].object;
            let newMaterial = selectedObjects.material.clone();
            newMaterial.color = new Color('#D3C542'); //重新修改颜色
            selectedObjects.material = newMaterial;
            let composer = new EffectComposer(renderer);
            let renderPass = new RenderPass(scene, camera);
            composer.addPass(renderPass);

            let outlinePass = new OutlinePass(new Vector2(window.innerWidth, window.innerHeight), scene, camera);
            composer.addPass(outlinePass);

            outlinePass.visibleEdgeColor.set('#ff0000'); // 选中颜色
            outlinePass.edgeStrength = 5;
            outlinePass.edgeGlow = 1.5;

            const render = function () {
              requestAnimationFrame(render);
              composer.render();
            };
          }
        };

        document.body.addEventListener('click', selectHandler, false);
        renderer.render(scene, camera);
      },
      (e) => {
        console.log(e);
      },
      (err) => {
        console.log(err);
      }
    );

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

    // 首先渲染器开启阴影
    renderer.shadowMap.enabled = true;

    // 光源开启阴影
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize = new Vector2(1024, 1024);
    directionalLight.shadow.bias = -0.001;

    // 地板接受阴影开启
    floor.receiveShadow = true;
  };
  useEffect(() => {
    initThree();
  }, []);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <canvas style={{ width: '100%', height: '100%' }} ref={ref}></canvas>
    </div>
  );
};

ThreeDemo.defaultProps = {};

export default ThreeDemo;
