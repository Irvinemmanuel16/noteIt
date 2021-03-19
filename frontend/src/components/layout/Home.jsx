/* eslint-disable */
import { useState, useMemo, useEffect } from 'react'
import { connect } from 'react-redux'
import { createEditor } from 'slate'
import axios from 'axios';
import { Slate, withReact } from 'slate-react';
import { deleteNote } from '../../redux/actions/notesActions';
import CustomEditor from '../../utils/customEditor';
import Note from './Note'
import NotesList from './NotesList'

function Home(props) {

  const [show, setShow] = useState(true)
  const editor = useMemo(() => withReact(createEditor()), [])
  const [value, setValue] = useState([
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
  ])

  const main = async () => {
    if (props.match.params.id) {
      const res = await axios.get(`/api/notes/${props.match.params.id}`);
      // console.log(res)
      setValue(res.data.content)
    }
  }

  useEffect(() => {
    main()
    if(props.history.location.pathname === '/notes'){
      setValue(() => [
        {
          type: 'paragraph',
          children: [{ text: '' }],
        },
      ])
    }
  }, [props.history.location.pathname])

  return(
    <>
      <div className={`container grid ${show ? 'grid-default' : 'grid-hidden' } min-h-screen h-full`}>
        {show && <>
          <div className='text-secondary border-r-4 border-l-4 border-b-4 font-pay flex justify-evenly icons items-center border-gray text-lg'>
            <i className='logo-delete cursor-pointer' onClick={() => props.deleteNote(props.match.params.id, props.history)} />
              <span className='lg:hidden'>My Notes</span>
            <i className='logo-new cursor-pointer' onClick={() => props.history.push('/notes')} />
          </div>
          <div className='text-secondary border-r-4 border-l-4 border-b-4 border-gray bg-blue notes-list'>
            <NotesList history={props.history} className='overflow-y-scroll'/>
          </div>
        </>}
        <Slate editor={editor} value={value} onChange={value => {
          setValue(value)
        }}>
          <div className={`text-secondary border-b-4 border-r-4 border-gray flex justify-between items-center ${show ? 'text-editor' : 'border-l-4'}`}>
            <div className='h-12 flex items-center ml-2'>
              <i className={`logo-tab hidden lg:inline ${!show ? 'transform rotate-180' : '' }`} onClick={() => setShow(prev => !prev)}/>
            </div>
            <div className='w-1/5 sm:w-2/5 flex justify-evenly items-center mr-2'>
              <i 
                className='cursor-pointer logo-n' 
                onMouseDown={event => {
                  event.preventDefault(); 
                  CustomEditor.toggleBoldMark(editor)
                }}
              />
              <i 
                className='cursor-pointer logo-k' 
                onMouseDown={event => {
                  event.preventDefault()
                  CustomEditor.toggleItalicMark(editor)
                }}
              />
              <i 
                className='cursor-pointer logo-s' 
                onMouseDown={event => {
                  event.preventDefault()
                  CustomEditor.toggleUnderlineMark(editor)
                }}
              />
            </div>
          </div>
          <div className={`text-secondary border-r-4 border-b-4 border-gray bg-blue note-editor ${!show ? 'border-l-4' : ''}`}>
            <Note match={props.match} history={props.history} editor={editor} value={value} />
          </div>
        </Slate>
      </div>
    </>
  )
}

const mapStateToProps = state => ({
  notes: state.notes
});

export default connect(mapStateToProps, { deleteNote })(Home);