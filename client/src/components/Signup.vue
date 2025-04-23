<style>
#app {
	font-family: Arial, Helvetica, Avenir, sans-serif;
	color: #333;
}

.container1 {
	display: flex;
	justify-content: center;
	align-items: center;
}
</style>

<template>
	<div class="login">
		<h2>Sign up</h2>
		<form v-on:submit.prevent="handleSignup" class="note">
			<label class="input" for="email">Email</label>
			<input class="input" ref="email" id="email" type="email" v-model="email" required />
			<label class="input" for="password">Password</label>
			<input class="input" ref="password" id="password" type="password" v-model="password" required />
			<button type="submit" class="button">
				Sign up
			</button>
		</form>
		<a class="button" :href="'/login'">
			Already have an account?
		</a>
	</div>
</template>

<script>

const URL = "http://localhost:8000/";
const SIGNUPURL = URL + "signup";

export default {
	data() {
		return {
			email: "",
			password: "",
			SIGNUPURL: SIGNUPURL
		};
	},
	mounted() {
	},
	methods: {
		handleSignup() {
			const formData = new FormData();
			if (this.$refs.email.value && this.$refs.password.value) {
				formData.append('email', this.$refs.email.value);
				formData.append('password', this.$refs.password.value);
				fetch("/signup", { method: 'POST', body: formData, credentials: 'include' })
					.then(res => {
						if (!res.ok) {
							throw new Error('Error at post: ' + res.status);
						}
						return res.json();
					})
					.then(() => {
						this.$router.push("/notes");
					})
					.catch(err => console.log(err.message));
			}
			else {
				console.log('error logging in')
			}
		},
	}
};

</script>