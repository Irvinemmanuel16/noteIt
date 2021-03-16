/*eslint-disable*/
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getNotes, deleteNote } from '../../redux/actions/notesActions'

function NotesList(props) {

  useEffect(() => {
    props.getNotes(props.auth.user.name);
  }, [props.notes]);
  
  return (
    <>
    {
      props.notes?.map(note => (
        <Link to={ `/notes/${note._id}` } key={ note._id } onDoubleClick={() => props.deleteNote(note._id, props.history)} className='flex justify-center items-center h-14 border-b-2 border-gray font-pay text-primary text-base'>
          {note.title}
        </Link>
      ))
    }
    </>
  );
}

const mapStateToProps = state => ({
  auth: state.auth,
  notes: state.notes
});

export default connect(mapStateToProps, {getNotes, deleteNote})(NotesList);