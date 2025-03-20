import { computed, ref, watch, watchEffect } from 'vue'
import { useDraggable } from '@vueuse/core'

function useModalDrag(modalRef, modalTitleRef) {
  const { x, y, isDragging } = useDraggable(modalTitleRef)
  const startX = ref(0)
  const startY = ref(0)
  const startedDrag = ref(false)
  const transformX = ref(0)
  const transformY = ref(0)
  const preTransformX = ref(0)
  const preTransformY = ref(0)
  const dragRect = ref({
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  })
  watch([x, y], () => {
    if (!startedDrag.value) {
      startX.value = x.value
      startY.value = y.value
      const bodyRect = document.body.getBoundingClientRect()
      const modalRefRect = modalRef.value.getBoundingClientRect()
      dragRect.value.right = bodyRect.width - modalRefRect.width
      dragRect.value.bottom = bodyRect.height - modalRefRect.height
      preTransformX.value = transformX.value
      preTransformY.value = transformY.value
    }
    startedDrag.value = true
  })
  watch(isDragging, () => {
    if (!isDragging.value) {
      startedDrag.value = false
    }
  })
  watchEffect(() => {
    if (startedDrag.value) {
      transformX.value =
        preTransformX.value + Math.min(Math.max(dragRect.value.left, x.value), dragRect.value.right) - startX.value
      transformY.value =
        preTransformY.value + Math.min(Math.max(dragRect.value.top, y.value), dragRect.value.bottom) - startY.value
    }
  })
  return computed(() => {
    return {
      transform: `translate(${transformX.value}px, ${transformY.value}px)`,
    }
  })
}

export { useModalDrag }
