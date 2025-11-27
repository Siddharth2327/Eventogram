import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { getEventLogs } from '../Apicalls/event';

dayjs.extend(utc);
dayjs.extend(timezone);

const ViewLogs = ({ eventId, onClose }) => {
  const [logs, setLogs] = useState([]);
  const currentTimezone = useSelector(state => state.currentTimezone);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await getEventLogs(eventId);
        // console.log(res)
        setLogs(res.data);
      } catch (err) {
        console.error('Error fetching logs:', err);
      }
    };
    fetchLogs();
  }, [eventId]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content logs-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Recent Logs</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        
        <div className="logs-content">
          {logs.length === 0 ? (
            <p>No logs yet</p>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="log-item">
                <div className="log-time">
                  {dayjs(log.timestamp).tz(currentTimezone).format('MMM DD, YYYY hh:mm A')}
                </div>
                <div className="log-changes">
                  {Object.entries(log.changes || {}).map(([key, value], i) => (
                    <div key={i}>
                      <strong>{key}</strong>: {JSON.stringify(value.old)} → {JSON.stringify(value.new)}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewLogs;
