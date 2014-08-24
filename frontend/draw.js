LINER={
	lines:[],
	settings:{
		lineheight:12,
		scorewidth:22+6,
		scoresize:16,
		tailsize:20,
		beatsperseq:8,
		seqperline:6,
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
		
		elem.svg.upper.cx(20);
		elem.svg.lower.cx(20);
		var bracket_y=LINER.y_conversion(0)+LINER.settings.extra_vertical_spacing/2;
		var bracket_size=LINER.y_conversion(-6)-LINER.y_conversion(6)+LINER.settings.extra_vertical_spacing;
		bracket_img=elem.svg.image('./resources/staff/bracket.png').size(bracket_size,bracket_size).center(10,bracket_y);
		bracket_line=elem.svg.line(20,LINER.y_conversion(5),20,LINER.y_conversion(-5)+LINER.settings.extra_vertical_spacing).stroke('black');
		
		var bcf=4*LINER.settings.lineheight;
		var tcf=8*LINER.settings.lineheight;
		img=elem.svg.lower.image('./resources/staff/bass_clef.png').size(bcf,bcf).center(LINER.settings.clef_x_offset,LINER.y_conversion(-2.5));
		img=elem.svg.upper.image('./resources/staff/treble_clef.png').size(tcf,tcf).center(LINER.settings.clef_x_offset,LINER.y_conversion(3));
		
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
		
		elem.newnote=function(duration){//fudian?
			var src;
			switch(duration){
				case 1://eighth/quaver
				case 2://quarter
				case 3:src='./resources/staff/quarternote.png';break;
				case 4:
				case 6:src='./resources/staff/halfnote.png';break;
				case 8:src='./resources/staff/fullnote.png';break;	
			}
			var img=elem.svg.image(src);
			img.remove();
			img.size(LINER.settings.scoresize,LINER.settings.scoresize);
			img.scoredata={duration:duration,cx:0,cy:0};
			if(duration==1)img.stroke('red');
			return img;
		}
		elem.newrest=function(duration){
			//to be implemented: fudian?
			var el;
			var rh=3*LINER.settings.lineheight;
			switch(duration){
				case 1:
					el=elem.svg.image('./resources/staff/quaver_rest.png').size(rh,rh);break;
				case 2:
					el=elem.svg.image('./resources/staff/quarter_rest.png').size(rh,rh);
				break;
				case 4:
					el=elem.svg.group().size(LINER.settings.lineheight,2*LINER.settings.lineheight);
					el.rect(LINER.settings.lineheight,2*LINER.settings.lineheight).opacity(0)
					el.rect(LINER.settings.lineheight,LINER.settings.lineheight*0.5).center(LINER.settings.lineheight*0.5,LINER.settings.lineheight*0.75).fill('black');
				break;
				case 8:
					el=elem.svg.group().size(LINER.settings.lineheight,2*LINER.settings.lineheight);
					el.rect(LINER.settings.lineheight,2*LINER.settings.lineheight).opacity(0)
					el.rect(LINER.settings.lineheight,LINER.settings.lineheight*0.5).center(LINER.settings.lineheight*0.5,LINER.settings.lineheight*0.25).fill('black');
				break;
			}
			
			el.remove();
			return el;
		}
		elem.scores=[];//{time,duration,frnum,svgelem}
		elem.rests={upper:[],lower:[]};//{duration,svgelem}
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
					
					liner.update_tail(mysc);
					
					liner.update_additional_line(mysc.lastx);
					liner.update_additional_line(time);
					mysc.lastx=time;
					
					
					liner.update_rest(time);
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
			update_tail:function(mysc){
				var line=LINER.line_conversion(mysc.frnum),time=mysc.time;
				if(mysc.svgelem.tail){
					mysc.svgelem.tail.remove();
				}
				var tx,tys,tye,spacing=0.2,isup=false;
				if(line>=0&&line<=3){//upper right
					isup=1;
					tx=LINER.x_conversion(time)+(
						LINER.settings.scorewidth
						+LINER.settings.scoresize
					)/2;
					tys=LINER.y_conversion(line);
					//tye=LINER.y_conversion(5-spacing);
				}
				else if(line>3){//lower left
					tx=LINER.x_conversion(time)+(
						LINER.settings.scorewidth
						-LINER.settings.scoresize
					)/2;
					tys=LINER.y_conversion(line);
					//tye=LINER.y_conversion(1+spacing);
				}
				else if(line<-3){//upper right
					isup=1;
					tx=LINER.x_conversion(time)+(
						LINER.settings.scorewidth
						+LINER.settings.scoresize
					)/2;
					tys=LINER.y_conversion(line);
					//tye=LINER.y_conversion(-1-spacing);
				}
				else if(line<0&&line>=-3){//lower left
					tx=LINER.x_conversion(time)+(
						LINER.settings.scorewidth
						-LINER.settings.scoresize
					)/2;
					tys=LINER.y_conversion(line);
					//tye=LINER.y_conversion(-5+spacing);
				}
				tye=tys+3.5*LINER.settings.lineheight*(isup?-1:1);
				
				mysc.svgelem.tail=mysc.svgelem.parent.tails.nested();
				switch(mysc.duration){
					case 1:
						var src=isup?'./resources/staff/notetail_up.png':'./resources/staff/notetail_down.png';
						mysc.svgelem.tail.image(src).size(LINER.settings.tailsize,LINER.settings.tailsize).center(tx,tye+(isup?0.5:-0.5)*LINER.settings.tailsize);
					case 2:
					case 4:
					break;
					case 3:
					case 6:
						var cx=LINER.x_conversion(time)
						+0.9*LINER.settings.scorewidth
						+0.1*LINER.settings.scoresize;
						var cy=LINER.y_conversion(0.5+Math.floor(line));
						mysc.svgelem.tail.circle(LINER.settings.scoresize/3).center(cx,cy).fill('black').opacity(1);
					break;
				}
				if(mysc.duration<=6)
					mysc.svgelem.tail.line(tx,tys,tx,tye).stroke('black').opacity(1);
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
				if(highest>=6)
				for(var i=6;i<=highest;i++)
				{
					var y=LINER.y_conversion(i);
					elem.addline[time].push(elem.svg.upper.addlines.line(xs,y,xe,y).stroke('black'));
				}
				if(lowest<=-6)
				for(var i=-6;i>=lowest;i--)
				{
					var y=LINER.y_conversion(i);
					elem.addline[time].push(elem.svg.lower.addlines.line(xs,y,xe,y).stroke('black'));
				}
			},
			update_rest:function(){
				var scores=elem.scores;
				var len=LINER.settings.beatsperseq*LINER.settings.seqperline;
				var occupied_upper=new Array(len),occupied_lower=new Array(len);
				scores.map(function(s){
					if(s.frnum>=39)//upper
					{
						for(var i=0;i<s.duration;i++)
							occupied_upper[s.time+i]=true;
					}
					else
					{
						for(var i=0;i<s.duration;i++)
							occupied_lower[s.time+i]=true;
					}
				});
			
	
				function none(arr,s,e){
					for(var i=s;i<=e;i++)
						if(arr[i])return 0;
					return 1;
				}
				
				for(var i=0;i<len;)//upper
				{		
					if(occupied_upper[i])
					{
						if(elem.rests.upper[i])
						{
							elem.rests.upper[i].svgelem.remove();
							delete elem.rests.upper[i];
						}
						i++;continue;
					}
					else
					{
						var rest_size=[8,4,2,1];
						for(var si=0;si<rest_size.length;si++)
						{
							var size=rest_size[si];
							if(i%size==0 && none(occupied_upper,i+1,i+size-1))
							{
								for(var j=i;j<=i+size-1;j++)
								if(elem.rests.upper[j]){elem.rests.upper[j].svgelem.remove();delete elem.rests.upper[j];
								}
								var rest=elem.newrest(size);
								elem.svg.upper.add(rest);
								elem.rests.upper[i]={time:i,duration:size,svgelem:rest}
								rest.center(
									LINER.x_conversion(i)+LINER.settings.scorewidth/2,
									LINER.y_conversion(3)
								);
								i+=size;		
								break;
							}
						}
					}
				}
			
				for(var i=0;i<len;)//lower
				{		
					if(occupied_lower[i])
					{
						if(elem.rests.lower[i])
						{
							elem.rests.lower[i].svgelem.remove();
							delete elem.rests.lower[i];
						}
						i++;continue;
					}
					else
					{
						var rest_size=[8,4,2,1];
						for(var si=0;si<rest_size.length;si++)
						{
							var size=rest_size[si];
							if(i%size==0 && none(occupied_lower,i+1,i+size-1))
							{
								for(var j=i;j<=i+size-1;j++)
								if(elem.rests.lower[j]){elem.rests.lower[j].svgelem.remove();delete elem.rests.lower[j];
								}
								var rest=elem.newrest(size);
								elem.svg.lower.add(rest);
								elem.rests.lower[i]={time:i,duration:size,svgelem:rest}
								rest.center(
									LINER.x_conversion(i)+LINER.settings.scorewidth/2,
									LINER.y_conversion(-3)
								);
								i+=size;		
								break;
							}
						}
					}
				}
			}
		};
		
		LINER.lines.push(elem);
		return elem.liner;
	}
}
//todo: drag the note
//todo: draw addition up/down line, draw note tail