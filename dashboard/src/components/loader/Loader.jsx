import React from 'react';

export default function Loader() {
    return (
        <>
            {/* Loader 1 */}
            {/* <div className='position-absolute top-50 start-50 translate-middle'>
                <div className="spinner-grow" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div> */}
            {/* Loader 2 */}
            <div className="spinner-parent">
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        </>
    )
}
