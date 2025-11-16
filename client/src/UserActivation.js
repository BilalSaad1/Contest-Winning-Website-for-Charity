import React, { useEffect, useState } from 'react';
import "./UsersList.css"

function UsersList() {
    const [users, setUsers] = useState([]);

function getthe(){
        fetch('/api/users')
            .then(res => res.json())
            .then(setUsers)
            .catch(console.error);}
            useEffect(() => {
                getthe();
              }, []);

    const toggleDeactivation = (userId, isdeactivated) => {
        fetch(`/api/users/${userId}/toggleDeactivation`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isdeactivated: !isdeactivated }),
        })
        .then(response => {
            if (response.ok) {
                setUsers(users.map(user => user._id === userId ? { ...user, isdeactivated: !isdeactivated } : user));
            } else {
                alert('Failed to update user.');
            }
        })
        .catch(console.error);
    };
    const toggleEmployeeStatus = (userId, isEmployee) => {
        fetch(`/api/user/${userId}/toggleEmployee`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ isEmployee: !isEmployee }),
        })
        .then(response => {
            if (response.ok) {
                getthe()
            }
        })
        .catch(error => console.error('Error toggling employee status:', error));
    };
    


    return (
<div className="table-container">
    <h2>User List</h2>
    <table>
        <thead>
            <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Newsletter</th>
                <th>Is Deactivated?</th>
                <th>Is Employee?</th> {/* New Column Header */}
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            {users.map(user => (
                <tr key={user._id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.newsletter === "Yes" ? 'Yes' : 'No'}</td>
                    <td>{user.isdeactivated ? 'True' : 'False'}</td>
                    <td>{user.isemployee ? 'True' : 'False'}</td> {/* Display isemployee status */}
                    <td>
                        <button className="d-button" onClick={() => toggleDeactivation(user._id, user.isdeactivated)}>
                            Toggle Deactivation
                        </button>
                        <button className="d-button" onClick={() => toggleEmployeeStatus(user._id, user.isemployee)}>
                            Toggle Employee
                        </button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
</div>

    );
}

export default UsersList;
