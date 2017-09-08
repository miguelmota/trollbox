# trollbox

> Instant [trollbox](http://www.urbandictionary.com/define.php?term=trollbox) using [Firebase](https://firebase.google.com/).

# Demo

[https://lab.miguelmota.com/trollbox](https://lab.miguelmota.com/trollbox)

# Install

```javascript
npm install trollbox
```

# Instructions

1. Create a new [Firebase](https://firebase.google.com/) project.

2. Set read/write rules to be global in Firebase.

Firebase dashboard console -> Database -> Rules

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

3. Set up HTML container:

```html
<div id="trollbox"></div>
```

4. Copy Firebase project config from dashboard and initialize trollbox:

```javascript
const config = {
  // DOM selector for trollbox
  container: '#trollbox',

  // Firebase project config found in dashboard
  firebase: {
    apiKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    authDomain: 'xxxxxxxx-xxxxx.firebaseapp.com',
    databaseURL: 'https://xxxxxxxx-xxxxx.firebaseio.com',
    projectId: 'xxxxxxxx-xxxxx',
    storageBucket: 'xxxxxxxx-xxxxx.appspot.com',
    messagingSenderId: 'xxxxxxxxxxxx'
  },

  // trollbox channel name (chat room)
  channel: 'global',

  // trollbox username
  user: 'anon'
}

const trollbox = new window.Trollbox(config)
```

5. Copy base [trollbox.css](./trollbox.css) stylesheet into your web app.

6. That's it!

Later on if you need to, you can change the channel name and user:

```javascript
trollbox.setChannel('random')
trollbox.setUser('Bob')
```

# License

MIT
