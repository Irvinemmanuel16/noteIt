import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logoutUser } from '../../redux/actions/authActions';

function Navigation(props) {

  const { isAuthenticated } = props.auth;

  return (
    <nav className='container bg-gray h-14'>
      <div className='w-11/12 flex justify-between items-center h-full mx-auto'> {/*Option px-48*/}
        <Link to='/' className='navbar-brand flex justify-evenly items-center w-24 font-pay text-primary text-lg'>
          <i className='logo-icon' />
          NoteIt
        </Link>
        <div>
          { !isAuthenticated &&
            <Link to='/login' className='hover:underline font-source text-lg text-primary'>Sign in</Link>
          }
          { isAuthenticated &&
            <span className='hover:underline font-source text-lg text-primary cursor-pointer' onClick={ props.logoutUser } >Log out</span>
          }
        </div>
      </div>
    </nav>
  );
}

const mapStateToProps = state => ({
  errors: state.errors,
  auth: state.auth
});

export default connect(mapStateToProps, { logoutUser })(Navigation);