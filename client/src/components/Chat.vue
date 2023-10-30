<template >
  <v-card v-on:appendMessege="appendNewMessege" class="white elevation-2 chat-box">
    <v-toolbar fixed color="blue absolute title" dark dense>
      <v-toolbar-title>{{ chattingWith.username }}</v-toolbar-title>
    </v-toolbar>
    <div class="messeges mt-2">
      <div v-if="messeges.length != 0" style="overflow:hidden">
        <div
          v-for="text in messeges"
          :key="text.id"
          color="grey lighten-2"
          flat
          tile
          class="messege mx-2"
        >
          <div class="msg-container">
            <div id="chat-messege-list">
              <div
                class="msg-row"
                :class="text.sender.id == $store.state.user.id? 'yours':'others'"
              >
                <div class="msg-body">{{text.messege}}</div>
                <div class="msg-time">
                  <span
                    v-text="text.sender.username == $store.state.user.username? 'you':text.sender.username"
                  ></span> 10:30 PM
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- <v-container>
        <v-row width="200px" v-if="messeges.length == 0" justify="center" align="center">
          <v-flex>
            <v-alert dense type="info" class="msg pa-2 mx-5">No chats found yet</v-alert>
          </v-flex>
        </v-row>
      </v-container>-->
      <!-- <div v-if="messeges.length == 0"></div> -->
      <div v-if="messeges.length == 0" class="no-chat-found">No chats found yet</div>
    </div>

    <v-card-actions width="100%" class="elevation-0">
      <!-- <v-spacer></v-spacer> -->
      <!-- <v-text-field></v-text-field>  -->
      <!-- <v-btn>Post</v-btn> -->
      <div class="input-container">
        <input @keypress="typing" class type="text" placeholder="type a messege" v-model="messege" />
        <!-- <v-btn class="blue">Send</v-btn> -->
        <button id="send-btn" @click="sendMessege" :disabled="messege == ''">Send Me</button>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script>
// import moment from "moment";
export default {
  props: ["chattingWith", "socket", "messeges"],
  data() {
    return {
      messege: "",
      serverEndPoint: "http://localhost:5000",
    };
  },
  created() {
    this.connectSocket();
  },
  watch: {
    messeges() {
      const chatBox = document.querySelector(".messeges");
      setTimeout(() => {
        chatBox.scrollTop = chatBox.scrollHeight;
      }, 1);
    },
  },
  mounted() {},
  methods: {
    connectSocket() {
      console.log(this.socket);
    },
    appendNewMessege(data) {
      console.log("New Messege: ", data);
      this.messeges.push(data);
    },
    sendMessege() {
      const thisUser = this.$store.state.user;
      console.log(this.messege);
      const payload = {
        sender: thisUser,
        messege: this.messege,
        receiver: this.chattingWith,
      };
      this.messege = "";

      this.socket.emit("chatMessege", payload);

      this.messeges.push(payload);
    },
    msgClass(id) {
      const thisUser = this.$store.state.user;
      if (id == thisUser.id) return `d-flex justify-start `;
      else return `d-flex justify-end `;
    },
    msgTime(time) {
      //   return moment(time).fromNow();
      console.log(time);
      return "10:27 PM";
    },
    typing(ev) {
      if (ev.key == "Enter") {
        if (this.messege != "") this.sendMessege();
      }
    },
  },
};
</script>

<style scoped>
.messeges {
  max-height: 400px !important;
  min-height: 400px !important;
  overflow-y: scroll;
  /* z-index: 1; */
}

.no-chat-found {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateY(-50%) translateX(-50%);
}

.input-container {
  width: 100%;
  position: relative;
  left: -10px;
  right: -10px;
  bottom: -8px;
}

.input-container input[type="text"] {
  padding: 6px;
  margin-top: 8px;
  font-size: 17px;
  border: none;
  background: #cacaca;
  width: calc(100% - 82px);
  margin-right: -35px;
}

.input-container input[type="text"]:focus {
  border: none;
}

/* Style the button inside the input container */
.input-container button {
  float: right;
  padding: 6px;
  margin-top: 8px;
  margin-right: 16px;
  background: #ddd;
  font-size: 17px;
  border: none;
  cursor: pointer;
  width: 100px;
  position: relative;
  right: -35px;
  background-color: #4caf50 !important;
}

.input-container button:hover {
  background: #ccc;
}

.box {
  width: 300px;
  margin: 50px auto;
  padding: 10px;
  padding-bottom: 20px;
  text-align: center;
  font-weight: 600;
  color: #fff;
  font-family: arial;
  position: relative;
  border-radius: 20px;
  margin: 0px;
  margin-bottom: 5px;
}

.right {
  right: -100px;
  text-align: left;
  background: #5ea3c3;
}

.left {
  left: 14px;
  text-align: left;
  background: #00bfb6;
}

.right:before {
  content: "";
  width: 0px;
  height: 0px;
  position: absolute;
  border-left: 20px solid #5ea3c3;
  border-right: 20px solid transparent;
  border-top: 20px solid #5ea3c3;
  border-bottom: 20px solid transparent;
  right: -20px;
  top: 0px;
}

.left:before {
  content: "";
  width: 0px;
  height: 0px;
  position: absolute;
  border-right: 20px solid #00bfb6;
  border-left: 20px solid transparent;
  border-top: 20px solid #00bfb6;
  border-bottom: 20px solid transparent;
  left: -20px;
  top: 0px;
}

.time {
  position: absolute;
  font-size: 11px;
  font-weight: lighter;
  bottom: 5px;
  opacity: 0.9;
}

.right .time {
  right: 20px;
}

.left .time {
  left: 20px;
}

.left .msg-body {
  margin-left: 10px;
}

.right .msg-body {
  margin-left: 10px;
}

.msg-container {
  padding: 2px;
}

#chat-messege-list {
  /* grid-area: chat-messege-list; */
  display: flex;
  flex-direction: column-reverse;
  overflow-y: scroll;
}

.msg-row {
  margin-bottom: 20px;
  margin-left: 10px;
  margin-right: 10px;
  display: grid;
  grid-template-columns: 70%;
}

.msg-row.yours {
  justify-content: start;
  justify-items: start;
}

.msg-row.others {
  justify-content: end;
  justify-items: end;
}

.msg-row.others .msg-body {
  background: #0018aa;
  color: #eee;
  border: 1px solid #0018aa;
  border-radius: 15px 15px 0 15px;
  font-weight: normal;
  font-size: 16px;
}

.msg-row.yours .msg-body {
  background: #eee;
  color: #000000;
  border: 1px solid #0018aa;
  border-radius: 15px 15px 15px 0;
  font-weight: normal;
  font-size: 16px;
}

.msg-row > .msg-body {
  padding: 10px 15px;
  font-size: 1.1rem;
}

.msg-row > .msg-time {
  font-size: 0.7rem;
  color: #777;
}

.msg-time span {
  color: black;
  font-size: 12px;
  margin-right: 5px;
}

::-webkit-scrollbar {
  display: none;
}

::-moz-scrollbar {
  display: none;
}
</style>
