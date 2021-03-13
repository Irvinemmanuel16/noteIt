import NotesList from './NotesList'
import Note from './Note'
import { connect } from 'react-redux'
import { deleteNote } from '../../redux/actions/notesActions';

function Home(props) {
  return(
    <>
      <div className='container grid grid-flow-col grid-default h-screen mx-auto px-48'>
        <div className='text-secondary border-r-4 border-l-4 border-b-4 font-pay flex justify-evenly items-center border-gray text-lg'>
          <i className='logo-delete cursor-pointer' onClick={() => props.deleteNote(props.match.params.id, props.history)} />
            My Notes
          <i className='logo-new cursor-pointer' onClick={() => props.history.push('/notes')} />
        </div>
        <div className='text-secondary border-r-4 border-l-4 border-gray bg-blue'>
          <NotesList history={props.history} className='overflow-y-scroll'/>
        </div>
        <div className='text-secondary border-b-4 border-r-4 border-gray flex justify-end items-center'>
          <div className='h-12 w-1/5 flex justify-evenly items-center'>
            <i className='logo-n' />
            <i className='logo-k' />
            <i className='logo-s' />
          </div>
        </div>
        <div className='text-secondary border-r-4 border-gray bg-blue'>
          <Note match={props.match} history={props.history} />
        </div>
      </div>
    </>
  )
}

const mapStateToProps = state => ({
  notes: state.notes.notes
});

export default connect(mapStateToProps, { deleteNote })(Home);