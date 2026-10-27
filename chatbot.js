(() => {
  const launcher = document.getElementById('chatLauncher');
  const panel = document.getElementById('chatPanel');
  const closeBtn = document.getElementById('chatClose');
  const messages = document.getElementById('chatMessages');
  const quickReplies = document.getElementById('quickReplies');
  const form = document.getElementById('chatForm');
  const input = document.getElementById('chatInput');
  const humanBtn = document.getElementById('chatHuman');
  const inlineOpeners = [...document.querySelectorAll('.bot-open-inline')];

  if (!launcher || !panel || !messages || !quickReplies || !form || !input) return;

  const quick = ['Services', 'Packages', 'Website redesign', 'E-commerce', 'Contact options'];
  let welcomed = false;

  const addMessage = (text, role = 'bot', allowHtml = false) => {
    const el = document.createElement('div');
    el.className = `chat-message ${role}`;
    if (allowHtml) el.innerHTML = text;
    else el.textContent = text;
    messages.appendChild(el);
    messages.scrollTop = messages.scrollHeight;
    return el;
  };

  const typing = () => {
    const el = document.createElement('div');
    el.className = 'chat-message bot typing';
    el.innerHTML = '<span></span><span></span><span></span>';
    messages.appendChild(el);
    messages.scrollTop = messages.scrollHeight;
    return el;
  };

  const contactLinks = () => `You can <a href="#contact" data-chat-contact>send a project enquiry</a>, email <a href="mailto:www.vukosi394@gmail.com">www.vukosi394@gmail.com</a>, or message <a href="https://wa.me/27614884488?text=${encodeURIComponent('Hi Masana WebWorks, I would like to discuss a website project.')}" target="_blank" rel="noopener">WhatsApp</a>.`;

  const getResponse = (value) => {
    const text = value.toLowerCase().trim();

    if (/^(hi|hello|hey|morning|afternoon|evening)\b/.test(text)) {
      return 'Hello. I can help with services, packages, project types, timelines and contact options.';
    }
    if (/(service|what do you do|offer|help)/.test(text)) {
      return 'Masana WebWorks offers website design, redesigns, front-end development, back-end web functionality, API integrations, e-commerce support, SEO-aware builds, hosting and maintenance.';
    }
    if (/(package|price|pricing|cost|budget|quote)/.test(text)) {
      return 'Current starting packages are Starter from R2,500, Standard from R5,000, Advanced from R7,500 and Premium from R10,000. Final pricing depends on the confirmed project scope.';
    }
    if (/(redesign|existing website|revamp|improve my site)/.test(text)) {
      return 'Yes. Website redesigns are available for businesses or individuals who need a stronger visual presentation, better structure, improved responsiveness or a more professional feel.';
    }
    if (/(e-?commerce|shop|store|payment|sell online)/.test(text)) {
      return 'E-commerce support is available for businesses that need product displays, online selling, checkout flows or payment integration. These are usually scoped under advanced or premium work.';
    }
    if (/(web app|application|dashboard|custom|system|portal|database)/.test(text)) {
      return 'Custom web functionality is available for dashboards, workflows, forms, portals and data-driven features. These projects are quoted based on the specific requirements.';
    }
    if (/(seo|google|search|performance|speed|mobile)/.test(text)) {
      return 'SEO-aware page structure, mobile responsiveness and performance-conscious development are part of the general build approach.';
    }
    if (/(timeline|time|how long|delivery)/.test(text)) {
      return 'Project timing depends on scope. Smaller business websites can move faster, while custom functionality, more pages and revision rounds naturally add time.';
    }
    if (/(contact|email|whatsapp|call|person|human)/.test(text)) {
      return contactLinks();
    }
    if (/(portfolio|work|projects|clients)/.test(text)) {
      return 'Selected work currently featured includes R.K. Mabunda Attorneys Inc. and JoyChn Media. You can scroll to the Selected Work section to view them.';
    }

    return 'I can help with services, packages, redesigns, e-commerce, project types and contact options. If you already know what you need, please use the contact section and send an enquiry.';
  };

  const wireContactLink = (root) => {
    root?.querySelectorAll('[data-chat-contact]').forEach(link => {
      link.addEventListener('click', () => {
        closeChat();
        setTimeout(() => document.getElementById('name')?.focus(), 500);
      });
    });
  };

  const renderQuickReplies = () => {
    quickReplies.innerHTML = '';
    quick.forEach(label => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = label;
      button.addEventListener('click', () => handleUserMessage(label));
      quickReplies.appendChild(button);
    });
  };

  const openChat = () => {
    panel.hidden = false;
    launcher.setAttribute('aria-expanded', 'true');
    setTimeout(() => input.focus(), 50);
    if (!welcomed) {
      welcomed = true;
      addMessage('Welcome to Masana Assistant. Ask about services, website packages, redesigns, e-commerce, support or how to get started.');
      renderQuickReplies();
    }
  };

  const closeChat = () => {
    panel.hidden = true;
    launcher.setAttribute('aria-expanded', 'false');
    launcher.focus();
  };

  const handleUserMessage = (value) => {
    const clean = value.trim().slice(0, 220);
    if (!clean) return;
    addMessage(clean, 'user');
    input.value = '';
    const typingIndicator = typing();
    setTimeout(() => {
      typingIndicator.remove();
      const response = getResponse(clean);
      const botMessage = addMessage(response, 'bot', response.includes('<a '));
      wireContactLink(botMessage);
    }, 350 + Math.min(clean.length * 4, 500));
  };

  launcher.addEventListener('click', () => panel.hidden ? openChat() : closeChat());
  closeBtn?.addEventListener('click', closeChat);
  inlineOpeners.forEach(button => button.addEventListener('click', openChat));
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    handleUserMessage(input.value);
  });
  humanBtn?.addEventListener('click', () => {
    const message = addMessage(contactLinks(), 'bot', true);
    wireContactLink(message);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !panel.hidden) closeChat();
  });
})();
