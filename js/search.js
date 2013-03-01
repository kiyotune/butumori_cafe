jQuery(function($){
	$('table#item_table tbody *').remove();	//全て削除

	var is_incremental = $('#is_incremental').is(':checked');
	
	$('#is_incremental').click(function(){
		is_incremental = $('#is_incremental').is(':checked');
		if(is_incremental){
			search();
		}
	});
	$('#keyword').keyup(function(e){
		if(is_incremental){
			search();
		}
	});
	$('#keyword').focusout(function(){
		search();
	});
	$('#keyword').smartenter(function(){
		search();
	});

	//検索
	function search(){
		var value = $('#keyword').val();
		$.post(
			"/butumori/cafe/data.pl", 
			{"keyword":value},
			function(data, status) {
				$('table#item_table tbody *').remove();	//全て削除
				for(var i=0; i<data.length; i++){
					var tr = data[i].join('</td><td>');
					$('table#item_table tbody').append("<tr><td>"+tr+"</td></tr>");
				}
			},
			"json"
		);
	};
});

