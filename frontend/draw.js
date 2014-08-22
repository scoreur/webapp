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
		clef_x_offset:30,
		extra_vertical_spacing:50,
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
	y_conversion:function(line_num){
		return LINER.settings.lineheight * (LINER.settings.top_line-line_num);
	},
	x_conversion:function(time)
	{
		return LINER.settings.initial_padding+LINER.settings.scorewidth*time;
	},
	initialize:function(elem)
	{
		if(typeof elem == "string")
			elem=document.getElementById(elem);
		if(!elem)return;
		
		var lineend=LINER.settings.initial_padding+LINER.settings.scorewidth*LINER.settings.beatsperseq*LINER.settings.seqperline;
		
		elem.svg=SVG(elem);
		elem.svg.upper=elem.svg.nested();
		elem.svg.lower=elem.svg.nested();
		elem.svg.lower.cy(LINER.settings.extra_vertical_spacing);
		img=elem.svg.lower.image('./resources/staff/bass_clef.png').size(50,50).center(LINER.settings.clef_x_offset,LINER.y_conversion(-3)+6);
		img=elem.svg.upper.image('./resources/staff/treble_clef.png').size(50,50).center(LINER.settings.clef_x_offset,LINER.y_conversion(3));
		
		elem.svg.upper.tails=elem.svg.upper.nested();
		elem.svg.lower.tails=elem.svg.lower.nested();
		elem.svg.upper.addlines=elem.svg.upper.nested();
		elem.svg.lower.addlines=elem.svg.lower.nested();
		
		for(var i=1;i<=5;i++)
		{
			var lineheight=LINER.y_conversion(i);
			elem.svg.upper.line(0,lineheight,lineend,lineheight).stroke('black');
		}
		var low=LINER.y_conversion(1),high=LINER.y_conversion(5);
		for(var i=0;i<LINER.settings.seqperline;i++)
		{
			var x=LINER.settings.initial_padding+LINER.settings.scorewidth*LINER.settings.beatsperseq*i;
			elem.svg.upper.line(x,low,x,high).stroke('grey');
		}
		
		for(var i=-1;i>=-5;i--)
		{
			var lineheight=LINER.y_conversion(i);
			elem.svg.lower.line(0,lineheight,lineend,lineheight).stroke('black');
		}
		var low=LINER.y_conversion(-1),high=LINER.y_conversion(-5);
		for(var i=0;i<LINER.settings.seqperline;i++)
		{
			var x=LINER.settings.initial_padding+LINER.settings.scorewidth*LINER.settings.beatsperseq*i;
			elem.svg.lower.line(x,low,x,high).stroke('grey');
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
			img.remove();
			img.size(LINER.settings.scoresize,LINER.settings.scoresize);
			img.scoredata={duration:duration,cx:0,cy:0};
			return img;
		}
		elem.scores=[];//{time,duration,frnum,svgelem}
		elem.addline=[];
		elem.liner={
			addscore:function(score){
				var mysc={
					time:score.time,
					duration:score.duration||1,
					frnum:score.frnum
				};
				mysc.svgelem=elem.newnote(mysc.duration);
				mysc.moveTo=function(time,frnum){
					mysc.time=time;mysc.frnum=frnum;
					var line=LINER.line_conversion(frnum);
					if(line>=0 && (mysc.svgelem.parent!=elem.svg.upper))
					{
						mysc.svgelem.remove();
						elem.svg.upper.add(mysc.svgelem);
					}
					if(line<0 && (mysc.svgelem.parent!=elem.svg.lower))
					{
						mysc.svgelem.remove();
						elem.svg.lower.add(mysc.svgelem);
					}
					var y=LINER.y_conversion(line);
					var x=LINER.x_conversion(time);
					mysc.svgelem.center(
						mysc.svgelem.scoredata.cx+x+LINER.settings.scorewidth/2,
						mysc.svgelem.scoredata.cy+y
					);
					
					if(mysc.svgelem.tail){
						mysc.svgelem.tail.remove();
					}
					var tx,tys,tye,spacing=0.2;
					if(line>=0&&line<=3){//upper right
						tx=LINER.x_conversion(time)+(
							LINER.settings.scorewidth
							+LINER.settings.scoresize
						)/2;
						tys=LINER.y_conversion(line);
						tye=LINER.y_conversion(5-spacing);
					}
					else if(line>3){//lower left
						tx=LINER.x_conversion(time)+(
							LINER.settings.scorewidth
							-LINER.settings.scoresize
						)/2;
						tys=LINER.y_conversion(line);
						tye=LINER.y_conversion(1+spacing);
					}
					else if(line<-3){//upper right
						tx=LINER.x_conversion(time)+(
							LINER.settings.scorewidth
							+LINER.settings.scoresize
						)/2;
						tys=LINER.y_conversion(line);
						tye=LINER.y_conversion(-1-spacing);
					}
					else if(line<0&&line>=-3){//lower left
						tx=LINER.x_conversion(time)+(
							LINER.settings.scorewidth
							-LINER.settings.scoresize
						)/2;
						tys=LINER.y_conversion(line);
						tye=LINER.y_conversion(-5+spacing);
					}
					
					mysc.svgelem.tail=mysc.svgelem.parent.tails.line(tx,tys,tx,tye).stroke('black').opacity(1);
					
					liner.update_additional_line(mysc.lastx);
					liner.update_additional_line(time);
					mysc.lastx=time;
					return mysc.svgelem;
				}
				elem.scores.push(mysc);
				mysc.moveTo(mysc.time,mysc.frnum);
				return mysc;
			},
			addscores:function(scores){
				return scores.map(function(s){elem.liner.addscore(s);});
			},
			listscores:function(){
				return elem.scores;
			},
			update_additional_line:function(time){
				var scores=elem.scores;
				var scorelines=[];
				scores.map(function(s){
					if(s.time==time)
						scorelines.push(LINER.line_conversion(s.frnum));
				});
				var highest=0,lowest=0,hasmid=false;
				
				scorelines.map(function(l){
					if(l>highest)highest=l;
					if(l<lowest)lowest=l;
					if(l==0)hasmid=true;
				});
				if(elem.addline[time])
					while(elem.addline[time].length)
						elem.addline[time].pop().remove();
				
				elem.addline[time]=[];
				var xs=LINER.x_conversion(time),xe=LINER.x_conversion(time+1);
				if(hasmid){
					var y=LINER.y_conversion(0);
					elem.addline[time].push(elem.svg.upper.addlines.line(xs,y,xe,y).stroke('black'));
				}
				
				
			}
		};
		
		LINER.lines.push(elem);
		return elem.liner;
	}
}
//todo: drag the note
//todo: draw addition up/down line, draw note tail