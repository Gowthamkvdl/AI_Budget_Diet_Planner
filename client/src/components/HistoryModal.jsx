import { useEffect, useState } from 'react';
import api from '../lib/api';
import { useNavigate } from 'react-router-dom';

const HistoryModal = ({ onClose }) => {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      const { data } = await api.get('/api/history');
      setHistory(data.history);
    };
    fetchHistory();
  }, []);

  const handleClick = (id) => {
    onClose(); // close modal
    navigate(`/history/${id}`);
  };

  return (
    <>
      <div className="modal fade show d-block">
        <div className="modal-dialog">
          <div className="modal-content">

            <div className="modal-header">
              <h5>History</h5>
              <button className="btn-close" onClick={onClose}></button>
            </div>

            <div className="modal-body">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="card p-2 mb-2"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleClick(item.id)}
                >
                  <strong className='mb-0 pb-2' >Plan #{item.id.slice(-5)}</strong>
                  <small className='mt-0 pt-0'>
                    {new Date(item.createdAt).toLocaleString()}
                  </small>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      <div className="modal-backdrop fade show" onClick={onClose}></div>
    </>
  );
};

export default HistoryModal;