const baseURL = 'http://localhost:9000/api/v1';

let socket;

// -> https://medium.com/@heatherbooker/how-to-auto-scroll-to-the-bottom-of-a-div-415e967e7a24
const scroller = (someElement) => {
  return () => {
    someElement.scrollTop = someElement.scrollHeight;
  }
}

const makeScroller = () => {
  const messageContainer = document.querySelector('#messages-container');
  const scrollToBottom = scroller(messageContainer)
  var observer = new MutationObserver(scrollToBottom);
  console.log(observer)
  observer.observe(messageContainer, {
    childList: true
  })
}

Vue.component("Message", {
  data () {
    return {
      body: "",
      from: ""
    }
  }
});

new Vue({
  el: '#app',

  components: {
  },

  data: {
    auth: {
      signedIn: false,
      signup: {
        username: "",
        password: ""
      },
      signin: {
        username: "",
        password: ""
      },
      user: {
        username: "",
        token: ""
      }
    },

    errorMessage: "",
    errorEvent: new Event('errorMessage'),

    activeChat: null,

    chats: [],
    messages: [],
    messageToSend: ""

  },

  mounted () {
    this.loadActiveChat(); // this runs after created
    if (this.activeChat) this.loadChatMessages(this.activeChat);
  },

  created () {
    const authorization = JSON.parse(localStorage.getItem('authCreds'))

    if (authorization && authorization.signedIn) {
      const { token, username, signedIn } = authorization;
      this.auth.user = { username, token }
      this.auth.signedIn = signedIn
      this.connectSocket();

      this.loadChats();
    }
  },

  directives: {
    "use-enter-key": {
      bind (el, binding, vnode) {
        el.addEventListener("keydown", function (ev) {
          if (ev.keyCode === 13) {
            vnode.context.postMessage();
          }
        });
      }
    },
  },

  methods: {
    connectSocket () {
      console.log('connecting...');
      if (!socket || !socket.connnected) socket = io.connect();
      socket.on("newMessage", (newMessage) => {
        if (newMessage.to === this.activeChat.id) {
          this.messages.push(newMessage);
          this.scrollTo();
        }
      });
    },

    scrollTo () {
      const endOfList = document.getElementById("endOfList");
      endOfList.scrollIntoView();
    },

    clearAuthFields () {
      this.auth.signin.username = ""
      this.auth.signin.password = ""
      this.auth.signup.username = ""
      this.auth.signup.password = ""
    },

    signUp (e) {
      e.preventDefault();
      const { auth:{ signup: { username, password } } } = this

      axios
      .post(`${baseURL}/auth/signup`, { username, password })
      .then(result => {
        const { signedIn, id, username, token } = { signedIn: true, ...result.data.data };
        this.auth.signedIn = signedIn
        this.auth.user = { username, token }
        this.connectSocket()
        localStorage.setItem('authCreds', JSON.stringify({ signedIn, id, username, token }));
        this.loadChats();
        this.clearAuthFields()
      }).catch(err => {
        this.errorMessage = err.response.data.message
        setTimeout(() => this.errorMessage = "", 2000);
      });
    },

    signIn (e) {
      e.preventDefault();
      const { auth:{ signin: { username, password } } } = this
      axios
      .post(`${baseURL}/auth/signin`, { username, password })
      .then(result => {
        const { signedIn, id, username, token } = { signedIn: true, ...result.data.data };
        this.auth.signedIn = signedIn
        this.auth.user = { username, token }
        this.connectSocket();
        localStorage.setItem('authCreds', JSON.stringify({ signedIn, id, username, token }));
        this.loadChats();
        this.clearAuthFields()
      }).catch(err => {
        this.errorMessage = "Username or password incorrect"
        setTimeout(() => this.errorMessage = "", 2000);
      });
    },

    loadActiveChat () {
      this.activeChat = JSON.parse(localStorage.getItem("activeChat")) || null;
    },

    saveActiveChat (chat) {
      this.activeChat = chat;
      localStorage.setItem("activeChat", JSON.stringify(chat))
    },

    signOut () {
      localStorage.setItem('authCreds', null);
      localStorage.setItem('activeChat', null);
      this.auth.signedIn = false;
      this.auth.user = { username: "", password: "" }
      socket.disconnect()
    },

    loadChats () {
      axios.get(`${baseURL}/chats`, {
        headers: { Authorization: this.auth.user.token }
      }).then(results => {
        this.chats = results.data.data
        if (!this.activeChat) this.loadChatMessages(this.chats[0]);
      }).catch(() => {
        // could not load chats
      })
    },

    loadChatMessages (chat) {
      this.saveActiveChat(chat);
      axios.get(`${baseURL}/chats/${chat.id}/messages`, {
        headers: { Authorization: this.auth.user.token }
      }).then(results => {
        this.messages = results.data.data;
      }).catch();
    },

    postMessage () {
      this.messageToSend = this.messageToSend.trim()
      if (!this.messageToSend) return null;
      axios.post(`${baseURL}/chats/${this.activeChat.id}/messages`, {
        body: this.messageToSend
      }, {
        headers: { Authorization: this.auth.user.token }
      }).then(result => {
        this.messageToSend = "";
      })
    },

    sendMessage (e) {
      e.preventDefault();
      this.postMessage();
    }
  }
});