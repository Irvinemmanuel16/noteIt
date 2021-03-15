/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { registerUser } from '../../redux/actions/authActions';
import Alert from '../Alert';

function Register(props) {
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });

  const [errors, setErrors] = useState([]);

  const onChange = e => {
    e.preventDefault();
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const onSubmit = e => {
    e.preventDefault();
    props.registerUser({ ...data }, props.history);
  };

  // const onClick = (e) => {
  //   setErrors(prevErrors => {
  //     return prevErrors.filter(error => error.slice(0, 1) !== e.target.className);
  //   });
  // };

  useEffect(() => {
    setErrors(() => Object.values(props.errors));
  }, [props.errors]);

  useEffect(() => {
    if (props.auth.isAuthenticated) {
      props.history.push('/notes');
    }
  }, [props.auth]);


  return (
    <React.Fragment>
      <div className='mx-auto mt-24 flex justify-center'>
        <div className='border-4 border-gray w-1/5 xs:w-2/4 sm:w-7/12 lg:w-4/12 xl:w-3/12 h-96 rounded-3xl flex flex-col justify-evenly items-center bg-gray bg-opacity-5'>
          <h4 className='text-3xl font-pay text-primary'>Sign Up</h4>
          <form onSubmit={ onSubmit } className='flex flex-col justify-between mt-2 h-3/5 w-11/12' >
              <input className='text-primary w-full outline-none bg-white bg-opacity-5 border-2 rounded-xl pl-3 py-1 border-gray placeholder-white font-source bg-gray bg-opacity-20' placeholder='Name' type="text" name='name' onChange={ onChange } />
              <input className='text-primary w-full outline-none bg-white bg-opacity-5 border-2 rounded-xl pl-3 py-1 border-gray placeholder-white font-source bg-gray bg-opacity-20' placeholder='Email' type="text" name='email' onChange={ onChange } />
              <input className='text-primary w-full outline-none bg-white bg-opacity-5 border-2 rounded-xl pl-3 py-1 border-gray placeholder-white font-source bg-gray bg-opacity-20' placeholder='Password' type="password" name='password' onChange={ onChange } />
              <input className='mb-4 text-primary outline-none bg-white bg-opacity-5 border-2 rounded-xl pl-3 py-1 border-gray placeholder-white font-source bg-gray bg-opacity-20' placeholder='Confirm password' type="password" name='password2' onChange={ onChange } />
              <div className='mx-auto'>
                <button className='text-secondary font-pay text-2xl hover:underline focus:outline-none'>Submit</button>
              </div>
          </form>
          <span className='text-primary font-source  sm:text-sm sm:px-1.5'>Already have an account ?&nbsp;<Link to='/login' className='text-secondary font-source hover:underline'>Sign in</Link></span>
        </div>
      </div>
      {/* {errors.map(msg => (
        <Alert msg={ msg } key={ `${Math.random()}${msg.slice(0, 1)}` } handler={ onClick } />
      )) } */}
    </React.Fragment>
  );
}

const mapStateToProps = state => ({
  errors: state.errors,
  auth: state.auth
});

export default connect(mapStateToProps, { registerUser })(Register);