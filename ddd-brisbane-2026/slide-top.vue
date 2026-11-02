<script setup lang="ts">
// Magic Move has no maxHeight option like code blocks do, so this scrolls its
// highlighted lines into view the same way slidev's CodeBlockWrapper does.
import { useSlideContext } from '@slidev/client'
import { ref, watch } from 'vue'

const { $clicks } = useSlideContext()
const anchor = ref<HTMLElement>()

function scrollToHighlighted() {
  const wrapper = anchor.value?.parentElement?.querySelector<HTMLElement>('.slidev-code-magic-move')
  const pre = wrapper?.querySelector<HTMLElement>('.shiki')
  if (!wrapper || !pre)
    return

  const highlighted = Array.from(pre.querySelectorAll<HTMLElement>('.slidev-code-highlighted'))
    .filter(el => !el.className.includes('shiki-magic-move-leave'))
  if (!highlighted.length)
    return

  const top = pre.offsetTop + Math.min(...highlighted.map(el => el.offsetTop))
  const bottom = pre.offsetTop + Math.max(...highlighted.map(el => el.offsetTop + el.offsetHeight))
  wrapper.scrollTo({
    top: bottom - top > wrapper.clientHeight ? top : (top + bottom - wrapper.clientHeight) / 2,
    behavior: 'smooth',
  })
}

// Magic Move updates its highlights a tick after the click changes.
watch($clicks, () => setTimeout(scrollToHighlighted, 50), { immediate: true })
</script>

<template>
  <span ref="anchor" class="hidden" />
</template>
