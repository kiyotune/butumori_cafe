jQuery(function($){
	$('table#item_table tbody *').remove();	//全て削除

	$('#keyword').keyup(function(e){
		search();
	});
	$('#keyword').focusout(function(){
		search();
	});
	$('#keyword').smartenter(function(){
		search(true);
	});
	$('table#skeyboard tr td').click(function(){
		var self = this;
		var type = $(self).attr('type');
		var str = $('#keyword').val();
		var c = str.slice(-1);
		if(type){
			switch(type){
				case 'clear':		//クリア
					str = '';
					$('table#item_table tbody *').remove();
					break;
				case 'daku':		//か゛=>が: 濁音化
					str = str.slice(0, -1) + to_daku(c);
					break;
				case 'handaku':	//は゜=>ぱ: 半濁音化
					str = str.slice(0, -1) + to_handaku(c);
					break;
				case 'you':			//きや=>きゃ: 拗音化
					str = str.slice(0, -1) + to_you(c);
					break;
			}
			$('#keyword').val(str);
		}else{
			$('#keyword').val($('#keyword').val() + $(self).text());
		}
		search();
	});
	$('#search').click(function(){
		search(true);
	});
	$('#del').click(function(){
		var str = $('#keyword').val();
		$('#keyword').val(str.slice(0, -1));
		search();
	});

	//検索
	function search(go_search = false){
		if(!go_search && !$('#finc').is(':checked')) return;

		var str = $('#keyword').val();
		$('table#item_table tbody *').remove();	//全て削除
		$.post(
			"/butumori/cafe/data.pl", 
			{"keyword":str},
			function(data, status) {
				for(var i=0; i<data.length; i++){
					var tr = data[i].join('</td><td>');
					$('table#item_table tbody').append("<tr><td>"+tr+"</td></tr>");
				}
			},
			"json"
		);
	};
	//濁音化
	function to_daku(c){
		var dict = {
			"か":"が", "き":"ぎ", "く":"ぐ", "け":"げ", "こ":"ご", 
			"さ":"ざ", "し":"じ", "す":"ず", "せ":"ぜ", "そ":"ぞ", 
			"た":"だ", "ち":"ぢ", "つ":"づ", "て":"で", "と":"ど", 
			"は":"ば", "ひ":"び", "ふ":"ぶ", "へ":"べ", "ほ":"ぼ"
		};
		return(dict[c] ? dict[c] : c);
	};
	//半濁音化
	function to_handaku(c){
		var dict = {
			"は":"ぱ", "ひ":"ぴ", "ふ":"ぷ", "へ":"ぺ", "ほ":"ぽ"
		};
		return(dict[c] ? dict[c] : c);
	};
	//拗音化
	function to_you(c){
		var dict = {
			"あ":"ぁ", "い":"ぃ", "う":"ぅ", "え":"ぇ", "お":"ぉ",
			"や":"ゃ", "ゆ":"ゅ", "よ":"ょ", "つ":"っ"
		};
		return(dict[c] ? dict[c] : c);
	};
});

