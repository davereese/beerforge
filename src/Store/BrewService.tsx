import axios from 'axios';

import { BrewInterface } from './BrewContext';
import { UserInterface } from './UserContext';

export async function saveBrew(brew: BrewInterface, user: UserInterface) {
  const authHeaders = {'authorization': user ? user.token : null};
  return await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/brew`, {brew: brew}, {
    headers: authHeaders,
  });
}

export async function updateBrew(brew: BrewInterface, user: UserInterface) {
  const authHeaders = {'authorization': user ? user.token : null};
  return await axios.put(`${process.env.REACT_APP_API_ENDPOINT}/brew/${brew.id}`, {brew: brew}, {
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