<template>
  <v-form ref="form" v-model="valid" lazy-validation>
    <div class="modal">
      <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="290">
          <v-card>
            <v-card-title class="headline">Спасибо!</v-card-title>
            <v-card-text
              >Заявка на брендирование успешно отправлена.</v-card-text
            >
            <v-card-actions>
              <v-btn color="green darken-1" text @click="reload">Ок</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </div>
    <h1 class="header mt-5 mb-3">Оформить заявку</h1>
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
			dialog: false,
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

			let headers = {
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}

			if (this.$refs.form.validate() ) {
				HTTP.post('/send.php', data, headers)
				.then( response => {
					if (response.status === 200) {
						this.dialog = true
					}
				})
				.catch( error => console.error('Hello error', error))
			}
		},
		reload() {
			location.reload()
		}
	}
}
</script>
