// const connectWebSocket = () => {
//   if (!stompClient.current) {
//     try {
//       const url = 'wss://localhost:8083/ws';
//       stompClient.current = new Client({
//         brokerURL: url,
//         onConnect: () => {
//           console.log('stomp connected');
//           setStompStatus('연결됨');
//           console.log('onConnect');

//           subChannels();
//         },
//         onDisconnect: () => {
//           console.log('stomp disconnected');
//           setStompStatus('끊어짐');
//         },
//         onWebSocketError: (error) => {
//           console.error('Error with websocket', error);
//           stompClient.current.deactivate();
//         },
//         onStompError: (frame) => {
//           console.error('Broker reported error: ' + frame.headers['message']);
//           console.error('Additional details: ' + frame.body);
//           stompClient.current.deactivate();
//         },
//       });
//       stompClient.current.activate();
//     } catch (e) {
//       console.log(e);
//     }
//   } else {
//     if (!stompClient.current.active) {
//       stompClient.current.activate();
//     }
//   }
//   console.log('stompClient.current : ', stompClient.current);
// };

// const issueCode = () => {
//   console.log('issueCode publish');
//   stompClient.current.publish({
//     destination: '/app/remote.issueCode',
//     body: JSON.stringify({ recipientId: 'gyechunhoe' }),
//   });
// };

// const enrollNickname = (nickname: string) => {
//   axios
//     .post(
//       'https://localhost:8083/app/username',
//       { nickname: nickname },
//       { withCredentials: true },
//     )
//     .then((res) => {
//       console.log('enrollNickname : ', res.data);
//       setNicknameResponse(res.data.message);
//     })
//     .catch((err) => {
//       console.log('enrollNickname error : ', err);
//       setNicknameResponse(err.response.data.message);
//     });
// };
