WAVGEN={
	sampleps:44100,
	wavSize:16,//2 bytes per sample
	beatspm:108,
	amplitude:3000,
	frnum2hz:function(frnum){
		//440hz = 48
		frnum-=48;
		return 440*Math.pow(2,frnum/12);
	},
	_arrayBufferToBase64:function( buffer ) {
		var binary = ''
		var bytes = new Uint8Array( buffer )
		var len = bytes.byteLength;
		for (var i = 0; i < len; i++) {
			binary += String.fromCharCode( bytes[ i ] )
		}
		return window.btoa( binary );
	},
	generateSingleScore:function(amplitude,freq,samplecnt){
		var pack=function(p){
			var plateau_start=0.1;
			var plateau_end=0.7;
			if(p<plateau_start){
				//0..start
				return 0.5-0.5*Math.cos(Math.PI*(p/plateau_start));
			}
			else if(p>plateau_end){
				return 0.5-0.5*Math.cos(Math.PI*( (1-p)/(1-plateau_end)  ));
			}
			else return 1.0;
		}
		
		var thisWave=new ArrayBuffer(2*samplecnt);
		var dv=new DataView(thisWave,0);
		for(i=0;i<samplecnt;i++)
		{
			var sample=pack(i/samplecnt)*amplitude*
			Math.sin((i/this.sampleps)*(2*Math.PI*freq));
			dv.setInt16(i*2,Math.floor(sample),1);
		}
		return thisWave;
	},
	saveSingleScore_rawbuffer:function(frnum,second){
		second=second||1;
		var hz=this.frnum2hz(frnum);
		var samplecnt=this.sampleps*second;
		var contentlength=2*samplecnt;
		var file=new ArrayBuffer(contentlength+44);
		var headdv=new DataView(file);
		
		var riff_header="52494646FFFFFFFF57415645666D7420100000000100010044AC000010B102000200100064617461FFFFFFFF".match(/../g).map(function(s){return parseInt(s,16);});
		
		for(var i=0;i<44;i++)
			headdv.setUint8(i,riff_header[i]);
		headdv.setUint32(40,contentlength,true);
		headdv.setUint32(4,contentlength+36,true);
		
		var contentdv=new DataView(file,44);
		
		var wavebuffer=this.generateSingleScore(this.amplitude,hz,samplecnt);
		var wavedv=new DataView(wavebuffer);
		for(i=0;i<samplecnt;i++)
		{
			contentdv.setInt16(i*2,
				 contentdv.getInt16(i*2,1)+
				 wavedv.getInt16(i*2,1)
			,1);
		}
		delete wavedv;delete wavebuffer;
		
		delete headdv;
		delete contentdv;
		return file;
	},
	buffer2b64src:function(buffer){
		var b64=this._arrayBufferToBase64(buffer);
		return "data:audio/wav;base64,"+b64;
	},
	buffer2blobsrc:function(buffer){
		//faster implementation with blob url
	},
	//Read the scores and save into wav file.
	saveScoreSequence:function(scores)
	{
	
	}
	
}