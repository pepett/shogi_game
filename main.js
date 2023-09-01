/*
	1:王
	2:玉
	3:金将
	4:銀将
*/

window.onload = () => {
	const can = document.getElementById( 'can' );
	const g = can.getContext( '2d' );
	
	const MAX_LENGTH = 9;
	const BLOCK_SIZE = 90;

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
		[ 6,5,4,3,1,3,4,5,6 ],
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
		for( let y = 0;y < MAX_LENGTH;y ++ ){
			for( let x = 0;x < MAX_LENGTH;x ++ ){
				if( field[ y ][ x ] == 0 ) continue;
				const img = new Image();
				img.src = './shogi_img/p1_' + field[ y ][ x ].toString() + '.png';
				img.onload = ()=>{ g.drawImage( img, x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE ); }
			}
		}
		/*for( let y = 0;y < MAX_LENGTH;y ++ ){
			for( let x = 0;x < MAX_LENGTH;x ++ ){
				if( player_1_field[ y ][ x ] == 0 ) continue;
				const img = new Image();
				img.src = './shogi_img/p1_' + player_1_field[ y ][ x ].toString() + '.png';
				img.onload = () => { g.drawImage( img, x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE ); }
			}
		}*/
	}
	const execute = ()=>{
		for( let y = 0;y < MAX_LENGTH;y ++ ){
			for( let x = 0;x < MAX_LENGTH;x ++ ){
				field[ y ][ x ] = v_field[ y ][ x ];
			}
		}
	}
	const select_ou_gyoku = ( w, h ) => {
		for( let y = 0;y < MAX_LENGTH;y ++ ){
			for( let x = 0;x < MAX_LENGTH;x ++ ){
				v_field[ y ][ x ] = field[ y ][ x ];
			}
		}
		for( let y = h - 1;y < h + 2;y ++ ){
			if( !( y >= 0 && y <= 8 ) ) continue;
			for( let x = w - 1;x < w + 2;x ++ ){
				if( !( x >= 0 && x <= 8 ) ) continue;
				if( v_field[ y ][ x ] != 0 ) continue;
				cand_position.push( [ x, y ] );
				g.fillStyle = '#e3edf7';
				g.fillRect( x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE );
			}
		}

		//ここから敵の駒との判定
	}
	const select_kin = ( w, h ) => {
		for( let y = 0;y < MAX_LENGTH;y ++ ){
			for( let x = 0;x < MAX_LENGTH;x ++ ){
				v_field[ y ][ x ] = field[ y ][ x ];
			}
		}
		for( let y = h - 1;y < h + 2;y ++ ){
			if( !( y >= 0 && y <= 8 ) ) continue;
			for( let x = w - 1;x < w + 2;x ++ ){
				if( !( x >= 0 && x <= 8 ) ) continue;
				if( y == h + 1 && x != w ) continue;
				if( v_field[ y ][ x ] != 0 ) continue;
				cand_position.push( [ x, y ] );
				g.fillStyle = '#e3edf7';
				g.fillRect( x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE );
			}
		}
	}
	const select_gin = ( w, h ) => {
		for( let y = 0;y < MAX_LENGTH;y ++ ){
			for( let x = 0;x < MAX_LENGTH;x ++ ){
				v_field[ y ][ x ] = field[ y ][ x ];
			}
		}
		for( let y = h - 1;y < h + 2;y ++ ){
			if( !( y >= 0 && y <= 8 ) ) continue;
			if( y == h ) continue;
			for( let x = w - 1;x < w + 2;x ++ ){
				if( !( x >= 0 && x <= 8 ) ) continue;
				if( y != h - 1 && x == w ) continue;
				if( v_field[ y ][ x ] != 0 ) continue;
				cand_position.push( [ x, y ] );
				g.fillStyle = '#e3edf7';
				g.fillRect( x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE );
			}
		}
	}
	const select_kei = ( w, h ) => {
		for( let y = 0;y < MAX_LENGTH;y ++ ){
			for( let x = 0;x < MAX_LENGTH;x ++ ){
				v_field[ y ][ x ] = field[ y ][ x ];
			}
		}
		if( !( h - 2 >= 0 ) ) return;
		g.fillStyle = '#e3edf7';
		if( field[ h - 2 ][ w - 1 ] == 0 ){
			cand_position.push( [ w - 1, h - 2 ] );
			g.fillRect( ( w - 1 ) * BLOCK_SIZE, ( h - 2 ) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE );
		}
		if( field[ h - 2 ][ w + 1 ] == 0 ){
			cand_position.push( [ w + 1, h - 2 ] );
			g.fillRect( ( w + 1 ) * BLOCK_SIZE, ( h - 2 ) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE );
		}
	}
	const select_kou = ( w, h ) => {
		for( let y = 0;y < MAX_LENGTH;y ++ ){
			for( let x = 0;x < MAX_LENGTH;x ++ ){
				v_field[ y ][ x ] = field[ y ][ x ];
			}
		}
		g.fillStyle = '#e3edf7';
		for( let y = h - 1;y >= 0;y -- ){
			//if( !( y >= 0 ) ) break;
			if( field[ y ][ w ] != 0 ) break;
			cand_position.push( [ w, y ] );
			g.fillRect( w * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE );
		}
	}
	const select_hohe = ( w, h ) => {
		for( let y = 0;y < MAX_LENGTH;y ++ ){
			for( let x = 0;x < MAX_LENGTH;x ++ ){
				v_field[ y ][ x ] = field[ y ][ x ];
			}
		}
		if( !( h - 1 >= 0 ) ) return;
		if( v_field[ h - 1 ][ w ] != 0 ) return;
		cand_position.push( [ w ,h - 1 ] );
		g.fillStyle = '#e3edf7';
		g.fillRect( w * BLOCK_SIZE, ( h - 1 ) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE );

		//ここから敵の駒との判定
	}
	const select_hi = ( w, h ) => {
		for( let y = 0;y < MAX_LENGTH;y ++ ){
			for( let x = 0;x < MAX_LENGTH;x ++ ){
				v_field[ y ][ x ] = field[ y ][ x ];
			}
		}
		g.fillStyle = '#e3edf7';
		for( let x = w - 1;x >= 0;x -- ){
			if( field[ h ][ x ] ) break;
			cand_position.push( [ x, h ] );
			g.fillRect( x * BLOCK_SIZE, h * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE );
		}
		for( let y = h - 1;y >= 0;y -- ){
			if( field[ y ][ w ] != 0 ) break;
			cand_position.push( [ w, y ] );
			g.fillRect( w * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE );
		}
		for( let x = w + 1;x <= 8;x ++ ){
			if( field[ h ][ x ] != 0 ) break;
			cand_position.push( [ x, h ] );
			g.fillRect( x * BLOCK_SIZE, h * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE );
		}
		for( let y = h + 1;y <= 8;y ++ ){
			if( field[ y ][ w ] != 0 ) break;
			cand_position.push( [ w, y ] );
			g.fillRect( w * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE );
		}
	}
	const select_kaku = ( w, h ) => {
		let nx = w;
		let ny = h;
		for( let y = 0;y < MAX_LENGTH;y ++ ){
			for( let x = 0;x < MAX_LENGTH;x ++ ){
				v_field[ y ][ x ] = field[ y ][ x ];
			}
		}
		g.fillStyle = '#e3edf7';	
		for( let y = h - 1;y >= 0;y -- ){//左上
			nx --;
			if( !( nx >= 0 ) ) break;
			if( field[ y ][ nx ] != 0 ) break;
			cand_position.push( [ nx, y ] );
			g.fillRect( nx * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE );
		}
		nx = w;
		for( let y = h + 1;y <= 8;y ++ ){//左下
			nx --;
			if( !( nx >= 0 ) ) break;
			if( field[ y ][ nx ] != 0 ) break;
			cand_position.push( [ nx, y ] );
			g.fillRect( nx * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE );
		}
		for( let x = w + 1;x <= 8;x ++){//右上
			ny --;
			if( !( ny >= 0 ) ) break;
			if( field[ ny ][ x ] != 0 ) break;
			cand_position.push( [ x, ny ] );
			g.fillRect( x * BLOCK_SIZE, ny * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE );
		}
		ny = h;
		for( let x = w + 1;x >= 0;x ++ ){//右下
			ny ++;
			if( !( ny <= 8 ) ) break;
			if( field[ ny ][ x ] != 0 ) break;
			cand_position.push( [ x, ny ] );
			g.fillRect( x * BLOCK_SIZE, ny * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE );
		}
	}
	const select = ( n, w, h ) => {
		cand_position = [];
		ms_position = [];
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
	const move = ( bf, af ) => {
		for( let y = 0;y < MAX_LENGTH;y ++ ){
			for( let x = 0;x < MAX_LENGTH;x ++ ){
				v_field[ y ][ x ] = field[ y ][ x ];
			}
		}
		v_field[ af[ 1 ] ][ af[ 0 ] ] = v_field[ bf[ 1 ] ][ bf[ 0 ] ];
		v_field[ bf[ 1 ] ][ bf[ 0 ] ] = 0;
		execute();
	}
	draw_field();
	draw_koma();
	can.onclick = ( e ) => {
		let click_x = 0;
		let click_y = 0;
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

		g.clearRect( 0, 0, BLOCK_SIZE * MAX_LENGTH, BLOCK_SIZE * MAX_LENGTH );
		for( i = 0;i < cand_position.length;i ++ ){
			if( cand_position[ i ][ 0 ] == click_x && cand_position[ i ][ 1 ] == click_y ){
				move( ms_position, [ click_x, click_y ] );
				move_flg = true;
				cand_position = [];
				break;
			}
		}
		if( !move_flg ) select( field[ click_y ][ click_x ], click_x, click_y );
		draw_koma();
		draw_field();
		g.strokeStyle = '#FF00FF';
		g.strokeRect( click_x * BLOCK_SIZE, click_y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE );
	}
}