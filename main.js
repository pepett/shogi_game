/*
	1:王
	2:玉
	3:金将
	4:銀将
*/
/*
	敵との駒の衝突判定がまだ
	プレイヤー2の飛車、角行との当たり判定がまだ
*/

window.onload = () => {
	const can = document.getElementById( 'can' );
	const g = can.getContext( '2d' );
	
	const MAX_LENGTH = 9;
	const BLOCK_SIZE = 90;

	let turn;//ターン
	let player_1_koma = [];
	let player_2_koma = [];

	let cand_position = [];	//選択した候補の保存(移動先の候補)
	let ms_position = [];	//移動元

	let v_field = [//仮想盤
		[ 0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0 ],
		[ 7,7,7,7,7,7,7,7,7 ],
		[ 0,9,0,0,0,0,0,8,0 ],
		[ 6,5,4,3,1,3,4,5,6 ],
	]

	let field = [//実盤
		[ 0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0 ],
		[ 7,7,7,7,7,7,7,7,7 ],
		[ 0,9,0,0,0,0,0,8,0 ],
		[ 6,5,4,3,1,3,4,5,6 ],
	]

	let player_1_field = [//プレイヤー1の盤
		[ 0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0 ],
		[ 7,7,7,7,7,7,7,7,7 ],
		[ 0,9,0,0,0,0,0,8,0 ],
		[ 6,5,4,3,1,3,4,5,6 ],
	]

	let player_2_field = [//プレイヤー2の盤
		[ 0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0 ],
		[ 0,0,0,0,0,0,0,0,0 ],
		[ 7,7,7,7,7,7,7,7,7 ],
		[ 0,9,0,0,0,0,0,8,0 ],
		[ 6,5,4,3,2,3,4,5,6 ],
	]

	const draw_field = () => {
		for( let y = 0;y < MAX_LENGTH;y ++ ){
			for( let x = 0;x < MAX_LENGTH;x ++ ){
				g.strokeStyle = 'black';
				g.strokeRect( x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE );
			}
		}
	}
	const draw_koma = () => {
		/*for( let y = 0;y < MAX_LENGTH;y ++ ){
			for( let x = 0;x < MAX_LENGTH;x ++ ){
				if( field[ y ][ x ] == 0 ) continue;
				const img = new Image();
				img.src = './shogi_img/p1_' + field[ y ][ x ].toString() + '.png';
				img.onload = ()=>{ g.drawImage( img, x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE ); }
			}
		}*/
		for( let y = 0;y < MAX_LENGTH;y ++ ){//プレイヤー1の駒の描画#p1draw
			for( let x = 0;x < MAX_LENGTH;x ++ ){
				if( player_1_field[ y ][ x ] == 0 ) continue;
				const img = new Image();
				img.src = './shogi_img/p1_' + player_1_field[ y ][ x ].toString() + '.png';
				img.onload = () => { g.drawImage( img, x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE ); }
			}
		}
		for( let y = 0;y < MAX_LENGTH;y ++ ){//プレイヤー2の駒の描画#p2draw
			for( let x = 0;x < MAX_LENGTH;x ++ ){
				if( player_2_field[ y ][ x ] == 0 ) continue;
				const img = new Image();
				img.src = './shogi_img/p2_' + player_2_field[ y ][ x ].toString() + '.png';
				img.onload = () => { g.drawImage( img, ( MAX_LENGTH - x - 1 ) * BLOCK_SIZE, ( MAX_LENGTH - y - 1 ) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE ); }
			}
		}
	}
	const get_player_field = ( trn ) => {
		if( trn ) return player_1_field;
		else return player_2_field;
	}
	const get_player_koma = ( trn ) => {
		if( trn ) return player_1_koma;
		else return player_2_koma;
	}
	const execute = ()=>{
		for( let y = 0;y < MAX_LENGTH;y ++ ){
			for( let x = 0;x < MAX_LENGTH;x ++ ){
				field[ y ][ x ] = v_field[ y ][ x ];
			}
		}
	}
	const select_ou_gyoku = ( w, h ) => {//#ou
		for( let y = 0;y < MAX_LENGTH;y ++ ){
			for( let x = 0;x < MAX_LENGTH;x ++ ){
				v_field[ y ][ x ] = get_player_field( turn )[ y ][ x ];//仮想盤を更新(ターンのプレイヤーの盤面にする)
			}
		}
		g.fillStyle = '#e3edf7';
		for( let y = ( turn ? h : MAX_LENGTH - h - 1 ) - 1;y < ( turn ? h : MAX_LENGTH - h - 1 ) + 2;y ++ ){
			if( !( y >= 0 && y <= 8 ) ) continue;
			for( let x = ( turn ? w : MAX_LENGTH - w - 1 ) - 1;x < ( turn ? w : MAX_LENGTH - w - 1 ) + 2;x ++ ){
				if( !( x >= 0 && x <= 8 ) ) continue;
				if( v_field[ y ][ x ] != 0 ) continue;
				//駒を置ける候補を追加
				cand_position.push( [ turn ? x : MAX_LENGTH - x - 1, turn ? y : MAX_LENGTH - y - 1 ] );
				//駒を置ける候補を描画( 水色のやつ )
				g.fillRect( ( turn ? x : MAX_LENGTH - x - 1 ) * BLOCK_SIZE, ( turn ? y : MAX_LENGTH - y - 1 ) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE );
			}
		}
		//ここから敵の駒との判定
	}
	const select_kin = ( w, h ) => {
		for( let y = 0;y < MAX_LENGTH;y ++ ){
			for( let x = 0;x < MAX_LENGTH;x ++ ){
				v_field[ y ][ x ] = get_player_field( turn )[ y ][ x ];
			}
		}
		g.fillStyle = '#e3edf7';
		for( let y = ( turn ? h : MAX_LENGTH - h - 1 ) - 1;y < ( turn ? h : MAX_LENGTH - h - 1 ) + 2;y ++ ){
			if( !( y >= 0 && y <= 8 ) ) continue;
			for( let x = ( turn ? w : MAX_LENGTH - w - 1 ) - 1;x < ( turn ? w : MAX_LENGTH - w - 1 ) + 2;x ++ ){
				if( !( x >= 0 && x <= 8 ) ) continue;
				if( y == ( turn ? h : MAX_LENGTH - h - 1 ) + 1 && x != ( turn ? w : MAX_LENGTH - w - 1 ) ) continue;
				if( v_field[ y ][ x ] != 0 ) continue;
				cand_position.push( [ turn ? x : MAX_LENGTH - x - 1, turn ? y : MAX_LENGTH - y - 1 ] );
				g.fillRect( ( turn ? x : MAX_LENGTH - x - 1 ) * BLOCK_SIZE, ( turn ? y : MAX_LENGTH - y - 1 ) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE );
			}
		}
	}
	const select_gin = ( w, h ) => {
		for( let y = 0;y < MAX_LENGTH;y ++ ){
			for( let x = 0;x < MAX_LENGTH;x ++ ){
				v_field[ y ][ x ] = get_player_field( turn )[ y ][ x ];
			}
		}
		g.fillStyle = '#e3edf7';
		for( let y = ( turn ? h : MAX_LENGTH - h - 1 ) - 1;y < ( turn ? h : MAX_LENGTH - h - 1 ) + 2;y ++ ){
			if( !( y >= 0 && y <= 8 ) ) continue;
			if( y == ( turn ? h : MAX_LENGTH - h - 1 ) ) continue;
			for( let x = ( turn ? w : MAX_LENGTH - w - 1 ) - 1;x < ( turn ? w : MAX_LENGTH - w - 1 ) + 2;x ++ ){
				if( !( x >= 0 && x <= 8 ) ) continue;
				if( y != ( turn ? h : MAX_LENGTH - h - 1 ) - 1 && x == ( turn ? w : MAX_LENGTH - w - 1 ) ) continue;
				if( v_field[ y ][ x ] != 0 ) continue;
				cand_position.push( [ ( turn ? x : MAX_LENGTH - x - 1 ), ( turn ? y : MAX_LENGTH - y - 1 ) ] );
				g.fillRect( ( turn ? x : MAX_LENGTH - x - 1 ) * BLOCK_SIZE, ( turn ? y : MAX_LENGTH - y - 1 ) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE );
			}
		}
	}
	const select_kei = ( w, h ) => {
		let nw = ( turn ? w : MAX_LENGTH - w - 1 );
		let nh = ( turn ? h : MAX_LENGTH - h - 1 );
		for( let y = 0;y < MAX_LENGTH;y ++ ){
			for( let x = 0;x < MAX_LENGTH;x ++ ){
				v_field[ y ][ x ] = get_player_field( turn )[ y ][ x ];
			}
		}
		if( !( nh - 2 >= 0 ) ) return;
		g.fillStyle = '#e3edf7';
		if( v_field[ nh - 2 ][ nw - 1 ] == 0 ){
			cand_position.push( [ turn ? nw - 1 : ( MAX_LENGTH - ( nw - 1 ) - 1 ), turn ? nh - 2 : ( MAX_LENGTH - ( nh - 2 ) - 1 ) ] );
			g.fillRect( ( turn ? nw - 1 : MAX_LENGTH - ( nw - 1 ) - 1 ) * BLOCK_SIZE, ( turn ? nh - 2 : MAX_LENGTH - ( nh - 2 ) - 1 ) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE );
		}
		if( v_field[ nh - 2 ][ nw + 1 ] == 0 ){
			cand_position.push( [ ( turn ? nw + 1 : MAX_LENGTH - ( nw + 1 ) - 1 ), ( turn ? nh - 2 : MAX_LENGTH - ( nh - 2 ) - 1 ) ] );
			g.fillRect( ( turn ? nw + 1 : MAX_LENGTH - ( nw + 1 ) - 1 ) * BLOCK_SIZE, ( turn ? nh - 2 : MAX_LENGTH - ( nh - 2 ) - 1 ) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE );
		}
	}
	const select_kou = ( w, h ) => {
		let nw = ( turn ? w : MAX_LENGTH - w - 1 );
		let nh = ( turn ? h : MAX_LENGTH - h - 1 );
		for( let y = 0;y < MAX_LENGTH;y ++ ){ 
			for( let x = 0;x < MAX_LENGTH;x ++ ){
				v_field[ y ][ x ] = get_player_field( turn )[ y ][ x ];
			}
		}
		g.fillStyle = '#e3edf7';
		for( let y = nh - 1;y >= 0;y -- ){
			if( v_field[ y ][ nw ] != 0 ) break;
			cand_position.push( [ turn ? nw : MAX_LENGTH - nw - 1, turn ? y : MAX_LENGTH - y - 1 ] );
			g.fillRect( ( turn ? nw : MAX_LENGTH - nw - 1 ) * BLOCK_SIZE, ( turn ? y : MAX_LENGTH - y - 1 ) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE );
		}
	}
	const select_hohe = ( w, h ) => {//#hohe
		for( let y = 0;y < MAX_LENGTH;y ++ ){
			for( let x = 0;x < MAX_LENGTH;x ++ ){
				v_field[ y ][ x ] = get_player_field( turn )[ y ][ x ];
			}
		}
		g.fillStyle = '#e3edf7';
		if( turn ){
			if( !( h - 1 >= 0 ) ) return;
			if( v_field[ h - 1 ][ w ] != 0 ) return;
			cand_position.push( [ w ,h - 1 ] );
			g.fillRect( w * BLOCK_SIZE, ( h - 1 ) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE );
		}else{
			if( !( h + 1 <= 8 ) ) return;
			if( v_field[ ( MAX_LENGTH - h - 1 ) - 1 ][ MAX_LENGTH - w - 1 ] != 0 ) return;
			cand_position.push( [ ( MAX_LENGTH - ( MAX_LENGTH - w - 1 ) - 1 ), ( MAX_LENGTH - ( MAX_LENGTH - h - 1 - 1 ) - 1 ) ] );
			g.fillRect( ( MAX_LENGTH - ( MAX_LENGTH - w - 1 ) - 1 ) * BLOCK_SIZE, ( MAX_LENGTH - ( MAX_LENGTH - h - 1 - 1 ) - 1 ) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE );
		}
		//ここから敵の駒との判定
	}
	const select_hi = ( w, h ) => {
		for( let y = 0;y < MAX_LENGTH;y ++ ){
			for( let x = 0;x < MAX_LENGTH;x ++ ){
				v_field[ y ][ x ] = get_player_field( turn )[ y ][ x ];
			}
		}
		g.fillStyle = '#e3edf7';
		for( let x = w - 1;x >= 0;x -- ){
			if( v_field[ h ][ x ] ) break;
			cand_position.push( [ x, h ] );
			g.fillRect( x * BLOCK_SIZE, h * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE );
		}
		for( let y = h - 1;y >= 0;y -- ){
			if( v_field[ y ][ w ] != 0 ) break;
			cand_position.push( [ w, y ] );
			g.fillRect( w * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE );
		}
		for( let x = w + 1;x <= 8;x ++ ){
			if( v_field[ h ][ x ] != 0 ) break;
			cand_position.push( [ x, h ] );
			g.fillRect( x * BLOCK_SIZE, h * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE );
		}
		for( let y = h + 1;y <= 8;y ++ ){
			if( v_field[ y ][ w ] != 0 ) break;
			cand_position.push( [ w, y ] );
			g.fillRect( w * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE );
		}
	}
	const select_kaku = ( w, h ) => {
		let nx = w;
		let ny = h;
		for( let y = 0;y < MAX_LENGTH;y ++ ){
			for( let x = 0;x < MAX_LENGTH;x ++ ){
				v_field[ y ][ x ] = get_player_field( turn )[ y ][ x ];
			}
		}
		g.fillStyle = '#e3edf7';	
		for( let y = h - 1;y >= 0;y -- ){//左上
			nx --;
			if( !( nx >= 0 ) ) break;
			if( v_field[ y ][ nx ] != 0 ) break;
			cand_position.push( [ nx, y ] );
			g.fillRect( nx * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE );
		}
		nx = w;
		for( let y = h + 1;y <= 8;y ++ ){//左下
			nx --;
			if( !( nx >= 0 ) ) break;
			if( v_field[ y ][ nx ] != 0 ) break;
			cand_position.push( [ nx, y ] );
			g.fillRect( nx * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE );
		}
		for( let x = w + 1;x <= 8;x ++){//右上
			ny --;
			if( !( ny >= 0 ) ) break;
			if( v_field[ ny ][ x ] != 0 ) break;
			cand_position.push( [ x, ny ] );
			g.fillRect( x * BLOCK_SIZE, ny * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE );
		}
		ny = h;
		for( let x = w + 1;x >= 0;x ++ ){//右下
			ny ++;
			if( !( ny <= 8 ) ) break;
			if( v_field[ ny ][ x ] != 0 ) break;
			cand_position.push( [ x, ny ] );
			g.fillRect( x * BLOCK_SIZE, ny * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE );
		}
	}
	const select = ( n, w, h ) => {
		cand_position = [];
		ms_position = [];
		//ここでクリックされた位置が敵駒とかぶっていないかチェックする
		switch( n ){
			case 1:
				select_ou_gyoku( w, h );
				break;
			case 2:
				select_ou_gyoku( w, h );
				break;
			case 3:
				select_kin( w, h );
				break;
			case 4:
				select_gin( w, h );
				break;
			case 5:
				select_kei( w, h );
				break;
			case 6:
				select_kou( w, h );
				break;
			case 7:
				select_hohe( w, h );
				break;
			case 8:
				select_hi( w, h );
				break;
			case 9:
				select_kaku( w, h );
				break;
		}
		ms_position = [ w, h ];
	}
	const move = ( bf, af ) => {//駒を取った時の処理
		if( turn ){//参考演算子使いましょう
			get_player_field( turn )[ af[ 1 ] ][ af[ 0 ] ] = get_player_field( turn )[ bf[ 1 ] ][ bf[ 0 ] ];
			get_player_field( turn )[ bf[ 1 ] ][ bf[ 0 ] ] = 0;
			if( get_player_field( !turn )[ MAX_LENGTH - af[ 1 ] - 1 ][ MAX_LENGTH - af[ 0 ] - 1 ] == 0 ) return;//p1とp2の駒がかぶらなかった
			get_player_koma( turn ).push( get_player_field( !turn )[ MAX_LENGTH - af[ 1 ] - 1 ][ MAX_LENGTH - af[ 0 ] - 1 ] );//とられた駒を相手の持ち駒に追加
			get_player_field( !turn )[ MAX_LENGTH - af[ 1 ] - 1 ][ MAX_LENGTH - af[ 0 ] - 1 ] = 0;//とられた場所を0にする
		}else{
			get_player_field( turn )[ MAX_LENGTH - af[ 1 ] - 1 ][ MAX_LENGTH - af[ 0 ] - 1 ] = get_player_field( turn )[ MAX_LENGTH - bf[ 1 ] - 1 ][ MAX_LENGTH - bf[ 0 ] - 1 ];
			get_player_field( turn )[ MAX_LENGTH - bf[ 1 ] - 1 ][ MAX_LENGTH - bf[ 0 ] - 1 ] = 0;
			if( get_player_field( !turn )[ af[ 1 ] ][ af[ 0 ] ] == 0 ) return;
			get_player_koma( turn ).push( get_player_field( !turn )[ af[ 1 ] ][ af[ 0 ] ] );
			get_player_field( !turn )[ af[ 1 ] ][ af[ 0 ] ] = 0;
		}
	}
	can.onclick = ( e ) => {
		let click_x = 0;//x座標
		let click_y = 0;//y座標
		let move_flg = false;

		for( let y = 0;y < MAX_LENGTH;y ++ ){
			if( y * BLOCK_SIZE <= e.y ){
				click_y = y;
			}
		}
		for( let x = 0;x < MAX_LENGTH;x ++ ){
			if( x * BLOCK_SIZE <= e.x ){
				click_x = x;
			}
		}

		g.clearRect( 0, 0, BLOCK_SIZE * MAX_LENGTH, BLOCK_SIZE * MAX_LENGTH );//画面のクリア
		for( i = 0;i < cand_position.length;i ++ ){
			if( cand_position[ i ][ 0 ] == click_x && cand_position[ i ][ 1 ] == click_y ){//候補から座標が一致した場所に駒を置く
				move( ms_position, [ click_x, click_y ] );
				move_flg = true;
				cand_position = [];
				//turn = !turn;
				break;
			}
		}
		if( !move_flg ) select( get_player_field( turn )[ turn ? click_y : MAX_LENGTH - click_y - 1 ][ turn ? click_x : MAX_LENGTH - click_x - 1 ], click_x, click_y );//ターン処理に変える
		//描画
		draw_koma();
		draw_field();
		//magentaの描画( 選択時の色 )
		g.strokeStyle = '#FF00FF';
		g.strokeRect( click_x * BLOCK_SIZE, click_y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE );
	}
	//ここから処理開始
	draw_field();
	draw_koma();
	turn = true;//true = myturn, false = partner
}