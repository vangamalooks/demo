/*
  Masana WebWorks: contact form + opted-in chatbot handoff
  Recipient: www.vukosi394@gmail.com
  Keeps the existing script.js/chatbot.js and CSS in place.
  Ordinary chatbot conversation is NOT automatically emailed.
  FormSubmit delivery requires recipient email activation.
*/
(() => {
  'use strict';

  const RECIPIENT = 'www.vukosi394@gmail.com';
  const AJAX_ENDPOINT = `https://formsubmit.co/ajax/${RECIPIENT}`;
  const FORM_ENDPOINT = `https://formsubmit.co/${RECIPIENT}`;
  const SITE_URL = 'https://masanawebworks.co.za/';

  const byId = (id) => document.getElementById(id);

  function isConfirmedSuccess(value) {
    // FormSubmit can return the strings 'true' and 'false'; both are truthy in JS!
    return value === true || value === 'true';
  }

  function setStatus(target, message, isError = false) {
    if (!target) return;
    target.textContent = message;
    target.style.color = isError ? '#c74739' : '';
    target.dataset.state = isError ? 'error' : 'info';
  }

  async function submitEnquiry(fields) {
    // FormSubmit's AJAX endpoint, not the regular HTML endpoint.
    let response;
    try {
      response = await fetch(AJAX_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(fields),
        credentials: 'omit'
      });
    } catch (error) {
      throw new Error('Could not connect to the email service. Please check your connection and try again, or email us directly.');
    }

    let data;
    try {
      data = await response.json();
    } catch (error) {
      throw new Error('The email service returned an unexpected response. Please try again or email us directly.');
    }

    if (!response.ok || !isConfirmedSuccess(data.success)) {
      const message = typeof data.message === 'string' && data.message.trim()
        ? data.message.trim()
        : 'The email service did not accept the enquiry.';
      if (/activat|confirm/i.test(message)) {
        throw new Error('The recipient email must be activated. Open the activation message sent to www.vukosi394@gmail.com, confirm it, and send your enquiry again.');
      }
      throw new Error(message);
    }

    return data;
  }

  function bindContactForm() {
    const form = byId('contactForm');
    if (!form) return;
    form.action = FORM_ENDPOINT; // Native POST fallback when JavaScript is disabled.
    form.method = 'POST';
    const status = byId('formStatus');

    // Capture phase: prevents an older site script from silently sending to a previous address.
    document.addEventListener('submit', async (event) => {
      if (event.target !== form) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      if (!form.reportValidity()) return;
      const button = form.querySelector('[type="submit"]');
      if (button?.disabled) return;
      if (button) button.disabled = true;
      setStatus(status, 'Sending your enquiry…');
      try {
        const values = Object.fromEntries(new FormData(form).entries());
        // Explicitly preserve the sender email to enable Reply-To in FormSubmit.
        values._url = SITE_URL;
        values._subject = 'New Masana WebWorks website enquiry';
        values._captcha = 'false';
        values.source = 'Website contact form';
        await submitEnquiry(values);
        form.reset();
        setStatus(status, 'Your enquiry was accepted by the email service. Thank you!');
      } catch (error) {
        setStatus(status, `Enquiry not sent: ${error.message}`, true);
      } finally {
        if (button) button.disabled = false;
      }
    }, true);
  }

  function bindChatHandoff() {
    const panel = byId('chatPanel');
    const human = byId('chatHuman');
    if (!panel || !human) return;

    const style = document.createElement('style');
    style.textContent = `
      #masanaEmailHandoff[hidden] { display: none !important; }
      #chatPanel .chat-messages[hidden], #chatPanel .quick-replies[hidden], #chatPanel .chat-input-row[hidden] { display: none !important; }
      #masanaEmailHandoff { padding: 12px 16px; max-height: 55vh; overflow-y: auto; background: #ffffff; color: #1d2934; }
      #masanaEmailHandoff form { display: grid; gap: 9px; }
      #masanaEmailHandoff label { display: grid; gap: 4px; font-size: 12px; font-weight: 600; }
      #masanaEmailHandoff input:not([type="checkbox"]), #masanaEmailHandoff textarea { min-width: 0; width: 100%; padding: 9px; border: 1px solid #aeb8c2; border-radius: 8px; font: inherit; box-sizing: border-box; background: white; color: #172431; }
      #masanaEmailHandoff textarea { resize: vertical; }
      #masanaEmailHandoff .handoff-consent { display: flex; gap: 8px; font-weight: 400; align-items: flex-start; line-height: 1.4; }
      #masanaEmailHandoff .handoff-consent input { flex-shrink: 0; margin-top: 3px; }
      #masanaEmailHandoff .handoff-buttons { display: flex; gap: 8px; flex-wrap: wrap; }
      #masanaEmailHandoff button { border-radius: 8px; padding: 9px 12px; cursor: pointer; }
      #masanaEmailHandoff button[type="submit"] { background: #116c82; color: white; border: none; }
      #masanaEmailHandoff button[type="button"] { background: white; color: #172431; border: 1px solid #b8c2cd; }
      #masanaEmailHandoff button[disabled] { opacity: 0.6; cursor: progress; }
      #masanaEmailHandoff [role="status"] { font-size: 12px; line-height: 1.45; overflow-wrap: anywhere; }
    `;
    document.head.appendChild(style);

    const handoff = document.createElement('section');
    handoff.id = 'masanaEmailHandoff';
    handoff.hidden = true;
    handoff.setAttribute('aria-label', 'Contact a person by email');
    // Static markup only; submitted values are read as field values, never injected as HTML.
    handoff.innerHTML = `
      <form id="masanaChatHandoffForm" action="${FORM_ENDPOINT}" method="POST">
        <strong>Request a personal reply</strong>
        <label>Your name <input name="name" autocomplete="name" maxlength="120" required></label>
        <label>Your email <input name="email" type="email" autocomplete="email" maxlength="254" required></label>
        <label>Your message <textarea name="message" rows="3" maxlength="4000" required placeholder="How can we help?"></textarea></label>
        <label class="handoff-consent"><input name="privacy_consent" type="checkbox" required> <span>I consent to sending my message and recent chat transcript for a reply, in accordance with the <a href="privacy.html" target="_blank" rel="noopener noreferrer">Privacy &amp; Consent Notice</a>.</span></label>
        <div class="handoff-buttons"><button type="submit">Email my enquiry</button><button type="button" id="masanaHandoffCancel">Back to chat</button></div>
        <p id="masanaHandoffStatus" role="status" aria-live="polite">Nothing is emailed until you select “Email my enquiry”.</p>
      </form>
    `;

    const footer = panel.querySelector('.chat-footer');
    if (footer) panel.insertBefore(handoff, footer);
    else panel.appendChild(handoff);

    const chatMessages = byId('chatMessages');
    const quickReplies = byId('quickReplies');
    const chatForm = byId('chatForm');
    const hideWhileHandoff = [chatMessages, quickReplies, chatForm].filter(Boolean);
    const handoffForm = byId('masanaChatHandoffForm');
    const status = byId('masanaHandoffStatus');
    let previousVisibility = [];
    let consentedTranscript = '';

    function showHandoff() {
      if (!handoff.hidden) return;
      // Capture now, while the chat is visible. It is sent only after explicit consent.
      consentedTranscript = (chatMessages?.innerText || chatMessages?.textContent || '').slice(-6000);
      previousVisibility = hideWhileHandoff.map((node) => node.hidden);
      hideWhileHandoff.forEach((node) => { node.hidden = true; });
      handoff.hidden = false;
      handoffForm.querySelector('input[name="name"]')?.focus();
    }
    function hideHandoff() {
      handoff.hidden = true;
      hideWhileHandoff.forEach((node, index) => { node.hidden = previousVisibility[index] ?? false; });
    }

    // Capture first, before the existing chatbot's own "contact a person" click logic.
    document.addEventListener('click', (event) => {
      if (event.target instanceof Element && event.target.closest('#chatHuman')) {
        event.preventDefault();
        event.stopImmediatePropagation();
        if (handoff.hidden) showHandoff();
        else hideHandoff();
      }
    }, true);

    byId('masanaHandoffCancel').addEventListener('click', hideHandoff);

    document.addEventListener('submit', async (event) => {
      if (event.target !== handoffForm) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      if (!handoffForm.reportValidity()) return;
      const button = handoffForm.querySelector('[type="submit"]');
      if (button.disabled) return;
      button.disabled = true;
      setStatus(status, 'Sending your contact request…');
      try {
        const values = Object.fromEntries(new FormData(handoffForm).entries());
        values._subject = 'New Masana Assistant chat contact request';
        values._template = 'table';
        values._captcha = 'false';
        values._honey = '';
        values._url = SITE_URL;
        values.source = 'Masana Assistant - opted-in contact handoff';
        // The transcript is sent ONLY after the visitor ticks the consent box.
        values.chat_transcript = consentedTranscript;
        await submitEnquiry(values);
        handoffForm.reset();
        setStatus(status, 'Your contact request was accepted by the email service. Thank you!');
      } catch (error) {
        setStatus(status, `Message not sent: ${error.message}`, true);
      } finally {
        button.disabled = false;
      }
    }, true);
  }

  // A deferred script runs after parsing HTML, with handlers installed before the existing site scripts.
  bindContactForm();
  bindChatHandoff();
})();
