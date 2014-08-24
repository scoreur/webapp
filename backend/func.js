window.WAVEFORM={
	piano:[1,0.5,0.3,0.08,0,0,0,0,0.04],
	smule:[1,0.5],
	sine:[1]
}
MP3ENCODE={//A simple wrapper class for synchronously invoking libmp3lame.js
	float32tomp3:function(buff)
		{
			var data=[];
			var mp3codec=Lame.init();
			Lame.set_in_samplerate(mp3codec,44100);
			Lame.set_out_samplerate(mp3codec,44100);
			Lame.set_num_channels(mp3codec,2);
			Lame.set_mode(mp3codec,Lame.JOINT_STEREO);
			//Lame.set_num_channels(mp3codec,1);
			//Lame.set_mode(mp3codec,Lame.MONO);
			//Lame.set_num_samples(buff.length);
			Lame.set_bitrate(mp3codec,128);
			Lame.init_params(mp3codec);
			
			var blocksize=8192;
			var slices=Math.floor(buff.length/blocksize);
			for(var i=0;i<slices;i++)
			{
				console.log('encoding:',Math.floor(i*blocksize/buff.length)+'%');
				var block=buff.subarray(blocksize*i,blocksize*(i+1));
				var datum=Lame.encode_buffer_ieee_float(mp3codec,block,block);
				data.push(datum);
			}
			var block=buff.subarray(blocksize*slices,buff.length);
			var datum=Lame.encode_buffer_ieee_float(mp3codec,block,block);
			data.push(datum);
			datum=Lame.encode_flush(mp3codec);
			data.push(datum);
			
			var totalsize=data.map(function(d){return d.size;}).reduce(function(a,b){return a+b;});
			var output_buffer=new ArrayBuffer(totalsize),output_array=new Uint8Array(output_buffer);
			var ptr=0;
			for(var i=0;i<data.length;i++){
				var slice_arr=output_array.subarray(ptr,ptr+data[i].size);
				slice_arr.set(data[i].data);
				ptr+=slice_arr.length;
			}
			return output_buffer;
		} 	
	wavbuff2float32:function(file)
		{
			var dv=new DataView(file,44), samplecnt=(file.byteLength-44)/2;
			var out=new Float32Array(samplecnt);
			for(var i=0;i<samplecnt;i++)
				out[i]=dv.getInt16(i*2,1)/32768.0;
			return out;
		}
	wavbuff2mp3:function(file){
			return this.float32tomp3(wavbuff2float32(file));
		}
}


