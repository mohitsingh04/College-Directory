import React, { Fragment, useEffect, useState } from 'react';
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import { Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { API } from '../../../../services/API';
import AddCourse from './AddCourse';
import EditCourse from './EditCourse';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

export default function Course() {
    const [toggleCoursePage, setToggleCoursePage] = useState(true);
    const { uniqueId } = useParams();
    const [course, setCourse] = useState([]);
    const [courseUniqueId, setCourseUniqueId] = useState("");

    const fetchCourse = async () => {
        try {
            const response = await API.get(`/property-course`);
            const filteredCourse = response.data.filter((course) => course.propertyId === Number(uniqueId));
            setCourse(filteredCourse);
        } catch (error) {
            console.error('Error fetching course:', error);
        }
    };

    useEffect(() => {
        fetchCourse();
    }, [uniqueId]);

    const handleShowCoursePage = () => {
        setToggleCoursePage(true);
    }

    const handleEditCourse = (id) => {
        setToggleCoursePage(false);
        setCourseUniqueId(id);
    };

    const handleDeleteCourse = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await API.delete(`/property-course/${id}`);
                    toast.success(response.data.message);
                    fetchCourse();
                } catch (error) {
                    toast.error("Error deleting course");
                }
            }
        });
    };

    const columns = [
        {
            name: 'ID',
            selector: row => row.uniqueId,
            sortable: true,
        },
        {
            name: 'Name',
            selector: row => (
                Array.isArray(row.name)
                    ? row.name.map((item, index) => (
                        <span key={index}>
                            {item.label}
                            {index < row.name.length - 1 ? ", " : ""}
                        </span>
                    ))
                    : row.name || "N/A"
            ),
            sortable: true,
        },
        {
            name: 'Short Name',
            selector: row => (
                Array.isArray(row.short_name)
                    ? row.short_name.map((item, index) => (
                        <span key={index}>
                            {item.label}
                            {index < row.short_name.length - 1 ? ", " : ""}
                        </span>
                    ))
                    : row.short_name || "N/A"
            ),
            sortable: true,
        },
        {
            name: 'Specialization',
            selector: row => (
                Array.isArray(row.specialization)
                    ? row.specialization.map((item, index) => (
                        <span key={index}>
                            {item.label}
                            {index < row.specialization.length - 1 ? ", " : ""}
                        </span>
                    ))
                    : row.specialization || "N/A"
            ),
            sortable: true,
        },
        {
            name: "Action",
            selector: (row) => [
                <button className="btn btn-sm btn-primary me-1" data-bs-toggle="tooltip" title="Edit" onClick={() => handleEditCourse(row.uniqueId)}>
                    <i className="fe fe-edit"></i>
                </button>,
                <button className="btn btn-sm btn-danger me-1" data-bs-toggle="tooltip" title="Delete" onClick={() => handleDeleteCourse(row.uniqueId)}>
                    <i className="fe fe-trash"></i>
                </button>
            ],
        },
    ];

    const data = course;

    const tableData = {
        columns,
        data,
        export: false,
        print: false
    };

    return (
        <Fragment>
            <Card>
                <Card.Header className='flex justify-between'>
                    <div className="media-heading">
                        <h5>
                            {course.length > 0
                                ?
                                toggleCoursePage
                                    ?
                                    <strong>Course</strong>
                                    :
                                    <strong>Edit Course</strong>
                                :
                                <strong>Course</strong>
                            }
                        </h5>
                    </div>
                    <div>
                        {course.length > 0
                            ?
                            toggleCoursePage ?
                                null
                                :
                                <button className="btn btn-danger btn-sm" title="Close" onClick={handleShowCoursePage}>
                                    <i className="fe fe-x"></i>
                                </button>
                            :
                            null
                        }
                    </div>
                </Card.Header>
                <Card.Body>
                    {toggleCoursePage
                        ?
                        <>
                            {course.length > 0 ? (
                                <DataTableExtensions {...tableData}>
                                    <DataTable
                                        noHeader
                                        defaultSortFieldId="id"
                                        defaultSortAsc={false}
                                        pagination
                                        highlightOnHover
                                    />
                                </DataTableExtensions>
                            ) : (
                                <p>No Course Found</p>
                            )}

                        </>
                        :
                        <>
                            <EditCourse courseUniqueId={courseUniqueId} />
                        </>
                    }
                </Card.Body>
            </Card>

            {toggleCoursePage
                ?
                <>
                    <Card>
                        <Card.Header>
                            <div className="media-heading">
                                <h5>
                                    <strong>Add Course</strong>
                                </h5>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <AddCourse />
                        </Card.Body>
                    </Card>
                </>
                :
                null
            }
        </Fragment>
    );
}


