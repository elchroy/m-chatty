const baseURL = 'http://localhost:9000/api/v1';

new Vue({
  el: '#app',
  data: {
  	authUser: {
  		username: "",
      id: "",
      token: ""
  	},
    signedIn: false,

    users: [],
    chats: [],
    messages: [],

    openChat: false,
    activeChat: {},
    activeChatUser: {},
    activeChatHistory:[],
    messageBody: "Hello from my other side",

    username: "daddyboy",
    password: "elchroy",

    "signUpUsername": "",
    "signUpPassword": "elchroy",

    socket: {}
  },
  created () {
  	const authorization = JSON.parse(localStorage.getItem('authCreds'))
  	if (authorization.auth) {
  		const { token, id, username } = authorization;
  		this.signedIn = true;
  		this.authUser = { id, username, token };
	  	
	  	axios.get(`${baseURL}/users`, {
	  		headers: { Authorization: token }
	  	}).then(results => {
	  		this.users = results.data
	  	}).catch(() => {
        // error is users' call fails
      })

      axios.get(`${baseURL}/chats`, {
        headers: { Authorization: token }
      }).then(results => {
        this.chats = results.data
      }).catch()
  	} else {

  	}
  },
  mounted () {
    this.socket.on("MESSAGE_POSTED", (messageData) => {
      this.messages.push(messageData);
    })
  },
  computed: {
  },
  methods: {
  	enableChat (user) {
  		// this.openChat = true
  		// this.activeChatUser = user
    //   // fetch previous messages.
    //   axios.get(`${baseURL}/messages/${user.id}`, {
    //     headers: { Authorization: this.authUser.token }
    //   }).then(result => console.log(result))
    //   .catch();
  	},

  	signOut () {
  		localStorage.setItem('authCreds', null);
  		this.signedIn = false
  		this.authUser = {}
  		this.openChat = false
  	},

    loadChat (chat) {
      axios.get(`${baseURL}/chats/${chat.id}/messages`, {
        headers: { Authorization: this.authUser.token }
      }).then(results => {
        this.messages = results.data;
        console.log(this.messages)
        this.activeChat = chat;
        this.openChat = true;
        this.socket = io.connect();
      }).catch();
    },

    signUp () {
      const { signUpUsername, signUpPassword } = this

      axios.post(`${baseURL}/auth/signup`, {
        username: signUpUsername,
        password: signUpPassword,
      }).then(result => {
        const { id, username, token } = {auth: true, ...result.data};
        localStorage.setItem('authCreds', JSON.stringify({auth: true, id, username, token }));
        this.signedIn = true;
        this.authUser = { id, username, token }
      });
    },

  	signIn () {
  		const { username, password } = this
  		axios.post(`${baseURL}/auth/signin`, {
  			username,
  			password
  		}).then(result => {
        const { id, username, token } = {auth: true, ...result.data};
  			localStorage.setItem('authCreds', JSON.stringify({auth: true, id, username, token }));
  			this.signedIn = true;
        this.authUser = { id, username, token }
  		})
  	},

  	sendMessage (e) {
  		e.preventDefault();
      axios.post(`${baseURL}/chats/${this.activeChat.id}/messages`, {
        body: this.messageBody
      }, {
        headers: { Authorization: this.authUser.token }
      }).then(result => this.messages.push(result.data))
  	}
  }
})


	// send message to the server, resets & prevents default form action.
	// $('#chatForm').submit((e) => {
	// 	e.preventDefault();
	// 	this.socket.emit("messages", $("#message").val());
	// 	$("#message").val('')
	// });

	// listener for 'thread' event, which updates messages
	// socket.on("thread", data => {
	// 	$("#thread").append("<li>" + data + "</li>");
	// });