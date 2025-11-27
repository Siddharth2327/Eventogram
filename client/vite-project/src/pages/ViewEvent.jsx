import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import SwitchUser from '../components/SwitchUser';
import EditEvent from '../components/EditEvent';
import ViewLogs from '../components/ViewLogs';
import { getUserEvents } from '../Apicalls/event';
import { getAllUsers } from '../Apicalls/user';

dayjs.extend(utc);
dayjs.extend(timezone);

const TIMEZONES = [
  'Asia/Kolkata',
  'America/New_York',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Australia/Sydney',
  'Pacific/Auckland'
];

const ViewEvent = () => {
  const [currentProfile, setCurrentProfile] = useState([]);
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewingLogs, setViewingLogs] = useState(null);
  const currentUser = useSelector(state => state.currentUser);
  const currentTimezone = useSelector(state => state.currentTimezone);
  const dispatch = useDispatch();
  const [users, setUsers] = useState([])

  useEffect(() => {
    if (currentUser) {
      setCurrentProfile([currentUser.name]);
      fetchEvents(currentUser._id);
    }
    // console.log(currentUser);
  }, [currentUser]);

  useEffect(() => {
    if (currentProfile.length > 0 && currentUser) {
      fetchEvents(currentUser._id);
    }
    console.log(currentTimezone)
  }, [currentTimezone]);

  useEffect(()=>{
    getusers();
  },[])
  const getusers = async () => {
    try {
      const response = await getAllUsers();
      // console.log(response);
      setUsers(response.data);
    } catch (err) {
      console.log(err.message);
    }
  }

  const fetchEvents = async (userId) => {
    try {
      const response = await getUserEvents(userId);
      setEvents(response);
      // console.log(response);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  const handleProfileChange = (profiles) => {
    if (profiles.length > 0) {
      const user = users.find(usr => usr.name === profiles[0]);
      if (user) {
        // console.log(user);
        dispatch({ type: 'SET_CURRENT_USER', payload: user });
        dispatch({ type: 'SET_CURRENT_TIMEZONE', payload: user.timezone });
        setCurrentProfile(profiles);
      }
    }
  };

  const handleTimezoneChange = (timezone) => {
    dispatch({ type: 'SET_CURRENT_TIMEZONE', payload: timezone });
  };

  return (
    <div className="view-event">
      <h2>Your Events</h2>
      <div className="view-controls">
        <div className="form-group">
          <label>Current Profile</label>
          <SwitchUser
            mode="single"
            selectedUsers={currentProfile}
            onChange={handleProfileChange}
          />
        </div>
        <div className="form-group">
          <label>View in Timezone</label>
          <select value={currentTimezone} onChange={(e) => handleTimezoneChange(e.target.value)}>
            {TIMEZONES.map(zone => (
              <option key={zone} value={zone}>{zone}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="events-list">
        {events.length === 0 ? (
          <div className="empty-state">No events found</div>
        ) : (
          events.map(event => (
            <div key={event._id} className="event-card">
              <div className="event-profiles">{event.usernames.join(', ')}</div>
              <div className="event-details">
                <div>Start: {dayjs(event.startTime).tz(currentTimezone).format('MMM DD, YYYY hh:mm A')}</div>
                <div>End: {dayjs(event.endTime).tz(currentTimezone).format('MMM DD, YYYY hh:mm A')}</div>
                <div className="event-meta">
                  Created: {dayjs(event.createdAt).tz(currentTimezone).format('MMM DD, YYYY hh:mm A')}
                </div>
                <div className="event-meta">
                  Updated: {dayjs(event.updatedAt).tz(currentTimezone).format('MMM DD, YYYY hh:mm A')}
                </div>
              </div>
              <div className="event-actions">
                <button onClick={() => setEditingEvent(event)}>Edit</button>
                <button onClick={() => setViewingLogs(event._id)}>View Logs</button>
              </div>
            </div>
          ))
        )}
      </div>
      {editingEvent && (
        <EditEvent
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onUpdate={() => fetchEvents(currentUser._id)}
        />
      )}
      {viewingLogs && (
        <ViewLogs
          eventId={viewingLogs}
          onClose={() => setViewingLogs(null)}
        />
      )}
    </div>
  );
};

export default ViewEvent;
