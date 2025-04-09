// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Sidebar from '../Sidebar';
// import axios from 'axios';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const AddCpuCoolerProduct = () => {
//   const navigate = useNavigate();
//   const [cpuCoolerData, setCpuCoolerData] = useState({
//     name: '',
//     category: 'cpu_cooler',
//     brand: '',
//     model: '',
//     description: '',
//     price: '',
//     stock: '',
//     imageUrl: '',
//     specifications: {
//         cpuCooler: {
//             coolerType: '',
//             fanSize: '',
//             rpm: '',
//             compatibility: '',
//             dimensions: '',
//             weight: '',
//         }
//     },
//   });

//   const [brands, setBrands] = useState([]);
//   const [image, setImage] = useState(null);

//   useEffect(() => {
//     const checkAdmin = () => {
//       if (!sessionStorage.getItem('AdminUser')) {
//         navigate('/login');
//       }
//     };
//     checkAdmin();
//     fetchBrands();
//   }, []);

//   const fetchBrands = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/brands');
//       setBrands(response.data);
//     } catch (error) {
//       console.error('Error fetching brands:', error);
//       toast.error('Failed to fetch brands');
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setCpuCoolerData((prevData) => ({
//       ...prevData,
//       [name]: name === 'price' || name === 'stock' ? parseFloat(value) || '' : value,
//     }));
//   };

//   const handleSpecificationChange = (e) => {
//   const { name, value } = e.target;
//   setCpuCoolerData((prevData) => ({
//     ...prevData,
//     specifications: {
//       ...prevData.specifications,
//       cpuCooler: {
//         ...prevData.specifications.cpuCooler,
//         [name]: name === "rpm" && value === "" ? "N/A" : value,
//       },
//     },
//   }));
// };


//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImage(file);
//       setCpuCoolerData((prev) => ({ ...prev, imageUrl: file.name }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       if (image) {
//         const formData = new FormData();
//         formData.append('image', image);

//         const uploadResponse = await axios.post('http://localhost:5000/api/upload', formData, {
//           headers: { 'Content-Type': 'multipart/form-data' },
//         });

//         const updatedCpuCoolerData = {
//           ...cpuCoolerData,
//           imageUrl: uploadResponse.data.imageUrl,
//         };

//         await axios.post('http://localhost:5000/api/productsin', updatedCpuCoolerData);
//         toast.success('CPU Cooler added successfully!');

//         setCpuCoolerData({
//           name: '',
//           category: 'cpu_cooler',
//           brand: '',
//           model: '',
//           description: '',
//           price: '',
//           stock: '',
//           imageUrl: '',
//           specifications: {
//             cpuCooler: {
//                 coolerType: '',
//                 fanSize: '',
//                 rpm: '',
//                 compatibility: '',
//                 dimensions: '',
//                 weight: '',
//             }
//           },
//         });
//         setImage(null);
//       }
//     } catch (error) {
//       console.error('Error adding CPU Cooler:', error);
//       toast.error('Failed to add CPU Cooler.');
//     }
//   };

//   return (
//     <div className="h-screen flex flex-col">
//       <ToastContainer />
//       <div className="flex flex-1 overflow-hidden">
//         <Sidebar />
//         <main className="flex-grow bg-gray-100 p-6 overflow-y-auto">
//           <h1 className="text-2xl font-bold mb-4">Add CPU Cooler</h1>
//           <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
//             {['name', 'model', 'description', 'price', 'stock'].map((field) => (
//               <div key={field}>
//                 <label htmlFor={field} className="block font-medium mb-2">
//                   {field.charAt(0).toUpperCase() + field.slice(1)}
//                 </label>
//                 <input
//                   type={field === 'price' || field === 'stock' ? 'number' : 'text'}
//                   id={field}
//                   name={field}
//                   value={cpuCoolerData[field]}
//                   onChange={handleChange}
//                   placeholder={`Enter ${field}`}
//                   required
//                   className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//             ))}

//             <div>
//               <label htmlFor="brand" className="block font-medium mb-2">Brand</label>
//               <select
//                 id="brand"
//                 name="brand"
//                 value={cpuCoolerData.brand}
//                 onChange={handleChange}
//                 required
//                 className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500">
//                 <option value="">Select Brand</option>
//                 {brands.map((brand) => (
//                   <option key={brand._id} value={brand.name}>{brand.name}</option>
//                 ))}
//               </select>
//             </div>
            

//             <div>
//               <label htmlFor="type" className="block font-medium mb-2">
//                 Cooler Type
//               </label>
//               <select
//                 id="type"
//                 name="type"
//                 value={cpuCoolerData.specifications.cpuCooler.coolerType}
//                 onChange={handleSpecificationChange}
//                 required
//                 className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="">Select Cooler Type</option>
//                 <option value="Air">Air Cooler</option>
//                 <option value="Liquid">Liquid Cooler</option>
//               </select>
//             </div>
            
//             <div>
//               <label htmlFor="fanSize" className="block font-medium mb-2">Fan Size</label>
//               <input
//                 type="text"
//                 id="fanSize"
//                 name="fanSize"
//                 value={cpuCoolerData.specifications.cpuCooler.fanSize}
//                 onChange={handleSpecificationChange}
//                 className="border rounded px-4 py-2 w-full"
//               />
//             </div>

//             <div>
//               <label htmlFor="rpm" className="block font-medium mb-2">RPM</label>
//               <input
//                 type="text"
//                 id="rpm"
//                 name="rpm"
//                 value={cpuCoolerData.specifications.cpuCooler.rpm}
//                 onChange={handleSpecificationChange}
//                 className="border rounded px-4 py-2 w-full"
//               />
//             </div>

//             <div>
//               <label htmlFor="compatibility" className="block font-medium mb-2">Compatibility</label>
//               <input
//                 type="text"
//                 id="compatibility"
//                 name="compatibility"
//                 value={cpuCoolerData.specifications.cpuCooler.compatibility}
//                 onChange={handleSpecificationChange}
//                 className="border rounded px-4 py-2 w-full"
//               />
//             </div>

//             <div>
//               <label htmlFor="dimensions" className="block font-medium mb-2">Dimensions</label>
//               <input
//                 type="text"
//                 id="dimensions"
//                 name="dimensions"
//                 value={cpuCoolerData.specifications.cpuCooler.dimensions}
//                 onChange={handleSpecificationChange}
//                 className="border rounded px-4 py-2 w-full"
//               />
//             </div>


//             <div>
//               <label htmlFor="image" className="block font-medium mb-2">Upload Image</label>
//               <input type="file" id="image" accept="image/*" onChange={handleImageChange} className="border rounded px-4 py-2 w-full" />
//             </div>

//             <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
//               Add CPU Cooler
//             </button>
//           </form>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default AddCpuCoolerProduct;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddCpuCoolerProduct = () => {
  const navigate = useNavigate();
  const [cpuCoolerData, setCpuCoolerData] = useState({
    name: '',
    category: 'cpu cooler',
    brand: '',
    model: '',
    description: '',
    price: '',
    stock: '',
    imageUrl: '',
    specifications: {
      cpuCooler: {
        coolerType: '',
        fanSize: '',
        rpm: '',
        compatibility: '',
        dimensions: '',
        weight: '',
      }
    },
  });

  const [brands, setBrands] = useState([]);
  const [image, setImage] = useState(null);

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
    setCpuCoolerData((prevData) => ({
      ...prevData,
      [name]: name === 'price' || name === 'stock' ? (value ? parseFloat(value) : '') : value,
    }));
  };

  const handleSpecificationChange = (e) => {
    const { name, value } = e.target;
    setCpuCoolerData((prevData) => ({
      ...prevData,
      specifications: {
        cpuCooler: {
          ...prevData.specifications.cpuCooler,
          [name]: name === "rpm" && value === "" ? "N/A" : value,
        }
      },
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = cpuCoolerData.imageUrl;
      if (image) {
        const formData = new FormData();
        formData.append('image', image);

        const uploadResponse = await axios.post('http://localhost:5000/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        imageUrl = uploadResponse.data.imageUrl;
      }

      const updatedCpuCoolerData = {
        ...cpuCoolerData,
        imageUrl,
      };

      await axios.post('http://localhost:5000/api/productsin', updatedCpuCoolerData);
      toast.success('CPU Cooler added successfully!');

      setCpuCoolerData({
        name: '',
        category: 'cpu cooler',
        brand: '',
        model: '',
        description: '',
        price: '',
        stock: '',
        imageUrl: '',
        specifications: {
          cpuCooler: {
            coolerType: '',
            fanSize: '',
            rpm: '',
            compatibility: '',
            dimensions: '',
            weight: '',
          }
        },
      });
      setImage(null);
    } catch (error) {
      console.error('Error adding CPU Cooler:', error);
      toast.error('Failed to add CPU Cooler.');
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <ToastContainer />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-grow bg-gray-100 p-6 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-4">Add CPU Cooler</h1>
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
                  value={cpuCoolerData[field]}
                  onChange={handleChange}
                  placeholder={`Enter ${field}`}
                  required
                  className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}

            <div>
              <label htmlFor="brand" className="block font-medium mb-2">Brand</label>
              <select
                id="brand"
                name="brand"
                value={cpuCoolerData.brand}
                onChange={handleChange}
                required
                className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Brand</option>
                {brands.map((brand) => (
                  <option key={brand._id} value={brand.name}>{brand.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="coolerType" className="block font-medium mb-2">Cooler Type</label>
              <select
                id="coolerType"
                name="coolerType"
                value={cpuCoolerData.specifications.cpuCooler.coolerType}
                onChange={handleSpecificationChange}
                required
                className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Cooler Type</option>
                <option value="Air">Air Cooler</option>
                <option value="Liquid">Liquid Cooler</option>
              </select>
            </div>

            {['fanSize', 'rpm', 'compatibility', 'dimensions', 'weight'].map((spec) => (
              <div key={spec}>
                <label htmlFor={spec} className="block font-medium mb-2">
                  {spec.charAt(0).toUpperCase() + spec.slice(1)}
                </label>
                <input
                  type="text"
                  id={spec}
                  name={spec}
                  value={cpuCoolerData.specifications.cpuCooler[spec]}
                  onChange={handleSpecificationChange}
                  className="border rounded px-4 py-2 w-full"
                />
              </div>
            ))}

            <div>
              <label htmlFor="image" className="block font-medium mb-2">Upload Image</label>
              <input type="file" id="image" accept="image/*" onChange={handleImageChange} className="border rounded px-4 py-2 w-full" />
            </div>

            <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
              Add CPU Cooler
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default AddCpuCoolerProduct;
