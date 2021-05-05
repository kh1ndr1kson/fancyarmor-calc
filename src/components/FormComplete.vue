<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <h1 class="header mb-3">Оформить заявку</h1>
    <v-text-field
      v-model="name"
      :rules="nameRules"
      label="Имя"
      required
      outlined
      dense
    ></v-text-field>

    <v-text-field
      v-model="email"
      :rules="emailRules"
      label="E-mail"
      required
      outlined
      dense
    ></v-text-field>

    <v-text-field
      v-model="phone"
      :rules="phoneRules"
      label="Номер телефона"
      v-mask="'+7 (###) ###-##-##'"
      required
      outlined
      dense
    ></v-text-field>

    <v-textarea
      v-model="message"
      name="message"
      label="Комментарий"
      outlined
      dense
    >
    </v-textarea>

    <v-checkbox
      v-model="terms"
      :rules="[
        (v) => !!v || 'Необходимо подтвердить обработку персональных данных!',
      ]"
      label="Настоящим подтверждаю, что я согласен(на) на обработку персональных данных"
      class="mt-0 mb-2"
      required
      outlined
      dense
    ></v-checkbox>

    <v-btn :disabled="!valid" color="success" class="mr-4" @click="send">
      Отправить заявку на брендирование
    </v-btn>
  </v-form>
</template>

<script>
import { HTTP } from '@/plugins/axios'

export default {
	name: "form-complete",
	data() {
		return {
			valid: false,
			name: null,
			email: null,
			phone: null,
			message: null,
			terms: false,
			nameRules: [ v => !!v || 'Как Вас зовут?', ],
			emailRules: [
        v => !!v || 'Заполните E-mail',
        v => /.+@.+\..+/.test(v) || 'Некорректный E-mail',
      ],
			phoneRules: [ v => !!v || 'Необходимо указать номер телефона', ],
		}
	},
	props: {
		complete: {
			type: Object,
			default: () => {}
		}
	},
	methods: {
		send () {
			let data = {
				order: this.complete,
				form: {
					name: this.name,
					email: this.email,
					phone: this. phone,
					message: this.message,
				}
			}

			if (this.$refs.form.validate() ) {
				HTTP.post('/send.php', data)
				.then( response => {
					console.log(response)
				})
				.catch( error => console.error('Hello error', error))
			}
		}
	}
}
</script>
