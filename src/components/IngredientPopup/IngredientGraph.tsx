import React from 'react';
import { ResponsiveRadar } from '@nivo/radar'

import { HopFlavors } from '../Forms/AddHopForm';
import { INGREDIENTS_GRAPH_COLORS } from '../../resources/javascript/constants';

interface IngredientValues {
  id: number;
  category: "finishing" | "bittering" | "dualPurpose";
  attributes: HopFlavors;
}

export type DataForGraph = {
  type: 'hop' | 'fermentable' | 'yeast';
  values: IngredientValues[];
}

interface FlavorGraphProps {
  graphData: DataForGraph;
}

interface GraphEntry {
  attribute: string;
  [key: number]: number;
}

const FlavorGraph: React.FC<FlavorGraphProps> = ({graphData}) => {
  let keys: string[] = [];
  const values: GraphEntry[] = graphData.values.reduce<GraphEntry[]>((accumulator: GraphEntry[], currentValue: IngredientValues) => {
    Object.entries(currentValue.attributes).forEach(([key, value]: [string, number]) => {
      const words = key.split('_');
      for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1);
      }
      const attribute = words.join("/");
      const accumulatorIndex = accumulator.findIndex((item: GraphEntry) => item.attribute === attribute);
      if (accumulatorIndex !== -1) {
        accumulator[accumulatorIndex] = {...accumulator[accumulatorIndex], [currentValue.id]: value};
      } else {
        accumulator.push({attribute: attribute, [currentValue.id]: value+1});
      }
    });
    keys.push(currentValue.id.toString());
    return accumulator;
  }, []);

  const getInsightBarColorCode = (barData: any) => {
    const category = graphData.values.find(value => value.id)?.category ;
    return category ? INGREDIENTS_GRAPH_COLORS[category] : "black";
  }

  return <>
    <span>0</span>
    <span>1</span>
    <span>2</span>
    <span>3</span>
    <span>4</span>
    <span>5</span>
    <ResponsiveRadar
      data={values}
      keys={keys}
      indexBy="attribute"
      maxValue={6}
      margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      curve="linearClosed"
      borderWidth={2}
      gridLevels={6}
      gridShape="circular"
      gridLabelOffset={12}
      enableDots={false}
      enableDotLabel={false}
      colors={(barData) => getInsightBarColorCode(barData)}
      fillOpacity={0.4}
      animate={true}
      isInteractive={false}
      theme={
        {
          textColor: 'rgb(255, 255, 255)',
          fontFamily: '"Montserrat", sans-serif',
          grid: {
            line: {
              stroke: 'rgba(233, 102, 34, 0.25)',
            },
          }
        }
      }
    />
  </>;
};

export default FlavorGraph;