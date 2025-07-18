import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { API } from '../../../../services/API';

export default function ViewEnquiry({ enquiryId }) {
    const [enquiryDetails, setEnquiryDetails] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [newStatus, setNewStatus] = useState("");

    const fetchEnquiryData = async () => {
        try {
            const response = await API.get(`/enquiry/${enquiryId}`);
            setEnquiryDetails(response.data);
            setNewStatus(response.data.status);  // initialize newStatus with current status
        } catch (error) {
            toast.error(error.response?.data?.error || error.message || "Error fetching data");
        }
    };

    useEffect(() => {
        fetchEnquiryData();
    }, [enquiryId]);

    const handleUpdateEnquiryStatus = async () => {
        try {
            const response = await API.put(`/enquiry-update/${enquiryDetails?.[0]?.uniqueId}`, {
                status: newStatus
            });
            toast.success(response.data.message || "Status updated");
            setEditMode(false);
            fetchEnquiryData();  // refresh details
        } catch (error) {
            toast.error(error.response?.data?.error || "Update failed");
        }
    };

    return (
        <div className="card p-4 shadow-sm rounded-lg bg-white">
            <h5 className="mb-4 font-semibold text-lg">Enquiry Details</h5>
            <table className="table table-bordered">
                <tbody>
                    <tr>
                        <th scope="row">ID</th>
                        <td>{enquiryDetails?.[0]?.uniqueId || '—'}</td>
                    </tr>
                    <tr>
                        <th scope="row">Name</th>
                        <td>{enquiryDetails?.[0]?.name || '—'}</td>
                    </tr>
                    <tr>
                        <th scope="row">Email</th>
                        <td>{enquiryDetails?.[0]?.email || '—'}</td>
                    </tr>
                    <tr>
                        <th scope="row">Mobile no.</th>
                        <td>{enquiryDetails?.[0]?.mobile_no || '—'}</td>
                    </tr>
                    <tr>
                        <th scope="row">City</th>
                        <td>{enquiryDetails?.[0]?.city || '—'}</td>
                    </tr>
                    <tr>
                        <th scope="row">Course</th>
                        <td>{enquiryDetails?.[0]?.course || '—'}</td>
                    </tr>
                    <tr>
                        <th scope="row">Status</th>
                        <td>
                            {editMode ? (
                                <>
                                    <form>
                                        <select
                                            name="status"
                                            className="form-control mb-2"
                                            value={newStatus}
                                            onChange={(e) => setNewStatus(e.target.value)}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Active">Active</option>
                                            <option value="Suspended">Suspended</option>
                                        </select>
                                    </form>
                                    <button
                                        className="btn btn-sm btn-success me-2"
                                        onClick={handleUpdateEnquiryStatus}
                                    >
                                        Save
                                    </button>
                                    <button
                                        className="btn btn-sm btn-secondary"
                                        onClick={() => setEditMode(false)}
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <>
                                    {enquiryDetails?.[0]?.status || '—'}
                                    <button
                                        className="btn btn-sm btn-primary float-end"
                                        onClick={() => {
                                            setNewStatus(enquiryDetails?.[0]?.status);
                                            setEditMode(true);
                                        }}
                                    >
                                        <i className="fe fe-edit"></i>
                                    </button>
                                </>
                            )}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
