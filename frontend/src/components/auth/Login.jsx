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
      return prevErrors.filter(error => `alert-${error.id}` !== e.target.className);
    });
  };

  useEffect(() => {
    if (props.auth.isAuthenticated) {
      props.history.push('/notes');
    }
  }, [props.auth]);

  useEffect(() => {
    setErrors(() => props.errors);
  }, [props.errors]);

  return (
    <React.Fragment>
      <div className="mx-auto mt-24 flex justify-center">
        <div className="border-4 border-gray w-1/5 xs:w-2/4 sm:w-7/12 lg:w-5/12 xl:w-3/12 h-80 rounded-3xl flex flex-col justify-evenly items-center bg-gray bg-opacity-5">
          <h4 className='text-3xl font-pay text-primary'>Sign in</h4>
          <form onSubmit={ onSubmit } className='flex flex-col items-center justify-between mt-2 h-45 w-11/12' >
              <input type="text" name="email" className="w-full outline-none text-primary bg-white bg-opacity-5 border-2 rounded-xl pl-3 py-1 border-gray placeholder-white font-source bg-gray bg-opacity-20" onChange={ onChange } placeholder='Email' />
              <input type="password" name="password" className="w-full mb-4 outline-none text-primary bg-white bg-opacity-5 border-2 rounded-xl pl-3 py-1 border-gray placeholder-white font-source bg-gray bg-opacity-20" onChange={ onChange } placeholder='Password' />
            <div className="mx-auto">
              <button className="text-secondary font-pay text-2xl hover:underline focus:outline-none">Submit</button>
            </div>
          </form>
          <span className='text-primary font-source sm:text-sm sm:px-2.5'>Don't have an account ?&nbsp;<Link to='/register' className='text-secondary font-source hover:underline'>create one</Link></span>
        </div>
      </div>
      {errors.length > 0 &&
        <Alert msg={ errors[0].msg } key={ `error-${errors[0].id}` } id={ errors[0].id } handler={ onClick } />
      }
    </React.Fragment>
  );
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, { loginUser })(Login);