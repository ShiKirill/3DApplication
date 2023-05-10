import React, { ChangeEvent } from "react";
import { observer } from "mobx-react";
import block from "bem-cn";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import { appStore } from "../../stores";
import { Axis } from "../../shared";

import "./SceneElementControlPanel.scss";

const cnSceneElementControlPanel = block("SceneElementControlPanel");

const SceneElementControlPanel = () => {
  const changeVisibilityHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    appStore.setMaterialVisibility(!event.target.checked);
  };

  const changeAxis = (event: SelectChangeEvent<Axis>) => {
    appStore.changeSelectedAxis(event.target.value as Axis);
  };

  const changeValue = (event: ChangeEvent<HTMLInputElement>) => {
    appStore.changeTransformationValue(
      event.target.value ? Number(event.target.value) : null
    );
  };

  const onBlur = () => {
    if (!appStore.transformationValue) appStore.changeTransformationValue(0);
  };

  return (
    <div className={cnSceneElementControlPanel()}>
      <div>
        <label
          htmlFor={"visibility"}
          className={cnSceneElementControlPanel("text").toString()}
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

      <p className={cnSceneElementControlPanel("text")}>
        Одноточечное перспективное преобразование
      </p>

      <div className={cnSceneElementControlPanel("fieldsContainer")}>
        <FormControl
          className={cnSceneElementControlPanel("select").toString()}
        >
          <InputLabel id="select-label">Ось</InputLabel>
          <Select
            labelId={"select-label"}
            value={appStore.selectedAxis}
            onChange={changeAxis}
            label={"Ось"}
          >
            <MenuItem value={Axis.X}>{Axis.X}</MenuItem>
            <MenuItem value={Axis.Y}>{Axis.Y}</MenuItem>
            <MenuItem value={Axis.Z}>{Axis.Z}</MenuItem>
          </Select>
        </FormControl>

        <FormControl className={cnSceneElementControlPanel("input").toString()}>
          <TextField
            value={appStore.transformationValue}
            onChange={changeValue}
            onBlur={onBlur}
            InputProps={{
              inputProps: { min: 0 },
            }}
            label={"Значение"}
            type="number"
          />
        </FormControl>
      </div>

      <div className={cnSceneElementControlPanel("buttons")}>
        <Button
          className={cnSceneElementControlPanel("btn").toString()}
          variant="outlined"
          onClick={appStore.resetMatrixTransformation}
        >
          Сбросить
        </Button>

        <Button
          className={cnSceneElementControlPanel("btn").toString()}
          variant="contained"
          onClick={appStore.transformMatrix}
        >
          Применить
        </Button>
      </div>
    </div>
  );
};

export default observer(SceneElementControlPanel);
