import React, { useState, useEffect } from 'react';
import { createUser, getAllUsers } from '../Apicalls/user';
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

const SwitchUser = ({ mode = 'multi', selectedUsers = [], onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAddProfile, setShowAddProfile] = useState(false);
  const [newName, setNewName] = useState('');
  const [newTimezone, setNewTimezone] = useState('Asia/Kolkata');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getusers();
  }, [])

  const getusers = async () => {
    try {
      const response = await getAllUsers();
      // console.log(response)
      setUsers(response.data);
    } catch (err) {
      console.log(err.message);
    }
  }

  const handleToggle = (username) => {
    if (mode === 'single') {
      onChange([username]);
      setIsOpen(false);
    } else {
      if (selectedUsers.includes(username)) {
        onChange(selectedUsers.filter(UsrName => UsrName !== username));
      } else {
        onChange([...selectedUsers, username]);
      }
    }
  };

  const handleAddProfile = async () => {
    if (!newName.trim()) {
      toast.warn("Please enter a valid name! ")
      return;
    }

    try {
      const response = await createUser({ name: newName, timezone: newTimezone });
      setNewName('') // resetting the input field
      setNewTimezone('Asia/Kolkata'); // by default iam setting to this
      setShowAddProfile(false);
      getusers(); // update the users with the latest user
    } catch (err) {
      console.error('Error creating user:', err);
      toast.error("Error creating user!");
      toast.info("Try Again!")
    }
  };

  return (
    <div className="switch-user">
      <div className="dropdown-header" onClick={() => setIsOpen(!isOpen)}>
        <span>
          {selectedUsers.length > 0
            ? selectedUsers.join(', ')
            : 'Search profiles...'}
        </span>
        <span className="arrow">{isOpen ? '▲' : '▼'}</span>
      </div>
      {isOpen && (
        <div className="dropdown-menu">
          {users && users.length > 0 ? (
            users.map(user => (
              <label key={user._id} className="dropdown-item">
                <input
                  type={mode === 'single' ? 'radio' : 'checkbox'}
                  checked={selectedUsers.includes(user.name)}
                  onChange={() => handleToggle(user.name)}
                />
                <span>{user.name}</span>
              </label>
            ))
          ) : (
            <p style={{ padding: '10px', color: '#999' }}>No users available</p>
          )}
          {!showAddProfile ? (
            <button
              className="add-profile-btn"
              onClick={() => setShowAddProfile(true)}
            >
              + Add Profile
            </button>
          ) : (
            <div className="add-profile-form">
              <input
                type="text"
                placeholder="Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <select
                value={newTimezone}
                onChange={(e) => setNewTimezone(e.target.value)}
              >
                {TIMEZONES.map(tz => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
              <button onClick={handleAddProfile}>Save</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SwitchUser;
