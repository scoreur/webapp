LINER={
	lines:[],
	settings:{
		lineheight:12,
		scorewidth:22,
		scoresize:16,
		beatsperseq:4,
		seqperline:12,
		top_line:8,
		initial_padding:100,
	},
	/*
	images:{
		ROOTURL:'./resources/staff/',
		bass_clef:{0,-30},
		
	},*/
	line_conversion:function(frnum){
		//39 -> origin,
		//0,2,4,5,7,9,11,12
		var frn2linepos=[0,0,1,1,2,3,3,4,4,5,5,6];//half line
		//var frn2fix=[0,1,0,1,0,0,1,0,1,0,1,0];
		
		frnum-=39;
		var eig=Math.floor(frnum/12);
		var diff=frnum-12*eig;
		return 3.5*eig+0.5*frn2linepos[diff];
	},
	height_conversion:function(line_num){
		return LINER.settings.lineheight * (LINER.settings.top_line-line_num);
	},
	coordinate_conversion:function(time,frnum)
	{
		var line=LINER.line_conversion(frnum);
		var height=LINER.height_conversion(line);
		var x=LINER.settings.initial_padding+LINER.settings.scorewidth*time;
		return [height,x];
	},
	initialize:function(elem)
	{
		if(typeof elem == "string")
			elem=document.getElementById(elem);
		if(!elem)return;
		
		var lineend=LINER.settings.initial_padding+LINER.settings.scorewidth*LINER.settings.beatsperseq*LINER.settings.seqperline;
		
		elem.svg=SVG(elem);
		
		for(var i=1;i<=5;i++)
		{
			var lineheight=LINER.height_conversion(i);
			elem.svg.line(0,lineheight,lineend,lineheight).stroke('black');
		}
		var low=LINER.height_conversion(1),high=LINER.height_conversion(5);
		for(var i=0;i<LINER.settings.seqperline;i++)
		{
			var x=LINER.settings.initial_padding+LINER.settings.scorewidth*LINER.settings.beatsperseq*i;
			elem.svg.line(x,low,x,high).stroke('grey');
		}
		
		for(var i=-1;i>=-5;i--)
		{
			var lineheight=LINER.height_conversion(i);
			elem.svg.line(0,lineheight,lineend,lineheight).stroke('black');
		}
		var low=LINER.height_conversion(-1),high=LINER.height_conversion(-5);
		for(var i=0;i<LINER.settings.seqperline;i++)
		{
			var x=LINER.settings.initial_padding+LINER.settings.scorewidth*LINER.settings.beatsperseq*i;
			elem.svg.line(x,low,x,high).stroke('grey');
		}
		
		elem.newnote=function(duration){
			var src;
			switch(duration){
				case 1:src='./resources/staff/quarternote.png';break;
				case 2:
				case 3:src='./resources/staff/halfnote.png';break;
				case 4:src='./resources/staff/fullnote.png';break;
			}
			var img=elem.svg.image(src);
			img.size(LINER.settings.scoresize,LINER.settings.scoresize);
			img.scoredata={duration:duration,cx:0,cy:0};
			return img;
		}
		elem.scores=[];//{time,duration,frnum,svgelem}
		elem.liner={
			addscore:function(score){
				var mysc={
					time:score.time,
					duration:score.duration||1,
					frnum:score.frnum
				};
				mysc.svgelem=elem.newnote(mysc.duration);
				mysc.moveTo=function(time,frnum){
					var pos=LINER.coordinate_conversion(time,frnum);
					mysc.svgelem.center(
						mysc.svgelem.scoredata.cx+pos[1]+LINER.settings.scorewidth/2,
						mysc.svgelem.scoredata.cy+pos[0]
					);
					return mysc.svgelem;
				}
				mysc.moveTo(mysc.time,mysc.frnum);
				elem.scores.push(mysc);
				return mysc;
			},
			addscores:function(scores){
				return scores.map(function(s){elem.liner.addscore(s);});
			},
			listscores:function(){
				return elem.scores;
			}
		};
		
		LINER.lines.push(elem);
		return elem.liner;
	}
}
//todo: drag the note
//todo: draw addition up/down line, draw note tail