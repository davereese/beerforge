import React, { useState } from 'react';

import styles from '../Brew.module.scss';
import { BrewInterface, MashInterface } from '../../../Store/BrewContext';
import { gal2l, f2c, qt2l, l2gal, c2f, l2qt } from '../../../resources/javascript/calculator';
import BrewEditableField from './BrewEditableField';

interface Props {
  readOnly: boolean;
  newBrew: boolean;
  brew: BrewInterface;
  unitLabels: any;
  openSideBar: Function;
  user: any;
  brewdayResults: boolean;
  applyEdit: Function;
}

const BrewMash = (props: Props) => {
  const {brew, readOnly, unitLabels, openSideBar, user, brewdayResults, applyEdit} = props;

  const [editing, setEditing] = useState(false);

  const editValue = (value: any, choice: string, index: number) => {
    const editedBrew = {...brew};
    let data;
    switch (choice) {
      case 'strikeVolume':
      case 'spargeVolume':
        data = user.units === 'metric' ? l2gal(value) : value;
        break;
      case 'strikeTemp':
      case 'targetStepTemp':
      case 'totalMashVolume':
      case 'infusionWaterTemp':
      case 'spargeTemp':
        data = user.units === 'metric' ? c2f(value) : value;
        break;
      case 'infusionWaterVol':
        data = user.units === 'metric' ? l2qt(value) : value;
        break;
      default:
        data = value;
    }
    if (editedBrew.mash && choice !== 'totalWater') {
      editedBrew.mash[index][choice] = data;
    } else {
      editedBrew[choice] = Number(data);
    }
    applyEdit(editedBrew);
  }

  const utilityProps = {
    editValue,
    editing,
    setEditing,
    brewdayResults
  }

  return (
    <div className={`${styles.brew__section} ${styles.mash}`}>
      <div className={styles.brew__header}>
        <h2>Mash</h2>
        <span>{brew.batchType === 'BIAB' &&
          brew.totalMashVolume &&
          brew.kettleSize &&
          Number(brew.totalMashVolume) > Number(brew.kettleSize)
            ? <>Warning: Total mash volume exceeds kettle size</>
            : null}
        </span>
        {!readOnly
          ? <button
              className={`button button--icon pen ${styles.editButton}`}
              onClick={openSideBar('mash')}
            ><span>Edit</span></button>
          : null}
      </div>
      {brew && brew.mash.map((step: MashInterface, index: number) => (
        <div
          key={`step${index + 1}`} className={styles.mash_step}
          onClick={!readOnly ? openSideBar('mash', {...step, index: index + 1}) : () => null}
        >
          <label className={styles.mash_label}>
            {index + 1}: {step.type ? step.type.toUpperCase() : ''}
          </label>
          <div className={styles.section__values}>
            {step.type === 'strike'
              ? <>
                <span>
                  {step.strikeVolume && brew.batchType !== 'BIAB' && step.strikeTemp
                    ? <>Strike with <strong>
                          <BrewEditableField
                            fieldName="strikeVolume"
                            value={user.units === 'metric'
                              ? parseFloat(gal2l(step.strikeVolume).toFixed(2))
                              : step.strikeVolume}
                            label={` ${unitLabels.vol}`}
                            {...utilityProps}
                            editValue={(value: any, fieldName: any) => {
                              editValue(value, fieldName, index)
                            }}
                          />
                        </strong> at <strong>
                          <BrewEditableField
                            fieldName="strikeTemp"
                            value={user.units === 'metric'
                              ? parseFloat(f2c(step.strikeTemp).toFixed(2))
                              : step.strikeTemp}
                            label={` °${unitLabels.temp}`}
                            {...utilityProps}
                            editValue={(value: any, fieldName: any) => {
                              editValue(value, fieldName, index)
                            }}
                          />
                        </strong></>
                    : null}
                  {brew.totalWater && brew.batchType === 'BIAB' && step.strikeTemp
                    ? <>Strike with <strong>
                          <BrewEditableField
                            fieldName="totalWater"
                            value={brew.totalWater.toFixed(2)}
                            label={` ${unitLabels.vol}`}
                            {...utilityProps}
                          />
                        &nbsp;</strong>at <strong>
                          <BrewEditableField
                            fieldName="strikeTemp"
                            value={user.units === 'metric'
                              ? parseFloat(f2c(step.strikeTemp).toFixed(1))
                              : step.strikeTemp}
                            label={` °${unitLabels.temp}`}
                            {...utilityProps}
                            editValue={(value: any, fieldName: any) => {
                              editValue(value, fieldName, index)
                            }}
                          />
                        </strong></>
                    : null}
                </span>
                <span>
                  {step.targetStepTemp
                    ? <>Mash at <strong>
                        <BrewEditableField
                          fieldName="targetStepTemp"
                          value={user.units === 'metric'
                            ? parseFloat(f2c(step.targetStepTemp).toFixed(1))
                            : step.targetStepTemp}
                          label={` °${unitLabels.temp}`}
                          {...utilityProps}
                          editValue={(value: any, fieldName: any) => {
                            editValue(value, fieldName, index)
                          }}
                        />
                      </strong></>
                    : null}
                </span>
                <span>
                  {step.stepLength
                    ? <>Hold for <strong>
                        <BrewEditableField
                          fieldName="stepLength"
                          value={step.stepLength}
                          label=" min"
                          {...utilityProps}
                          editValue={(value: any, fieldName: any) => {
                            editValue(value, fieldName, index)
                          }}
                        />
                      </strong></>
                    : null}
                </span>
                {brew.totalMashVolume && brew.batchType === 'BIAB'
                  ? <span>Total Mash Vol: <strong>
                        <BrewEditableField
                          fieldName="totalMashVolume"
                          value={user.units === 'metric'
                            ? parseFloat(gal2l(brew.totalMashVolume).toFixed(2))
                            : brew.totalMashVolume}
                          label={` ${unitLabels.vol}`}
                          {...utilityProps}
                        />
                      </strong></span>
                  : null}
              </>
              : null}
            {step.type === 'temperature' || step.type === 'decoction'
              ? <>
                <span>
                  {step.targetStepTemp
                    ? <>Raise to <strong>
                        <BrewEditableField
                          fieldName="targetStepTemp"
                          value={user.units === 'metric'
                            ? parseFloat(f2c(step.targetStepTemp).toFixed(1))
                            : step.targetStepTemp}
                          label={` °${unitLabels.temp}`}
                          {...utilityProps}
                          editValue={(value: any, fieldName: any) => {
                            editValue(value, fieldName, index)
                          }}
                        />
                      </strong></>
                    : null}
                </span>
                <span>
                  {step.stepLength
                    ? <>Hold for <strong>
                        <BrewEditableField
                          fieldName="stepLength"
                          value={step.stepLength}
                          label=" min"
                          {...utilityProps}
                          editValue={(value: any, fieldName: any) => {
                            editValue(value, fieldName, index)
                          }}
                        />
                      </strong></>
                    : null}
                </span>
                </>
              : null}
            {step.type === 'infusion'
              ? <>
                <span>
                  {step.infusionWaterVol
                    ? <>Add <strong>
                        <BrewEditableField
                          fieldName="infusionWaterVol"
                          value={user.units === 'metric'
                            ? parseFloat(qt2l(step.infusionWaterVol).toFixed(2))
                            : step.infusionWaterVol}
                          label={` ${unitLabels.smallVol}`}
                          {...utilityProps}
                          editValue={(value: any, fieldName: any) => {
                            editValue(value, fieldName, index)
                          }}
                        />
                      </strong></>
                    : null}
                  {step.infusionWaterTemp
                    ? <> at <strong>
                        <BrewEditableField
                          fieldName="infusionWaterTemp"
                          value={user.units === 'metric'
                            ? parseFloat(f2c(step.infusionWaterTemp).toFixed(2))
                            : step.infusionWaterTemp}
                          label={` °${unitLabels.temp}`}
                          {...utilityProps}
                          editValue={(value: any, fieldName: any) => {
                            editValue(value, fieldName, index)
                          }}
                        />
                      </strong></>
                    : null}
                </span>
                <span>
                  {step.targetStepTemp
                    ? <> Bring to <strong>
                        <BrewEditableField
                          fieldName="targetStepTemp"
                          value={user.units === 'metric'
                            ? parseFloat(f2c(step.targetStepTemp).toFixed(2))
                            : step.targetStepTemp}
                          label={` °${unitLabels.temp}`}
                          {...utilityProps}
                          editValue={(value: any, fieldName: any) => {
                            editValue(value, fieldName, index)
                          }}
                        />
                      </strong></>
                    : null}
                </span>
                <span>
                  {step.stepLength
                    ? <>Hold for <strong>
                        <BrewEditableField
                          fieldName="stepLength"
                          value={step.stepLength}
                          label=" min"
                          {...utilityProps}
                          editValue={(value: any, fieldName: any) => {
                            editValue(value, fieldName, index)
                          }}
                        />
                      </strong></>
                    : null}
                </span>
                </>
              : null}
            {step.type === 'sparge'
              ? <span>
                {step.spargeTemp
                  ? <>Sparge&nbsp;
                    {step.spargeVolume
                      ? <>with <strong>
                          <BrewEditableField
                            fieldName="spargeVolume"
                            value={user.units === 'metric'
                              ? parseFloat(gal2l(step.spargeVolume).toFixed(2))
                              : step.spargeVolume}
                            label={` ${unitLabels.vol}`}
                            {...utilityProps}
                            editValue={(value: any, fieldName: any) => {
                              editValue(value, fieldName, index)
                            }}
                          />
                        </strong> </>
                      : null}
                    at <strong>
                      <BrewEditableField
                        fieldName="spargeTemp"
                        value={user.units === 'metric'
                          ? parseFloat(f2c(step.spargeTemp).toFixed(1))
                          : step.spargeTemp}
                        label={` °${unitLabels.temp}`}
                        {...utilityProps}
                        editValue={(value: any, fieldName: any) => {
                          editValue(value, fieldName, index)
                        }}
                      />
                    </strong></>
                  : null}
              </span>
              : null}
          </div>
        </div>
      ))}
    </div>
  );
}

export default BrewMash;