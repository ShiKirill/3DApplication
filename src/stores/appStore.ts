import { makeAutoObservable } from "mobx";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "dat.gui";
import { Axis } from "../shared";

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
    this.scene.background = new THREE.Color(0xaaaaaa);

    const geometry = new THREE.CylinderGeometry(
      this.cylinderGeometryProps.radiusTop,
      this.cylinderGeometryProps.radiusBottom,
      this.cylinderGeometryProps.height,
      this.cylinderGeometryProps.radialSegments
    );
    const material = new THREE.MeshPhongMaterial({
      color: 0xe59aa7,
      flatShading: true,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
      side: THREE.DoubleSide,
    });
    this.cylinder = new THREE.Mesh(geometry, material);

    const geo = new THREE.EdgesGeometry(this.cylinder.geometry);
    const mat = new THREE.LineBasicMaterial({ color: 0x000000 });
    const wireframe = new THREE.LineSegments(geo, mat);
    this.cylinder.add(wireframe);

    const ambientLight = new THREE.AmbientLight(0xaaaaaa, 2);
    this.scene.add(ambientLight);

    this.light = new THREE.PointLight(0xaaaaaa);
    this.light.position.set(100, 50, 75);
    this.scene.add(this.light);

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

  public isMaterialVisible = true;

  public selectedAxis = Axis.X;

  public transformationValue: number | null = 0;

  public isSnackbarVisible = false;

  public initCylinder() {
    this.scene.add(this.cylinder);
  }

  public changeSelectedAxis(axis: Axis) {
    this.selectedAxis = axis;
  }

  public changeTransformationValue(value: number | null) {
    this.transformationValue = value;
  }

  private redraw() {
    const newGeometry = new THREE.CylinderGeometry(
      this.cylinderGeometryProps.radiusTop,
      this.cylinderGeometryProps.radiusBottom,
      this.cylinderGeometryProps.height,
      this.cylinderGeometryProps.radialSegments
    );

    const newWireframeGeometry = new THREE.EdgesGeometry(newGeometry);

    this.cylinder.children[0].geometry.dispose();
    this.cylinder.children[0].geometry = newWireframeGeometry;

    this.cylinder.geometry.dispose();
    this.cylinder.geometry = newGeometry;
  }

  public initGUI() {
    const cameraGUI = this.gui.addFolder("camera projection");
    cameraGUI.add(this.camera, "fov").min(10).max(500).step(10);
    cameraGUI.open();

    const lightGUI = this.gui.addFolder("light position");
    lightGUI.add(this.light.position, "x", -150, 150);
    lightGUI.add(this.light.position, "y", -150, 150);
    lightGUI.add(this.light.position, "z", -150, 150);
    lightGUI.open();

    const cylinderGUI = this.gui.addFolder("cylinder transform");
    cylinderGUI
      .add(this.cylinderGeometryProps, "radiusTop", 1, 50)
      .step(1)
      .onChange(this.redraw);
    cylinderGUI
      .add(this.cylinderGeometryProps, "radiusBottom", 1, 50)
      .step(1)
      .onChange(this.redraw);
    cylinderGUI
      .add(this.cylinderGeometryProps, "height", 0, 100)
      .step(1)
      .onChange(this.redraw);
    cylinderGUI
      .add(this.cylinderGeometryProps, "radialSegments", 1, 50)
      .step(1)
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

  public setMaterialVisibility(isVisible: boolean) {
    this.isMaterialVisible = isVisible;
    this.cylinder.material.visible = isVisible;
  }

  public transformMatrix() {
    this.cylinder.matrixAutoUpdate = false;
    this.isSnackbarVisible = true;
    this.gui.hide();

    switch (this.selectedAxis) {
      case Axis.X: {
        this.cylinder.matrix.elements[3] = this.transformationValue;

        break;
      }
      case Axis.Y: {
        this.cylinder.matrix.elements[7] = this.transformationValue;

        break;
      }
      case Axis.Z: {
        this.cylinder.matrix.elements[11] = this.transformationValue;

        break;
      }
    }
  }

  public resetMatrixTransformation() {
    this.cylinder.matrixAutoUpdate = true;
    this.isSnackbarVisible = false;
    this.gui.show();
  }
}

export default new AppStore();
