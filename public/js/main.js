$(document).ready(  () => {
    
    $('.delete-todo').on('click', (e) => {
        //console.log("CLICKED on DELETE BTN");
        $target  =  $(e.target);
        const id = $target.attr('data-id');     //get the data-id from the attribute
        console.log(id);

        $.ajax({            //Create ajax for type DELETE
            type: 'DELETE',
            url: '/todo/delete/'+id,

            success: (respone) => {
                alert('Deleting todo');
                window.location.href = '/';

            },
            error: (error) => {
                console.log(error);
            },

        });


    });

});