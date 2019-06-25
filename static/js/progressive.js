window.onscroll = function() {scrollFunction()};

function scrollFunction(){
    var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    //height of total documetn height - height of users browser.
    var winHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var scrolled = (winScroll / winHeight) * 100;
    document.getElementById("myBar").style.width = scrolled + "%";
}