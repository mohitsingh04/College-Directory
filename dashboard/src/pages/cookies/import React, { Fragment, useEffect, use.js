import React, { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Col, Row, Form, Button } from "react-bootstrap";
import Dropdown from "react-dropdown-select";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import { API } from "../../../../services/API";
import { Editor } from '@tinymce/tinymce-react';

export default function AddCourse() {
    const navigate = useNavigate();
    const { uniqueId } = useParams();
    const editorRef = useRef(null);
    const [description, setDescription] = useState("");
    const [categoryData, setCategoryData] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [toggleHideShow, setToggleHideShow] = useState(false);
    const [filteredSubCategory, setFilteredSubCategory] = useState([]);
    const [courseData, setCourseData] = useState([]);
    const [propertyCourse, setPropertyCourse] = useState("");
    const [selectedCourseName, setSelectedCourseName] = useState("");

    useEffect(() => {
        const fetchPropertyCourse = async () => {
            if (!selectedCourseName) return;
            try {
                const response = await API.get(`/course`);
                const courseData = response.data;
                const filteredCourse = courseData.find(course => course.name === selectedCourseName);
                setPropertyCourse(filteredCourse);
            } catch (error) {
                console.error("Error fetching course details:", error);
            }
        };

        fetchPropertyCourse();
    }, [selectedCourseName]);

    useEffect(() => {
        const getCategoryData = async () => {
            try {
                const response = await API.get(`/category`);
                setCategoryData(response.data);
            } catch (error) {
                toast.error(error.message);
            }
        };
        const getCourseData = async () => {
            try {
                const response = await API.get(`/course`);
                setCourseData(response.data);
            } catch (error) {
                toast.error(error.message);
            }
        };

        getCategoryData();
        getCourseData();
    }, []);

    const initialValues = {
        propertyId: uniqueId,
        name: "",
        short_name: propertyCourse?.short_name || "",
        specialization: propertyCourse?.specialization || "",
        description: propertyCourse?.description || "",
        eligibility: propertyCourse?.eligibility || "",
        course_duration: propertyCourse?.course_duration || "",
        course_type: propertyCourse?.course_type || "",
        program_type: propertyCourse?.program_type || "",
        category: propertyCourse?.category || "",
        sub_category: propertyCourse?.sub_category || "",
        stream: propertyCourse?.stream || "",
        course_fees: propertyCourse?.course_fees || "",
    }

    const handleSubmit = async (values) => {
        try {
            const formData = { ...values, description: editorRef.current.getContent() };
            console.log(formData)
            // const response = await API.post("/property-course", formData);
            // if (response.data.message) {
            //     toast.success(response.data.message);
            // } else {
            //     toast.error(response.data.error);
            // }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    toast.error(error.response.data.error || "Bad Request");
                } else if (error.response.status === 404) {
                    toast.error(error.response.status);
                } else if (error.response.status === 500) {
                    toast.error("Internal server error, please try again later.");
                } else {
                    toast.error("Something went wrong, please try again.");
                }
            } else {
                toast.error(`Failed: ${error.message}`);
            }
        }
    };

    const validationSchema = Yup.object({
        course_fees: Yup.string().required("Course fees is required"),
    });

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: handleSubmit,
        enableReinitialize: true
    });

    const CourseTypeData = [
        { value: "Degree", label: "Degree" },
        { value: "Diploma", label: "Diploma" },
        { value: "Certification", label: "Certification" },
    ];

    const handleCategory = (value) => {
        const category = formik.setFieldValue("category", value);
        setSelectedCategory(value[0].value)
        setToggleHideShow(category ? true : false);
    }

    const handleSubCategory = (value) => {
        formik.setFieldValue("sub_category", value)
    }

    useEffect(() => {
        const filteredData = categoryData.filter((item) => item.category_name === selectedCategory);
        setFilteredSubCategory(filteredData)
    }, [selectedCategory, categoryData]);

    return (
        <Fragment>
            <Form onSubmit={formik.handleSubmit}>
                <Row>
                    {/* Name */}
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="courseName">Name</Form.Label>
                            {/* <Dropdown
                                options={Array.from(
                                    new Set(courseData.map((course) => course.name))
                                ).map((name) => ({
                                    label: name,
                                    value: name,
                                }))}
                                placeholder="Choose Course    "
                                value={selectedCourseName ? [{ label: selectedCourseName, value: selectedCourseName }] : []}
                                onChange={handleChangeName}
                                closeOnSelect
                            /> */}
                            <Dropdown
                                options={Array.from(
                                    new Set(courseData.map((group) => group.name))
                                ).map((name) => ({
                                    label: name,
                                    value: name,
                                }))}
                                values={[]}
                                closeOnSelect
                                placeholder="Choose Course   "
                                keepSelectedInList={false}
                                searchable={true}
                                dropdownHandle={false}
                                value={formik.values.name}
                                onChange={(value) => {
                                    formik.setFieldValue("name", value[0].value);
                                    setSelectedCourseName(value[0].value);
                                }}
                                onBlur={formik.handleBlur}
                            />
                        </Form.Group>
                    </Col>
                    {/* Short Name */}
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="courseShortName">Short Name</Form.Label>
                            <Form.Control
                                type="text"
                                id="courseShortName"
                                placeholder="Short Name"
                                name="short_name"
                                className={`form-control ${formik.touched.short_name && formik.errors.short_name ? 'is-invalid' : ''}`}
                                value={formik.values.short_name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.errors.short_name && formik.touched.short_name ? <div className="text-danger mt-1">{formik.errors.short_name}</div> : null}

                        </Form.Group>
                    </Col>
                    {/* Specialization */}
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="specialization">Specialization</Form.Label>
                            <Form.Control
                                type="text"
                                id="specialization"
                                placeholder="Specialization"
                                name="specialization"
                                className={`form-control ${formik.touched.specialization && formik.errors.specialization ? 'is-invalid' : ''}`}
                                value={formik.values.specialization}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.errors.specialization && formik.touched.specialization ? <div className="text-danger mt-1">{formik.errors.specialization}</div> : null}
                        </Form.Group>
                    </Col>
                    {/* Duration */}
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="course_duration">Duration</Form.Label>
                            <Form.Control
                                type="text"
                                id="course_duration"
                                placeholder="3 Years..."
                                name="course_duration"
                                value={formik.values.course_duration}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.errors.course_duration && formik.touched.course_duration ? <div className="text-danger mt-1">{formik.errors.course_duration}</div> : null}
                        </Form.Group>
                    </Col>
                    {/* Course Type */}
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="course_type">Course Type</Form.Label>
                            <Dropdown
                                options={CourseTypeData}
                                closeOnSelect={false}
                                placeholder="Choose Type  "
                                keepSelectedInList={false}
                                searchable={false}
                                dropdownHandle={false}
                                value={formik.values.course_type}
                                values={propertyCourse?.course_type}
                                onChange={(value) => formik.setFieldValue("course_type", value)}
                                onBlur={formik.handleBlur}
                            />
                        </Form.Group>
                    </Col>
                    {/* Category */}
                    <Col md={12}>
                        <Row>
                            {/* Category */}
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label htmlFor="category">Category</Form.Label>
                                    <Dropdown
                                        options={categoryData
                                            .filter((item) => item.category_name === "Course")
                                            .map((group) => ({
                                                label: group.parent_category,
                                                value: group.parent_category,
                                            }))}
                                        values={propertyCourse?.category}
                                        closeOnSelect={false}
                                        placeholder="Choose Category    "
                                        keepSelectedInList={false}
                                        searchable={false}
                                        dropdownHandle={false}
                                        value={formik.values.category}
                                        // onChange={(value) => formik.setFieldValue("category", value)}
                                        onChange={handleCategory}
                                        onBlur={formik.handleBlur}
                                    />
                                </Form.Group>
                            </Col>
                            {/* Sub Category */}
                            {toggleHideShow && (
                                <>
                                    {filteredSubCategory.length > 0 ? (
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label htmlFor="sub_category">Sub Category</Form.Label>
                                                <Dropdown
                                                    options={filteredSubCategory.map((group) => ({
                                                        label: group.parent_category,
                                                        value: group.parent_category,
                                                    }))}
                                                    values={propertyCourse?.sub_category}
                                                    closeOnSelect={false}
                                                    placeholder="Choose Sub Category   "
                                                    keepSelectedInList={false}
                                                    searchable={false}
                                                    dropdownHandle={false}
                                                    value={formik.values.sub_category}
                                                    // onChange={(value) => formik.setFieldValue("sub_category", value)}
                                                    onChange={handleSubCategory}
                                                    onBlur={formik.handleBlur}
                                                />
                                            </Form.Group>
                                        </Col>
                                    ) : null}
                                </>
                            )}
                        </Row>
                    </Col>
                    {/* Stream */}
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="stream">Stream</Form.Label><Dropdown
                                options={CourseTypeData}
                                closeOnSelect={false}
                                placeholder="Choose Type  "
                                keepSelectedInList={false}
                                searchable={false}
                                dropdownHandle={false}
                                value={formik.values.stream}
                                values={propertyCourse?.stream}
                                onChange={(value) => formik.setFieldValue("stream", value)}
                                onBlur={formik.handleBlur}
                            />
                        </Form.Group>
                    </Col>
                    {/* Program Type */}
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="program_type">Program Type</Form.Label>
                            <br />
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="program_type"
                                    id="inlineRadio1"
                                    value="UG"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                <label className="form-check-label" htmlFor="inlineRadio1">UG</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="program_type"
                                    id="inlineRadio2"
                                    value="PG"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                <label className="form-check-label" htmlFor="inlineRadio2">PG</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="program_type"
                                    id="inlineRadio3"
                                    value="Diploma"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                <label className="form-check-label" htmlFor="inlineRadio3">Diploma</label>
                            </div>
                        </Form.Group>
                    </Col>
                    {/* Course Fees */}
                    <Col md={6}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="course_fees">Course Fees</Form.Label>
                            <Form.Control
                                type="text"
                                id="course_fees"
                                placeholder="150000"
                                name="course_fees"
                                className={`form-control ${formik.touched.course_fees && formik.errors.course_fees ? 'is-invalid' : ''}`}
                                value={formik.values.course_fees}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.errors.course_fees && formik.touched.course_fees ? <div className="text-danger mt-1">{formik.errors.course_fees}</div> : null}
                        </Form.Group>
                    </Col>
                    {/* Eligibility */}
                    <Col md={12}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="eligibility">Eligibility</Form.Label>
                            <Form.Control
                                // type="text"
                                as="textarea"
                                id="eligibility"
                                placeholder="Eligibility"
                                name="eligibility"
                                value={formik.values.eligibility}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.errors.eligibility && formik.touched.eligibility ? <div className="text-danger mt-1">{formik.errors.eligibility}</div> : null}
                        </Form.Group>
                    </Col>
                    {/* Description */}
                    <Col md={12}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="userName">Description</Form.Label>
                            <Editor
                                apiKey={`${import.meta.env.VITE_TEXT_EDITOR_API}`}
                                onInit={(evt, editor) => editorRef.current = editor}
                                onChange={(e) => setDescription(editorRef.current.getContent())}
                                onBlur={formik.handleBlur}
                                init={{
                                    height: 250,
                                    menubar: false,
                                    plugins: [
                                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                    ],
                                    toolbar: 'undo redo | blocks | ' +
                                        'bold italic forecolor | alignleft aligncenter ' +
                                        'alignright alignjustify | bullist numlist outdent indent | ' +
                                        'removeformat',
                                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                }}
                                initialValue={propertyCourse?.description}
                            />
                        </Form.Group>
                    </Col>

                </Row>
                <Button type="submit">Add</Button>
            </Form>
        </Fragment>
    );
}
