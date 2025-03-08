import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FeedbackMgmt = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState({});

  const navigate = useNavigate();
  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/feedbacks");
      setFeedbacks(response.data);

      const userIds = [...new Set(response.data.map((feedback) => feedback.userId))];

      const userResponses = await Promise.all(
        userIds.map((id) =>
          axios.get(`http://localhost:5000/api/users/${id}`)
        )
      );

      const usersData = {};
      userResponses.forEach((res, index) => {
        usersData[userIds[index]] = res.data.username;
      });

      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    } finally {
      setLoading(false);
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

  const disapproveFeedback = async (id) => {
    if (!window.confirm("Are you sure you want to disapprove this feedback?")) return;

    try {
      await axios.put(`http://localhost:5000/api/feedbacks/${id}/disapprove`, {
        isActive: false,
      });

      setFeedbacks((prev) =>
        prev.map((feedback) =>
          feedback._id === id ? { ...feedback, isActive: false } : feedback
        )
      );
    } catch (error) {
      console.error("Error disapproving feedback:", error);
    }
  };

  const handleApproval = () => {
    navigate('/feedback-approval');
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-grow bg-gray-100 p-6 overflow-y-auto">
          <h1 className="text-2xl font-semibold mb-4">Feedback Management</h1>
          <div className='p-1'>
            <button
              onClick={handleApproval}
              className="bg-green-500 text-white px-2 py-2 mx-1 rounded hover:bg-green-600"
            >
              <i className="fa fa-plus" aria-hidden="true"></i> Feedback Approval
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
                    <th className="border p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {feedbacks.length > 0 ? (
                    feedbacks.map((feedback) => (
                      <tr key={feedback._id} className="hover:bg-gray-100">
                        <td className="border p-2">{users[feedback.userId] || "Unknown"}</td>
                        <td className="border p-2 w-3/12">{feedback.productTitle}</td>
                        <td className="border p-2">{feedback.title}</td>
                        <td className="border p-2 w-3/12">{feedback.description}</td>
                        <td className="border p-2 space-x-2">
                          <button
                            onClick={() => deleteFeedback(feedback._id)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                          >
                            <i class="fa fa-trash-o" aria-hidden="true"></i>
                          </button>
                          <button
                            onClick={() => disapproveFeedback(feedback._id)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                          >
                            <i class="fa fa-thumbs-down" aria-hidden="true"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center border p-4">
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
    </div>
  );
};

export default FeedbackMgmt;
