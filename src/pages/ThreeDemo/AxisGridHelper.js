import * as THREE from "three";
//打开/关闭轴和网格可见
// dat.GUI需要一个返回布尔值的属性
//决定创建一个复选框，以便我们创建一个二传手
//和“可见”的获取器，我们可以告诉dat.GUI
//查看。
export default class AxisGridHelper {
  constructor(node, units = 10) {
    const axes = new THREE.AxesHelper();
    axes.material.depthTest = false;
    axes.renderOrder = 2;  //在网格之后
    node.add(axes);
 
    const grid = new THREE.GridHelper(units, units);
    grid.material.depthTest = false;
    grid.renderOrder = 1;
    node.add(grid);
 
    this.grid = grid;
    this.axes = axes;
    this.visible = false;
  }
  get visible() {
    return this._visible;
  }
  set visible(v) {
    this._visible = v;
    this.grid.visible = v;
    this.axes.visible = v;
  }
}