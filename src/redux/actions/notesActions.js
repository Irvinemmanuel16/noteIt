import axios from 'axios';
import { CREATE_NOTE, DELETE_NOTE, UPDATE_NOTE, GET_NOTES } from './types'

export const getNotes = user => async dispatch => {
  const res = await axios.get('/.netlify/lambda/getNotes');
  dispatch({
    type: GET_NOTES,
    payload: res.data.filter(note => note.author === user)
  });
};

export const deleteNote = (noteId, history) => async dispatch => {
  await axios.delete(`/.netlify/lambda/deleteNote?id=${noteId}`);
  dispatch({
    type: DELETE_NOTE
  })
  history.push('/notes')
};

export const createNote = (data, history) => async dispatch => {
  let { data: id } = await axios.post('/.netlify/lambda/createNote', data);
  dispatch({
    type: CREATE_NOTE
  })
  history.push(`/notes/${id}`)
}

export const updateNote = (data, id) => async dispatch => {
  await axios.put(`/.netlify/lambda/editNote?id=${id}`, data);
  dispatch({
    type: UPDATE_NOTE
  })
}