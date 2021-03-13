/*eslint-disable*/
import { CREATE_NOTE, DELETE_NOTE, GET_NOTES, UPDATE_NOTE } from '../actions/types';

const initialState = {
  notes: []
}

export default function(state = initialState, action) {
  switch(action.type) {
    case GET_NOTES:
      return {
        ...state,
        notes: action.payload
      }
    case DELETE_NOTE: 
      return {...state}

    case UPDATE_NOTE: 
      return {...state}

    case CREATE_NOTE: 
      return {...state}
    default: 
      return {...state}
  }
}