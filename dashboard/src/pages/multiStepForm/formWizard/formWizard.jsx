import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import validator from "validator";

// Step 1
function Step1({ nextStep, handleFormData, values }) {
    const [error, setError] = useState(false);

    const submitFormData = (e) => {
        e.preventDefault();

        // Validate the input
        if (validator.isEmpty(values.propertyType)) {
            setError(true);
        } else {
            setError(false);
            nextStep(); // Move to the next step
        }
    };

    return (
        <div>
            <Form onSubmit={submitFormData}>
                <Form.Group className="">
                    <Form.Label>Type</Form.Label>
                    <div>
                        {/* Add multiple radio options for property type */}
                        <Form.Check
                            type="radio"
                            id="university"
                            label="University"
                            value="University"
                            name="propertyType"
                            checked={values.propertyType === "University"}
                            onChange={handleFormData("propertyType")}
                            style={{ border: error ? "2px solid #6259ca" : "" }}
                        />
                        <Form.Check
                            type="radio"
                            id="college"
                            label="College"
                            value="College"
                            name="propertyType"
                            checked={values.propertyType === "College"}
                            onChange={handleFormData("propertyType")}
                            style={{ border: error ? "2px solid #6259ca" : "" }}
                        />
                    </div>
                    {error && (
                        <Form.Text style={{ color: "#6259ca" }}>
                            This is a required field
                        </Form.Text>
                    )}
                </Form.Group>
                <Button type="submit">Continue</Button>
            </Form>
        </div>
    );
}

export default Step1;


function Name({ nextStep, handleFormData, values }) {
    const [error, setError] = useState(false);
    const submitFormData = (e) => {
        e.preventDefault();
        if (
            validator.isEmpty(values.firstName) ||
            validator.isEmpty(values.lastName)
        ) {
            setError(true);
        } else {
            nextStep();
        }
    };

    return (
        <div>
            <Form onSubmit={submitFormData}>
                <Form.Group className="">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                        style={{ border: error ? "2px solid #6259ca" : "" }}
                        name="firstName"
                        defaultValue={values.firstName}
                        type="text"
                        placeholder="First Name"
                        onChange={handleFormData("firstName")}
                    />
                    {error ? (
                        <Form.Text style={{ color: "#6259ca" }}>
                            This is a required field
                        </Form.Text>
                    ) : (
                        ""
                    )}
                </Form.Group>
                <Form.Group className="">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                        style={{ border: error ? "2px solid #6259ca" : "" }}
                        name="lastName"
                        defaultValue={values.lastName}
                        type="text"
                        placeholder="Last Name"
                        onChange={handleFormData("lastName")}
                    />
                    {error ? (
                        <Form.Text style={{ color: "#6259ca" }}>
                            This is a required field
                        </Form.Text>
                    ) : (
                        ""
                    )}
                </Form.Group>
                <Button type="submit">
                    Continue
                </Button>
            </Form>
        </div>
    );
}

// Step 2
function StepTwo({ nextStep, handleFormData, prevStep, values }) {
    const [error, setError] = useState(false);

    const submitFormData = (e) => {
        e.preventDefault();
        if (validator.isEmpty(values.age) || validator.isEmpty(values.email)) {
            setError(true);
        } else {
            nextStep();
        }
    };

    return (
        <div>
            <Form onSubmit={submitFormData}>
                <Form.Group className="mb-3">
                    <Form.Label>Age</Form.Label>
                    <Form.Control
                        style={{ border: error ? "2px solid red" : "" }}
                        type="number"
                        placeholder="Age"
                        onChange={handleFormData("age")}
                    />
                    {error ? (
                        <Form.Text style={{ color: "red" }}>
                            This is a required field
                        </Form.Text>
                    ) : (
                        ""
                    )}
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        style={{ border: error ? "2px solid red" : "" }}
                        type="email"
                        placeholder="email"
                        onChange={handleFormData("email")}
                    />
                    {error ? (
                        <Form.Text style={{ color: "red" }}>
                            This is a required field
                        </Form.Text>
                    ) : (
                        ""
                    )}
                </Form.Group>
                <div >
                    <Button className="float-start" onClick={prevStep}>
                        Previous
                    </Button>

                    <Button className="float-end" type="submit">
                        Submit
                    </Button>
                </div>
            </Form>
        </div>
    );
};

// Step 3
function Final({ values }) {
    const { firstName, lastName, age, email } = values;
    return (
        <div style={{ textAlign: "left" }}>
            <div>
                <p>
                    <strong>First Name :</strong> {firstName}
                </p>
                <p>
                    <strong>Last Name :</strong> {lastName}
                </p>
                <p>
                    <strong>Age :</strong> {age}
                </p>
                <p>
                    <strong>Email :</strong> {email}
                </p>
            </div>
        </div>
    );
};

export function WizardForm() {
    const [step, setstep] = useState(1);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        age: "",
        email: ""
    })
    const nextStep = () => {
        setstep(step + 1);
    };
    const prevStep = () => {
        setstep(step - 1);
    };
    const handleInputData = input => e => {
        const { value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [input]: value
        }));
    }
    switch (step) {
        case 1:
            return (

                <div className="custom-margin">
                    <Step1 nextStep={nextStep} handleFormData={handleInputData} values={formData} />
                </div>
            );

        case 2:
            return (

                <div className="custom-margin">
                    <Name nextStep={nextStep} handleFormData={handleInputData} values={formData} />
                </div>
            );

        case 3:
            return (

                <div className="custom-margin">
                    <StepTwo nextStep={nextStep} prevStep={prevStep} handleFormData={handleInputData} values={formData} />
                </div>
            );


        default: return (
            <div className="">
                <div className="custom-margin">
                    <Final values={formData} />
                </div>
            </div>
        );
    }
}