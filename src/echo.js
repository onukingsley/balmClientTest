import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;


const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;


/*const echo = new Echo({
    broadcaster: "pusher",
    key: "bc6945f1185c40d908cf",
    cluster: 'eu',
    forceTLS: true,
    //authEndpoint: '/broadcasting/auth',  // Make sure this exists

    auth: {
        headers: {
            'X-CSRF-TOKEN': csrfToken,
            'X-Requested-With': 'XMLHttpRequest'
        },
        // If using Laravel Sanctum for API auth
        withCredentials: true,
    }

});*/
const echo = new Echo({
    broadcaster: 'pusher',
    key: 'bc6945f1185c40d908cf',
    cluster: 'eu',
    forceTLS: true,
    encrypted: true,
    // For debugging
    enabledTransports: ['ws', 'wss'],
    disabledTransports: [], // Don't disable any transports initially
});



// Test basic WebSocket connection
/*
const ws = new WebSocket(`wss://api.nextofskin.org/app/bc6945f1185c40d908cf`);
ws.onopen = () => console.log('✅ WebSocket connected');
ws.onerror = (err) => console.error('WebSocket error:', err);
ws.onmessage = (msg) => console.log('Message:', msg);

*/

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