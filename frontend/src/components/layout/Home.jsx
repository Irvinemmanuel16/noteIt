import { useState } from 'react'
import NotesList from './NotesList'
import Note from './Note'
import { connect } from 'react-redux'
import { deleteNote } from '../../redux/actions/notesActions';

function Home(props) {

  const [show, setShow] = useState(true)

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
        <div className={`text-secondary border-b-4 border-r-4 border-gray flex justify-between items-center ${show ? 'text-editor' : 'border-l-4'}`}>
          <div className='h-12 flex items-center ml-2'>
            <i className={`logo-tab hidden lg:inline ${!show ? 'transform rotate-180' : '' }`} onClick={() => setShow(prev => !prev)}/>
          </div>
          <div className='w-1/5 sm:w-2/5 flex justify-evenly items-center mr-2'>
            <i className='logo-n' />
            <i className='logo-k' />
            <i className='logo-s' />
          </div>
        </div>
        <div className={`text-secondary border-r-4 border-b-4 border-gray bg-blue note-editor ${!show ? 'border-l-4' : ''}`}>
          <Note match={props.match} history={props.history} />
        </div>
      </div>
    </>
  )
}

const mapStateToProps = state => ({
  notes: state.notes
});

export default connect(mapStateToProps, { deleteNote })(Home);