import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFormik } from "formik";
import * as Yup from "yup";
import { useParams } from "react-router-dom";
import { API } from '../../../../services/API';
import { toast } from 'react-hot-toast';
import { Button } from 'react-bootstrap';

export default function AddGallery({ onSuccess }) {
    const [images, setImages] = useState([]);
    const { uniqueId } = useParams();

    useEffect(() => {
        return () => {
            images.forEach(file => URL.revokeObjectURL(file.preview));
        };
    }, [images]);

    const initialValues = {
        propertyId: uniqueId || "",
        title: "",
        gallery: [],
    };

    const validationSchema = Yup.object({
        title: Yup.string().required("Title is required."),
        gallery: Yup.array()
            .min(1, 'You must select at least one image')
            .max(8, 'You can upload a maximum of 8 images.')
            .required('Image is required'),
    });

    const handleSubmit = async (values) => {
        const toastId = toast.loading("Updating...");
        try {
            const formData = new FormData();
            formData.append('propertyId', uniqueId);
            formData.append('title', values.title);
            values.gallery.forEach(image => formData.append("gallery", image));

            const response = await API.post(`/gallery`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            toast.success(response.data.message || "Updated successfully", { id: toastId });
            onSuccess();
        } catch (error) {
            toast.error(error.response?.data?.error || error.message);
        }
    };

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: handleSubmit,
    });

    const onDrop = useCallback((acceptedFiles) => {
        const filePreviews = acceptedFiles.map(file => Object.assign(file, { preview: URL.createObjectURL(file) }));
        setImages(prev => [...prev, ...filePreviews]);
        formik.setFieldValue("gallery", [...formik.values.gallery, ...acceptedFiles]);
    }, [formik]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'image/jpeg, image/png, image/gif',
    });

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        formik.setFieldValue("gallery", formik.values.gallery.filter((_, i) => i !== index));
        formik.setTouched({ gallery: true });
    };

    return (
        <form onSubmit={formik.handleSubmit} className="p-4" encType="multipart/form-data">
            <div className="mb-4">
                <label htmlFor="title">Title</label>
                <input type="text" name="title" id="title" className="w-full border p-2 rounded" value={formik.values.title} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                {formik.touched.title && formik.errors.title && <div className="text-red-500">{formik.errors.title}</div>}
            </div>

            <div {...getRootProps({ className: 'border-dashed border p-4 text-center cursor-pointer rounded' })}>
                <input {...getInputProps()} />
                <p>{isDragActive ? "Drop the files here ..." : "Drag and drop or click to upload"}</p>
            </div>

            <div className="grid grid-cols-3 gap-4 my-3">
                {images.map((file, index) => (
                    <div key={index} className="relative">
                        <img src={file.preview} className="h-32 w-full object-cover rounded" />
                        <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 text-white bg-red-600 px-2 py-1 rounded-full text-sm">Remove</button>
                    </div>
                ))}
            </div>

            {formik.touched.gallery && formik.errors.gallery && <div className="text-red-500 my-2">{formik.errors.gallery}</div>}

            {/* <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-4">Add</button> */}
            <Button type="submit" disabled={formik.isSubmitting}>
                {formik.isSubmitting ? "Adding..." : "Add"}
            </Button>
        </form>
    );
}
