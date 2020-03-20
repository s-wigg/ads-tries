document.addEventListener("DOMContentLoaded", () => {
  console.log('in event listener edit');
  const target = document.querySelector('.keyboard');
  target.textContent = "Hello from JS!";
});