(function () {
  'use strict';

  var siteHeader = document.querySelector('.site-header');
  function updateHeader() {
    if (siteHeader) siteHeader.classList.toggle('scrolled', window.scrollY > 8);
  }
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('main-nav');
  function setMenu(open) {
    if (!nav || !toggle) return;
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
    nav.querySelectorAll('a').forEach(function (link) { link.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (event) { if (event.key === 'Escape') setMenu(false); });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      var id = link.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (target) { event.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  var form = document.getElementById('appointment-form');
  if (!form) return;

  var successBox = document.getElementById('success-box');
  var dateInput = form.elements['date'];
  var timeInput = form.elements['time'];
  var slotGrid = document.getElementById('slot-grid');
  var slotDateNote = document.getElementById('slot-date-note');
  var selectedSlotText = document.getElementById('selected-slot');

  var now = new Date();
  var todayIso = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
  dateInput.min = todayIso;

  // Show the next available clinic day and its slots immediately when the booking page opens.
  var initialDate = new Date();
  if (initialDate.getDay() === 0) initialDate.setDate(initialDate.getDate() + 1);
  var initialIso = initialDate.getFullYear() + '-' + String(initialDate.getMonth() + 1).padStart(2, '0') + '-' + String(initialDate.getDate()).padStart(2, '0');
  dateInput.value = initialIso;

  var slots = [
    ['09:00', '9:00 AM'], ['09:45', '9:45 AM'], ['10:30', '10:30 AM'],
    ['11:15', '11:15 AM'], ['12:00', '12:00 PM'], ['12:45', '12:45 PM'],
    ['15:00', '3:00 PM'], ['15:45', '3:45 PM'], ['16:30', '4:30 PM'],
    ['17:15', '5:15 PM']
  ];

  function dateKey(dateString) {
    var d = new Date(dateString + 'T00:00:00');
    return d.getDay();
  }

  function renderSlots() {
    if (!slotGrid || !dateInput.value) return;
    slotGrid.innerHTML = '';
    timeInput.value = '';
    selectedSlotText.textContent = '';

    var selectedDate = dateInput.value;
    var day = dateKey(selectedDate);
    var pretty = new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
    slotDateNote.textContent = day === 0 ? 'The clinic is closed on Sunday. Please choose another date.' : 'Available times on ' + pretty;

    if (day === 0) return;

    // Static demo availability: a few slots are intentionally booked.
    var dayNumber = new Date(selectedDate + 'T00:00:00').getDate();
    var bookedIndexes = [(dayNumber + 1) % slots.length, (dayNumber + 4) % slots.length];

    slots.forEach(function (slot, index) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'slot-btn' + (bookedIndexes.indexOf(index) !== -1 ? ' booked' : '');
      button.textContent = slot[1];
      button.dataset.time = slot[0];
      if (bookedIndexes.indexOf(index) !== -1) {
        button.disabled = true;
        button.setAttribute('aria-label', slot[1] + ' booked');
      } else {
        button.addEventListener('click', function () {
          slotGrid.querySelectorAll('.slot-btn').forEach(function (b) { b.classList.remove('selected'); });
          button.classList.add('selected');
          timeInput.value = slot[0];
          selectedSlotText.textContent = 'Selected: ' + slot[1];
          showError('time', '');
        });
      }
      slotGrid.appendChild(button);
    });
  }

  renderSlots();

  dateInput.addEventListener('change', function () {
    showError('date', '');
    renderSlots();
  });

  var rules = {
    fullName: function (value) {
      if (!value) return 'Please enter your full name.';
      if (value.length < 3) return 'Your name should be at least 3 characters.';
      if (!/^[A-Za-z][A-Za-z .'-]*$/.test(value)) return 'Please use letters and spaces only.';
      return '';
    },
    phone: function (value) {
      if (!value) return 'Please enter your phone number.';
      var digits = value.replace(/[\s-]/g, '');
      if (!/^(\+91|91|0)?[6-9]\d{9}$/.test(digits)) return 'Please enter a valid 10-digit mobile number.';
      return '';
    },
    email: function (value) {
      if (!value) return 'Please enter your email address.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) return 'Please enter a valid email, for example name@example.com.';
      return '';
    },
    age: function (value) {
      if (!value) return 'Please enter your age.';
      var age = Number(value);
      if (!Number.isInteger(age) || age < 1 || age > 120) return 'Please enter an age between 1 and 120.';
      return '';
    },
    reason: function (value) { return value ? '' : 'Please select a reason for consultation.'; },
    date: function (value) {
      if (!value) return 'Please choose a preferred date.';
      if (value < todayIso) return 'Please choose today or a later date.';
      if (new Date(value + 'T00:00:00').getDay() === 0) return 'The clinic is closed on Sundays. Please choose another day.';
      return '';
    },
    time: function (value) {
      if (!value) return 'Please choose an available appointment slot.';
      return ''; 
    },
    message: function (value) { return value.length > 300 ? 'Please keep your message under 300 characters.' : ''; }
  };

  var fieldNames = Object.keys(rules);
  function showError(name, message) {
    var input = form.elements[name];
    var field = input.closest('.field');
    if (field) field.classList.toggle('invalid', message !== '');
    input.setAttribute('aria-invalid', message !== '' ? 'true' : 'false');
    var error = document.getElementById(name + '-error');
    if (error) error.textContent = message;
  }
  function validateField(name) {
    var value = form.elements[name].value.trim();
    var message = rules[name](value);
    showError(name, message);
    return message === '';
  }

  fieldNames.forEach(function (name) {
    var input = form.elements[name];
    if (name === 'time') return;
    function recheck() {
      if (input.closest('.field').classList.contains('invalid')) validateField(name);
    }
    input.addEventListener('input', recheck);
    input.addEventListener('change', recheck);
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var firstInvalid = null;
    fieldNames.forEach(function (name) {
      if (!validateField(name) && !firstInvalid) firstInvalid = form.elements[name];
    });
    if (firstInvalid) {
      if (firstInvalid === timeInput) {
        var slotSection = document.querySelector('.slot-section');
        if (slotSection) slotSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      firstInvalid.focus();
      return;
    }
    successBox.hidden = false;
    form.reset();
    fieldNames.forEach(function (name) { showError(name, ''); });
    if (slotGrid) slotGrid.innerHTML = '';
    if (slotDateNote) slotDateNote.textContent = 'Select a date to see available times.';
    if (selectedSlotText) selectedSlotText.textContent = '';
    successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    successBox.focus({ preventScroll: true });
  });
})();
