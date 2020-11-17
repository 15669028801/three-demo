import { DirectionalLight, FileLoader, Object3D, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import * as THREE from "three";
import { geoMercator } from "d3-geo";
import AxisGridHelper from "./AxisGridHelper";
import { GUI } from "dat.gui";

// 添加轴线网格辅助
const addAxisGridHelper = (mesh) => {
  const gui = new GUI();
  function makeAxisGrid(node, label, units = 10) {
    const helper = new AxisGridHelper(node, units);
    gui.add(helper, 'visible').name(label);
  }
  makeAxisGrid(mesh, 'solarSystem', 2225);
}

export default class MapDemo {
  canvas: HTMLCanvasElement;
  renderer: WebGLRenderer;
  map: Object3D;
  scene: Scene;
  camera: PerspectiveCamera;
  constructor(canvas) {
    this.canvas = canvas;
    this.renderer = new WebGLRenderer({ canvas: this.canvas })
    this.init()
  }
  init() {
    // 场景
    const { clientWidth, clientHeight } = this.canvas;

    this.scene = new Scene();
    console.log("😋🙃场景初始化");
    this.camera = this.createCamera()
    this.createLight(this.scene);
    
    this.renderer.setSize(clientWidth, clientHeight, false);
    this.renderer.render(this.scene, this.camera);
    // this.creatSunMaterial(this.scene)
    this.loadMapData();
  }
  createCamera() {

    const fov = 75, aspect = 2,near = 0.1, far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, -20, 170);
    camera.up.set(0, 0, 1);
    camera.lookAt(0, 0, 0);
    const { clientWidth, clientHeight } = this.canvas;
    camera.aspect = clientWidth / clientHeight;
    camera.updateProjectionMatrix();
    return camera;
  }
  createLight(scene) {
    // 灯光
    const ambientLight = new THREE.AmbientLight('#FFFFFF'); // 环境光
    scene.add(ambientLight);
  }
  loadMapData() {
    const loader = new FileLoader();
    loader.load("http://127.0.0.1:3001/china3d/json/chongqing.json", (data: any) => {
      const jsonData = JSON.parse(data);
      this.initMap(jsonData);
    })
  }
  initMap(jsonData) {

    // 地图
    this.map = new Object3D();
    this.map.scale.set(0.5, 0.5, 0.5);
    
    const projection = geoMercator().center([106.6, 29.6]).scale(5000).translate([0, 0]);

    jsonData.features.forEach(element => {
      // 定一个省份(区县)3D对象
      const province = new Object3D();
      // 每个的 坐标 数组
      const coordinates = element.geometry.coordinates;
      // 循环坐标数组
      coordinates.forEach(multiPolygon => {

        multiPolygon.forEach(polygon => {
          const shape = new THREE.Shape();
          const lineMaterial = new THREE.LineBasicMaterial({
            color: 'white'
          });
          const lineGeometry = new THREE.Geometry();

          for (let i = 0; i < polygon.length; i++) {
            const [x, y] = projection(polygon[i]);
            if (i === 0) {
              shape.moveTo(x, -y);
            }
            shape.lineTo(x, -y);
            lineGeometry.vertices.push(new THREE.Vector3(x, -y, 4.01));
          }

          const extrudeSettings = {
            depth: 4,
            bevelEnabled: false
          };

          const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
          const material = new THREE.MeshBasicMaterial({
            color: '#02A1E2',
            transparent: true,
            opacity: 0.6
          });
          const material1 = new THREE.MeshBasicMaterial({
            color: '#3480C4',
            transparent: true,
            opacity: 0.5
          });
          /* const material = new THREE.MeshBasicMaterial({ color: '#dedede', transparent: false, opacity: 0.6 });
          const material1 = new THREE.MeshBasicMaterial({ color: '#dedede', transparent: false, opacity: 0.5 }); */
          const mesh = new THREE.Mesh(geometry, [material, material1]);
          const line = new THREE.Line(lineGeometry, lineMaterial);
          province.add(mesh);
          province.add(line)

        })

      })

      // 将geo的属性放到省份模型中
      province.properties = element.properties;
      if (element.properties.contorid) {
        const [x, y] = projection(element.properties.contorid);
        province.properties._centroid = [x, y];
      }
      console.log("添加地图")
      this.map.add(province);
    });
    console.log(1111)
    addAxisGridHelper(this.map);
    this.scene.add(this.map);
    this.renderer.render(this.scene, this.camera);
  }
}