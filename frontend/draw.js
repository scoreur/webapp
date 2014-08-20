LINER={
	lines:[],
	settings:{
		lineheight:12,
		scorewidth:16,
		beatsperseq:4,
		seqperline:12,
		top_line:7.5,
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
			//draw it! image resources!
			//dummy fill:
			var c=new SVG.Color();
			c.b=255;
			c.g=255*(10-duration)/10;
			c.r=255*(duration)/10;
			
			var note=elem.svg.circle(LINER.settings.scorewidth*0.8);
			note.scoredata={duration:duration, cx:0,cy:0};
			note.fill(c);
			return note;
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
//todo: score database
//todo: draw line, place note, score-to-note relation