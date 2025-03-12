import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddMonitorProduct = () => {
    const navigate = useNavigate();
    const [monitorData, setMonitorData] = useState({
        name: '',
        category: 'monitor',
        brand: '',
        model: '',
        description: '',
        price: '',
        stock: '',
        imageUrl: '',
        specifications: {
          monitor: {
            screenSize: '',
            resolution: '',
            refreshRate: '',
            panelType: '',
            responseTime: '',
            hdrSupport: false,
            adaptiveSync: 'None',
            ports: [],
         }
        },
    });

    const [brands, setBrands] = useState([]);
    const [image, setImage] = useState(null);
    const availablePorts = ['HDMI', 'DisplayPort', 'USB-C', 'DVI', 'VGA'];

    useEffect(() => {
        if (!sessionStorage.getItem('AdminUser')) {
            navigate('/login');
        }
        fetchBrands();
    }, []);

    const fetchBrands = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/brands');
            setBrands(response.data);
        } catch (error) {
            console.error('Error fetching brands:', error);
            toast.error('Failed to fetch brands');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMonitorData(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'stock' ? parseFloat(value) || '' : value,
        }));
    };

    const handleSpecificationChange = (e) => {
        const { name, value, type, checked } = e.target;
    
        setMonitorData((prevData) => {
            if (type === "checkbox") {
                const updatedPorts = checked
                    ? [...prevData.specifications.monitor.ports, value]
                    : prevData.specifications.monitor.ports.filter((port) => port !== value);
    
                return {
                    ...prevData,
                    specifications: {
                        ...prevData.specifications,
                        monitor: {
                            ...prevData.specifications.monitor,
                            ports: updatedPorts,
                        },
                    },
                };
            } else {
                return {
                    ...prevData,
                    specifications: {
                        ...prevData.specifications,
                        monitor: {
                            ...prevData.specifications.monitor,
                            [name]: value,
                        },
                    },
                };
            }
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setMonitorData(prev => ({ ...prev, imageUrl: file.name }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let imageUrl = monitorData.imageUrl;
            if (image) {
                const formData = new FormData();
                formData.append('image', image);
                const uploadResponse = await axios.post('http://localhost:5000/api/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                imageUrl = uploadResponse.data.imageUrl;
            }

            const finalData = { ...monitorData, imageUrl };
            await axios.post('http://localhost:5000/api/productsin', finalData);
            toast.success('Monitor Product added successfully!');

            setMonitorData({
                name: '',
                category: 'monitor',
                brand: '',
                model: '',
                description: '',
                price: '',
                stock: '',
                imageUrl: '',
                specifications: {
                    monitor: {
                        screenSize: '',
                        resolution: '',
                        refreshRate: '',
                        panelType: '',
                        responseTime: '',
                        hdrSupport: false,
                        adaptiveSync: 'None',
                        ports: [],
                    }
                },
            });
            setImage(null);
        } catch (error) {
            console.error('Error adding Monitor product:', error);
            toast.error('Failed to add Monitor product.');
        }
    };

    return (
        <div className="h-screen flex flex-col">
            <ToastContainer />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-grow bg-gray-100 p-6 overflow-y-auto">
                    <h1 className="text-2xl font-bold mb-4">Add Monitor Product</h1>
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
                        {['name', 'model', 'description', 'price', 'stock'].map((field) => (
                            <div key={field}>
                                <label htmlFor={field} className="block font-medium mb-2">
                                    {field.charAt(0).toUpperCase() + field.slice(1)}
                                </label>
                                <input
                                    type={field === 'price' || field === 'stock' ? 'number' : 'text'}
                                    id={field}
                                    name={field}
                                    value={monitorData[field]}
                                    onChange={handleChange}
                                    placeholder={`Enter ${field}`}
                                    className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        ))}

                        <div>
                            <label htmlFor="brand" className="block font-medium mb-2">Brand</label>
                            <select
                                id="brand"
                                name="brand"
                                value={monitorData.brand}
                                onChange={handleChange}
                                className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Brand</option>
                                {brands.map((brand) => (
                                    <option key={brand._id} value={brand.name}>{brand.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="screenSize" className="block font-medium mb-2">Screen Size (in inches)</label>
                            <input
                                type="text"
                                id="screenSize"
                                name="screenSize"
                                value={monitorData.specifications.monitor.screenSize}
                                onChange={handleSpecificationChange}
                                placeholder="Enter screen size"
                                className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="resolution" className="block font-medium mb-2">Resolution</label>
                            <input
                                type="text"
                                id="resolution"
                                name="resolution"
                                value={monitorData.specifications.monitor.resolution}
                                onChange={handleSpecificationChange}
                                placeholder="Enter resolution (e.g. 1920x1080)"
                                className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="refreshRate" className="block font-medium mb-2">Refresh Rate (Hz)</label>
                            <input
                                type="number"
                                id="refreshRate"
                                name="refreshRate"
                                value={monitorData.specifications.monitor.refreshRate}
                                onChange={handleSpecificationChange}
                                className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="panelType" className="block font-medium mb-2">Panel Type</label>
                            <input
                                type="text"
                                id="panelType"
                                name="panelType"
                                value={monitorData.specifications.monitor.panelType}
                                onChange={handleSpecificationChange}
                                placeholder="Enter panel type (e.g. IPS, TN, VA)"
                                className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="responseTime" className="block font-medium mb-2">Response Time (ms)</label>
                            <input
                                type="number"
                                id="responseTime"
                                name="responseTime"
                                value={monitorData.specifications.monitor.responseTime}
                                onChange={handleSpecificationChange}
                                className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="hdrSupport" className="block font-medium mb-2">HDR Support</label>
                            <select
                                id="hdrSupport"
                                name="hdrSupport"
                                value={monitorData.specifications.monitor.hdrSupport}
                                onChange={handleSpecificationChange}
                                className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value={false}>No</option>
                                <option value={true}>Yes</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="adaptiveSync" className="block font-medium mb-2">Adaptive Sync</label>
                            <select
                                id="adaptiveSync"
                                name="adaptiveSync"
                                value={monitorData.specifications.monitor.adaptiveSync}
                                onChange={handleSpecificationChange}
                                className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="None">None</option>
                                <option value="G-Sync">G-Sync</option>
                                <option value="FreeSync">FreeSync</option>
                            </select>
                        </div>

                        <div>
                            <label className="block font-medium mb-2">Ports</label>
                            {availablePorts.map((port) => (
                                <div key={port} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={port}
                                        name="ports"
                                        value={port}
                                        checked={monitorData.specifications.monitor.ports.includes(port)}
                                        onChange={handleSpecificationChange}
                                        className="mr-2"
                                    />
                                    <label htmlFor={port}>{port}</label>
                                </div>
                            ))}
                        </div>

                        <div>
                            <label className="block font-medium mb-2">Product Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="mt-1 block w-full"
                            />
                        </div>

                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
                        >
                            Add Monitor Product
                        </button>
                    </form>
                </main>
            </div>
        </div>
    );
};

export default AddMonitorProduct;