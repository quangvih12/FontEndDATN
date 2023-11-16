<script setup>
import { ref, onMounted } from 'vue';
import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';

const socket = new SockJS('http://localhost:8080/ws');
const stompClient = Stomp.over(() => new WebSocket(socket.url));
const messages = ref([]);

onMounted(() => {
  stompClient.connect({},
    () => {
      console.log('Kết nối thành công!');
    },
    (error) => {
      console.error('Lỗi kết nối:', error);
    }
  );
});
</script>
