import React, { useEffect } from "react";
import { observer } from "mobx-react";

import * as THREE from "three";

import "./App.css";
import { appStore } from "./stores";

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const App = () => {
  (window as any).appStore = appStore;

  useEffect(() => {
    appStore.initScene(renderer);
  }, []);

  return <div className="App"></div>;
};

export default observer(App);
