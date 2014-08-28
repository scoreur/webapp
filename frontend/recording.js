RECORDER={
	sampleps:48000,
	ctx:(function(){
		var ctx=new (window.AudioContext || window.webkitAudioContext)();
		ctx.sampleRate=this.sampleps;
		return ctx;
	})(),
	sourceNode:null,
	processorNode:null,
	initialize:function(callback){
	this.processorNode=this.ctx.createScriptProcessor(1024);
	this.processorNode.connect(this.ctx.destination);
	var _this=this;
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
		navigator.getUserMedia( {audio:true}, function(stream){
			_this.sourceNode = _this.ctx.createMediaStreamSource(stream);	
			if(typeof callback=='function')callback();
			console.log('gum ok',stream);
		} ,function(error){
			console.log(error);
			alert('get user medai error!');
		});
	},
	startRecording:function(){
		this.processorNode.onaudioprocess=function(audioProcessingEvent){
			console.log('recording evt:',ape=audioProcessingEvent);
			var inputBuffer = audioProcessingEvent.inputBuffer;
			var Data = inputBuffer.getChannelData(0);
			document.body.innerHTML=real_cfft(Data).join("\n");
		}
		this.sourceNode.connect(this.processorNode);
	},
	endRecording:function(){
		this.sourceNode.disconnect();
		this.processorNode.onaudioprocess=null;
	}
}