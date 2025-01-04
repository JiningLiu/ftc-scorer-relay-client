<script lang="ts">
	import { onMount } from 'svelte';

	let development = false;
	const prodServerWsUrl = 'wss://relay.ftcscoring.app';
	const devServerWsUrl = 'ws://localhost:20240';

	let storage = false;

	let user = '';
	let password = '';
	let eventCode = '';
	let ftcliveWsHost = 'localhost';
	let ftcliveWs: WebSocket;
	let serverWs: WebSocket;

	let ftcliveConnected = false;
	let serverConnected = false;

	const processingTypes = [
		'START_MATCH',
		'ABORT_MATCH',
		'SHOW_PREVIEW',
		'SHOW_MATCH',
		'SCORE_UPDATE',
		'SHOW_RESULTS'
	];

	onMount(() => {});

	function connect() {
		ftcliveWs?.close();
		serverWs?.close();

		// relay server

		serverWs = new WebSocket(development ? devServerWsUrl : prodServerWsUrl, [user, password]);

		serverWs.onopen = () => {
			serverWs.send(
				JSON.stringify({
					eventCode: eventCode.toLowerCase(),
					clientType: 'relay',
					connected: false
				})
			);
		};

		serverWs.onclose = () => {
			serverConnected = false;
		};

		serverWs.onmessage = (message) => {
			const newConnStatus = JSON.parse(message.data)['connected'] == true;

			if (serverConnected && newConnStatus) return;

			serverConnected = newConnStatus;

			if (serverConnected) {
				ftcliveWs = new WebSocket(
					`ws://${ftcliveWsHost}/stream/display/command/?code=${eventCode}`
				);

				ftcliveWs.onopen = () => {
					ftcliveConnected = true;
				};

				ftcliveWs.onclose = () => {
					ftcliveConnected = false;
				};

				ftcliveWs.onmessage = (message) => {
					console.log(message.data);
					try {
						serverWs.send(
							JSON.stringify({
								eventCode: eventCode.toLowerCase(),
								clientType: 'relay',
								connected: true,
								data: JSON.parse(message.data)
							})
						);
					} catch (e) {
						console.log(e);
					}
				};
			}
		};
	}

	$: () => {
		if (storage) {
			localStorage.setItem('user', user);
			localStorage.setItem('password', password);
		} else {
			localStorage.removeItem('user');
			localStorage.removeItem('password');
		}
	};
</script>

<main>
	<div>
		<input bind:value={user} placeholder="FTC API Username" type="text" name="User" id="user" /><br
		/>

		<input
			bind:value={password}
			placeholder="FTC API Password"
			type="password"
			name="Password"
			id="password"
		/><br /><br />

		<input
			bind:value={eventCode}
			placeholder="Event Code"
			type="text"
			name="Event Code"
			id="event-code"
		/><br />

		<input
			bind:value={ftcliveWsHost}
			placeholder="FTCLive Host"
			type="text"
			name="Host"
			id="host"
		/><br /><br />

		<input bind:checked={development} type="checkbox" name="Dev" id="dev-toggle" />
		<label for="dev-toggle">Development</label><br />

		{#if ftcliveConnected}
			<p>FTCLive Connected</p>
		{/if}

		{#if serverConnected}
			<p>Server Connected</p>
		{/if}

		<input bind:checked={storage} type="checkbox" name="storage" id="storage-toggle" />
		<!-- <label for="storage-toggle">Use LocalStorage to store credentials</label><br /><br /> -->

		<button on:click={connect}>Connect</button><br /><br />

		<p>Open console to see relays.</p>
	</div>
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