// import React, { Fragment, useEffect, useRef, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { Col, Row, Form, Button } from "react-bootstrap";
// import Dropdown from "react-dropdown-select";
// import * as Yup from "yup";
// import { toast } from "react-hot-toast";
// import { useFormik } from "formik";
// import { Editor } from '@tinymce/tinymce-react';
// import { API } from "../../../../services/API";

// export default function AddCourse() {
//     const navigate = useNavigate();
//     const { uniqueId } = useParams();
//     const editorRef = useRef(null);
//     const [description, setDescription] = useState("");
//     const [categoryData, setCategoryData] = useState([]);
//     const [selectedCategory, setSelectedCategory] = useState('');
//     const [toggleHideShow, setToggleHideShow] = useState(false);
//     const [filteredSubCategory, setFilteredSubCategory] = useState([]);
//     const [courseData, setCourseData] = useState([]);

//     useEffect(() => {
//         const getCategoryData = async () => {
//             try {
//                 const response = await API.get(`/category`);
//                 setCategoryData(response.data);
//             } catch (error) {
//                 toast.error(error.message);
//             }
//         };
//         const getCourseData = async () => {
//             try {
//                 const response = await API.get(`/course`);
//                 setCourseData(response.data);
//             } catch (error) {
//                 toast.error(error.message);
//             }
//         };

//         getCategoryData();
//         getCourseData();
//     }, []);

//     const initialValues = {
//         propertyId: uniqueId,
//         name: "",
//         short_name: "",
//         specialization: "",
//         eligibility: "",
//         course_duration: "",
//         course_fees: "",
//         course_type: "",
//         program_type: "",
//         category: "",
//         sub_category: "",
//         stream: "",
//     }

//     const validationSchema = Yup.object({
//         name: Yup.string().required("Name is required."),
//         short_name: Yup.string().required("Short Name is required."),
//     });

//     const handleSubmit = async (values) => {
//         try {
//             const formData = { ...values, description: editorRef.current.getContent() };

//             const response = await API.post("/property-course", formData);
//             if (response.data.message) {
//                 toast.success(response.data.message);
//             } else {
//                 toast.error(response.data.error);
//             }
//         } catch (error) {
//             if (error.response) {
//                 if (error.response.status === 400) {
//                     toast.error(error.response.data.error || "Bad Request");
//                 } else if (error.response.status === 404) {
//                     toast.error(error.response.status);
//                 } else if (error.response.status === 500) {
//                     toast.error("Internal server error, please try again later.");
//                 } else {
//                     toast.error("Something went wrong, please try again.");
//                 }
//             } else {
//                 toast.error(`Failed: ${error.message}`);
//             }
//         }
//     };

//     const formik = useFormik({
//         initialValues: initialValues,
//         // validationSchema: validationSchema,
//         onSubmit: handleSubmit,
//     });

//     const CourseTypeData = [
//         { value: "Degree", label: "Degree" },
//         { value: "Diploma", label: "Diploma" },
//         { value: "Certification", label: "Certification" },
//     ];

//     const handleCategory = (value) => {
//         const category = formik.setFieldValue("category", value);
//         setSelectedCategory(value[0].value)
//         setToggleHideShow(category ? true : false);
//     }

//     const handleSubCategory = (value) => {
//         formik.setFieldValue("sub_category", value)
//     }

//     useEffect(() => {
//         const filteredData = categoryData.filter((item) => item.category_name === selectedCategory);
//         setFilteredSubCategory(filteredData)
//     }, [selectedCategory, categoryData]);

