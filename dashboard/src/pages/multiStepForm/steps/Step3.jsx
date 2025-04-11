import React from 'react';
import { useFormikContext } from 'formik';

const Step3 = () => {
    const { values, handleChange, errors, touched } = useFormikContext();

    return (
        <div className="flex flex-col items-center gap-4">
            <h2 className="text-2xl font-semibold text-gray-800">Set Your Password</h2>
            <input
                type="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={`w-full md:w-1/2 p-2 border rounded-md ${errors.password && touched.password ? 'border-red-500' : 'focus:border-blue-500'
                    }`}
            />
            {errors.password && touched.password && (
                <div className="text-red-500">{errors.password}</div>
            )}
        </div>
    );
};

export default Step3;
