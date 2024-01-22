import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../src/config';
import { Link, useParams } from 'react-router-dom';
import HashLoader from "react-spinners/HashLoader";

const Details = () => {
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/details/${id}`);

                if (!response.data.success) {
                    console.error(response.data.message);
                    return;
                }

                setUser(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, [id]);

    return (
        <>
            {loading ? (
                <div className="loader-overlay">
                    <div className="loader" style={{ background: 'transparent', borderRadius: '50%', overflow: 'hidden' }}>
                        <HashLoader color="#36d7b7" />
                    </div>
                </div>
            ) : null}

            <div className='container details-main mt-5'>
                <div className='row'>
                    <h1 className='form-label'>User Details</h1>
                    <div className='col-sm-12'>
                        <div className='card mb-2'>
                            <div className='card-body'>
                                <p className='card-text'>Name: {user.name}</p>
                                <p className='card-text'>Email: {user.email}</p>
                                <p className='card-text'>Phone: {user.phone}</p>
                            </div>
                        </div>
                        <Link to='/dashboard' className='btn btn-primary'>Back</Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Details;