//     return (
//         <Fragment>
//             <Form onSubmit={formik.handleSubmit} encType="multipart/form-data">
//                 <Row>
//                     {/* Name */}
//                     <Col md={6}>
//                         <Form.Group className="mb-3">
//                             <Form.Label htmlFor="courseName">Name</Form.Label>
//                             <Dropdown
//                                 options={Array.from(
//                                     new Set(courseData.map((group) => group.name))
//                                 ).map((name) => ({
//                                     label: name,
//                                     value: name,
//                                 }))}
//                                 values={[]}
//                                 closeOnSelect={false}
//                                 placeholder="Choose Course   "
//                                 keepSelectedInList={false}
//                                 searchable={false}
//                                 dropdownHandle={false}
//                                 value={formik.values.name}
//                                 onChange={(value) => formik.setFieldValue("name", value)}
//                                 onBlur={formik.handleBlur}
//                             />
//                         </Form.Group>
//                     </Col>
//                     {/* Short Name */}
//                     <Col md={6}>
//                         <Form.Group className="mb-3">
//                             <Form.Label htmlFor="courseShortName">Short Name</Form.Label>
//                             <Dropdown
//                                 options={Array.from(
//                                     new Set(courseData.map((group) => group.short_name))
//                                 ).map((short_name) => ({
//                                     label: short_name,
//                                     value: short_name,
//                                 }))}
//                                 values={[]}
//                                 closeOnSelect={false}
//                                 placeholder="Choose Course   "
//                                 keepSelectedInList={false}
//                                 searchable={false}
//                                 dropdownHandle={false}
//                                 value={formik.values.short_name}
//                                 onChange={(value) => formik.setFieldValue("short_name", value)}
//                                 onBlur={formik.handleBlur}
//                             />
//                         </Form.Group>
//                     </Col>
//                     {/* Duration */}
//                     <Col md={6}>
//                         <Form.Group className="mb-3">
//                             <Form.Label htmlFor="course_duration">Duration</Form.Label>
//                             <Dropdown
//                                 options={Array.from(
//                                     new Set(courseData.map((group) => group.course_duration))
//                                 ).map((duration) => ({
//                                     label: duration,
//                                     value: duration,
//                                 }))}
//                                 values={[]}
//                                 closeOnSelect={false}
//                                 placeholder="Choose Course   "
//                                 keepSelectedInList={false}
//                                 searchable={false}
//                                 dropdownHandle={false}
//                                 value={formik.values.course_duration}
//                                 onChange={(value) => formik.setFieldValue("course_duration", value)}
//                                 onBlur={formik.handleBlur}
//                             />
//                         </Form.Group>
//                     </Col>
//                     {/* Course Type */}
//                     <Col md={6}>
//                         <Form.Group className="mb-3">
//                             <Form.Label htmlFor="course_type">Course Type</Form.Label>
//                             <Dropdown
//                                 options={CourseTypeData}
//                                 values={[]}
//                                 closeOnSelect={false}
//                                 placeholder="Choose Type  "
//                                 keepSelectedInList={false}
//                                 searchable={false}
//                                 dropdownHandle={false}
//                                 value={formik.values.course_type}
//                                 onChange={(value) => formik.setFieldValue("course_type", value)}
//                                 onBlur={formik.handleBlur}
//                             />
//                         </Form.Group>
//                     </Col>
//                     <Col md={12}>
//                         <Row>
//                             {/* Category */}
//                             <Col md={6}>
//                                 <Form.Group className="mb-3">
//                                     <Form.Label htmlFor="category">Category</Form.Label>
//                                     <Dropdown
//                                         options={categoryData
//                                             .filter((item) => item.category_name === "Course")
//                                             .map((group) => ({
//                                                 label: group.parent_category,
//                                                 value: group.parent_category,
//                                             }))}
//                                         values={[]}
//                                         closeOnSelect={false}
//                                         placeholder="Choose Category    "
//                                         keepSelectedInList={false}
//                                         searchable={false}
//                                         dropdownHandle={false}
//                                         value={formik.values.category}
//                                         // onChange={(value) => formik.setFieldValue("category", value)}
//                                         onChange={handleCategory}
//                                         onBlur={formik.handleBlur}
//                                     />
//                                 </Form.Group>
//                             </Col>
//                             {/* Sub Category */}
//                             {toggleHideShow && (
//                                 <>
//                                     {filteredSubCategory.length > 0 ? (
//                                         <Col md={6}>
//                                             <Form.Group className="mb-3">
//                                                 <Form.Label htmlFor="sub_category">Sub Category</Form.Label>
//                                                 <Dropdown
//                                                     options={filteredSubCategory.map((group) => ({
//                                                         label: group.parent_category,
//                                                         value: group.parent_category,
//                                                     }))}
//                                                     values={[]}
//                                                     closeOnSelect={false}
//                                                     placeholder="Choose Sub Category   "
//                                                     keepSelectedInList={false}
//                                                     searchable={false}
//                                                     dropdownHandle={false}
//                                                     value={formik.values.sub_category}
//                                                     // onChange={(value) => formik.setFieldValue("sub_category", value)}
//                                                     onChange={handleSubCategory}
//                                                     onBlur={formik.handleBlur}
//                                                 />
//                                             </Form.Group>
//                                         </Col>
//                                     ) : null}
//                                 </>
//                             )}
//                         </Row>
//                     </Col>
//                     {/* Stream */}
//                     <Col md={6}>
//                         <Form.Group className="mb-3">
//                             <Form.Label htmlFor="stream">Stream</Form.Label>
//                             <Dropdown
//                                 options={categoryData
//                                     .filter((item) => item.category_name === "Stream")
//                                     .map((group) => ({
//                                         label: group.parent_category,
//                                         value: group.parent_category,
//                                     }))}
//                                 values={[]}
//                                 closeOnSelect={false}
//                                 placeholder="Choose Stream   "
//                                 keepSelectedInList={false}
//                                 searchable={false}
//                                 dropdownHandle={false}
//                                 value={formik.values.stream}
//                                 onChange={(value) => formik.setFieldValue("stream", value)}
//                                 onBlur={formik.handleBlur}
//                             />
//                         </Form.Group>
//                     </Col>
//                     {/* Program Type */}
//                     <Col md={6}>
//                         <Form.Group className="mb-3">
//                             <Form.Label htmlFor="program_type">Program Type</Form.Label>
//                             <br />
//                             <div className="form-check form-check-inline">
//                                 <input
//                                     className="form-check-input"
//                                     type="radio"
//                                     name="program_type"
//                                     id="inlineRadio1"
//                                     value="UG"
//                                     onChange={formik.handleChange}
//                                     onBlur={formik.handleBlur}
//                                 />
//                                 <label className="form-check-label" htmlFor="inlineRadio1">UG</label>
//                             </div>
//                             <div className="form-check form-check-inline">
//                                 <input
//                                     className="form-check-input"
//                                     type="radio"
//                                     name="program_type"
//                                     id="inlineRadio2"
//                                     value="PG"
//                                     onChange={formik.handleChange}
//                                     onBlur={formik.handleBlur}
//                                 />
//                                 <label className="form-check-label" htmlFor="inlineRadio2">PG</label>
//                             </div>
//                             <div className="form-check form-check-inline">
//                                 <input
//                                     className="form-check-input"
//                                     type="radio"
//                                     name="program_type"
//                                     id="inlineRadio3"
//                                     value="Diploma"
//                                     onChange={formik.handleChange}
//                                     onBlur={formik.handleBlur}
//                                 />
//                                 <label className="form-check-label" htmlFor="inlineRadio3">Diploma</label>
//                             </div>
//                         </Form.Group>
//                     </Col>
//                     {/* Course Fees */}
//                     <Col md={6}>
//                         <Form.Group className="mb-3">
//                             <Form.Label htmlFor="course_fees">Course Fees</Form.Label>
//                             <Form.Control
//                                 type="text"
//                                 id="course_fees"
//                                 placeholder="150000"
//                                 name="course_fees"
//                                 value={formik.values.course_fees}
//                                 onChange={formik.handleChange}
//                                 onBlur={formik.handleBlur}
//                             />
//                             {formik.errors.course_fees && formik.touched.course_fees ? <div className="text-danger mt-1">{formik.errors.course_fees}</div> : null}
//                         </Form.Group>
//                     </Col>
//                     {/* Specialization */}
//                     <Col md={6}>
//                         <Form.Group className="mb-3">
//                             <Form.Label htmlFor="specialization">Specialization</Form.Label>
//                             <Dropdown
//                                 options={Array.from(
//                                     new Set(courseData.map((group) => group.specialization))
//                                 ).map((specialization) => ({
//                                     label: specialization,
//                                     value: specialization,
//                                 }))}
//                                 values={[]}
//                                 closeOnSelect={false}
//                                 placeholder="Choose Specialization   "
//                                 keepSelectedInList={false}
//                                 searchable={false}
//                                 dropdownHandle={false}
//                                 value={formik.values.specialization}
//                                 onChange={(value) => formik.setFieldValue("specialization", value)}
//                                 onBlur={formik.handleBlur}
//                             />
//                         </Form.Group>
//                     </Col>
//                     {/* Eligibility */}
//                     <Col md={12}>
//                         <Form.Group className="mb-3">
//                             <Form.Label htmlFor="eligibility">Eligibility</Form.Label>
//                             <Form.Control
//                                 // type="text"
//                                 as="textarea"
//                                 id="eligibility"
//                                 placeholder="Eligibility"
//                                 name="eligibility"
//                                 value={formik.values.eligibility}
//                                 onChange={formik.handleChange}
//                                 onBlur={formik.handleBlur}
//                             />
//                             {formik.errors.eligibility && formik.touched.eligibility ? <div className="text-danger mt-1">{formik.errors.eligibility}</div> : null}
//                         </Form.Group>
//                     </Col>
//                     {/* Description */}
//                     <Col md={12}>
//                         <Form.Group className="mb-3">
//                             <Form.Label htmlFor="userName">Description</Form.Label>
//                             <Editor
//                                 apiKey={`${import.meta.env.VITE_TEXT_EDITOR_API}`}
//                                 onInit={(evt, editor) => editorRef.current = editor}
//                                 onChange={(e) => setDescription(editorRef.current.getContent())}
//                                 onBlur={formik.handleBlur}
//                                 init={{
//                                     height: 250,
//                                     menubar: false,
//                                     plugins: [
//                                         'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
//                                         'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
//                                         'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
//                                     ],
//                                     toolbar: 'undo redo | blocks | ' +
//                                         'bold italic forecolor | alignleft aligncenter ' +
//                                         'alignright alignjustify | bullist numlist outdent indent | ' +
//                                         'removeformat',
//                                     content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
//                                 }}
//                             />
//                         </Form.Group>
//                     </Col>

//                 </Row>
//                 <Button type="submit">Add</Button>
//             </Form>
//         </Fragment>
//     );
// }
