import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;


const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;


const echo = new Echo({
    broadcaster: "reverb",
    key: "nmxxqr1yolmyi1ma03xt",
    wsHost: '192.168.0.90',
    //wsHost: "127.0.0.1",
    wsPort: 8080,
    wssPort: 8080,
    forceTLS: false,
    enabledTransports: ["ws", "wss"], // ✅ prevents sockjs fallback
    disableStats: true,
    /*authEndpoint: null,*/
    authEndpoint: '/broadcasting/auth',  // Make sure this exists

    auth: {
        headers: {
            'X-CSRF-TOKEN': csrfToken,
            'X-Requested-With': 'XMLHttpRequest'
        },
        // If using Laravel Sanctum for API auth
        withCredentials: true,
    }

});

// Test basic WebSocket connection
const ws = new WebSocket(`ws://192.168.0.90:8080/app/nmxxqr1yolmyi1ma03xt`);
ws.onopen = () => console.log('✅ WebSocket connected');
ws.onerror = (err) => console.error('WebSocket error:', err);
ws.onmessage = (msg) => console.log('Message:', msg);


// Add connection debugging
echo.connector.pusher.connection.bind('connected', () => {
    console.log('✅ WebSocket connected successfully');
});

echo.connector.pusher.connection.bind('disconnected', () => {
    console.log('❌ WebSocket disconnected');
});

echo.connector.pusher.connection.bind('error', (err) => {
    console.error('WebSocket error:', err);
});


export default echo;