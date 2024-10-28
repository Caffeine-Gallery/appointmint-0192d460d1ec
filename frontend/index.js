import { backend } from 'declarations/backend';

let selectedDate = '';
let selectedTime = '';

document.addEventListener('DOMContentLoaded', () => {
  const datePicker = document.getElementById('datePicker');
  const timeSlots = document.getElementById('timeSlots');
  const appointmentForm = document.getElementById('appointmentForm');
  const bookButton = document.getElementById('bookButton');
  const confirmationMessage = document.getElementById('confirmationMessage');

  datePicker.addEventListener('change', async (e) => {
    selectedDate = e.target.value;
    const availableSlots = await backend.getAvailableSlots(selectedDate);
    displayTimeSlots(availableSlots);
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

    try {
      showLoading(true);
      const appointmentId = await backend.createAppointment(selectedDate, selectedTime, name, email);
      showConfirmation(appointmentId);
      resetForm();
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
});
