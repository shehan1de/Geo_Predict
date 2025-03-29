import axios from 'axios';
import debounce from 'lodash.debounce';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AnswerQueryPopup from './AnswerQueryPopup';

const ViewQueries = () => {
  const [queries, setQueries] = useState([]);
  const [filteredQueries, setFilteredQueries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState(null);

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const response = await axios.get('/api/queries/queries');
        setQueries(response.data);
        setFilteredQueries(response.data);
      } catch (error) {
        console.error('Error fetching queries:', error);
      }
    };
    fetchQueries();
  }, []);

  useEffect(() => {
    const delayedFilter = debounce((query) => {
      setFilteredQueries(queries.filter(q =>
        q.queryId.toString().includes(query) ||
        q.email.toLowerCase().includes(query) ||
        q.question.toLowerCase().includes(query) ||
        (q.answer && q.answer.toLowerCase().includes(query)) ||
        q.userId.toString().includes(query)
      ));
    }, 500);

    delayedFilter(searchQuery);

    return () => delayedFilter.cancel();
  }, [searchQuery, queries]);

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handleAnswerClick = (query) => {
    setSelectedQuery(query);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedQuery(null);
    
    window.location.reload();
  };

  const handleAnswerSubmit = (updatedQuery) => {
    setQueries(queries.map(query => query.queryId === updatedQuery.queryId ? updatedQuery : query));
    setFilteredQueries(filteredQueries.map(query => query.queryId === updatedQuery.queryId ? updatedQuery : query));
    handleClosePopup();
  };

  const handleDeleteClick = (queryId) => {
    const toastId = toast.warn(
      <div>
        <p>Are you sure you want to delete this query?</p>
        <button
          onClick={async () => {
            try {
              const response = await axios.delete(`/api/queries/${queryId}`);
              
              if (response.status === 200) {
                setQueries(queries.filter(q => q.queryId !== queryId));
                setFilteredQueries(filteredQueries.filter(q => q.queryId !== queryId));
                toast.success('Query deleted successfully!');
              }
            } catch (error) {
              console.error('Error deleting query:', error);
              toast.error('An error occurred while deleting the query. Please try again.');
            }
            toast.dismiss(toastId);
          }}
          style={{ marginRight: 10 }}
        >
          OK
        </button>
        <button onClick={() => toast.dismiss(toastId)}>Cancel</button>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        className: 'delete-toast',
        icon: false,
      }
    );
  };

  return (
    <div className="main-content">
    <div className="container mt-4">
      <h2 className="mb-3">View Queries</h2>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by Query ID, Email, Question, or User ID"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="thead-dark">
            <tr>
              <th>Query ID</th>
              <th>Email</th>
              <th>Question</th>
              <th>Answer</th>
              <th>Date Info</th>
              <th>User ID</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredQueries.length > 0 ? (
              filteredQueries.map((query) => (
                <tr key={query.queryId}>
                  <td>{query.queryId}</td>
                  <td>{query.email}</td>
                  <td>{query.question}</td>
                  <td>{query.answer || '-'}</td>
                  <td>
                    <strong>Created:</strong> {formatDateTime(query.createdAt)}<br />
                    <strong>Updated:</strong> {formatDateTime(query.answerDate)}
                  </td>
                  <td>{query.userId}</td>
                  <td>
                    {query.answer ? (
                      <>
                        <button className="btn-edit me-2" disabled>
                          <i className="bi bi-check-circle"></i> Answered
                        </button>
                        <button onClick={() => handleDeleteClick(query.queryId)} className="btn-delete">
                          <i className="bi bi-trash"></i> Delete
                        </button>
                      </>
                    ) : (
                      <button onClick={() => handleAnswerClick(query)} className="btn-edit me-2">
                        <i className="bi bi-pencil"></i> Answer
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">No queries found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isPopupOpen && selectedQuery && (
        <AnswerQueryPopup
          query={selectedQuery}
          onClose={handleClosePopup}
          onSubmit={handleAnswerSubmit}
        />
      )}
    </div>
    </div>
  );
};

export default ViewQueries;
