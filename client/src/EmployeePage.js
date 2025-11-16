import React, { useState, useEffect } from 'react';
import DemoApp from './CalenderEmp'
import DemoApp1 from './CalenderScheduleEmp'
import { saveAs } from 'file-saver';
import './EmployeePage.css'

function EmployeePage() {
  const [currentPage, setCurrentPage] = useState('clockInClockOut');
  const [clockInTime, setClockInTime] = useState(null);
  const [clockOutTime, setClockOutTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState('');
  const [hoursRecords, setHoursRecords] = useState([]);
  const [username, setUsername] = useState('');


  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser.isEmployee) {
      setUsername(storedUser.username);
      fetchHours(storedUser.username);
    }
  }, []);

  const clockIn = () => {
    const currentTime = new Date();
    setClockInTime(currentTime);
    setClockOutTime(null);
    setElapsedTime('');

  };
  
  const clockOut = async () => {
    const currentTime = new Date();
    if (clockInTime) {
      const elapsed = (currentTime - clockInTime) / 1000 / 60 / 60;
      setElapsedTime(`${elapsed.toFixed(2)} hours`);
      await recordHours(username, clockInTime, currentTime);
      fetchHours(username);
    }
    setClockOutTime(currentTime);
  };

  const recordHours = async (username, clockInTime, clockOutTime) => {
    try {
      const response = await fetch('/api/hours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          clockIn: clockInTime.toISOString(),
          clockOut: clockOutTime.toISOString(),
        }),
      });
      if (!response.ok) throw new Error('Failed to record hours');
      fetchHours(username);
    } catch (err) {
      console.error('Error recording hours:', err);
    }
  };

  const fetchHours = async (username) => {
    try {
      const response = await fetch(`/api/hours/${username}`);
      if (!response.ok) {
        throw new Error('Failed to fetch hours');
      }
      const data = await response.json();
      const records = data; 
      setHoursRecords(records); 
      return records;
    } catch (err) {
      console.error('Error fetching hours:', err);
      return [];  
    }
  };
  
  const downloadHoursAsCSV = async () => {
    const records = await fetchHours(username);
  
    if (!records.length) {
      console.log('No records fetched.');
      return;
    }
  
    const hoursRecords = records[0].hours;
  
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
  
    const currentMonthRecords = hoursRecords.filter(record => {
      const recordDate = new Date(record.clockIn);
      return recordDate.getMonth() === currentMonth && recordDate.getFullYear() === currentYear;
    });
  
    if (!currentMonthRecords.length) {
      console.log('No records found for the current month');
      return;
    }
    const totalHoursWorked = currentMonthRecords.reduce((total, record) => total + parseFloat(record.hoursWorked), 0);
    let csvContent = "Date, Hours Worked\n";
    currentMonthRecords.forEach(record => {
      const recordDate = new Date(record.clockIn).toLocaleDateString();
      const hoursWorked = record.hoursWorked.toFixed(2);
      csvContent += `${recordDate}, ${hoursWorked}\n`;
    });
  
    csvContent += `Total Hours,${totalHoursWorked.toFixed(2)}\n`;
    csvContent += "Hourly Rate,\n";
  
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `Hours_${currentMonth + 1}_${currentYear}.csv`);
  };
  
return (
<div className="employee-dashboard">
  <nav className="employee-navbar">
      <button onClick={() => setCurrentPage('calendar')} className={currentPage === 'calendar' ? 'active' : ''}>Calendar</button>
      <button onClick={() => setCurrentPage('scheduleHours')} className={currentPage === 'schedulehours' ? 'active' : ''}>Schedule</button>
      <button onClick={() => setCurrentPage('clockInClockOut')} className={currentPage === 'clockInClockOut' ? 'active' : ''}>Clock In/Out</button>
  </nav>

  <div className="employee-content">
        {currentPage === 'calendar' && <DemoApp />}
        {currentPage === 'scheduleHours' && <DemoApp1 />}
        {currentPage === 'clockInClockOut' && (
          <div className="clock-in-out-content">
              <button onClick={clockIn} className="employee-button">Clock In</button>
              <button onClick={clockOut} disabled={!clockInTime} className="employee-button">Clock Out</button>
              {elapsedTime && <p className="shift-length">Shift Length: {elapsedTime}</p>}
              <button onClick={downloadHoursAsCSV} className="employee-button">Download Hours</button>
          </div>
      )}
  </div>
</div>
);}


export default EmployeePage;