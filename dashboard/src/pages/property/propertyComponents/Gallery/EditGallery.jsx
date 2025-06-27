import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFormik } from "formik";
import * as Yup from "yup";
import { useParams } from "react-router-dom";
import { API } from '../../../../services/API';
import { toast } from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import { Button } from 'react-bootstrap';

export default function EditGallery({ galleryUniqueId, onSuccess }) {
    const [images, setImages] = useState([]);
    const { uniqueId } = useParams();
    const [gallery, setGallery] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const response = await API.get(`/gallery/${galleryUniqueId}`);
                setGallery(response.data);

                const existing = response.data.gallery.map(img => ({
                    preview: `${import.meta.env.VITE_API_URL}${img}`,
                    id: img
                }));
                setImages(existing);
            } catch (err) {
                toast.error("Failed to fetch gallery");
            } finally {
                setLoading(false);
            }
        };
        fetchGallery();
    }, [galleryUniqueId]);

    const initialValues = {
        propertyId: uniqueId || "",
        title: gallery?.title || "",
        gallery: gallery?.gallery || [],
    }

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
            values.gallery.forEach(image => {
                if (image instanceof File) {
                    formData.append("gallery", image);
                } else {
                    formData.append("existingGallery", image);
                }
            });

            const response = await API.put(`/gallery/${galleryUniqueId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success(response.data.message || "Updated successfully", { id: toastId });
            onSuccess();
        } catch (error) {
            console.log("Error : " + error)
        }
    };


    const formik = useFormik({
        initialValues: initialValues,
        validationSchema,
        onSubmit: handleSubmit,
        enableReinitialize: true
    });

    const onDrop = useCallback((acceptedFiles) => {
        const filePreviews = acceptedFiles.map((file) =>
            Object.assign(file, { preview: URL.createObjectURL(file) })
        );
        setImages((prev) => [...prev, ...filePreviews]);
        formik.setFieldValue("gallery", [...formik.values.gallery, ...acceptedFiles]);
    }, [formik]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'image/*',
        maxFiles: 8,
    });

    const removeImage = (index) => {
        const updatedImages = [...images];
        const removedImage = updatedImages.splice(index, 1);

        setImages(updatedImages);

        if (removedImage[0].id) {
            formik.setFieldValue(
                "gallery",
                formik.values.gallery.filter((img) => img !== removedImage[0].id)
            );
        } else {
            formik.setFieldValue(
                "gallery",
                formik.values.gallery.filter((_, i) => i !== index)
            );
        }
    };

    return (
        <Fragment>
            {loading ? (
                <Skeleton height={300} />
            ) : (
                <>
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

                        <div {...getRootProps({ className: 'border-dashed border p-4 text-center cursor-pointer rounded' })}>
                            <input {...getInputProps()} />
                            <p>{isDragActive ? "Drop the files here ..." : "Drag and drop or click to upload"}</p>
                        </div>

                        <div className="mt-4 grid grid-cols-3 gap-4">
                            {images.map((file, index) => (
                                <div key={index} className="relative">
                                    <img src={file.preview} alt="Preview" className="w-full h-32 object-cover rounded-md" />
                                    <button type="button" className="absolute top-1 right-1 bg-red-500 text-white rounded-full px-2 py-1 text-sm" onClick={() => removeImage(index)} >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>

                        {formik.touched.gallery && formik.errors.gallery && (
                            <div className="text-red-500 mt-2">{formik.errors.gallery}</div>
                        )}

                        <Button type="submit" disabled={formik.isSubmitting}>
                            {formik.isSubmitting ? "Updating..." : "Update"}
                        </Button>
                    </form>
                </>
            )}
        </Fragment>
    );
}
