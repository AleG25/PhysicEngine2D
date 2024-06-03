var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

if (isMobile) {
    document.body.style.overflow = "hidden"
    const obscurer = document.createElement("div")
    obscurer.className = "obscurer"
    obscurer_text = document.createElement("h1")
    obscurer_text.innerText = "THIS IS A COMPUTER-ONLY SITE"
    obscurer.appendChild(obscurer_text)
    document.body.appendChild(obscurer)
}