fucntion showAlert() {
    $("#alert").addClass("in");
    window.setTimeout(function () {
        $("#alert").addClass("out");
        $("#alert").removeClass("in");
    }, 10000);
};

$('#click').click(function () {
    showAlert();
});

$('#close').click(function () {
    $("#alert").addClass("out");
    $("#alert").removeClass("in");
});

<div id ="alert" class="alert alert-success alert-dismissible fade" role="alert" data-alert=alert>
<button type="button" id=close class=close data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>
<strong>Warning!</strong> Better check yourself, you're not looking too good.
</div>
<br><br><br>
<button id=click>Hello</button>
