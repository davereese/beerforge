import axios from 'axios';
import cloneDeep from 'lodash.clonedeep';

import { BrewInterface, processOptionsInterface, processBrew } from './BrewContext';
import { UserInterface } from './UserContext';

const options: processOptionsInterface = {
  units: 'us',
  ibuFormula: 'rager'
}

export async function saveBrew(brew: BrewInterface, user: UserInterface) {
  // convert brew to use the formulas and units we want to save with
  const processedBrew = processBrew(cloneDeep(brew), options);
  const authHeaders = {'authorization': user ? user.token : null};
  return await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/brew`, {brew: processedBrew}, {
    headers: authHeaders,
  });
}

export async function updateBrew(brew: BrewInterface, user: UserInterface) {
  // convert brew to use the formulas and units we want to save with
  const processedBrew = processBrew(cloneDeep(brew), options);
  const authHeaders = {'authorization': user ? user.token : null};
  return await axios.put(`${process.env.REACT_APP_API_ENDPOINT}/brew/${brew.id}`, {brew: processedBrew}, {
    headers: authHeaders,
  });
}

export async function getBrew(brewId: number, user: UserInterface) {
  const authHeaders = {'authorization': user ? user.token : null};
  return await axios.get(`${process.env.REACT_APP_API_ENDPOINT}/brew/${brewId}`, {
    headers: authHeaders,
  })
}

export async function deleteBrew(brewId: number, user: UserInterface) {
  const authHeaders = {'authorization': user ? user.token : null};
  return await axios.delete(`${process.env.REACT_APP_API_ENDPOINT}/brew/${brewId}`, {
    headers: authHeaders,
  });
}