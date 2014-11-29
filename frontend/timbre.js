
function matmul(mat,col){
	if(mat[0].length!=col.length)throw "Matrix Multiplication Exception: size does not fit.";
	var ret=new Float32Array(mat.length);
	for(var i in mat){
		for(var j in col)
			ret[i]+=mat[i][j]*col[j];
	}
	return ret;
}

function sigmoid(x){
		return 1/(1.0+Math.pow(Math.E,-x));
}

function sigmoid_col(x){
	for(var i=0;i<x.length;i++)
		x[i]=sigmoid(x[i]);
	return x;
}

function procMax(data){//unify&shift data
	var maxi=0;
	for(var i=0;i<data.length;i++)
		if(data[maxi]<data[i])maxi=i;
	if(data[maxi]>0){
		var nd=new Float32Array(data.length);
		nd.set((data.slice || data.subarray).apply(data,[maxi]));
		//for(var i=0;i<data.length;i++)nd[i]/=data[maxi];
		return nd;
	}
	else return data;
}

function apply_normalization(col){
	for(var i=0;i<513;i++)
	{
		col[i]-=miu[i];
		if(sigma[i]>1e-5)
			col[i]/=sigma[i];
	}
	return col;
}

function nn_test(fftdata){
	var f512=(fftdata.slice || fftdata.subarray).apply(fftdata,[1,513]);
	
	f512=procMax(f512);
	
	f512=apply_normalization(f512);
	
	var f256=matmul(PCA,f512);
	
	var a1=new Float32Array(256+1);
	a1[0]=1;
	a1.subarray(1).set(f256);
	var z2=matmul(theta_1,a1);
	var a2=new Float32Array(80+1);
	a2[0]=1;
	a2.subarray(1).set(sigmoid_col(z2));
	var z3=matmul(theta_2,a2);
	return sigmoid_col(z3);
}

function calc_timbre_name(fftdata){
	var nnresult=nn_test(fftdata);
	//console.log('nn result:',nnresult,nnresult.length);
	var maxi=0;
	for(var i in nnresult)
		if(nnresult[i]>nnresult[maxi])maxi=i;
		//console.log('maxi:',maxi,nnresult[maxi],timbre_list[maxi]);
	return [timbre_list[maxi],nnresult[maxi]];
}