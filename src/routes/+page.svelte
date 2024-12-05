<script lang="ts">
	import { onMount } from 'svelte';

	const serverWsUrl = 'wss://relay.ftcscoring.app';

	let eventCode = '';
	let ftcliveWsHost = 'localhost';
	let ws: WebSocket;

	onMount(() => {
		// code
	});
</script>

<main>
  <!-- stuff -->
</main>

<style lang="scss">
	@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

	:global(body) {
		overflow: hidden;
		margin: 0;
		padding: 0;
		font-family: 'Poppins', system-ui, sans-serif;
		color: #fff;
		background-color: #0f0f0f;
	}

	main {
		width: 100vw;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
