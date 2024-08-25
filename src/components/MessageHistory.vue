<script setup>
import { toRefs } from 'vue'
import ScrollPanel from 'primevue/scrollpanel'
import Timeline from 'primevue/timeline'
import Button from 'primevue/button'
import 'primeicons/primeicons.css'
import message from '@/primevue-presets/Lara/message'

defineEmits(['playpause', 'stop'])
const props = defineProps({
  messages: { type: Array, required: true },
  messagePlayingState: { type: Object, required: true }
})
const { messages } = toRefs(props)
</script>

<template>
  <ScrollPanel>
    <Timeline
      :value="messages"
      :pt="{ marker: 'mt-1', opposite: 'flex-none' }"
      :ptOptions="{ mergeSections: true, mergeProps: true }"
    >
      <template #content="{ item, index }">
        <div class="flex gap-2">
          {{ item.text }}
          <Button
            :icon="
              index == messagePlayingState.index && messagePlayingState.playing
                ? 'pi pi-pause'
                : 'pi pi-play'
            "
            :aria-label="
              index == messagePlayingState.index && messagePlayingState.playing ? 'Pause' : 'Play'
            "
            rounded
            outlined
            class="h-2"
            @click="$emit('playpause', index)"
          />
          <Button
            icon="pi pi-stop"
            aria-label="Stop"
            rounded
            outlined
            class="h-2"
            :disabled="messagePlayingState.index !== index || !messagePlayingState.playing"
            @click="$emit('stop', index)"
          />
        </div>
      </template>
    </Timeline>
  </ScrollPanel>
</template>
