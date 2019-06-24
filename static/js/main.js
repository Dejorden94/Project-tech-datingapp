$(document).ready(function(){
    $('.deleteButton').on('click', function(e){
        $target = $(e.target);
        const id = ($target.attr('data-id'));
        $.ajax({
            type:'DELETE',
            url: '/interest/'+id,
            success: function(response){
                alert('Deleted interest');
                window.location.href='/';
            },
            error: function(err){
                console.log(err);
            }
        });
    });
});