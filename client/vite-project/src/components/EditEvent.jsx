import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import SwitchUser from "./SwitchUser";
import { updateEvent } from '../Apicalls/event';
import { toast } from 'react-toastify';
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

const EditEvent = ({ event, onClose, onUpdate }) => {
  const [profiles, setProfiles] = useState(event.usernames || []);
  const [timezone, setTimezone] = useState(event.eventTimezone);
  const [startDate, setStartDate] = useState(new Date(event.startTime));
  const [endDate, setEndDate] = useState(new Date(event.endTime));

  const handleUpdate = async () => {
    if (endDate <= startDate) {
      toast.warn("End date must be after start date")
      return;
    }

    try {
      await updateEvent(event._id, {
        usernames: profiles,
        eventTimezone: timezone,
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        changedBy: 'user'
      });
      toast.success("Event Updated successfully")
      onUpdate();
      onClose();
    } catch (err) {
      console.error('Error while updating event:', err);
      toast.error("Error while updating the event")
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Edit Event</h2>
        <div className="form-group">
          <label>Profiles</label>
          <SwitchUser
            mode="multi"
            selectedUsers={profiles}
            onChange={setProfiles}
          />
        </div>
        <div className="form-group">
          <label>Timezone</label>
          <select value={timezone} onChange={(e) => setTimezone(e.target.value)}>
            {TIMEZONES.map(tz => (
              <option key={tz} value={tz}>{tz}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Start Date & Time</label>
          <DatePicker
            selected={startDate}
            onChange={setStartDate}
            showTimeSelect
            dateFormat="MMM dd, yyyy hh:mm aa"
          />
        </div>
        <div className="form-group">
          <label>End Date & Time</label>
          <DatePicker
            selected={endDate}
            onChange={setEndDate}
            showTimeSelect
            dateFormat="MMM dd, yyyy hh:mm aa"
            minDate={startDate}
          />
        </div>
        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="update-btn" onClick={handleUpdate}>Update Event</button>
        </div>
      </div>
    </div>
  );
};

export default EditEvent;
