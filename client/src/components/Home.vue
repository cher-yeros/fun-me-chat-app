<template>
  <v-container fluid>
    <v-row justify="center" v-if="$store.state.loggedIn">
      <v-flex xs12 sm4 md3 class="white elevation-2 mx-2 my-2">
        <v-toolbar color="blue" dark dense>
          <v-toolbar-title>Users to chat with</v-toolbar-title>
        </v-toolbar>

        <v-list>
          <template v-for="(user, index) in users">
            <v-list-item :key="user.id" @click="chatWith(user)">
              <v-badge
                offset-x="15"
                offset-y="15"
                bordered
                bottom
                :color="user.info.socketId?'success':'grey'"
                overlap
              >
                <v-avatar>
                  <v-img src="null_avatar.png"></v-img>
                </v-avatar>
              </v-badge>

              <v-list-item-content right>
                <v-list-item-title>{{ user.info.username }}</v-list-item-title>
                <v-list-item-subtitle>Hi dude how are you</v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action>
                <!-- <v-list-item-action-text v-text="notMesTxt(user.unseenCount)"></v-list-item-action-text> -->
                <v-avatar v-if="user.unseenCount" color="indigo" size="30">
                  <span class="white--text headline" v-text="user.unseenCount"></span>
                </v-avatar>
              </v-list-item-action>
            </v-list-item>
            <v-divider v-if="index + 1 < users.length" :key="index"></v-divider>
          </template>
        </v-list>
      </v-flex>
      <!-- Chat box -->
      <v-flex v-show="startChat" xs12 sm7 md6 class="white elevation-2 mx-2 my-2">
        <Chat :chattingWith="chattingWith" :messeges="messeges" :socket="socket" />
      </v-flex>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import io from "socket.io-client";
import Chat from "./Chat";
// import * as easings from "vuetify/es5/services/goto/easing-patterns";
export default {
  components: {
    Chat,
  },
  data() {
    return {
      serverEndPoint: "http://localhost:5000",
      user: null,
      messeges: [],
      socket: null,
      messege: "",
      users: null,
      startChat: false,
      chattingWith: {},
    };
  },
  computed: {},
  created() {
    this.checkLogin();
    this.setUsers();
    this.connectSocket();
  },
  methods: {
    notMesTxt(count) {
      if (count) return "new messege";
      else return "No new messege";
    },
    checkLogin() {
      const signed = this.$store.state.loggedIn;
      if (!signed) {
        this.$router.push("/login");
      } else {
        this.user = this.$store.state.user;
      }
    },
    connectSocket() {
      this.socket = io(this.serverEndPoint);

      this.socket.on("connect", () => {
        this.socket.emit("user_connected", this.user);
      });

      this.socket.on("messege", (data) => {
        console.log("messege is : ", data);
        this.messeges.push(data);
      });

      this.socket.on("disconnect", () => {
        console.log("disconnected");
        this.socket.emit("user_disconnected", this.user);
      });
    },
    chatWith(user) {
      this.chattingWith = user.info;
      this.startChat = true;
      const thisUser = this.$store.state.user;

      const payload = {
        sender: thisUser.id,
        receiver: user.info.id,
      };

      axios.post(this.serverEndPoint + "/chats", payload).then(({ data }) => {
        this.messeges = data.chats;
      });

      axios
        .post(this.serverEndPoint + "/chats/makeseen", {
          thisUser: thisUser.id,
          sender: user.info.id,
        })
        .then(({ data }) => {
          if (data.result[0]) {
            user.unseenCount = 0;
          }
        });
    },
    setUsers() {
      const thisUser = this.$store.state.user;
      axios
        .get(this.serverEndPoint + "/users/" + thisUser.id)
        .then(async ({ data }) => {
          const u = data.users.findIndex(({ info }) => {
            return info.id === thisUser.id;
          });

          data.users.splice(u, 1);
          this.users = await data.users;
        });
    },
  },
};
</script>

<style scoped>
/* .chat-box {
  max-height: 500px !important;
  overflow: scroll;
  z-index: 1;
}  .absolute {
  position: absolute;

  width: 100%;
}
.absolute.field {
  bottom: 0;
  z-index: 20;
}

.absolute.title {
  z-index: 10;
  top: 0;
} */
/* .messeges {
  background-color: cyan;
}
.messege {
  background-color: cyan;
}

.msg {
  position: relative;
  right: 0;
  background: blue;
  width: 300px;
} */
</style>
