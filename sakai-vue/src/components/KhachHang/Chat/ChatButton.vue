<script setup>
import ChatComponent from "../../Admin/Chat/ChatComponent.vue";
import {ref} from "vue";

const isChatPanelDisplayed = ref(false);
</script>

<template>
  <div class="chat-panel w-26rem">
    <div class="message-box" v-show="isChatPanelDisplayed">
            <ChatComponent height="100%" :single-room="true"/>
    </div>
    <Button label="CSKH" rounded severity="help" class="chat-button w-5rem h-5rem" iconPos="top"
      @click="isChatPanelDisplayed = !isChatPanelDisplayed">
      <template #icon>
        <i class="text-4xl" :class="isChatPanelDisplayed ? 'pi pi-times' : 'pi pi-comments'" />
      </template>
    </Button>
  </div>
</template>

<style scoped>
.chat-panel {
  position: fixed;
  right: 3%;
  bottom: 6%;
  height: 50%;
}

.message-box {
  position: absolute;
  height: 90%;
  width: 90%;
  z-index: 0;
}

.chat-button {
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 1;
}
</style>