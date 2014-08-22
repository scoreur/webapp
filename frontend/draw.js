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
		elem.newrest=function(duration){
			//to be implemented
			var img=elem.svg.text('r'+duration);
			//var img=elem.svg.circle(10).fill('red');
			img.remove();
			return img;
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
					if(mysc.duration<4)
					mysc.svgelem.tail=mysc.svgelem.parent.tails.line(tx,tys,tx,tye).stroke('black').opacity(1);
					
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
				
				for(var i=0;i<=len;)//upper
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
			
				for(var i=0;i<=len;)//lower
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