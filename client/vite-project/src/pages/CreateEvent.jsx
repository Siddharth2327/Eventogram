import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import SwitchUser from '../components/SwitchUser';
import { createEvent } from '../Apicalls/event';
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

const CreateEvent = () => {
  const [profiles, setProfiles] = useState([]);
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const currentTimezone = useSelector(state => state.currentTimezone);

  useEffect(() => {
    setTimezone(currentTimezone);
  }, [currentTimezone]);

  const handleSubmit = async () => {
    if (!profiles.length || !startDate || !endDate) {
      toast.warn("Please fill all the fileds")
      return;
    }
    if (endDate <= startDate) {
      toast.warn("End date must be after Start date ")
      return;
    }

    try {
      await createEvent({
        usernames: profiles,
        eventTimezone: timezone,
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString()
      });
      toast.success("Event created successfully")
      setProfiles([]);
      setStartDate(null);
      setEndDate(null);
    } catch (err) {
      console.error('Error creating event:', err);
      toast.error("Failed to create the event!")
    }
  };

  return (
    <div className="create-event">
      <h2>Create New Event</h2>
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
          {TIMEZONES.map(zone => (
            <option key={zone} value={zone}>{zone}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label>Start Date & Time</label>
        <DatePicker
          selected={startDate}
          onChange={setStartDate}
          showTimeInput
          dateFormat="MMM dd, yyyy hh:mm aa"
          placeholderText="Select start date and time"
        />
      </div>
      <div className="form-group">
        <label>End Date & Time</label>
        <DatePicker
          selected={endDate}
          onChange={setEndDate}
          showTimeInput
          dateFormat="MMM dd, yyyy hh:mm aa"
          minDate={startDate} // blocking the previous dates before startdate
          placeholderText="Select end date and time"
        />
      </div>
      <button className="create-btn" onClick={handleSubmit}>
        + Create Event
      </button>
    </div>
  );
};

export default CreateEvent;
