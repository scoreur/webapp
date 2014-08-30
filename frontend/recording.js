RECORDER={
	sampleps:0,
	ctx:(function(){
		var ctx=new (window.AudioContext || window.webkitAudioContext)();
		this.sampleps=ctx.sampleRate;
		return ctx;
	})(),
	sourceNode:null,
	processorNode:null,
	initialize:function(callback,blocksize){
	blocksize=1 << Math.floor(Math.log(blocksize)/Math.LN2);
	if(!(blocksize>=128))blocksize=1024;
	this.processorNode=this.ctx.createScriptProcessor(blocksize);
	this.processorNode.connect(this.ctx.destination);
	var _this=this;
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
		navigator.getUserMedia( {audio:true}, function(stream){
			_this.sourceNode = _this.ctx.createMediaStreamSource(stream);	
			if(typeof callback=='function')callback();
			console.log('gum ok',stream);
		} ,function(error){
			console.log(error);
			alert('get user media error!');
		});
	},
	startRecording:function(dataCallback){
		this.processorNode.onaudioprocess=function(audioProcessingEvent){
			var inputBuffer = audioProcessingEvent.inputBuffer;
			var Data = inputBuffer.getChannelData(0);
			var d2;
			if(inputBuffer.numberOfChannels==2)d2=inputBuffer.getChannelData(1);
			dataCallback(Data,d2);
		}
		this.sourceNode.connect(this.processorNode);
	},
	endRecording:function(){
		this.sourceNode.disconnect();
		this.processorNode.onaudioprocess=null;
	}
}