<template>
  <v-app>
    <v-col> <h1>Брендирование</h1> </v-col>
    <v-col>
      <v-slide-y-transition>
        <v-select
          v-model="currentData.item_id"
          :success="currentData.item_id ? true : false"
          :items="items"
          item-value="id"
          item-text="name"
          label="Товары"
          dense
          outlined
          @input="getSizes"
        >
        </v-select>
      </v-slide-y-transition>

      <v-slide-y-transition>
        <v-select
          v-if="currentData.item_id !== 0 && sizes.length"
          v-model="currentData.size_id"
          :success="currentData.size_id ? true : false"
          :items="sizes"
          item-value="id"
          item-text="name"
          label="Размеры"
          dense
          outlined
          @input="getMaterials"
        >
        </v-select>
      </v-slide-y-transition>

      <v-slide-y-transition>
        <v-select
          v-if="materials.length"
          :success="currentData.material_id ? true : false"
          v-model="currentData.material_id"
          :items="materials"
          item-value="id"
          item-text="name"
          label="Материалы"
          dense
          outlined
          @input="fullProps"
        >
        </v-select>
      </v-slide-y-transition>
    </v-col>
    <v-slide-x-transition v-if="isSeenRange">
      <v-col>
        <v-slider
          v-model="currentData.quantity"
          color="#38383F"
          track-color="#38383F"
          thumb-color="#FF8400"
          label="Количество"
          :min="min"
          :max="max"
          thumb-label="always"
          @change="changeQuantity"
        ></v-slider>
      </v-col>
    </v-slide-x-transition>
    <v-slide-x-transition v-if="isSeenResult">
      <v-col>
        <p>Цена за один товар: {{ currentData.price | toPrice }}</p>
        <p>
          Цена за {{ currentData.quantity }} товаров:
          {{ (currentData.price * currentData.quantity) | toPrice }}
        </p>
      </v-col>
    </v-slide-x-transition>
    <v-col>
      <v-checkbox
        v-model="currentData.rush"
        label="Нужно срочно"
        color="red"
      ></v-checkbox>
      <v-slide-y-transition>
        <v-select
          v-if="currentData.rush"
          :success="currentData.markup_id ? true : false"
          v-model="currentData.markup_id"
          :items="markups"
          item-value="id"
          item-text="name"
          label="Насколько срочно?"
          dense
          outlined
        >
        </v-select>
      </v-slide-y-transition>
    </v-col>
    <v-col>
      <v-btn color="#FF8400" dark>Рассчитать</v-btn>
    </v-col>
  </v-app>
</template>

<script>
import { HTTP } from './plugins/axios'

export default {
  name: 'App',
  components: {},
	data() {
		return {
			currentData: {
				item_id: 0,
				size_id: 0,
				material_id: 0,
				markup_id: 0,
				quantity: 1,
				price: 0,
				rush: false
			},
			items: [],
			sizes: [],
			materials: [],
			markups: [],
			min: 0,
			max: 0,
		}
	},
	computed: {
		isSeenRange() {
			return this.currentData.item_id ? true : false
		},
		isSeenResult() {
			if (this.items.length > 0) {
				if (this.currentData.item_id) {
					return true
				} else {
					return false
				}
			} else {
				return false
			}
		}
	},
	methods: {
		getItems() {
			HTTP.get('/select/items.php')
			.then( response => {
				this.items = response.data.items

				this.min = response.data.min
				this.max = response.data.max
			})
			.catch( error => console.error('Hello error', error))
		},
		getSizes() {
			HTTP.get('/select/sizes.php?item_id=' + this.currentData.item_id + '&q=' + this.currentData.quantity)
			.then( response => {
				this.sizes = response.data.sizes

				this.min = response.data.min
				this.max = response.data.max

				this.currentData.size_id = 0
				this.currentData.material_id = 0
				this.currentData.quantity = response.data.min
				this.currentData.price = response.data.price
			})
			.catch( error => console.error('Hello error', error))
		},
		getMaterials() {
			HTTP.get('/select/materials.php?item_id=' + this.currentData.item_id + '&size_id=' + this.currentData.size_id)
			.then( response => {
				this.materials = response.data.materials

				this.min = response.data.min
				this.max = response.data.max

				this.currentData.material_id = 0
				this.currentData.quantity = response.data.min
				this.currentData.price = response.data.price
			})
			.catch( error => console.error('Hello error', error))
		},
		fullProps() {
			HTTP.get('/full_props.php?item_id=' + this.currentData.item_id + '&size_id=' + this.currentData.size_id + '&material_id=' + this.currentData.material_id)
			.then( response => {
				this.min = response.data.min
				this.max = response.data.max

				this.currentData.quantity = response.data.min
				this.currentData.price = response.data.price
			})
			.catch( error => console.error('Hello error', error))
		},
		changeQuantity() {
			HTTP.get('/change_quantity.php?item_id=' + this.currentData.item_id + '&size_id=' + this.currentData.size_id + '&material_id=' + this.currentData.material_id + '&q=' + this.currentData.quantity)
			.then( response => {
				this.currentData.price = response.data
			})
			.catch( error => console.error('Hello error', error))
		},
		getMarkups() {
			HTTP.get('/select/markups.php')
			.then( response =>  this.markups = response.data )
			.catch( error => console.error('Hello error', error))
		},
	},
	filters: {
		toPrice(val) {
			return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ' руб.'
		}
	},
	mounted() {
		this.getItems(),
		this.getMarkups()
	}
}
</script>

<style>
.v-application--wrap {
  min-height: unset !important;
  min-width: unset !important;
}
</style>
