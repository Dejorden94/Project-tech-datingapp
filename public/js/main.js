$(document).ready(function(){
    $('.delete-interest').on('click', function(e){
        $target = $(e.target);
        console.log($target.attr('data-id'));
    });
});