WAVEFORM={
	piano:[1,0.5,0.3,0.08,0,0,0,0,0.04],
	smule:[1,0.5],
	sine:[1]
}
WAVGEN={
	use_regular_waveform_data:0,//replace waveform data by database data
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
		if(samplecnt<this.sampleps/freq/10)throw "Strange samplecnt; are you generating a complete waveshape?";
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
	writeRIFFHeader:function(buffer){
		var headdv=new DataView(buffer);
		var contentlength=buffer.byteLength-44;
		var riff_header="52494646FFFFFFFF57415645666D7420100000000100010044AC000010B102000200100064617461FFFFFFFF".match(/../g).map(function(s){return parseInt(s,16);});
		for(var i=0;i<44;i++)
			headdv.setUint8(i,riff_header[i]);
		headdv.setUint32(40,contentlength,true);
		headdv.setUint32(4,contentlength+36,true);
		delete headdv;
	},
	dvinc_Int16:function(main_dv,extra_dv,cnt){
		for(var i=0;i<cnt;i++)
		{
			main_dv.setInt16(i*2,
				 main_dv.getInt16(i*2,1)+
				 extra_dv.getInt16(i*2,1)
			,1);
		}
	},
	saveSingleScore_rawbuffer:function(frnum,second){
		second=second||1;
		var hz=this.frnum2hz(frnum);
		var samplecnt=Math.ceil(this.sampleps*second);
		if(samplecnt<10)throw "Strange duration; are you generating a complete wave?";
		var contentlength=2*samplecnt;
		var file=new ArrayBuffer(contentlength+44);
		
		this.writeRIFFHeader(file);
		var contentdv=new DataView(file,44);
		
		var wavebuffer=this.generateSingleScore(this.amplitude,hz,samplecnt);
		var wavedv=new DataView(wavebuffer);
		this.dvinc_Int16(contentdv,wavedv,samplecnt);
		
		delete wavedv;
		delete wavebuffer;
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
	/*
	Data scructure: 
	{
		time_unit:750,//(ms, 1 standard beat (48 score units), or approximately 1/4800 minute)
		chorus:[
			[
				"piano",
				[[1*12,1*12,440],[2*12,1*12,880],[3*12,2*12,740]], //scores
				[1,0.2,0.2,0.5] //waveform
			],
			[
				"smule",
				[[5*12,1*12,440],[6*12,1*12,740],[7*12,1*12,880]],
				[1]
			]
		]
	}
	*/
	generateScoreSequence_rawbuffer:function(unit_ms,scores,waveform)
	{	
		unit_ms/=1000;//translate to second
		if(!waveform || waveform.length<=1)waveform=[1];
		var unit_sample=unit_ms*this.sampleps;
		var total_time=0;
		for(var i=0;i<scores.length;i++)
		{
			if(total_time<scores[i][0]+scores[i][1])total_time=scores[i][0]+scores[i][1];
		}
		console.log("total time unit:",total_time);
		var total_samples=Math.floor(total_time*unit_sample);
		console.log("total_samples:",total_samples);
		var output_buffer=new ArrayBuffer(total_samples*2+44);
		
		for(var i=0;i<scores.length;i++)
		{
			var hz=scores[i][2], start=Math.floor(unit_sample*scores[i][0]), duration=Math.floor(unit_sample*scores[i][1]);
			console.log('scorer sd:',start,duration);
			for(var wfi=0;wfi<waveform.length;wfi++)
			if(waveform[wfi]>0)
			{
				var note=this.generateSingleScore(this.amplitude*waveform[wfi],hz*(wfi+1),duration);
				var contentdv=new DataView(output_buffer,start*2);
				var wavedv=new DataView(note);
				this.dvinc_Int16(contentdv,wavedv,duration);
			}
		}
		this.writeRIFFHeader(output_buffer);
		return output_buffer;
	},
	saveScoreSequences_rawbuffer:function(unit_ms,chorus)
	{
		var buffers=[];
		for(var i=0;i<chorus.length;i++)
		{
			var instrument=chorus[i];
			buffers.push(
				this.generateScoreSequence_rawbuffer(unit_ms,instrument[1],instrument[2])
			);
		}
		
		var maxlen=0;
		for(var i=0;i<buffers.length;i++)
		{
			if(maxlen<buffers[i].byteLength)maxlen=buffers[i].byteLength;
		}
		console.log('chorus maxlen:',maxlen);
		
		var output_buffer=new ArrayBuffer(maxlen);
		for(var i=0;i<buffers.length;i++)
		{
			var output_dv=new DataView(output_buffer,44);
			var instrument_dv=new DataView(buffers[i],44);
			console.log(output_buffer.byteLength,buffers[i].byteLength,(buffers[i].byteLength)/2-22);
			this.dvinc_Int16(output_dv,instrument_dv,(buffers[i].byteLength)/2-22);
		}
		
		this.writeRIFFHeader(output_buffer);
		return output_buffer;
	},
	RENDER:function(data){
		var unit_ms=data.time_unit/48;
		if(this.use_regular_waveform_data)
			for(var i=0;i<data.chorus.length;i++)
				if(WAVEFORM[data.chorus[i][0]])
					data.chorus[i][2]=WAVEFORM[data.chorus[i][0]];
		return this.saveScoreSequences_rawbuffer(unit_ms,data.chorus);
	},
	PLAY:function(data){
		var src=this.buffer2b64src(this.RENDER(data));
		var el=document.createElement('audio');
		el.onended=function(){
			el.src='';
			document.body.removeChild(el);
			delete el;
		}
		el.autoplay=1;
		el.src=src;
		document.body.appendChild(el);
	}
}