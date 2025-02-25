import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const FeedbackApproval = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/feedbacks/pending"); 
      setFeedbacks(response.data);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    } finally {
      setLoading(false);
    }
  };
  

  const approveFeedback = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/feedbacks/approve/${id}`);
      setFeedbacks((prev) =>
        prev.map((feedback) =>
          feedback._id === id ? { ...feedback, isActive: true } : feedback
        )
      );

      navigate('/feedback')
    } catch (error) {
      console.error("Error approving feedback:", error);
    }
  };

  const deleteFeedback = async (id) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/feedbacks/${id}`);
      setFeedbacks((prev) => prev.filter((feedback) => feedback._id !== id));
    } catch (error) {
      console.error("Error deleting feedback:", error);
    }
  };

  const handleBackToFeedbackMgmt = () => {
    navigate('/feedback');
  }

  return (
    <div className="h-screen flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-4">Feedback Approval</h1>
        <div className='p-1'>
              <button
                onClick={handleBackToFeedbackMgmt}
                className="bg-green-500 text-white px-2 py-2 mx-1 rounded hover:bg-green-600"
              >
                <i class="fa fa-arrow-left" aria-hidden="true"></i> Feedback Management
              </button>
            </div>
        {loading ? (
          <p>Loading feedback...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Username</th>
                  <th className="border p-2">Product</th>
                  <th className="border p-2">Title</th>
                  <th className="border p-2">Message</th>
                  <th className="border p-2">Status</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {feedbacks.length > 0 ? (
                  feedbacks.map((feedback) => (
                    <tr key={feedback._id} className="hover:bg-gray-100">
                      <td className="border p-2">{feedback.userId.username || "Unknown"}</td>
                      <td className="border p-2">{feedback.productTitle || "Unknown"}</td>
                      <td className="border p-2">{feedback.title}</td>
                      <td className="border p-2">{feedback.description}</td>
                      <td className="border p-2">
                        {feedback.isActive ? (
                          <span className="text-green-600 font-bold">Approved</span>
                        ) : (
                          <span className="text-red-500 font-bold">Pending</span>
                        )}
                      </td>
                      <td className="border p-2">
                        {!feedback.isActive && (
                          <button
                            onClick={() => approveFeedback(feedback._id)}
                            className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                          >
                            Approve
                          </button>
                        )}
                        <button
                          onClick={() => deleteFeedback(feedback._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center border p-4">
                      No feedback available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackApproval;
