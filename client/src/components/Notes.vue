<style></style>

<template>

	<div class="nav">
		<div class="navcontent">
			<span id="titlespan" style="color: #ffff">
				My Notes
			</span>
			<button v-on:click.prevent="handleLogOut" class="button">
				Log out
			</button>
		</div>
	</div>
	<div class="container">
		<div class="container">
			<div v-for="note in notes" :key="note.id">
				<form id="put" v-if="note.id" class="note"
					v-on:submit="(e) => { e.preventDefault(); patchNote(note.id, title1[note.id] ? title1[note.id] : note.title, content1[note.id] ? content1[note.id] : note.content); noteBeingModified = -1 }">
					<div>
						<div>
							<span id="title1span" v-if="noteBeingModified != note.id" class="title">
								{{ note.title || note.content ? note.title : 'Empty note' }}
							</span>
							<input id="title1input" v-else ref="title1" style="background-color: #ffffff;" class="title"
								v-model="title1[note.id]" :placeholder="note.title || 'Title'">
						</div>
						<div>
							<span id="content1span" v-if="noteBeingModified != note.id" class="textarea">
								{{ note.content }}
							</span>
							<textarea id="content1input" v-else ref="content1" style="background-color: #ffffff;"
								class="textarea" v-model="content1[note.id]"
								:placeholder="note.content || 'Content...'"></textarea>
						</div>
					</div>
					<div>
						<button id="edit" style="margin-right:10px" class="button"
							v-on:click="(e) => { e.preventDefault(); noteBeingModified == note.id ? noteBeingModified = -1 : noteBeingModified = note.id }">
							{{ noteBeingModified == note.id ? "Cancel" : "Modify" }}
						</button>
						<button id="save" v-if="noteBeingModified == note.id" style="margin-right:10px" class="button">
							Save
						</button>
						<button id="delete" style="background-color:rgb(203, 0, 0)" class="button"
							v-on:click="(e) => { e.preventDefault(); deleteNote(note.id) }">
							Delete
						</button>
					</div>
				</form>
			</div>
			<button class="button" v-on:click="() => { addButtonVisibility = !addButtonVisibility }">
				{{ addButtonVisibility ? "x" : "+" }}
			</button>
			<form id="post" v-on:submit="(e) => { e.preventDefault(); postNote() }">
				<div class="note" v-if="addButtonVisibility">
					<div>
						<input id="title" ref="title" class="title" placeholder="Title">
						<textarea id="content" ref="content" class="textarea" placeholder="Content..."></textarea>
					</div>
					<div>
						<button id="add" class="button">
							Add
						</button>
					</div>
				</div>
			</form>
		</div>
		<span id="notfoundspan" v-if="notes.length === 0" class="container">
			No notes found
		</span>
	</div>

</template>

<script>

const URL = "http://localhost:8000/";
const HOMEURL = URL + "notes";
const LOGINURL = URL + "login";
const LOGOUTURL = URL + "logout";

export default {
	data() {
		return {
			notes: [],
			addButtonVisibility: false,
			noteBeingModified: -1,
			title1: [],
			content1: [],
			HOMEURL: HOMEURL,
			LOGINURL: LOGINURL,
			LOGOUTURL: LOGOUTURL
		};
	},
	mounted() {
		fetch('/notes', {
			method: 'GET',
			credentials: 'include'
		})
			.then(res => res.json())
			.then(data => this.notes = data);
	},
	methods: {
		postNote() {
			this.addButtonVisibility = !this.addButtonVisibility;
			const formData = new FormData();
			formData.append('title', this.$refs.title.value || "");
			formData.append('content', this.$refs.content.value || "");
			fetch('/notes', {
				method: 'POST', body: formData,
				credentials: 'include'
			})
				.then(res => {
					if (!res.ok) {
						throw new Error('Error at post: ' + res.status);
					}
					return res.json();
				})
				.then(data => { this.notes = [...this.notes, data] })
				.catch(err => console.log(err.message));
		},
		patchNote(id, title, content) {
			const formData = new FormData();
			formData.append('title', title);
			formData.append('content', content);
			fetch('/' + id, {
				method: 'PUT', body: formData,
				credentials: 'include'
			})
				.then(this.notes.forEach((note) => {
					if (note.id == id) {
						note.title = title;
						note.content = content;
					}
				}
				)
				)
				.then((res) => {
					if (res.status == 200) {
						console.log("Saved " + title);
					}
				})
				.catch(err => console.log(err.message));
		},
		deleteNote(id) {
			fetch('/' + id, {
				method: 'DELETE',
				credentials: 'include'
			})
				.then(() => this.notes = this.notes.filter(note => note.id != id))
				.catch(err => console.log(err.message));
		},
		handleLogOut() {
			fetch('/logout', {
				method: 'POST',
				credentials: 'include'
			})
				.then(() => {
					this.$router.push("/login");
				})
				.catch(err => console.log(err.message));
		}
	}
};

</script>