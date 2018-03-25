//Show arrow when left side is hovered
  $(document).ready(function () {

    //show the menu items when the users clicks menu btn
    $('.menu-li').click(function () {
      document.getElementById('app-modal').style.display='block';
    });

    // Get the modal
    var modal = document.getElementById('app-modal');

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
 });
