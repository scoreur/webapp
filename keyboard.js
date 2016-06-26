// JavaScript Document


function keyshape(type, pos_x){

	switch(type){
		case 1: case 4: case 6: case 9: case 11://blackkey
			return (pos_x-bw)+',0 '
			+(pos_x+bw)+',0 '
			+(pos_x+bw)+','+(bh)+' '
			+(pos_x-bw)+','+(bh);
		case 0: case 5: case 10://whitenormal
			return (pos_x-ww+bw)+',0 '
			+(pos_x+ww-bw)+',0 '
			+(pos_x+ww-bw)+','+(bh)+' '
			+(pos_x+ww)+','+(bh)+' '
			+(pos_x+ww)+','+(wh)+' '
			+(pos_x-ww)+','+(wh)+' '
			+(pos_x-ww)+','+(bh)+' '
			+(pos_x-ww+bw)+','+(bh);
		break;
		
		case 3: case 8: case -1://whiteleft
			return (pos_x-ww)+',0 '
			+(pos_x+ww-bw)+',0 '
			+(pos_x+ww-bw)+','+(bh)+' '
			+(pos_x+ww)+','+(bh)+' '
			+(pos_x+ww)+','+(wh)+' '
			+(pos_x-ww)+','+(wh);
		
		case 2: case 7://whiteright
		return (pos_x-ww+bw)+',0 '
			+(pos_x+ww)+',0 '
			+(pos_x+ww)+','+(wh)+' '
			+(pos_x-ww)+','+(wh)+' '
			+(pos_x-ww)+','+(bh)+' '
			+(pos_x-ww+bw)+','+(bh);
		break;
		case -2://whitewhole
			return (pos_x-ww)+',0 '
				+(pos_x+ww)+',0 '
				+(pos_x+ww)+','+(wh)+' '
				+(pos_x-ww)+','+(wh);
		break;
		default: return "";
		break;
	}
}

function keycolor(type){
	switch(type){
		case 1: case 4: case 6: case 9: case 11:
			return 'black';
		default:
			return 'white';
	}
}

function keyfreq(frnum){
	return 440*Math.pow(2,(frnum-48)/12);
}

function Bto64( buffer ) {
		var binary = '';
		var bytes = new Uint8Array( buffer );
		var len = bytes.byteLength;
		for (var i = 0; i < len; i++) {
			binary += String.fromCharCode( bytes[ i ] );
		}
		return window.btoa( binary );
}
function envelopeFlute(d){
	var thres = 0.12;
	if( d < thres) 
	    return (1-Math.cos(Math.PI*d/thres))/2;
	if( d > 1 - thres*2) 
		return (1-Math.cos(Math.PI*(1-d)/thres/2))/2;
	return 1;
}
function keysound(frnum, tlen){
	var sampleps = 44100;
	var riff_header = [
	      82, 73, 70, 70,      // 'RIFF'
          255, 255, 255, 255,  // dataSize+36
          87, 65, 86, 69,      // 'WAVE'
          102, 109, 116, 32,   // 'fmt '
          16, 0, 0, 0,         // wavSize:16||18
          1, 0, 1, 0,          // pcm:1, nchannels
          68, 172, 0, 0,       // sampleps:44100=68+172*256
          16, 177, 2, 0,       // Bps(BytesPerSecond)=sampleps*blockAlign
          2, 0, 16, 0,         // BlockAlign, bpsample
          100, 97, 116, 97,    // 'data'
          255, 255, 255, 255];
		  
	var freq = 2*Math.PI*keyfreq(frnum)/sampleps;
	var amp = 4000;
	var samplesize = Math.floor(tlen * sampleps);
	var file=new ArrayBuffer(samplesize*2+44);
	var hv = new DataView(file);
	
	for(var i=0;i<44;i++)
		hv.setUint8(i, riff_header[i]);
	hv.setUint32(40, samplesize*2, true);//little endian
	hv.setUint32(4, samplesize*2+36, true);
	
	for(var i=0; i<samplesize ; ++i)
	{
		var sample = amp * envelopeFlute(i/samplesize)*
		(Math.sin( i * freq)+0.3*Math.sin(i * freq *2)+0.1*Math.sin(i * freq *3) + 0.6*(0.18-frnum/500)*Math.sin(i * freq * 8));
		hv.setInt16(i*2+44, Math.floor(sample), true);
	}
	var snd = Bto64(file);
	delete file;
	delete hv;
	return "data:audio/wav;base64,"+ snd;
		
		
	
	
}
function keyboard_xml(){
	temp = "";
	for(pos_x=ww, i=0;i<88;++i){
	if(i==0)type=-1;
	else if(i==87)type=-2;
	else type = i % 12;
	temp += '<polygon id="key_'+(i)+'" onMouseDown="keydown('+(i)+')" onMouseUp="keyup('+(i)+')" points="'+keyshape(type,pos_x)
  +'" style="fill:'+keycolor(type)+';stroke:gray;stroke-width:1;fill-rule:odd;" />';
  pos_x += ww;
  if(type == 2 || type ==7) pos_x+=ww;
	}
	return temp;
}
