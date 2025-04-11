// import { useState } from "react";

// const VerifyOtp = () => {
//     const [otp, setOtp] = useState(["", "", "", ""]);

//     const handleChange = (index, value) => {
//         if (isNaN(value)) return;
//         const newOtp = [...otp];
//         newOtp[index] = value;
//         setOtp(newOtp);

//         if (value && index < otp.length - 1) {
//             document.getElementById(`otp-${index + 1}`).focus();
//         }
//     };

//     const handleKeyDown = (index, e) => {
//         if (e.key === "Backspace" && !otp[index] && index > 0) {
//             document.getElementById(`otp-${index - 1}`).focus();
//         }
//     };

//     const handleSubmit = () => {
//         alert(`Entered OTP: ${otp.join("")}`);
//     };

//     return (
//         <div className="flex items-center justify-center min-h-screen bg-indigo-600">
//             <div className="bg-white p-8 rounded-2xl shadow-lg w-96 text-center">
//                 <h2 className="text-xl font-bold">Mobile Phone Verification</h2>
//                 <p className="text-gray-600 text-sm mt-2">Enter the 4-digit verification code that was sent to your phone number.</p>
//                 <div className="flex justify-center gap-2 my-4">
//                     {otp.map((digit, index) => (
//                         <input
//                             key={index}
//                             id={`otp-${index}`}
//                             type="text"
//                             maxLength="1"
//                             value={digit}
//                             onChange={(e) => handleChange(index, e.target.value)}
//                             onKeyDown={(e) => handleKeyDown(index, e)}
//                             className="w-12 h-12 text-center text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                         />
//                     ))}
//                 </div>
//                 <button
//                     onClick={handleSubmit}
//                     className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
//                 >
//                     Verify Account
//                 </button>
//                 <p className="text-gray-600 text-sm mt-3">
//                     Didn’t receive code? <span className="text-indigo-600 cursor-pointer">Resend</span>
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default VerifyOtp;
import { useState, useRef } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";

const otpSchema = Yup.object().shape({
    otp: Yup.array()
        .of(Yup.string().matches(/^\d$/, "Must be a number").required("Required"))
        .min(4, "OTP must be 4 digits")
        .max(4, "OTP must be 4 digits"),
});

const VerifyOtp = () => {
    const inputRefs = useRef([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (index, value, setFieldValue) => {
        if (!/^\d?$/.test(value)) return;
        setFieldValue(`otp[${index}]`, value);

        if (value && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e, values, setFieldValue) => {
        if (e.key === "Backspace" && !values.otp[index] && index > 0) {
            setFieldValue(`otp[${index}]`, "");
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async (values) => {
        setIsSubmitting(true);
        const otpCode = values.otp.join("");

        try {
            const response = await fetch("/api/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ otp: otpCode }),
            });

            const data = await response.json();
            if (response.ok) {
                toast.success("OTP Verified Successfully!");
            } else {
                toast.error(data.message || "Invalid OTP!");
            }
        } catch (error) {
            toast.error("Something went wrong!");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResendOtp = async () => {
        toast.loading("Resending OTP...");
        try {
            const response = await fetch("/api/resend-otp", { method: "POST" });
            const data = await response.json();
            if (response.ok) {
                toast.success("OTP Resent Successfully!");
            } else {
                toast.error(data.message || "Failed to resend OTP");
            }
        } catch (error) {
            toast.error("Something went wrong!");
        } finally {
            toast.dismiss();
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-indigo-600">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-96 text-center">
                <h2 className="text-xl font-bold">Mobile Phone Verification</h2>
                <p className="text-gray-600 text-sm mt-2">Enter the 4-digit verification code sent to your phone.</p>

                <Formik
                    initialValues={{ otp: ["", "", "", ""] }}
                    validationSchema={otpSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, setFieldValue }) => (
                        <Form>
                            <div className="flex justify-center gap-2 my-4">
                                {values.otp.map((_, index) => (
                                    <Field
                                        key={index}
                                        name={`otp[${index}]`}
                                        innerRef={(el) => (inputRefs.current[index] = el)}
                                        type="text"
                                        maxLength="1"
                                        className="w-12 h-12 text-center text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        onChange={(e) => handleChange(index, e.target.value, setFieldValue)}
                                        onKeyDown={(e) => handleKeyDown(index, e, values, setFieldValue)}
                                    />
                                ))}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full py-2 rounded-lg text-sm font-semibold transition ${isSubmitting
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                                    }`}
                            >
                                {isSubmitting ? "Verifying..." : "Verify Account"}
                            </button>
                        </Form>
                    )}
                </Formik>

                <p className="text-gray-600 text-sm mt-3">
                    Didn’t receive code?{" "}
                    <span className="text-indigo-600 cursor-pointer" onClick={handleResendOtp}>
                        Resend
                    </span>
                </p>
            </div>
        </div>
    );
};

export default VerifyOtp;
