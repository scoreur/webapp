/*
	Simple JS Queuing library, version 0.0, date 2014-08-23.
	Copyleft @chenxiaoqino; Published under WTFPL.
*/
QUEUE=function(callback){
	var queue={
		length:0,
		onSuccess:callback,
		taskCompleted:function(){
			queue.length--;
			if(!queue.length)
				queue.onSuccess();
		},
		newTask:function(){
			queue.length++;
			return queue.taskCompleted;
		}
	}
	this.newTask=queue.newTask;
	//this.onError, this.taskError....
}