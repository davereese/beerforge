import React, { useState, useEffect } from "react";

import styles from "./Forms.module.scss";
import Info from "../Info/Info";
import { useUser } from "../../store/UserContext";
import { BrewInterface } from "../../store/BrewContext";
import { l2gal, gal2l } from "../../resources/javascript/calculator";
import Select from "../Select/Select";
import { PITCHING_RATES } from "../../resources/javascript/constants";

interface Props {
  brew: BrewInterface;
  dataUpdated: Function;
  delete: Function;
}

function BrewSettingsForm(props: Props) {
  const [user] = useUser();
  const [formData, setFormData] = useState({
    ...props.brew,
    targetPitchingRate: props.brew.targetPitchingRate
      ? props.brew.targetPitchingRate
      : "0.75"
  });

  const dataChanged = (type: string) => (event: any) => {
    let data;
    if (type === "dateBrewed") {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      data = `${event.currentTarget.value}T${hours}:${minutes}`;
    } else if (type === "batchSize") {
      data =
        user.units === "metric"
          ? l2gal(event.currentTarget.value)
          : event.currentTarget.value;
    } else {
      data = event.currentTarget.value;
    }
    setFormData({ ...formData, [type]: data });
  };

  const getFormattedDate = (date: string | Date) => {
    const d = new Date(date);
    const month = ("0" + (d.getMonth() + 1)).slice(-2);
    const day = ("0" + d.getDate()).slice(-2);
    const year = d.getFullYear();

    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    props.dataUpdated(formData);
  }, [formData, props]);

  useEffect(() => {
    if (!formData.mashEfficiency) {
      setFormData({...formData, mashEfficiency: user.mash_efficiency ? user.mash_efficiency : ''});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <label>
        Name
        <br />
        <input
          type="text"
          placeholder="New Brew"
          defaultValue={`${props.brew.name}`}
          onChange={dataChanged("name")}
        />
      </label>
      <label>
        Brew Date
        <br />
        <input
          type="date"
          defaultValue={
            props.brew.dateBrewed
              ? getFormattedDate(props.brew.dateBrewed).toString()
              : ""
          }
          onChange={dataChanged("dateBrewed")}
        />
      </label>
      <div className={styles.row}>
        <label>
          Batch Type
          <br />
          <Select
            options={[
              {value:"", option:"Choose One"},
              {value:"allGrain", option:"All Grain"},
              {value:"BIAB", option:"BIAB"},
              {value:"partialMash", option:"Partial Mash"},
              {value:"extract", option:"Extract"},
            ]}
            value={formData.batchType || ""}
            onChange={dataChanged('batchType')}
            className="capitalize lightInput"
          />
        </label>
        <label>
          Units (global change)&nbsp;
          <Info
            alignment="top-right"
            info="The&nbsp;units&nbsp;are&nbsp;managed at the account level. Go to your profile to switch. This will only change how units are displayed, and will not have any other affect on saved brews."
          />
          <br />
          <span className={styles.info}>Current: <strong>{`${user.units === "metric" ? "Metric" : "US"}`}</strong></span>
        </label>
      </div>
      <div className={styles.row}>
        <label>
          Batch Size ({user.units === "metric" ? "L" : "gal"})&nbsp;
          <Info
            alignment="top-right"
            info="Volume&nbsp;of&nbsp;wort you expect to transfer to the fermentor."
          />
          <br />
          <input
            type="number"
            placeholder={user.units === "metric" ? "22.5" : "6"}
            step="0.1"
            defaultValue={`${
              user.units === "metric"
                ? parseFloat(gal2l(props.brew.batchSize).toFixed(2))
                : props.brew.batchSize
            }`}
            onChange={dataChanged("batchSize")}
          />
        </label>
        <label>
          Mash Efficiency (%){" "}
          <Info
            alignment="top-right"
            info="Mash&nbsp;extraction efficiency in percentage."
          />
          <br />
          <input
            type="number"
            placeholder="75"
            value={`${formData.mashEfficiency}`}
            onChange={dataChanged("mashEfficiency")}
          />
        </label>
      </div>
      <label>
        Target Pitching Rate (million cells / ml / °Plato){" "}
        <Info
          alignment="top-right"
          info="It is reccommended to use a rate highter than&nbsp;the&nbsp;manufacturer's."
        />
        <br />
        <Select
          options={PITCHING_RATES}
          value={`${formData.targetPitchingRate}`}
          onChange={dataChanged('targetPitchingRate')}
          className="capitalize lightInput"
        />
      </label>
      {props.brew.id ? (
        <button
          className={`button button--error button--no-shadow ${styles.fullButton}`}
          onClick={() => props.delete()}
        >
          {props.brew.isDraft ? `Remove Draft` : `Remove Brew`}
        </button>
      ) : null}
    </>
  );
}

export default BrewSettingsForm;
