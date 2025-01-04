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

	onMount(() => {
		development = localStorage.getItem('development') == 'true';
		storage = localStorage.getItem('storage') == 'true';
		user = localStorage.getItem('user') || '';
		password = localStorage.getItem('password') || '';
	});

	function updateUsername() {
		if (storage) {
			localStorage.setItem('user', user);
		}
	}

	function updatePassword() {
		if (storage) {
			localStorage.setItem('password', password);
		}
	}

	function devCheck() {
		localStorage.setItem('development', development.toString());
	}

	function storageCheck() {
		localStorage.setItem('storage', storage.toString());
		if (storage) {
			localStorage.setItem('user', user);
			localStorage.setItem('password', password);
		} else {
			localStorage.removeItem('user');
			localStorage.removeItem('password');
		}
	}

	function connectServer() {
		serverWs?.close();
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
			console.log('Server connection status:', JSON.parse(message.data)['connected'] == true);
			const newConnStatus = JSON.parse(message.data)['connected'] == true;

			if (serverConnected && newConnStatus) return;

			serverConnected = newConnStatus;
		};
	}

	function connectFtclive() {
		ftcliveWs?.close();
		ftcliveWs = new WebSocket(`ws://${ftcliveWsHost}/stream/display/command/?code=${eventCode}`);

		ftcliveWs.onopen = () => {
			ftcliveConnected = true;
		};

		ftcliveWs.onclose = () => {
			ftcliveConnected = false;
		};

		ftcliveWs.onmessage = (message) => {
			if (message.data != 'pong') {
				console.log(message.data);
				try {
					serverWs?.send(
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
			}
		};
	}
</script>

<main>
	<div>
		<div class="field-section">
			<h3>Credentials</h3>

			<input
				bind:value={user}
				on:change={updateUsername}
				placeholder="FTC API Username"
				type="text"
				name="User"
				id="user"
				autocomplete="username"
			/>

			<input
				bind:value={password}
				on:change={updatePassword}
				placeholder="FTC API Password"
				type="password"
				name="Password"
				id="password"
				autocomplete="current-password"
			/>
		</div>

		<div class="field-section">
			<h3>Event</h3>

			<input
				bind:value={eventCode}
				placeholder="Event Code"
				type="text"
				name="Event Code"
				id="event-code"
			/>

			<input
				bind:value={ftcliveWsHost}
				placeholder="FTCLive Host"
				type="text"
				name="Host"
				id="host"
			/>
		</div>

		<div class="field-section">
			<div class="checkbox">
				<input
					bind:checked={development}
					on:change={devCheck}
					type="checkbox"
					name="Dev"
					id="dev-toggle"
				/>
				<label for="dev-toggle">Development</label>
			</div>

			<div class="checkbox">
				<input
					bind:checked={storage}
					on:change={storageCheck}
					type="checkbox"
					name="Storage"
					id="storage-toggle"
				/>
				<label for="storage-toggle">Store Credentials in LocalStorage</label>
			</div>
		</div>

		<div class="field-section">
			<h3 class="conn-status">
				<span class={serverConnected ? 'on' : 'off'}
					>• {serverConnected ? 'C' : 'Disc'}onnected</span
				>{development ? 'Development' : 'Production'} Relay Server
			</h3>

			<button on:click={connectServer}>1 - Connect to Relay Server</button>
		</div>

		<div class="field-section">
			<h3 class="conn-status">
				<span class={ftcliveConnected ? 'on' : 'off'}
					>• {ftcliveConnected ? 'C' : 'Disc'}onnected</span
				>FTCLive
			</h3>

			<button on:click={connectFtclive}>2 - Connect to FTCLive</button>
		</div>
		<p>Open console to see data.</p>
	</div>
</main>

<div id="viewport-too-small">
	<h1>Window is Too Small</h1>
	<p>Please make your window larger to use this app.</p>
</div>

<style lang="scss">
	:global(body) {
		margin: 0;
		padding: 0;
		color: #fff;
		background-color: #0f0f0f;
	}

	main {
		width: 100vw;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;

		div {
			display: flex;
			flex-direction: column;
			gap: 1rem;
			background-color: #222;
			padding: 1rem;
			border-radius: 0.5rem;

			div {
				padding: 0;
			}

			.field-section {
				display: flex;
				flex-direction: column;
				gap: 0.5rem;
			}

			.checkbox {
				display: flex;
				flex-direction: row;
				align-items: center;
				gap: 0.2rem;
			}
		}
	}

	input {
		padding: 0.5rem 0.8rem;
		font-size: 1rem;
		border: none;
		border-radius: 0.5rem;
		background-color: #333;
		color: #fff;
	}

	h3,
	p {
		margin: 0;
	}

	h3 {
		font-size: 1.2rem;

		span {
			font-weight: 600;
			margin-right: 0.4rem;
		}
	}

	h3 .on {
		color: #4f4;
	}

	h3 .off {
		color: #f44;
	}

	.conn-status {
		min-width: 390px;
		padding: 0.5rem 0.8rem;
		background-color: #333;
		border-radius: 0.5rem;
	}

	button {
		padding: 0.5rem 1rem;
		font-size: 1rem;
		font-weight: 500;
		border: none;
		border-radius: 0.5rem;
		background-color: #193;
		color: #fff;
		cursor: pointer;
		transition: all 0.2s;
	}

	button:hover {
		background-color: #082;
	}

	#viewport-too-small {
		position: absolute;
		left: 0;
		top: 0;
		width: calc(100vw - 2rem);
		height: calc(100vh - 2rem);
		margin: 1rem;
		display: none;
		justify-content: center;
		gap: 0.5rem;
		align-items: center;
		flex-direction: column;
		text-align: center;

		* {
			margin: 0;
		}

		h1 {
			font-size: 2rem;
		}

		p {
			font-size: 1rem;
		}
	}

	@media (max-width: 448px) {
		main {
			display: none;
		}

		#viewport-too-small {
			display: flex;
		}
	}

	@media (max-height: 560px) {
		main {
			display: none;
		}

		#viewport-too-small {
			display: flex;
		}
	}
</style>
