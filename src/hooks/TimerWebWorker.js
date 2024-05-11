let msTickInterval = null;

onmessage = (e) => {
  if (e.data === 'stop') {
    clearInterval(msTickInterval);
  } else if (e.data === 'start') {
    if (msTickInterval) {
      clearInterval(msTickInterval);
    }
    msTickInterval = setInterval(() => {
      postMessage('tick');
    }, 100);
  }
};
