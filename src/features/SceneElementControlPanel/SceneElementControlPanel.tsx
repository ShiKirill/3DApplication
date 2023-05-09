import React from "react";
import { observer } from "mobx-react";
import block from "bem-cn";
import { appStore } from "../../stores";

import "./SceneElementControlPanel.scss";

const cnSceneElementControlPanel = block("SceneElementControlPanel");

const SceneElementControlPanel = () => {
  const changeVisibilityHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    appStore.setMaterialVisibility(!event.target.checked);
  };

  return (
    <div className={cnSceneElementControlPanel()}>
      <label
        htmlFor={"visibility"}
        className={cnSceneElementControlPanel("text")}
      >
        Сменить режим отображения невидимых граней
      </label>
      <input
        id={"visibility"}
        type="checkbox"
        checked={!appStore.isMaterialVisible}
        onChange={changeVisibilityHandler}
      />
    </div>
  );
};

export default observer(SceneElementControlPanel);
