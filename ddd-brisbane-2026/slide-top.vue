<script setup lang="ts">
// Magic Move has no maxHeight option like code blocks do, so this scrolls its
// highlighted lines into view the same way slidev's CodeBlockWrapper does.
import { onSlideEnter } from '@slidev/client'
import { nextTick, onMounted, onUnmounted, ref } from 'vue'

const anchor = ref<HTMLElement>()

function scrollToHighlighted(behavior: ScrollBehavior) {
  const wrapper = anchor.value?.parentElement?.querySelector<HTMLElement>('.slidev-code-magic-move')
  const pre = wrapper?.querySelector<HTMLElement>('.shiki')
  // Hidden (preloaded) slides have no layout to scroll yet.
  if (!wrapper?.clientHeight || !pre)
    return

  const tokens = (Array.from(pre.children) as HTMLElement[])
    .slice(1) // Magic Move's anchor
    .filter(el => el.tagName !== 'BR' && !el.className.includes('shiki-magic-move-leave'))
  const highlighted = tokens.filter(el => el.classList.contains('slidev-code-highlighted'))
  if (!highlighted.length)
    return

  // Magic Move animates the code's height, so size the box by where the tokens
  // end up (offsetTop ignores their transforms) rather than mid-animation.
  const bottomOf = (el: HTMLElement) => el.offsetTop + el.offsetHeight
  const height = pre.offsetTop + Math.max(...tokens.map(bottomOf)) + Number.parseFloat(getComputedStyle(pre).paddingBottom)
  const box = Math.min(height, Number.parseFloat(getComputedStyle(wrapper).maxHeight))
  const top = pre.offsetTop + Math.min(...highlighted.map(el => el.offsetTop))
  const bottom = pre.offsetTop + Math.max(...highlighted.map(bottomOf))
  const target = bottom - top > box ? top : (top + bottom - box) / 2
  wrapper.scrollTo({ top: Math.max(0, Math.min(target, height - box)), behavior })
}

// Scroll when the highlights change (whenever Magic Move gets to it, on any click,
// direction or jump), and again when the code's height finishes animating, as
// the scroll can't go past the height it had when it started.
const observer = new MutationObserver((records) => {
  if (records.some(({ target, oldValue }) => {
    const had = (name: string) => !!oldValue?.includes(name)
    const has = (name: string) => (target as HTMLElement).classList.contains(name)
    return (target as HTMLElement).closest('.slidev-code-magic-move')
      && (has('slidev-code-highlighted') !== had('slidev-code-highlighted')
        || (had('shiki-magic-move-container-resize') && !has('shiki-magic-move-container-resize')))
  })) {
    scrollToHighlighted('smooth')
  }
})
onMounted(() => observer.observe(anchor.value!.parentElement!, {
  subtree: true,
  attributeFilter: ['class'],
  attributeOldValue: true,
}))
onUnmounted(() => observer.disconnect())

// Entering a preloaded slide shows it without changing its highlights.
onSlideEnter(() => nextTick(() => scrollToHighlighted('instant')))
</script>

<template>
  <span ref="anchor" class="hidden" />
</template>
