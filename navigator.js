const navigatorExpand = document.getElementById("nav-exp")
const navBtn = document.getElementById("nav-btn")
const homeBtn = document.getElementById("home-btn")
const backBtn = document.getElementById("back-btn")
const levelMenu = document.getElementById("level-menu")
const expandClassOn = "navigator-expanded-enabled"
const expandClassOff = "navigator-expanded-disabled"

let expanded = false

navBtn.addEventListener("click", () => {
    if(!expanded) {
        navigatorExpand.classList.add(expandClassOn)
        homeBtn.classList.add("disabled")
        backBtn.classList.remove("disabled")
        levelMenu.classList.remove("disabled")
        levelMenu.classList.add("smallAnim")
        expanded = true
    } else {
        navigatorExpand.classList.remove(expandClassOn)
        backBtn.classList.add("disabled")
        homeBtn.classList.remove("disabled")
        levelMenu.classList.add("disabled")
        levelMenu.classList.remove("smallAnim")
        expanded = false
    }
})


//levels
const levels = [
    {
        thumbnail: "thumbnails/level1.png",
        name: "Simple Friction",
        link: "level1.html",
        level: 1
    },
    {
        thumbnail: "thumbnails/level2.png",
        name: "Simple Collision",
        link: "level2.html",
        level: 2
    },
    {
        thumbnail: "thumbnails/level3.png",
        name: "Gravity",
        link: "level3.html",
        level: 3
    },
    {
        thumbnail: "thumbnails/level4.png",
        name: "Orbit",
        link: "level4.html",
        level: 4
    }
]

const level_column = document.getElementById("level-column")
const level_row = document.getElementById("level-menu-row")
levels.forEach((obj) => {
    const lc_copy = level_column.cloneNode(true)
    lc_copy.id = "level" + obj.level
    lc_copy.querySelector("img").src = obj.thumbnail
    lc_copy.querySelector("h1").innerText = obj.level + "- " + obj.name
    lc_copy.querySelector("button").onclick = () => {
        location.assign(obj.link)
    }
    level_row.appendChild(lc_copy)
})
level_column.remove()