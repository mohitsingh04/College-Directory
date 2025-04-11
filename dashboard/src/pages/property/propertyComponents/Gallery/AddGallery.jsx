import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFormik } from "formik";
import * as Yup from "yup";
import { useParams } from "react-router-dom";
import { API } from '../../../../services/API';
import { toast } from 'react-hot-toast';

export default function AddGallery() {
    const [images, setImages] = useState([]);
    const { uniqueId } = useParams();

    useEffect(() => {
        return () => {
            images.forEach(file => URL.revokeObjectURL(file.preview));
        };
    }, []);

    const initialValues = {
        propertyId: uniqueId || "",
        title: "",
        gallery: [],
    };

    const validationSchema = Yup.object({
        title: Yup.string().required("Title is required."),
        gallery: Yup.array()
            .min(1, 'You must select at least one image.')
            .max(8, 'You can upload a maximum of 8 images.')
            .required('Image selection is required.'),
    });

    const handleSubmit = async (values) => {
        try {
            const formData = new FormData();
            if (uniqueId) {
                formData.append('propertyId', uniqueId);
            }
            formData.append('title', values.title);
            values.gallery.forEach(image => {
                formData.append("gallery", image);
            });

            const response = await API.post(`/gallery`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                toast.success(response.data.message || "Gallery added successfully!");
                window.location.reload();
            }
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.error || "An error occurred!");
            } else {
                toast.error(`Error: ${error.message}`);
            }
        }
    };

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: handleSubmit,
    });

    const onDrop = useCallback(
        (acceptedFiles) => {
            const filePreviews = acceptedFiles.map((file) =>
                Object.assign(file, { preview: URL.createObjectURL(file) })
            );
            setImages((prev) => [...prev, ...filePreviews]);
            formik.setFieldValue("gallery", [
                ...formik.values.gallery,
                ...acceptedFiles,
            ]);
        },
        [formik]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'image/jpeg, image/png, image/gif',
    });

    const removeImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));

        const updatedGallery = formik.values.gallery.filter((_, i) => i !== index);
        formik.setFieldValue("gallery", updatedGallery);

        // Manually trigger validation
        formik.setTouched({ gallery: true });
    };

    return (
        <form onSubmit={formik.handleSubmit} className="p-4" encType="multipart/form-data">
            <div className="mb-4">
                <label htmlFor="title" className="block mb-2 font-medium">Title</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.title}
                    className="w-full p-2 border rounded-md"
                />
                {formik.touched.title && formik.errors.title ? (
                    <div className="text-red-500 mt-1">{formik.errors.title}</div>
                ) : null}
            </div>

            <div
                {...getRootProps({
                    className:
                        'border border-dashed p-4 rounded-md cursor-pointer text-center',
                })}
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p>Drop the files here ...</p>
                ) : (
                    <p>Drag 'n' drop some files here, or click to select files</p>
                )}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4">
                {images.map((file, index) => (
                    <div key={index} className="relative">
                        <img
                            src={file.preview}
                            alt="Preview"
                            className="w-full h-32 object-cover rounded-md"
                        />
                        <button
                            type="button"
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full px-2 py-1 text-sm"
                            onClick={() => removeImage(index)}
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>

            {formik.touched.gallery && formik.errors.gallery ? (
                <div className="text-red-500 mt-2">{formik.errors.gallery}</div>
            ) : null}

            <button
                type="submit"
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
            >
                Add
            </button>
        </form>
    );
}
