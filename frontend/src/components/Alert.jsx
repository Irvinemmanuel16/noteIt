import React from 'react';

function Alert({ msg, handler }) {

  return (
    <div className='mt-4'>
      <div className="alert alert-dark alert-dismissible fade show" role="alert" >
        { msg }
        <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={ handler }>
          <span aria-hidden="true" className={ msg.slice(0, 1) }>&times;</span>
        </button>
      </div>
    </div>
  );
}

export default Alert;