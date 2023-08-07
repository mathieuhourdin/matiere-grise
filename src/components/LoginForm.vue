<template>
  <div class="w-1/3 border shadow rounded">
    <div class="m-2">Connectez-vous</div>
    <TextInput label="Username" v-model="username" />
    <TextInput label="Password" v-model="password" />
    <div class="flex">
      <ActionButton class="ml-auto m-2" text="Valider" type="valid" @click="submit"/>
      <ActionButton class="m-2" text="Annuler" type="abort" @click="submit"/>
    </div>
  </div>
</template>

<script setup>
  import TextInput from "@/components/Ui/TextInput.vue";
  import ActionButton from "@/components/Ui/ActionButton.vue";
  import { ref } from 'vue';

  const username = ref("");
  const password = ref("");

  const submit = async () => {
    console.log("Submit");
    console.log(username.value);
    const response = await fetch("http://127.0.0.1:8080/sessions", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      })
    });
    if (response.status == 200) {
      const responseData = await response.json();
      localStorage.setItem("sessionId", responseData.id);
      localStorage.setItem("userId", responseData.user_id);
    }
  };
</script>

