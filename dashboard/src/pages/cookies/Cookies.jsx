// import React, { Fragment } from "react";
// import { Card } from "react-bootstrap";
// import { API } from "../../services/API";
// import { useQuery } from "@tanstack/react-query";

// const fetchData = async () => {
//   const startTime = performance.now();

//   const { data } = await API.get("/fetch-city");

//   const endTime = performance.now(); 
//   const fetchTime = ((endTime - startTime) / 1000).toFixed(2); 

//   const responseSizeInBytes = new TextEncoder().encode(JSON.stringify(data)).length;
//   const fetchSize = (responseSizeInBytes / (1024 * 1024)).toFixed(2);

//   return { data, fetchTime, fetchSize };
// };

// const GetCookies = () => {
//   const { data, isLoading, error } = useQuery({
//     queryKey: ["myData"],
//     queryFn: fetchData,
//   });

//   if (isLoading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error.message}</p>;

//   return (
//     <Fragment>
//       <Card className="custom-card mt-5">
//         <Card.Header>
//           <h3 className="card-title">Fetch Property</h3>
//         </Card.Header>
//         <Card.Body>
//           <p>Fetch Time: {data?.fetchTime} sec</p>
//           <p>Fetched Size: {data?.fetchSize} MB</p>
//           {data?.data?.length > 0 ? (
//             <div className="table">
//               <table className="table table-bordered">
//                 <thead>
//                   <tr>
//                     <th>Id</th>
//                     <th>City Name</th>
//                     <th>State Id</th>
//                     <th>State Code</th>
//                     <th>Country Id</th>
//                     <th>Country Code</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {data.data.map((item, index) => (
//                     <tr key={index}>
//                       <td>{item.id}</td>
//                       <td>{item.name}</td>
//                       <td>{item.state_id}</td>
//                       <td>{item.state_code}</td>
//                       <td>{item.country_id}</td>
//                       <td>{item.country_code}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <p>No Property Found.</p>
//           )}
//         </Card.Body>
//       </Card>
//     </Fragment>
//   );
// };

// export default GetCookies;

import React, { Fragment} from "react";
import { Button, Card, Form } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";

export default function Cookies() {
  const initialValues = {
    title: "",
    image: "",
  }

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required."),
    image: Yup.string().required("Image is required."),
  });

  const handleSubmit = async (values) => {
    try {
      console.log(values)
    } catch (error) {
      toast.error(error.message);
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <Fragment>
      <Card className="custom-card mt-5">
        <Card.Header>
          <h3 className="card-title">Image Cropper</h3>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={formik.handleSubmit}>

            <Form.Group className="mb-3">
              <Form.Label htmlFor="title">Title</Form.Label>
              <Form.Control
                type="text"
                id="title"
                placeholder="Title"
                name="title"
                className={`form-control ${formik.touched.title && formik.errors.title ? 'is-invalid' : ''}`}
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.title && formik.touched.title ? <div className="text-danger mt-1">{formik.errors.title}</div> : null}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label htmlFor="image">Image</Form.Label>
              <Form.Control
                type="file"
                id="image"
                name="image"
                className={`form-control ${formik.touched.image && formik.errors.image ? 'is-invalid' : ''}`}
                value={formik.values.image}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.image && formik.touched.image ? <div className="text-danger mt-1">{formik.errors.image}</div> : null}
            </Form.Group>

            <Button type="submit">Submit</Button>
          </Form>
        </Card.Body>
      </Card>
    </Fragment>
  )
};