import { makeAutoObservable } from "mobx";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "dat.gui";

class AppStore {
  public cylinderGeometryProps = {
    radiusTop: 2,
    radiusBottom: 6,
    height: 20,
    radialSegments: 8,
  };

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });

    this.scene = new THREE.Scene();

    const geometry = new THREE.CylinderGeometry(
      this.cylinderGeometryProps.radiusTop,
      this.cylinderGeometryProps.radiusBottom,
      this.cylinderGeometryProps.height,
      this.cylinderGeometryProps.radialSegments
    );
    const material = new THREE.MeshPhongMaterial({
      color: 0xeeff00,
      flatShading: true,
    });
    this.cylinder = new THREE.Mesh(geometry, material);

    const light = new THREE.PointLight(0xffff00);
    light.position.set(100, 100, 100);
    this.light = light;

    const ambientLight = new THREE.AmbientLight(0x404040, 5); // soft white light
    this.scene.add(ambientLight);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );

    camera.position.z = 100;
    this.camera = camera;

    const axesHelper = new THREE.AxesHelper(1000);

    this.scene.add(axesHelper);
  }

  public isSceneInited = false;

  private gui = new GUI();

  public scene;

  public camera;

  public light;

  public cylinder;

  public initCylinder() {
    this.scene.add(this.cylinder);
  }

  public initLight() {
    this.scene.add(this.light);
  }

  private redraw() {
    let newGeometry = new THREE.CylinderGeometry(
      this.cylinderGeometryProps.radiusTop,
      this.cylinderGeometryProps.radiusBottom,
      this.cylinderGeometryProps.height,
      this.cylinderGeometryProps.radialSegments
    );
    this.cylinder.geometry.dispose();
    this.cylinder.geometry = newGeometry;
  }

  public initGUI() {
    const cameraGUI = this.gui.addFolder("camera projection");
    cameraGUI.add(this.camera, "fov").min(10).max(500).step(10);
    cameraGUI.open();

    const cylinderGUI = this.gui.addFolder("cylinder transform");
    cylinderGUI
      .add(this.cylinderGeometryProps, "radiusTop", 1, 50)
      .onChange(this.redraw);
    cylinderGUI
      .add(this.cylinderGeometryProps, "radiusBottom", 1, 50)
      .onChange(this.redraw);
    cylinderGUI
      .add(this.cylinderGeometryProps, "height", 0, 100)
      .onChange(this.redraw);
    cylinderGUI
      .add(this.cylinderGeometryProps, "radialSegments", 1, 50)
      .onChange(this.redraw);
    cylinderGUI.open();

    const cylinderPositionGUI = this.gui.addFolder("cylinder position");
    cylinderPositionGUI.add(this.cylinder.position, "x", -100, 100);
    cylinderPositionGUI.add(this.cylinder.position, "y", -100, 100);
    cylinderPositionGUI.add(this.cylinder.position, "z", -100, 100);
    cylinderPositionGUI.open();

    const cylinderRotationGUI = this.gui.addFolder("cylinder rotation");
    cylinderRotationGUI
      .add(this.cylinder.rotation, "x", -2 * Math.PI, 2 * Math.PI)
      .step(0.1);
    cylinderRotationGUI
      .add(this.cylinder.rotation, "y", -2 * Math.PI, 2 * Math.PI)
      .step(0.1);
    cylinderRotationGUI
      .add(this.cylinder.rotation, "z", -2 * Math.PI, 2 * Math.PI)
      .step(0.1);
    cylinderRotationGUI.open();

    const cylinderScaleGUI = this.gui.addFolder("cylinder scale");
    cylinderScaleGUI.add(this.cylinder.scale, "x", 1, 10);
    cylinderScaleGUI.add(this.cylinder.scale, "y", 1, 10);
    cylinderScaleGUI.add(this.cylinder.scale, "z", 1, 10);
    cylinderScaleGUI.open();
  }

  public initScene(renderer: any) {
    if (this.isSceneInited) return;

    this.initLight();
    this.initCylinder();
    this.initGUI();

    const controls = new OrbitControls(this.camera, renderer.domElement);
    controls.enableZoom = false;

    const animate = () => {
      requestAnimationFrame(animate);

      this.camera.updateProjectionMatrix();
      controls.update();

      renderer.render(this.scene, this.camera);
    };

    animate();

    this.isSceneInited = true;
  }
}

export default new AppStore();
