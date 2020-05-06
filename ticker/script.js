(function () {

    /// Ajax after load ////
    $(document).ready(function () {
        // console.log("eventload", e);
        $.ajax({
            url: '/links.json',
            method: 'GET',
            success: function (responseLinks) { //need to go to http-server -c-O
                // console.log("response ", responseLinks);
                var myHtml = '';
                for (var i = 0; i < responseLinks.length; i++) {
                    // console.log("responselink ", responseLinks[i]);
                    var links = '<a href="' + responseLinks[i].link + '" class="headline" id="headline" target="_blank"' + '>' + responseLinks[i].headline + '</a>' + "...";
                    myHtml += links;
                    // console.log("myhtml", myHtml);
                }
                $('.box').html(myHtml);

                anim = requestAnimationFrame(moveBox);// ask for details about it
                var box = $(".box");
                var left = box.offset().left;
                var headLineLink = $('.headline');
                for (var j = 0; j < headLineLink.length; j++) {
                    if (headLineLink[j].className == 'headline') {
                        headLineLink[j].innerHTML = headLineLink[j].innerHTML.substring(0, 30);
                    }

                    //can only add event on one headline
                    headLineLink.eq(j).on("mouseover", function (e) {
                        $(e.target).css({
                            color: "cadetblue",
                            fontSize: 16 + "px"
                        });
                    });
                    headLineLink.eq(j).on("mouseout", function (e) {
                        $(e.target).css({
                            color: "black",
                            fontSize: 14 + "px",
                        });
                    });
                    // will call move box without beeing stuck in an infinite loop // return smthg new everytime uniq value
                    headLineLink.eq(0).on("mouseover", function (e) {
                        cancelAnimationFrame(anim);
                        e.preventDefault(anim);
                    });
                }
                var anim;
                function moveBox() {
                    console.log('callingmovebox');
                    // gives the value assigned for this in CSS and can be applied to all of them. Is the container that will contain the tags
                    var width = headLineLink.eq(0).outerWidth(); // use width to know the size of the first ancre tag and when will be out of screen
                    // console.log("width ", width);
                    // console.log("headline variable ", box.offset().left); //to see the first link
                    if (box.offset().left < -width - (3 + 'px')) {
                        box.append(headLineLink.eq(0)); // take first link and add it to end of the list /box.appendChild[0];
                        left += width;
                        headLineLink = $(".headline");
                    }
                    left--;
                    box.css({
                        left: left + "px",
                    });
                    requestAnimationFrame(moveBox); // will call move box without beeing stuck in an infinite loop // return smthg new everytime it is called
                }
                moveBox();
                console.log(moveBox);
            }

        });
    });

})();