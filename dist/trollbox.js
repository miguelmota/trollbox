(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
class Trollbox {
  constructor(config) {
    this.config = config || {};
    this.scriptId = 'FirebaseScript';
    if (document.querySelector(`#${this.scriptId}`)) {
      this.onLoad();
    } else {
      const script = document.createElement('script');
      script.id = this.scriptId;
      script.src = 'https://www.gstatic.com/firebasejs/4.3.1/firebase.js';
      document.body.appendChild(script);
      script.onload = () => {
        this.onLoad();
      };
    }

    this.onMessage = this.onMessage.bind(this);
    this.post = this.post.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onLoad() {
    this.config.user = this.config.user || 'anonymous';
    this.initFirebase();

    if (!this.config.delayRender) {
      this.render();
    }
  }

  initFirebase() {
    if (!window.firebase) {
      return false;
    }

    if (!this.db) {
      var app = window.firebase.initializeApp(this.config.firebase);
      this.db = app.database();
    }

    this.initRef();
  }

  initRef() {
    const channel = (this.config.channel || '').replace(/[^a-zA-Z\d]/gi, '_');

    if (!this.db) {
      return false;
    }

    this.ref = this.db.ref(`trollbox/${channel}`);

    this.ref.off('child_added', this.onMessage);
    this.ref.limitToFirst(100).on('child_added', this.onMessage);
  }

  setChannel(channel) {
    if (channel === this.config.channel) {
      return false;
    }

    this.config.channel = channel;
    this.onLoad();
  }

  setUser(user) {
    if (user === this.config.user) {
      return false;
    }

    this.config.user = user;
    this.onLoad();
  }

  post(message) {
    if (!this.ref) {
      return false;
    }

    this.ref.push().set({
      user: this.config.user,
      message: message,
      date: Date.now() / 1e3 | 0
    });
  }

  onMessage(snapshot) {
    const value = snapshot.val();

    if (typeof value !== 'object') {
      return false;
    }

    this.addLog(value.user, value.message);
  }

  render() {
    this.renderBox();
    this.bindForm();
  }

  renderBox() {
    const selector = this.config.container;
    this.container = document.querySelector(selector);

    if (!this.container) {
      return false;
    }

    // ugly, quick, and dirty
    const html = `
      <div class="TrollboxContainer">
        <div class="TrollboxHeader">
          Trollbox
        </div>
        <div class="TrollboxMessages">
          <ul class="TrollboxMessagesList">
          </ul>
        </div>
        <div class="TrollboxMessage">
          <form class="TrollboxForm">
            <input class="TrollboxInput" type="text" name="message" placeholder="Message (press enter to submit)" autocomplete="off" />
          </form>
        </div>
      </div>
    `;

    const doc = document.createDocumentFragment();
    const div = document.createElement('div');
    div.innerHTML = html;
    while (div.firstChild) doc.appendChild(div.firstChild);
    this.container.appendChild(doc);
  }

  bindForm(post) {
    if (!this.container) {
      return false;
    }

    const form = this.container.querySelector('.TrollboxForm');
    this.form = form;

    this.form.removeEventListener('submit', this.onSubmit);
    this.form.addEventListener('submit', this.onSubmit);
  }

  onSubmit(event) {
    event.preventDefault();
    const input = event.target.message;
    const message = input.value;
    this.post(message);
    input.value = '';
  }

  addLog(user, message) {
    if (!(user && message)) {
      return false;
    }

    if (!this.container) {
      return false;
    }

    const box = this.container.querySelector('.TrollboxMessages');
    const list = this.container.querySelector('.TrollboxMessagesList');

    if (!(box && list)) {
      return false;
    }

    const html = `<strong>${this.escapeHtml(user)}:</strong> ${this.escapeHtml(message)}`;

    const doc = document.createDocumentFragment();
    const listItem = document.createElement('li');
    listItem.innerHTML = html;
    doc.appendChild(listItem);
    list.appendChild(doc);

    box.scrollTop = box.scrollHeight;
  }

  destroy() {
    if (this.ref) {
      this.ref.off('child_added', this.onMessage);
    }

    if (this.form) {
      this.form.removeEventListener('submit', this.onSubmit);
    }

    if (this.container) {
      this.container.innerHTML = '';
    }

    const script = document.querySelector(`#${this.scriptId}`);

    if (script) {
      script.remove();
    }
  }

  escapeHtml(unsafe) {
    return unsafe.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }
}

module.exports = Trollbox;

if (typeof window === 'object') {
  window.Trollbox = Trollbox;
}

},{}]},{},[1]);
