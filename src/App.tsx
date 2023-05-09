import React, { useEffect } from "react";
import { observer } from "mobx-react";
import * as THREE from "three";
import { appStore } from "./stores";

import SceneElementControlPanel from "./features/SceneElementControlPanel";

import "./App.css";

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const App = () => {
  useEffect(() => {
    appStore.initScene(renderer);
  }, []);

  return (
    <div className="App">
      <SceneElementControlPanel />
    </div>
  );
};

export default observer(App);
