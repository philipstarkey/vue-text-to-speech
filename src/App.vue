<script setup>
import { computed, ref, onMounted, watchEffect } from 'vue'
import { useDark, useScroll, useSpeechSynthesis } from '@vueuse/core'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
import ToggleButton from '@/components/ToggleButton.vue'
import Heading from '@/components/HeadingText.vue'
import MessageHistory from '@/components/MessageHistory.vue'

const messages = ref([
  // { text: 'A really long message that should fill up a good fraction of the page if I am lucky' }
])
const newMessage = ref('')
const messagePlayingState = ref({ index: -1, playing: false })
const messagePlaying = ref('')
const messageHistory = ref(null)
const voiceIdx = ref(0)
const availableVoices = ref([])
const pitch = ref(1)
const rate = ref(1)
let synth

// const { y: messageHistoryScrollY } = useScroll(messageHistory)

const isDark = useDark()
const voice = computed(() => availableVoices.value[voiceIdx.value])
const speech = useSpeechSynthesis(messagePlaying, {
  voice,
  pitch,
  rate
})

onMounted(() => {
  if (speech.isSupported.value) {
    // Load initial voice
    setTimeout(() => {
      synth = window.speechSynthesis
      availableVoices.value = synth.getVoices()
      // voiceIdx.value = availableVoices.value[0]
    })
  }
})

const voices = computed(() =>
  availableVoices.value.map((item, idx) => ({ name: `${item.name} (${item.lang})`, value: idx }))
)

watchEffect(() => {
  if (
    messages.value.length == 0 ||
    messagePlayingState.value.index > messages.value.length ||
    messagePlayingState.value.index < 0
  ) {
    return
  }

  if (speech.status.value == 'end') {
    messagePlayingState.value.playing = false
  }

  // console.log(messages.value, messagePlayingIndex.value)
  // if (messageHistory.value) {
  //   console.log(
  //     messageHistory.value,
  //     messageHistory.value.$el.scrollHeight,
  //     messageHistory.value.$el.clientHeight,
  //     messageHistory.value.$el.children.length
  //   )
  //   if (messageHistory.value.$el.children.length) {
  //     if (messageHistory.value.$el.children[0].children.length) {
  //       if (messageHistory.value.$el.children[0].children[0].children.length) {
  //         if (messageHistory.value.$el.children[0].children[0].children[0].children.length) {
  //           console.log(
  //             messageHistory.value.$el.children[0].children[0].children[0].children.length
  //           )
  //           messageHistory.value.$el.children[0].children[0].children[0].children[
  //             messageHistory.value.$el.children[0].children[0].children[0].children.length - 1
  //           ].children[2].scrollIntoView({
  //             block: 'end'
  //           })
  //         }
  //       }
  //     }
  //   }
  // messageHistory.value.$el.scrollTo({
  //   top: messageHistory.value.$el.scrollHeight - messageHistory.value.$el.clientHeight
  // })
  // }
  // messagePlaying.value = messages.value[messagePlayingIndex.value].text
})

const onNewMessage = () => {
  if (!newMessage.value) {
    return
  }
  messages.value.unshift({ text: newMessage.value })
  messagePlayingState.value.index = 0
  messagePlayingState.value.playing = true
  if (speech.isPlaying.value) {
    speech.stop()
  }
  messagePlaying.value = newMessage.value
  speech.speak()
  newMessage.value = ''
}

const playpause = (index) => {
  if (index == messagePlayingState.value.index && speech.status.value != 'end') {
    speech.toggle()
    messagePlayingState.value.playing = !messagePlayingState.value.playing
  } else {
    speech.stop()
    messagePlaying.value = messages.value[index].text
    messagePlayingState.value.playing = true
    messagePlayingState.value.index = index
    speech.speak()
  }
}

const stop = (index) => {
  if (index == messagePlayingState.value.index) {
    speech.stop()
    messagePlayingState.value.playing = false
  }
}
</script>

<template>
  <div class="float-right m-2">
    <ToggleButton v-model="isDark">
      <template #offLabel>Light</template>
      <template #onLabel>Dark</template>
    </ToggleButton>
  </div>
  <Heading class="text-emerald-600 text-center">Text to speech</Heading>
  <div class="flex mt-8">
    <Card class="m-auto w-2/3">
      <template #content>
        <div class="grid grid-cols-1 gap-4 m-auto">
          <Dropdown
            v-model="voiceIdx"
            :options="voices"
            optionLabel="name"
            optionValue="value"
            placeholder="Select a voice"
          />
          <div class="flex gap-2">
            <InputText
              class="flex-grow"
              type="text"
              v-model="newMessage"
              @keyup.enter="onNewMessage"
            />
            <Button icon="pi pi-play" aria-label="Play" rounded outlined @click="onNewMessage" />
          </div>
          <MessageHistory
            :messages="messages"
            :messagePlayingState="messagePlayingState"
            class="max-h-[70vh]"
            ref="messageHistory"
            @playpause="playpause"
            @stop="stop"
          />
        </div>
      </template>
    </Card>
  </div>
</template>
