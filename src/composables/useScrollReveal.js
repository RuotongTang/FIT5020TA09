import { onMounted, onUnmounted } from 'vue'

export function useScrollReveal(selector = '.reveal') {
  let observer
  let mutationObserver

  const observeMatches = () => {
    if (!observer) return
    document.querySelectorAll(selector).forEach((el) => {
      if (!el.classList.contains('revealed')) {
        observer.observe(el)
      }
    })
  }

  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      },
    )

    observeMatches()

    // Observe late-rendered nodes (e.g., after location data appears).
    mutationObserver = new MutationObserver(() => {
      observeMatches()
    })

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    })
  })

  onUnmounted(() => {
    if (observer) observer.disconnect()
    if (mutationObserver) mutationObserver.disconnect()
  })
}
