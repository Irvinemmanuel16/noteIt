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
import { useAndroidPlugin } from "slate-android-plugin";

function Home(props) {

  const editor = useAndroidPlugin(useMemo(() => withReact(createEditor()), []));
  const [isBold, setIsBold] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [show, setShow] = useState(true)
  const [value, setValue] = useState([
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
  ])

  const main = async () => {
    if (props.match.params.id) {
      const res = await axios.get(`/.netlify/functions/getNote?id=${props.match.params.id}`);
      setValue(res?.data?.content)
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
                className={`cursor-pointer logo-n p-3 rounded border border-white ${isBold ? 'border-opacity-50' : 'border-opacity-0'}`} 
                onMouseDown={event => {
                  event.preventDefault();
                  CustomEditor.toggleBoldMark(editor)
                  setIsBold(() => CustomEditor.isBoldMarkActive(editor) ? true : false)
                }}
              />
              <i 
                className={`cursor-pointer logo-k p-3 rounded border border-white ${isItalic ? 'border-opacity-50' : 'border-opacity-0'}`}
                onMouseDown={event => {
                  event.preventDefault()
                  CustomEditor.toggleItalicMark(editor)
                  setIsItalic(() => CustomEditor.isItalicMarkActive(editor) ? true : false)
                }}
              />
              <i 
                className={`cursor-pointer logo-s p-3 rounded border border-white ${isUnderline ? 'border-opacity-50' : 'border-opacity-0'}`} 
                onMouseDown={event => {
                  event.preventDefault()
                  CustomEditor.toggleUnderlineMark(editor)
                  setIsUnderline(() => CustomEditor.isUnderlineMarkActive(editor) ? true : false)
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