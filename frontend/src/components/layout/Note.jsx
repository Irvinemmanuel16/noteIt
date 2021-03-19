/* eslint-disable */
import { useState, useEffect } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { useCallback } from 'react';
import { Editable } from 'slate-react';
import { createNote, updateNote } from '../../redux/actions/notesActions'

function Note(props) {

  const { match, history,  } = props;

  const [form, setForm] = useState({
    title: '',
    date: new Date(),
    author: '',
    content: {}
  });

  const [editing, setEditing] = useState(false);
  const [id, setId] = useState('');

  async function main() {
    if (match.params.id) {
      const res = await axios.get(`/api/notes/${match.params.id}`);
      console.log(res?.data?.content)
      setForm({
        title: res.data.title,
        content: res.data.content,
        date: new Date(res.data.date),
        author: res.data.author
      });
      setId(res.data._id);
      setEditing(true);
    } else{
      setEditing(false)
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (editing) {
      const updatedNote = {
        title: form.title,
        content: form.content,
        author: form.userSelected,
        date: form.date
      };
      props.updateNote(updatedNote, id);
    } else {
      const newNote = {
        title: form.title,
        content: form.content,
        author: props.auth.user.name,
        date: form.date,
      };
      props.createNote(newNote, history)
    }
  }

  function onInputChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });

  }

  const renderLeaf = useCallback(props => {
    if(props.leaf.bold) return <BoldLeaf {...props} />
    if(props.leaf.italic) return <ItalicLeaf {...props} />
    if(props.leaf.underline) return <UnderlineLeaf {...props} />
    else return <Leaf {...props} />
  }, [])

  useEffect(() => {
    main();
    if(history.location.pathname === '/notes'){
      setForm({
        title: '',
        author: '',
        date: new Date()
      })
    }
  }, [history.location.pathname]);

  useEffect(() => {
    setForm({...form, content: props.value?.[0]})
  }, [props.value])



  return (
    <div className='container h-5/6'>
      <form onSubmit={ onSubmit } className='flex flex-col items-center w-11/12 mx-auto mt-4 h-full'>
        <div className='w-full bg-transparent border-2 border-gray p-2'>
          <input 
            type="text" 
            className='bg-transparent outline-none pl-2 text-base font-pay placeholder-current' 
            placeholder='Title'
            onChange={ onInputChange }
            name='title'
            maxLength='12'
            value={ form.title }
            required
          />
        </div>
        <div className='mt-4 w-full h-4/6'>
          <Editable
            name="content"
            renderLeaf={renderLeaf}
            placeholder='Content'
            className="outline-none pl-4 pr-4 pt-2 max-w-full bg-transparent placeholder-current h-4/6 w-full break-all text-primary font-source text-base"
            required
          />
        </div>
        <input type="submit" value="Save" className='self-end mr-12 bg-transparent font-pay text-primary text-2xl cursor-pointer'/>
      </form>
    </div>
  );
}

const mapStateToProps = state => ({
  auth: state.auth,
  notes: state.notes
});

const Leaf = props => {
  return (
    <span {...props.attributes}>
      {props.children}
    </span>
  )
}

const BoldLeaf = props => {
  return (
    <span
      {...props.attributes}
      style={{ fontWeight: props.leaf.bold ? 'bold' : 'normal' }}
    >
      {props.children}
    </span>
  )
}

const ItalicLeaf = props => {
  return (
    <span
      {...props.attributes}
      style={{ fontStyle: props.leaf.italic ? 'italic' : 'normal' }}
    >
      {props.children}
    </span>
  )
}
const UnderlineLeaf = props => {
  return (
    <span
      {...props.attributes}
      style={{ textDecoration: props.leaf.underline ? 'underline' : 'none' }}
    >
      {props.children}
    </span>
  )
}

export default connect(mapStateToProps, {createNote, updateNote})(Note);