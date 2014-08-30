
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

function unify_col(col)
{
	var max=0;
	for(var i in col)if(col[i]>max)max=col[i];
	if(max>0)for(var i in col)col[i]/=max;
	return col;
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

function feedforward(fftdata){
	var a1=new Float32Array(513+1);
	a1[0]=1;
	var newcol=unify_col(fftdata);
	var norcol=apply_normalization(newcol);
	a1.subarray(1).set(norcol);
	var z2=matmul(theta_1,a1);
	var a2=new Float32Array(40+1);
	a2[0]=1;
	a2.subarray(1).set(sigmoid_col(z2));
	var z3=matmul(theta_2,a2);
	return sigmoid_col(z3);
}

function calc_timbre_name(fftdata){
	var nnresult=feedforward(fftdata);
	console.log('nn result:',nnresult,nnresult.length);
	var maxi=0;
	for(var i in nnresult)
		if(nnresult[i]>nnresult[maxi])maxi=i;
		console.log('maxi:',maxi,nnresult[maxi],timbre_list[maxi]);
	return timbre_list[maxi];
}