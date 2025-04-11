import React from 'react';
import { useFormikContext } from 'formik';

const Step1 = () => {
    const { values, handleChange, errors, touched } = useFormikContext();

    return (
        <div className="flex flex-col items-center gap-4">
            <h2 className="text-2xl font-semibold text-gray-800">Personal Information</h2>
            <input
                type="text"
                name="name"
                value={values.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className={`w-full md:w-1/2 p-2 border rounded-md ${errors.name && touched.name ? 'border-red-500' : 'focus:border-blue-500'
                    }`}
            />
            {errors.name && touched.name && (
                <div className="text-red-500">{errors.name}</div>
            )}
        </div>
    );
};

export default Step1;
