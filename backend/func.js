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
	
	saveSingleScore:function(frnum,second){
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
		for(i=0;i<samplecnt;i++)
		{
			var sample=this.amplitude*
			Math.sin((i/this.sampleps)*(2*Math.PI*hz));
			contentdv.setInt16(i*2,Math.floor(sample),1);
		}
		
		var b64file=this._arrayBufferToBase64(file);
		
		return "data:audio/wav;base64,"+b64file;
	
	},
	//Read the scores and save into wav file.
	saveScoreSequence:function(scores)
	{
	
	}
	
}