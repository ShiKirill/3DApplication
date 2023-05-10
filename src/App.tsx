import React, { useEffect } from "react";
import { observer } from "mobx-react";
import * as THREE from "three";
import { appStore } from "./stores";

import SceneElementControlPanel from "./features/SceneElementControlPanel";

import "./App.css";
import { Snackbar } from "@mui/material";

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const App = () => {
  useEffect(() => {
    (window as any).appStore = appStore;
    appStore.initScene(renderer);
  }, []);

  return (
    <div className="App">
      <SceneElementControlPanel />
      <Snackbar
        open={appStore.isSnackbarVisible}
        message="Необходимо сбросить перспективное преобразование, чтобы продолжить работу с объектом"
      />
    </div>
  );
};

export default observer(App);
