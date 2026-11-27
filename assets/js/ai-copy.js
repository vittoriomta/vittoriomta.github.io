// "Copy AI instructions": copies the post's prompt for a coding agent, then says so briefly.
;(() => {
  const button = document.querySelector(".ai-copy")
  const prompt = document.querySelector(".ai-prompt")
  if (!button || !prompt) return
  const label = button.textContent
  let timer = 0
  button.addEventListener("click", async () => {
    const text = prompt.value
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      prompt.hidden = false
      prompt.select()
      document.execCommand("copy")
      prompt.hidden = true
    }
    button.textContent = button.dataset.copied
    button.classList.add("done")
    clearTimeout(timer)
    timer = setTimeout(() => {
      button.textContent = label
      button.classList.remove("done")
    }, 1600)
  })
})()
