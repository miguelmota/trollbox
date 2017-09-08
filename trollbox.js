(function (root) {
  'use strict'

  /**
   * WARNING: ugly code ahead.
   * this is a quick and dirty MVP.
   */

  var config = null
  var ref = null
  var db = null

  function Trollbox (config) {
    const scriptId = 'FirebaseScript'
    if (document.querySelector(`#${scriptId}`)) {
      onLoad(config)
    } else {
      const script = document.createElement('script')
      script.id = scriptId
      script.src = 'https://www.gstatic.com/firebasejs/4.3.1/firebase.js'
      document.body.appendChild(script)
      script.onload = function () {
        onLoad(config)
      }
    }

    /*
    const style = document.createElement('link')
    style.id = 'TrollboxStyle'
    style.rel = 'stylesheet'
    style.href = 'trollbox.css'
    document.body.appendChild(style)
    */
  }

  function onLoad (_config) {
    _config.user = _config.user || 'anon'
    ref = initFirebase(_config)
    config = _config

    renderBox(config.container)
    bindForm(post)

    ref.off('child_added', onMessage)
    ref.limitToFirst(100)
    .on('child_added', onMessage)
  }

  function post (message) {
    ref.push().set({
      user: config.user,
      message: message,
      date: (Date.now() / 1e3) | 0
    })
  }

  function onMessage (snapshot) {
    const value = snapshot.val()

    if (typeof value !== 'object') {
      return false
    }

    addLog(value.user, value.message)
  }

  function initFirebase (config) {
    const channel = (config.channel || '').replace(/[^a-zA-Z\d]/gi, '_')

    if (!db) {
      var app = window.firebase.initializeApp(config.firebase)
      db = app.database()
    }

    var ref = db.ref(`trollbox/${channel}`)

    return ref
  }

  function renderBox (selector) {
    const container = document.querySelector(selector)

    // quick and dirty
    container.innerHTML = `
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
    `
  }

  function bindForm (post) {
    const form = document.querySelector('.TrollboxForm')

    form.removeEventListener('submit', onSubmit)
    form.addEventListener('submit', onSubmit)
  }

  function onSubmit (event) {
    event.preventDefault()
    const input = event.target.message
    const message = input.value
    post(message)
    input.value = ''
  }

  function addLog (user, message) {
    if (!(user && message)) {
      return false
    }

    const container = document.querySelector('.TrollboxMessages')
    const list = container.querySelector('.TrollboxMessagesList')

    list.innerHTML += `<li><strong>${escapeHtml(user)}:</strong> ${escapeHtml(message)}</li>`

    container.scrollTop = container.scrollHeight
  }

  function escapeHtml (unsafe) {
    return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/'/g, '&quot;')
    .replace(/'/g, '&#039;')
  }

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = Trollbox
    }
    exports.Trollbox = Trollbox
  } else if (typeof define === 'function' && define.amd) {
    define([], function () {
      return Trollbox
    })
  } else {
    root.Trollbox = Trollbox
  }

})(this);
