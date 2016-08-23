$(function() {
	var id = window.sessionStorage.getItem('cid');
	if(!id){
		window.location = '/login';
	}
});

function jqradio(name){
    return $(':checked[name="' + name + '"]').val();
}