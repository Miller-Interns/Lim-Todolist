<template>
  <div class="app">
    <nav>
      <RouterLink to="/">Home</RouterLink> |
      <RouterLink :to="{ name: 'todoListView' }">Go to App</RouterLink>
    </nav>
    <br />
    <div class="wrapper">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
body,
html {
  margin: 0;
  padding: 0;
  height: 100%;
}

.app {
  text-align: center;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  background-color: white;
  overflow: hidden;
}

nav {
  position: absolute;
  top: 0;
  width: 100%;
  height: 5%;
  text-align: center;
  background-color: #0b8a14;
  color: #ffffff;
  align-content: center;
}

nav a {
  color: white;
  text-decoration: none;
}

.wrapper {
  border: 1px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
}
</style>
