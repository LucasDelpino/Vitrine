function toogleMenu(){
    const menu = document.querySelector(".menuA");
    const btn = document.querySelector(".toggle");

    !menu.classList.contains("active") ? btn.querySelector("span").innerHTML = "" : btn.querySelector("span").innerHTML ="";
    !menu.classList.contains("active") ? btn.querySelector("span").classList.add("coloror") : btn.querySelector("span").classList.remove("coloror");
    menu.classList.contains("active") ? menu.classList.remove("active") : menu.classList.add("active");
}


            