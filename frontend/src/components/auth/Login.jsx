/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { loginUser } from '../../redux/actions/authActions';
import Alert from '../Alert';

function Login(props) {

  const [data, setData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState([]);

  const onSubmit = e => {
    e.preventDefault();
    props.loginUser({ ...data });
  };

  const onChange = e => {
    e.preventDefault();
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const onClick = (e) => {
    setErrors(prevErrors => {
      return prevErrors.filter(error => error.slice(0, 1) !== e.target.className);
    });
  };

  useEffect(() => {
    if (props.auth.isAuthenticated) {
      props.history.push('/notes');
    }
  }, [props.auth]);

  useEffect(() => {
    setErrors(() => Object.values(props.errors));
  }, [props.errors]);

  return (
    <React.Fragment>
      <div className="mx-auto mt-24 flex justify-center">
        <div className="border-4 border-gray w-1/5 min-w-min h-80 rounded-3xl flex flex-col justify-evenly items-center bg-gray bg-opacity-5">
          <h4 className='text-3xl font-pay text-primary'>Sign in</h4>
          <form onSubmit={ onSubmit } className='flex flex-col justify-between mt-2 h-45' >
            <div>
              <input type="text" name="email" className="outline-none text-primary bg-white bg-opacity-5 border-2 rounded-xl pl-3 py-1 border-gray placeholder-white font-source bg-gray bg-opacity-20" onChange={ onChange } placeholder='Email' />
            </div>
            <div className='mb-4'>
              <input type="password" name="password" className="outline-none text-primary bg-white bg-opacity-5 border-2 rounded-xl pl-3 py-1 border-gray placeholder-white font-source bg-gray bg-opacity-20" onChange={ onChange } placeholder='Password' />
            </div>
            <div className="mx-auto">
              <button className="text-secondary font-pay text-2xl hover:underline outline-none">Submit</button>
            </div>
          </form>
          <span className='text-primary font-source' >Don't have an account ?&nbsp;<Link to='/register' className='text-secondary font-source hover:underline'>create one</Link></span>
        </div>
      </div>
      {/* {errors.map(msg => (
        <Alert msg={ msg } key={ `${Math.random()}${msg.slice(0, 1)}` } handler={ onClick } />
      )) } */}
    </React.Fragment>
  );
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, { loginUser })(Login);