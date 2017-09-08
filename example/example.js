const config = {
  container: '#trollbox',
  firebase: {
    apiKey: 'AIzaSyAW50YNzjI4LAQo4kEWb0UwhegCTG9hSf8',
    authDomain: 'trollbox-d802b.firebaseapp.com',
    databaseURL: 'https://trollbox-d802b.firebaseio.com',
    projectId: 'trollbox-d802b',
    storageBucket: 'trollbox-d802b.appspot.com',
    messagingSenderId: '770197609793'
  },
  channel: null,
  user: null
}

const trollbox = new window.Trollbox(config)