WAVGEN={
	use_callback:"WARNING: a callback function is detected and data has been forwarded.",
	use_regular_waveform_data:0,//replace waveform data by database data
	sampleps:44100,
	wavSize:16,//2 bytes per sample
	amplitude:3000,
	frnum2hz:function(frnum){
		//440hz = 48
		frnum-=48;
		return 440*Math.pow(2,frnum/12);
	},
	pack:function(p){
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
		var pack=this.pack;
		
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
		var blob=new Blob([buffer],{type:"audio/wav"});
		return URL.createObjectURL(blob);
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
	generateScoreSequence_rawbuffer:function(unit_ms,scores,waveform,callback)
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
		
		if(typeof callback=='function'){
			setTimeout(function(){
				callback(output_buffer);
			},0);
			return this.use_callback;
		}
		return output_buffer;
	},
	saveScoreSequences_rawbuffer:function(unit_ms,chorus,callback)
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
		
		if(typeof callback=='function'){
			setTimeout(function(){
				callback(output_buffer);
			},0);
			return this.use_callback;
		}
		return output_buffer;
	},
	RENDER_WAV:function(data,callback){
		var unit_ms=data.time_unit/48;
		if(this.use_regular_waveform_data)
			for(var i=0;i<data.chorus.length;i++)
				if(WAVEFORM[data.chorus[i][0]])
					data.chorus[i][2]=WAVEFORM[data.chorus[i][0]];
		return this.saveScoreSequences_rawbuffer(unit_ms,data.chorus,callback);
	},
	RENDER_F32:function(data,callback){
		var unit_ms=data.time_unit/48;
		if(this.use_regular_waveform_data)
			for(var i=0;i<data.chorus.length;i++)
				if(WAVEFORM[data.chorus[i][0]])
					data.chorus[i][2]=WAVEFORM[data.chorus[i][0]];
		var _this=this;
		function calc()
		{
			var file=this.saveScoreSequences_rawbuffer(unit_ms,data.chorus);
			var dv=new DataView(file,44), samplecnt=(file.byteLength-44)/2;
			var out=new Float32Array(samplecnt);
			for(var i=0;i<samplecnt;i++)
				out[i]=dv.getInt16(i*2,1)/32768.0;
			if(callback)
			{
				setTimeout(function(){callback(out);},0);
				return this.use_callback;
			}
			else return out;
		}
		if(typeof callback=='function'){
			setTimeout(function(){
				calc.apply(_this);
			},0);
			return this.use_callback;
		}
		else{
			callback=false;
			return calc.apply(_this);
		}
	},
	SAVE:function(data,filename){
		if(!filename)filename="scores";
		if(!/\.wav$/.test(filename))filename+='.wav';
		var bin=this.RENDER_WAV(data);
		var blob=new Blob([bin],{type:"audio/wav"});
		setTimeout(function(){saveAs(blob,filename);},0);
	},
	PLAY:function(data){
		var buffer=this.RENDER_WAV(data);
		try{
			var src=this.buffer2blobsrc(buffer);
		}
		catch(e)
		{
			var src=this.buffer2b64src(buffer);
		}
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
WAVGEN_NEW={
	use_regular_waveform_data:0,
	sampleps:44100,
	warning:"WARNING: YOU SHOULD NOT SEE THIS.\nThis function is asynchronous, please use a callback function to obtain the returning data.",
	nocallback:"ERROR: You should provide a callback function to receive returning data.",
	pack:function(p){
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
	},
	ctx:(function(){
		var ctx=new (window.AudioContext || window.webkitAudioContext)();
		ctx.sampleRate=this.sampleps;
		return ctx;
	})(),
	generateSingleScore:function(amplitude,freq,second,callback){
		if(typeof callback!='function')throw this.nocallback;
		var pack=this.pack;
		var octx=new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(1,this.sampleps*second,this.sampleps);
		var g=octx.createGain();
		g.gain.value=amplitude;
		g.connect(octx.destination);
		var s=octx.createOscillator();
		s.frequency.value=freq;
		s.connect(g);
		s.start(0);
		octx.oncomplete=function(d){
			if(!d.returnValue)throw "Octx generation error";
			var arr=d.renderedBuffer.getChannelData(0);
			for(var i=0;i<arr.length;i++)
			{
				arr[i]*=pack(i/arr.length);
			}
			callback(d.renderedBuffer);
		};
		octx.startRendering();
		return this.warning;
	},
	generateSingleScore_waveform:function(amplitude,freq,second,waveform,callback){
		if(typeof callback!='function')throw this.nocallback;
		if(!waveform || waveform.length<=1)waveform=[1];
		var buffers=[];
		var q=new QUEUE(function(){
			//merge buffer
			if(buffers.length<=1)return callback(buffers[0]);
			var cd=[];
			for(var i=0;i<buffers.length;i++)
				cd[i]=buffers[i].getChannelData(0);
			for(var i=1;i<buffers.length;i++)
			for(var l=0;l<cd[0].length;l++)
			{	
					cd[0][l]+=cd[i][l];
			}
			for(var i=1;i<buffers.length;i++){
				delete cd[i];
				delete buffers[i];
			}
			return callback(buffers[0]);
		});
		for(var wfi=0;wfi<waveform.length;wfi++)
		if(waveform[wfi]>0)
		{	
			var taskfinished=q.newTask();
			this.generateSingleScore(amplitude*waveform[wfi],freq*(wfi+1),second,function(b){
				buffers.push(b);
				taskfinished();
			});
		}
		return this.warning;
	},
	_scoreBufferCache:{},
	generateScoreSequencePlayer:function(unit_ms,scores,waveform,callback){
		if(typeof callback!='function')throw this.nocallback;
		var unit_time=unit_ms/1000;//translate to second
		if(waveform.join)
		{
			var waveform_index=waveform.join(',');
			var buffers=this._scoreBufferCache[waveform_index];
			if(!buffers)buffers=this.	_scoreBufferCache[waveform_index]=[];
		}
		else var buffers=[];
		
		var single_note=[];
		var players=[];
		var context=this.ctx;
		var q=new QUEUE(function(){
			for(var i=0;i<scores.length;i++)
			{
				var hz=scores[i][2],duration=unit_time*scores[i][1],start=unit_time*scores[i][0];
				var kwd=hz+'hz,'+Math.floor(duration*1e6)+'us';
				
				var playerNode = context.createBufferSource();
				playerNode.buffer = buffers[kwd];
				playerNode.delay=start;
				playerNode.connect(context.destination); 
				players.push(playerNode);
			}
			var player=function(){
				for(var i=0;i<players.length;i++)
					players[i].start(context.currentTime+players[i].delay);
			}
			callback(player);
		});
		for(var i=0;i<scores.length;i++)
		{
			var hz=scores[i][2],duration=unit_time*scores[i][1],start=unit_time*scores[i][0];
			var kwd=hz+'hz,'+Math.floor(duration*1e6)+'us';
			if(!buffers[kwd])
			{
				var done_c=function(taskfinished,kwd){
					this.done=function(buff){
						buffers[kwd]=buff;
						console.log(lastbuff=buff);
						taskfinished();
					}
				};
				done=new done_c(q.newTask(),kwd);
				this.generateSingleScore_waveform(this.amplitude,hz,duration,waveform,done.done);
			}
		}
		setTimeout(q.newTask(),1);//fire with empty queue!
		return this.warning;
	},
	generateScoreSequencesPlayer:function(unit_ms,chorus,callback){
		if(typeof callback!='function')throw this.nocallback;
		var ssplayers=[];
		var q=new QUEUE(function(){
			console.log('ss all finished',ssplayers);	
			callback(function(){
				ssplayers.map(function(p){p();});	
			});
		});
		for(var i=0;i<chorus.length;i++)
		{
			var instrument=chorus[i];
			var taskFinished=q.newTask();
			var done=function(p){
				ssplayers.push(p);
				taskFinished();
			}
			this.generateScoreSequencePlayer(unit_ms,instrument[1],instrument[2],done);
		}
		return this.warning;
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
	audioBuffer2wav:function(f32data){//Only for mono; stereo to be implemented.
		var bin=new ArrayBuffer(44+f32data.length*2), dv=new DataView(bin,44);
		for(var i=0;i<f32data.length;i++)
			dv.setInt16(i*2,Math.floor(32768*f32data[i]),1);
		this.writeRIFFHeader(bin);
		return bin;
	},
	saveScoreSequences_rawbufferWAV:function(unit_ms,chorus,callback){
		var _this=this;
		this.saveScoreSequences_rawbufferF32(unit_ms,chorus,function(f32){		
			var d=_this.audioBuffer2wav.apply(_this,[f32]);
			callback(d);
		});
	},
	saveScoreSequences_rawbufferF32:function(unit_ms,chorus,callback){
		if(typeof callback!='function')throw this.nocallback;
		var max_time=0;
		for(var i=0;i<chorus.length;i++)
		{
			var scores=chorus[i][1];
			scores.map(function(s){
				if(s[0]+s[1]>max_time)
					max_time=s[0]+s[1];
			});
		}
		console.log('creating octx:',1,this.sampleps*unit_ms/1000*max_time,this.sampleps);
		var octx=new (window.OfflineAudioContext || window.webkitOfflineAudioContext)(1,this.sampleps*unit_ms/1000*max_time,this.sampleps);
		this._lctx=this.ctx;
		this.ctx=octx;
		var ctx_recovery=(function(_this){return function(){
			_this.ctx=_this._lctx;
		}})(this);
		this.generateScoreSequencesPlayer(unit_ms,chorus,function(p){
			p();
			octx.oncomplete=function(d){
				if(!d.returnValue)throw "Octx generation error";
				var buffer=d.renderedBuffer;
				ctx_recovery();
				callback(buffer.getChannelData(0));
			}
			octx.startRendering();
		});
		return this.warning;
	},
	RENDER_WAV:function(data,callback){
		var unit_ms=data.time_unit/48;
		if(this.use_regular_waveform_data)
			for(var i=0;i<data.chorus.length;i++)
				if(WAVEFORM[data.chorus[i][0]])
					data.chorus[i][2]=WAVEFORM[data.chorus[i][0]];
		this.saveScoreSequences_rawbufferWAV(unit_ms,data.chorus,callback);
		return this.warning;
	},
	RENDER_F32:function(data,callback){
		var unit_ms=data.time_unit/48;
		if(this.use_regular_waveform_data)
			for(var i=0;i<data.chorus.length;i++)
				if(WAVEFORM[data.chorus[i][0]])
					data.chorus[i][2]=WAVEFORM[data.chorus[i][0]];
		this.saveScoreSequences_rawbufferF32(unit_ms,data.chorus,callback);
		return this.warning;
	},
	SAVE_WAV:function(data,filename){
		if(!filename)filename="scores";
		if(!/\.wav$/.test(filename))filename+='.wav';
		this.RENDER_WAV(data,function(bin){
			var blob=new Blob([bin],{type:"audio/wav"});
			saveAs(blob,filename);
		});
		return this.warning;
	},
	PLAY:function(data){
		var playnow=function(s){s();}
		var unit_ms=data.time_unit/48;
		if(this.use_regular_waveform_data)
			for(var i=0;i<data.chorus.length;i++)
				if(WAVEFORM[data.chorus[i][0]])
					data.chorus[i][2]=WAVEFORM[data.chorus[i][0]];
		this.generateScoreSequencesPlayer(unit_ms,data.chorus,playnow);
	}
}
WAVPLAY={
	//An object to create real-time sound for interaction.
	ctx:(function(){
		var ctx=new (window.AudioContext || window.webkitAudioContext)();
		ctx.sampleRate=this.sampleps;
		return ctx;
	})(),
	frnum2hz:function(frnum){
		//440hz = 48
		frnum-=48;
		return 440*Math.pow(2,frnum/12);
	},
	sourceNodes:[],
	gainNodes:[],
	addFreq:function(hz){
		if(this.sourceNodes[hz])return this.sourceNodes[hz];
		var osc=this.ctx.createOscillator();
		osc.type='sine';
		osc.frequency.value=hz;
		osc.numberOfOutputs=1e9;
		osc.start();
		return this.sourceNodes[hz]=osc;
	},
	createGain:function(hz,waveform){
		if(!waveform || waveform.length<=1)waveform=[1];
		var kwd=hz+'hz,'+waveform.join(',')
		if(this.gainNodes[kwd])return this.gainNodes[kwd];
		
		var out_gain=this.ctx.createGain();
		out_gain.gain.value=0;
		for(var wfi=0;wfi<waveform.length;wfi++)
		{
			var intm_gain=this.ctx.createGain();
			intm_gain.gain.value=waveform[wfi];
			this.addFreq(hz).connect(intm_gain);
			intm_gain.connect(out_gain);
		}
		return this.gainNodes[kwd]=out_gain;
	},
	gradient_delay_1:3,
	gradient_delay_2:1,
	score_start:function(frnum,waveform){
		var gain=this.createGain(this.frnum2hz(frnum),waveform);
		gain.connect(this.ctx.destination);
		//gain.gain.value=1;//smooth? 
		gain.gradient_phase=1;
		var delay=this.gradient_delay_1;
		var adj=function(){//simple linear adjustment
			if(gain.gradient_phase==1)
			{
				gain.gain.value+=0.1;//gain.gain.value=(1+gain.gain.value)/2;
				setTimeout(adj,delay);
				if(gain.gain.value>0.99){gain.gradient_phase=0;gain.gain.value=1;}
			}
		}
		setTimeout(adj,delay);
	},
	score_end:function(frnum,waveform){
		var gain=this.createGain(this.frnum2hz(frnum),waveform);
		//gain.gain.value=0;//smooth? 
		gain.gradient_phase=-1;
		var delay=this.gradient_delay_2;
		var adj=function(){//simple linear adjustment
			if(gain.gradient_phase==-1)
			{
				gain.gain.value-=0.1;//gain.gain.value=(1+gain.gain.value)/2;
				setTimeout(adj,delay);
				if(gain.gain.value<0.01){gain.gradient_phase=0;gain.gain.value=0;}
			}
		}
		setTimeout(adj,delay);
	},
	end_all:function(){
		var gn=this.gainNodes;
		for(i in gn)
		{
			var gain=gn[i];
			(function(gain){
				var delay=1;
				gain.gradient_phase=-2;
				var adj=function(){//simple exponential adjustment
					if(gain.gradient_phase==-2)
					{
						gain.gain.value*=0.8;//gain.gain.value=(1+gain.gain.value)/2;
						setTimeout(adj,delay);
						if(gain.gain.value<0.01){gain.gradient_phase=0;gain.gain.value=0;}
					}
				}
				setTimeout(adj,delay);
			})(gn[i]);
		}
	},
	stop_all:function(){
		var gn=this.gainNodes;
		for(i in gn)
			gn[i].gain.value=0;
	}
}