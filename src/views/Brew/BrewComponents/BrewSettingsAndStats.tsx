import React, { useState } from "react";

import styles from "../Brew.module.scss";
import componentStyles from "./BrewComponents.module.scss";
import Card from "../../../components/Card/Card";
import {
  BrewInterface,
  processOptionsInterface
} from "../../../store/BrewContext";
import { parseStringValues } from "../BrewUtils";
import { getSrmToRgb } from "../../../resources/javascript/srmToRgb";
import {
  gal2l,
  l2gal,
  mashEfficiency,
  attenuation,
  alcoholContent,
  IBU,
  SRM,
  totalBIABWater,
  totalWater
} from "../../../resources/javascript/calculator";
import BrewEditableField from "./BrewEditableField";

interface Props {
  readOnly: boolean;
  newBrew: boolean;
  brew: BrewInterface;
  unitLabels: any;
  openSideBar: Function;
  clone: Function;
  brewdayResultsToggle: Function;
  user: any;
  brewdayResults: boolean;
  applyEdit: Function;
  originalBrew: BrewInterface | null;
  options: processOptionsInterface;
}

const BrewSettingsAndStats = (props: Props) => {
  const {
    brew,
    newBrew,
    readOnly,
    unitLabels,
    openSideBar,
    clone,
    brewdayResults,
    user,
    brewdayResultsToggle,
    applyEdit,
    originalBrew,
    options
  } = props;

  const [editing, setEditing] = useState(false);
  const [showSwatch, setShowSwatch] = useState(true);

  const editValue = (array: { value: any; choice: string }[]) => {
    const editedBrew = { ...brew };
    array.forEach(change => {
      let data;
      if (change.choice === "batchSize") {
        data = user.units === "metric" ? l2gal(change.value) : change.value;
      } else {
        data = change.value;
      }
      editedBrew[change.choice] = data;
    });
    applyEdit(editedBrew);
  };

  const utilityProps = {
    editValue,
    editing,
    setEditing,
    brewdayResults
  };

  return (
    <Card
      color="brew"
      customClass={
        newBrew ? styles.new : brewdayResults ? styles.res : styles.view
      }
    >
      <div className={styles.brew__numbers}>
        <div className={styles.brew__numbersMenu}>
          <ul className={styles.brew__numbersList}>
            <li>
              Brew Method: <strong>{parseStringValues(brew.batchType)}</strong>
            </li>
            <li>
              Batch Size:{" "}
              <strong>
                <BrewEditableField
                  fieldName="batchSize"
                  value={
                    brew.batchSize
                      ? user.units === "metric"
                        ? parseFloat(gal2l(brew.batchSize).toFixed(2))
                        : brew.batchSize
                      : null
                  }
                  label={` ${unitLabels.vol}`}
                  {...utilityProps}
                  editValue={(value: any, fieldName: any) => {
                    let totalWaterVol;
                    if (originalBrew && brew.batchType === "BIAB") {
                      totalWaterVol = totalBIABWater(
                        Number(value),
                        brew.boilLength,
                        brew.evaporationRate,
                        originalBrew.totalFermentables,
                        originalBrew.totalHops,
                        options
                      );
                    } else if (originalBrew) {
                      totalWaterVol = totalWater(
                        Number(value),
                        brew.boilLength,
                        brew.evaporationRate,
                        originalBrew.totalFermentables,
                        options
                      );
                    }
                    editValue([
                      { value: Number(value), choice: fieldName },
                      { value: totalWaterVol, choice: "totalWater" }
                    ]);
                  }}
                />
              </strong>
              {originalBrew !== null &&
                Number(originalBrew.batchSize) !== Number(brew.batchSize) && (
                  <span className={componentStyles.originalValue}>
                    Batch Size:{" "}
                    <strong>
                      {user.units === "metric"
                        ? parseFloat(gal2l(originalBrew.batchSize).toFixed(2))
                        : originalBrew.batchSize}{" "}
                      {unitLabels.vol}
                    </strong>
                  </span>
                )}
            </li>
            <li>
              Mash Efficiency:{" "}
              <strong>
                <BrewEditableField
                  fieldName="mashEfficiency"
                  value={brew.mashEfficiency ? brew.mashEfficiency : null}
                  label="%"
                  calculate={() => {
                    if (
                      brew.fermentables &&
                      brew.preBoilVolume &&
                      brew.preBoilG
                    ) {
                      const value = mashEfficiency(
                        brew.fermentables,
                        Number(brew.preBoilVolume),
                        Number(brew.preBoilG)
                      );
                      editValue([{ value: value, choice: "mashEfficiency" }]);
                    }
                  }}
                  {...utilityProps}
                  editValue={(value: any, fieldName: any) => {
                    editValue([{value: value, choice: fieldName}])
                  }}
                />
              </strong>
              {originalBrew !== null &&
                Number(originalBrew.mashEfficiency) !==
                  Number(brew.mashEfficiency) && (
                  <span className={componentStyles.originalValue}>
                    Mash Efficiency:{" "}
                    <strong>{originalBrew.mashEfficiency}%</strong>
                  </span>
                )}
            </li>
          </ul>

          <div className={styles.brew__menu}>
            {!readOnly && (
              <button
                className={`button button--icon-large button--light-brown button--no-shadow gear`}
                onClick={openSideBar("settings")}
                title="Settings"
                disabled={brewdayResults}
              >
                <span>Settings</span>
              </button>
            )}
            {/* {!readOnly && <button
                className={`button button--icon-large button--light-brown button--no-shadow eq`}
                onClick={() =>{}}
                title="Brew EQ"
                disabled={brewdayResults}
              ><span>Brew&nbsp;EQ</span></button>} */}
            <button
              className={`button button--icon-large button--light-brown button--no-shadow clone`}
              onClick={clone()}
              title="Clone"
              disabled={newBrew || brewdayResults}
            >
              <span>Clone</span>
            </button>
            {!readOnly && (
              <button
                className={`button button--icon-large button--light-brown button--no-shadow results`}
                onClick={brewdayResultsToggle()}
                disabled={newBrew}
                title="Brewday Results"
              >
                <span>Brewday&nbsp;Results</span>
              </button>
            )}
          </div>
        </div>
        <div className={styles.brew__stats}>
          <div className={styles.brew__stat}>
            <div>
              <span className={styles.value}>
                <BrewEditableField
                  fieldName="alcoholContent"
                  value={brew.alcoholContent ? brew.alcoholContent : null}
                  label="%"
                  noInputLabel
                  calculate={() => {
                    const value = alcoholContent(brew.og, brew.fg);
                    editValue([{ value: value, choice: "alcoholContent" }]);
                  }}
                  classes={`${componentStyles.editInputCenter} ${componentStyles.editInputLarge}`}
                  {...utilityProps}
                  editValue={(value: any, fieldName: any) => {
                    editValue([{value: value, choice: fieldName}])
                  }}
                />
              </span>
              {originalBrew !== null &&
                Number(originalBrew.alcoholContent) !==
                  Number(brew.alcoholContent) && (
                  <span
                    className={`${componentStyles.originalValue} ${componentStyles.bottomSpacing}`}
                  >
                    <strong>{originalBrew.alcoholContent}%</strong>
                  </span>
                )}
              <label className={styles.label}>ABV</label>
            </div>
          </div>
          <div className={styles.brew__stat}>
            <div>
              <span className={styles.value}>
                <BrewEditableField
                  fieldName="attenuation"
                  value={brew.attenuation ? brew.attenuation : null}
                  label="%"
                  noInputLabel
                  calculate={() => {
                    const value = attenuation(brew.og, brew.fg);
                    editValue([{ value: value, choice: "attenuation" }]);
                  }}
                  classes={`${componentStyles.editInputCenter} ${componentStyles.editInputLarge}`}
                  {...utilityProps}
                  editValue={(value: any, fieldName: any) => {
                    editValue([{value: value, choice: fieldName}])
                  }}
                />
              </span>
              {originalBrew !== null &&
                Number(originalBrew.attenuation) !==
                  Number(brew.attenuation) && (
                  <span
                    className={`${componentStyles.originalValue} ${componentStyles.bottomSpacing}`}
                  >
                    <strong>{originalBrew.attenuation}%</strong>
                  </span>
                )}
              <label className={styles.label}>ATTEN</label>
            </div>
          </div>
          <div className={styles.brew__stat}>
            <div>
              <span className={styles.value}>
                <BrewEditableField
                  fieldName="ibu"
                  value={brew.ibu ? brew.ibu : null}
                  noInputLabel
                  calculate={() => {
                    const value = IBU(brew.hops, brew.og, brew.batchSize);
                    editValue([{ value: value, choice: "ibu" }]);
                  }}
                  classes={`${componentStyles.editInputCenter} ${componentStyles.editInputLarge}`}
                  {...utilityProps}
                  editValue={(value: any, fieldName: any) => {
                    editValue([{value: value, choice: fieldName}])
                  }}
                />
              </span>
              {originalBrew !== null &&
                Number(originalBrew.ibu) !== Number(brew.ibu) && (
                  <span
                    className={`${componentStyles.originalValue} ${componentStyles.bottomSpacing}`}
                  >
                    <strong>{originalBrew.ibu}</strong>
                  </span>
                )}
              <label className={styles.label}>IBU</label>
            </div>
          </div>
          <div className={styles.brew__stat}>
            <div>
              <span className={styles.value}>
                {brew.srm && showSwatch && (
                  <div
                    className={styles.srmSwatch}
                    style={{ backgroundColor: getSrmToRgb(brew.srm) }}
                  />
                )}
                <BrewEditableField
                  fieldName="srm"
                  value={brew.srm ? brew.srm : null}
                  noInputLabel
                  calculate={() => {
                    const value = SRM(brew.fermentables, brew.batchSize);
                    editValue([{ value: value, choice: "srm" }]);
                  }}
                  classes={`${componentStyles.editInputCenter} ${componentStyles.editInputLarge}`}
                  {...utilityProps}
                  setEditing={(value: boolean) => {
                    setEditing(value);
                    setShowSwatch(!value);
                  }}
                  editValue={(value: any, fieldName: any) => {
                    editValue([{value: value, choice: fieldName}])
                  }}
                />
              </span>
              {originalBrew !== null &&
                Number(originalBrew.srm) !== Number(brew.srm) && (
                  <span
                    className={`${componentStyles.originalValue} ${componentStyles.bottomSpacing}`}
                  >
                    <strong>{originalBrew.srm}</strong>
                  </span>
                )}
              <label className={styles.label}>SRM</label>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BrewSettingsAndStats;
