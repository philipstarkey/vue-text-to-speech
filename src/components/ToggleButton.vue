<script setup>
import { toRefs } from 'vue'
import InputSwitch from 'primevue/inputswitch'
import { v4 as uuidv4 } from 'uuid'

const props = defineProps({ name: { type: String, default: () => uuidv4() } })
const { name } = toRefs(props)
const state = defineModel({ type: Boolean })
</script>

<template>
  <div class="flex gap-2 items-center">
    <label class="leading-none pr-1 select-none" :for="name">
      <slot name="offLabel"></slot>
    </label>
    <InputSwitch :inputId="name" v-model="state" />
    <label class="leading-none pl-1 select-none" :for="name">
      <slot name="onLabel"></slot>
    </label>
  </div>
</template>
