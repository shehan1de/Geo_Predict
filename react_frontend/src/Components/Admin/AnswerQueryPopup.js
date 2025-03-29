import axios from 'axios';
import 'bootstrap-icons/font/bootstrap-icons.css';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../css/main.css';

const EditQueryPopup = ({ query, onClose }) => {
  const [answer, setAnswer] = useState(query.answer);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);

    const userId = localStorage.getItem('userId');

    if (!userId) {
      toast.error('User not logged in. Please log in again.');
      setLoading(false);
      return;
    }

    const answerDate = new Date();
    try {
      await axios.put(`/api/queries/answer/${query.queryId}`, {
        answer,
        userId,
        answerDate,
      });

      toast.success('Query updated successfully!');

      onClose();
    } catch (error) {
      toast.error('Error updating query. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h4>Edit Query</h4>

        <label>Query ID</label>
        <input
          type="text"
          className="form-control readonly-field"
          value={query.queryId}
          readOnly
        />

        <label>Question</label>
        <input
          type="text"
          className="form-control readonly-field"
          value={query.question}
          readOnly
        />

        <label>Answer</label>
        <textarea
          className="form-control"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Enter your updated answer"
        />

        <div className="modal-actions">
          <button className="btn-save" onClick={handleUpdate} disabled={loading}>
            {loading ? 'Updating...' : 'Save Changes'}
          </button>
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default EditQueryPopup;
