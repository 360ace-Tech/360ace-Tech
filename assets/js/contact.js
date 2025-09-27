document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('.contact__form');
  const sendButton = form.querySelector('button[type="submit"]');
  const privacyCheckbox = form.querySelector('input[type="checkbox"]');
  let recaptcha;

  // Function to validate the email format
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Function to check form validity and enable/disable the send button
  function updateSendButton() {
    const formData = new FormData(form);
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');
    const isEmailValid = isValidEmail(email);
    const isSubjectValid = subject.trim() !== '';
    const isMessageValid = message.trim() !== '';
    const isPrivacyChecked = privacyCheckbox.checked;
    const isFormValid =
      isEmailValid && isSubjectValid && isMessageValid && isPrivacyChecked;
    sendButton.disabled = !isFormValid;
  }

  // Add event listeners for form input elements to check validity dynamically
  const formInputs = form.querySelectorAll('.contact__input');
  formInputs.forEach(function (input) {
    input.addEventListener('input', updateSendButton);
  });

  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    // Validate form fields
    updateSendButton();

    // Check if the form is valid before proceeding
    if (sendButton.disabled) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill out all required fields and agree to the privacy policy.',
      });
      return;
    }

    // Check reCAPTCHA response
    const formData = new FormData(form);
    const recaptchaResponse = formData.get('g-recaptcha-response');

    if (!recaptchaResponse) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please complete reCAPTCHA.',
      });
      return;
    }

    // Get form data
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');

    // Send email using Cloudflare Worker
    const cloudflareWorkerURL = 'https://360ace-sendmail.ade-000.workers.dev'; // Replace with your Cloudflare Worker URL

    // Send email using SendGrid
    const cloudflareResponse = await fetch(cloudflareWorkerURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        subject: subject,
        message: message,
      }),
    });

    if (cloudflareResponse.ok) {
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Email sent successfully!',
      });
      form.reset(); // Clear the form
      grecaptcha.reset(recaptcha); // Reset reCAPTCHA
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to send email. Please try again later.',
      });
      grecaptcha.reset(recaptcha); // Reset reCAPTCHA
    }
  });

  // Set a timeout to refresh the reCAPTCHA after a certain period of time
  setTimeout(function() {
    grecaptcha.reset(recaptcha);
  }, 120000); // 2 minutes timeout
});