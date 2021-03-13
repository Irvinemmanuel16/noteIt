import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

function Welcome(props) {

  const { isAuthenticated } = props.auth;

  return (
    <div className='container mx-auto px-48 mt-24 h-96'>
      <h1 className='text-secondary font-pay text-4xl'>Welcome!</h1>
      <p className='text-primary mt-10 font-source'>This is a completely functional app made with the <strong>MERN</strong> stack. Created for people like us, people who needs reminders for important tasks.</p>
      <div className='pt-10'>
        {
          isAuthenticated 
          ? <Link to='/notes' className='btn btn-primary font-pay text-secondary hover:underline'>Begin Now</Link> 
          : <Link to='/register' className='btn btn-primary font-pay text-secondary hover:underline'>Begin Now</Link>
        }
        <a href='https://github.com/Irvinemmanuel16/noteIt' rel="noreferrer" target='_blank' className='font-pay text-primary pl-4 hover:underline'>Source code</a>
      </div>

    </div>
  );
}

const mapStateToProps = state => ({
  errors: state.errors,
  auth: state.auth
});

export default connect(mapStateToProps, {})(Welcome);