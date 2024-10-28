import { AuthClient } from "@dfinity/auth-client";
import { Principal } from "@dfinity/principal";
import { backend } from 'declarations/backend';

let authClient;
let selectedDate = '';
let selectedTime = '';

document.addEventListener('DOMContentLoaded', async () => {
  const datePicker = document.getElementById('datePicker');
  const timeSlots = document.getElementById('timeSlots');
  const appointmentForm = document.getElementById('appointmentForm');
  const bookButton = document.getElementById('bookButton');
  const confirmationMessage = document.getElementById('confirmationMessage');
  const loginButton = document.getElementById('loginButton');
  const setAdminButton = document.getElementById('setAdminButton');
  const setSpecificAdminButton = document.getElementById('setSpecificAdminButton');
  const adminPrincipalInput = document.getElementById('adminPrincipalInput');
  const userView = document.getElementById('userView');
  const adminView = document.getElementById('adminView');
  const refreshAppointmentsButton = document.getElementById('refreshAppointments');
  const setAvailabilityButton = document.getElementById('setAvailabilityButton');

  authClient = await AuthClient.create();

  loginButton.onclick = async () => {
    await authClient.login({
      identityProvider: "https://identity.ic0.app/#authorize",
      onSuccess: async () => {
        const isAdmin = await backend.isAdmin();
        if (isAdmin) {
          userView.style.display = 'none';
          adminView.style.display = 'block';
          loginButton.style.display = 'none';
          loadAdminDashboard();
        } else {
          alert("You are not authorized as an admin.");
        }
      },
    });
  };

  setAdminButton.onclick = async () => {
    try {
      const result = await backend.setAdmin();
      if ('ok' in result) {
        alert("You are now set as an admin.");
      } else if ('err' in result) {
        alert("Error setting admin: " + result.err);
      }
    } catch (error) {
      console.error('Error setting admin:', error);
      alert('An error occurred while setting admin. Please try again.');
    }
  };

  setSpecificAdminButton.onclick = async () => {
    const principalId = adminPrincipalInput.value.trim();
    if (!principalId) {
      alert("Please enter a valid Principal ID.");
      return;
    }
    try {
      const principal = Principal.fromText(principalId);
      const result = await backend.setSpecificAdmin(principal);
      if ('ok' in result) {
        alert("Admin set successfully: " + result.ok);
      } else if ('err' in result) {
        alert("Error setting admin: " + result.err);
      }
    } catch (error) {
      console.error('Error setting specific admin:', error);
      alert('An error occurred while setting the specific admin. Please check the Principal ID and try again.');
    }
  };

  refreshAppointmentsButton.onclick = loadAdminDashboard;

  setAvailabilityButton.onclick = async () => {
    const date = document.getElementById('availabilityDate').value;
    const startTime = document.getElementById('availabilityStartTime').value;
    const endTime = document.getElementById('availabilityEndTime').value;

    if (!date || !startTime || !endTime) {
      alert("Please fill in all availability fields.");
      return;
    }

    try {
      const result = await backend.setDayAvailability(date, true, startTime, endTime);
      if ('ok' in result) {
        alert("Availability set successfully.");
      } else if ('err' in result) {
        alert("Error setting availability: " + result.err);
      }
    } catch (error) {
      console.error('Error setting availability:', error);
      alert('An error occurred while setting availability. Please try again.');
    }
  };

  datePicker.addEventListener('change', async (e) => {
    selectedDate = e.target.value;
    const result = await backend.getAvailableSlots(selectedDate);
    if ('ok' in result) {
      displayTimeSlots(result.ok);
    } else if ('err' in result) {
      alert("Error getting available slots: " + result.err);
      timeSlots.innerHTML = '';
    }
  });

  timeSlots.addEventListener('click', (e) => {
    if (e.target.classList.contains('time-slot')) {
      selectedTime = e.target.dataset.time;
      bookButton.disabled = false;
      Array.from(timeSlots.children).forEach(slot => {
        slot.classList.remove('selected');
      });
      e.target.classList.add('selected');
    }
  });

  appointmentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phoneNumber = document.getElementById('phoneNumber').value;

    try {
      showLoading(true);
      const result = await backend.createAppointment(selectedDate, selectedTime, name, email, phoneNumber);
      if ('ok' in result) {
        showConfirmation(result.ok);
        resetForm();
      } else if ('err' in result) {
        throw new Error(result.err);
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('An error occurred while booking the appointment. Please try again.');
    } finally {
      showLoading(false);
    }
  });

  function displayTimeSlots(slots) {
    timeSlots.innerHTML = '';
    slots.forEach(slot => {
      const button = document.createElement('button');
      button.textContent = slot;
      button.classList.add('btn', 'btn-outline-primary', 'me-2', 'mb-2', 'time-slot');
      button.dataset.time = slot;
      timeSlots.appendChild(button);
    });
  }

  function showConfirmation(appointmentId) {
    confirmationMessage.textContent = `Appointment booked successfully! Your appointment ID is: ${appointmentId}`;
    confirmationMessage.style.display = 'block';
  }

  function resetForm() {
    appointmentForm.reset();
    datePicker.value = '';
    timeSlots.innerHTML = '';
    bookButton.disabled = true;
    selectedDate = '';
    selectedTime = '';
  }

  function showLoading(isLoading) {
    bookButton.disabled = isLoading;
    bookButton.innerHTML = isLoading ? '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Booking...' : 'Book Appointment';
  }

  async function loadAdminDashboard() {
    try {
      const identity = await authClient.getIdentity();
      if (!identity) {
        throw new Error("Not authenticated");
      }
      const result = await backend.getAllAppointments();
      if ('ok' in result) {
        displayAppointments(result.ok);
      } else if ('err' in result) {
        throw new Error(result.err);
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
      alert('An error occurred while loading appointments. Please try again.');
    }
  }

  function displayAppointments(appointments) {
    const appointmentsList = document.getElementById('appointmentsList');
    appointmentsList.innerHTML = '';
    if (appointments.length === 0) {
      appointmentsList.innerHTML = '<p>No appointments found.</p>';
      return;
    }
    const table = document.createElement('table');
    table.classList.add('table', 'table-striped');
    table.innerHTML = `
      <thead>
        <tr>
          <th>Date</th>
          <th>Time</th>
          <th>Name</th>
          <th>Email</th>
          <th>Phone Number</th>
        </tr>
      </thead>
      <tbody>
      </tbody>
    `;
    const tbody = table.querySelector('tbody');
    appointments.forEach(appointment => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${appointment.date}</td>
        <td>${appointment.time}</td>
        <td>${appointment.name}</td>
        <td>${appointment.email}</td>
        <td>${appointment.phoneNumber}</td>
      `;
      tbody.appendChild(row);
    });
    appointmentsList.appendChild(table);
  }
});
