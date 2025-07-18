import React, { Fragment, useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { API } from '../../../../services/API';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import ViewEnquiry from './ViewEnquiry';

export default function EnquiryList() {
    const [toggleEnquiryPage, setToggleEnquiryPage] = useState(true);
    const { uniqueId } = useParams();
    const [enquiry, setEnquiry] = useState([]);
    const [enquiryUniqueId, setEnquiryUniqueId] = useState("");

    const fetchEnquiry = async () => {
        try {
            const response = await API.get(`/enquiry`);
            const filteredEnquiry = response.data.filter(
                (enq) => enq.propertyId === Number(uniqueId)
            );
            setEnquiry(filteredEnquiry);
        } catch (error) {
            console.error('Error fetching enquiry:', error);
        }
    };

    useEffect(() => {
        fetchEnquiry();
    }, [uniqueId]);

    const handleDeleteEnquiry = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        });

        if (result.isConfirmed) {
            try {
                const response = await API.delete(`/enquiry/${id}`);
                toast.success(response.data.message);
                fetchEnquiry();
            } catch (error) {
                toast.error(error.response?.data?.error || "Failed");
            }
        }
    };

    const handleViewEnquiry = (id) => {
        setToggleEnquiryPage(false);
        setEnquiryUniqueId(id);
    };

    const handleCloseView = () => {
        setToggleEnquiryPage(true);
        setEnquiryUniqueId("");
    };

    return (
        <Fragment>
            <Card>
                <Card.Header className='flex justify-between'>
                    <div className="media-heading">
                        <h5>
                            <strong>
                                {toggleEnquiryPage ? "Enquiry" : "View Enquiry"}
                            </strong>
                        </h5>
                    </div>
                    <div>
                        {!toggleEnquiryPage && (
                            <button className="btn btn-danger btn-sm" onClick={handleCloseView}>
                                <i className="fe fe-x"></i>
                            </button>
                        )}
                    </div>
                </Card.Header>

                <Card.Body>
                    {toggleEnquiryPage ? (
                        <div className="table-responsive">
                            <table className='table table-striped table-hover'>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Mobile no.</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {enquiry.map((item) => (
                                        <tr key={item.uniqueId}>
                                            <td>{item.uniqueId}</td>
                                            <td>{item.name}</td>
                                            <td>{item.email}</td>
                                            <td>{item.mobile_no}</td>
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-primary me-1"
                                                    title="View"
                                                    onClick={() => handleViewEnquiry(item.uniqueId)}
                                                >
                                                    <i className="fe fe-eye"></i>
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-danger me-1"
                                                    title="Delete"
                                                    onClick={() => handleDeleteEnquiry(item.uniqueId)}
                                                >
                                                    <i className="fe fe-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <ViewEnquiry enquiryId={enquiryUniqueId} onClose={handleCloseView} />
                    )}
                </Card.Body>
            </Card>
        </Fragment>
    );
}
