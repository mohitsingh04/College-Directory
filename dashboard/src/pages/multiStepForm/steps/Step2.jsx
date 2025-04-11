import React from 'react';
import { useFormikContext } from 'formik';

const Step2 = () => {
    const { values, handleChange, errors, touched } = useFormikContext();

    return (
        <div className="flex flex-col items-center gap-4">
            <h2 className="text-2xl font-semibold text-gray-800">Contact Information</h2>
            <input
                type="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`w-full md:w-1/2 p-2 border rounded-md ${errors.email && touched.email ? 'border-red-500' : 'focus:border-blue-500'
                    }`}
            />
            {errors.email && touched.email && (
                <div className="text-red-500">{errors.email}</div>
            )}
        </div>
    );
};

export default Step2;
