import React from 'react';

function Alert({ msg, id, handler }) {

  return (
    <div className='bg-gray rounded-xl md:w-2/4 sm:w-3/5 w-1/4 mx-auto mt-12 flex sm:text-xs justify-between p-4 font-pay text-primary text-sm'>
      { msg }
      <i className={ `alert-${id} logo-close cursor-pointer` } onClick={ handler } />
    </div>
  );
}

export default Alert;