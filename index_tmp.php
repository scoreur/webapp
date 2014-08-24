<!doctype html>
<html>
<head>
<meta charset="UTF-8">
<title>Scoreur Project</title>
<script src="js/keyboard.js"></script>
<script src="js/backend/func.js"></script>
<script src="js/backend/lib/queue.js"></script>
<script>
function git_tip()
{
	document.getElementById("gitTip").innerHTML = "click to see our codes!";
	document.getElementById("git").style.color="#F09";
}
function git_tip_out()
{
	document.getElementById("gitTip").innerHTML = "<br/>";
	document.getElementById("git").style.color="#069";
}
function zoom_in()
{
	document.getElementById("res_score").width *= 1.05;
	document.getElementById("res_score").height *= 1.05;
}
function zoom_out()
{
	document.getElementById("res_score").width *= 0.95;
	document.getElementById("res_score").height *= 0.95;
}
var wh = 130;//whiteheight
var bh = 70;//blackheight
var bw = 6;//halfblackwidth
var ww = 9;//halfwhitewidth
wfn=[1,-0.3,-0.1,0.5,0,0,0,0,-0.5,0,0,0,0,0,0,0.1];
function make_keyboard(){
	kb = document.getElementById("keyboard");
	kb.setAttribute("height", wh);
	kb.setAttribute("width", ww *104);
	kb.innerHTML = keyboard_xml();
}
function keydown(id){
	document.getElementById("gitTip").innerHTML = "You've clicked the No."+(id+1)+" key from the left";
	//ks = document.getElementById("ksnd_"+);
	
	//WAVPLAY.score_start(id,wfn);
	WAVPLAY.score_start(id,wfn);
	
	if(keycolor(id%12)=="white"){
	document.getElementById("key_"+(id)).style.fill = "#EEE";
	}else{
		document.getElementById("key_"+(id)).style.fill = "#444";}
}
function keyup(id){
	document.getElementById("key_"+(id)).style.fill = keycolor(id % 12);
	document.getElementById("gitTip").innerHTML = "<br/>";
	
	//WAVPLAY.score_end(id,wfn);
		
	WAVPLAY.score_end(id,wfn);
}
function big_keyboard(){
	wh*=1.05; bh*=1.05; bw*=1.05;ww*=1.05;
	make_keyboard();
}
function small_keyboard(){
	wh*=0.95; bh*=0.95; bw*=0.95;ww*=0.95;
	make_keyboard();
}
function display_keyboard(what){
	var obj = typeof what == 'object'
		? what : document.getElementById(what);
	if(obj.style.display == 'block'){
		document.getElementById("btn_display").innerHTML = 'show keyboard';
		obj.style.display = 'none';
	}
	else{
		document.getElementById("btn_display").innerHTML = 'hide keyboard';
		obj.style.display = 'block';
	}
}
	
</script>
</head>

<body>
<div align="center">
<h2 style=" font-style:oblique; font-family:Gotham, 'Helvetica Neue', Helvetica, Arial, sans-serif; color:#00C">SCOREUR</h2>
<img src="src/scoreur.jpg" alt="scoreur's avatar" width="200" height="200"/> 
<br/> <br>
<a id="git" href="http://github.com/scoreur/" onMouseOver="git_tip()" onMouseOut="git_tip_out()" style="color:#069">Scoreur: feel the musical bits!</a>
<p id="gitTip"><br/></p>
<button id="btn_display" onclick="display_keyboard(document.getElementById('keyboard_control'))" type="button" style="appearance:menu-item">
hide keyboard
</button>
<br/><br/>
</div>

<div id="keyboard_control" style="display:block" align="center">
<svg id="keyboard" xmlns="http://www.w3.org/2000/svg" version="1.1" width="936" height="130" style="background-color:#FFF; border:groove; alignment-adjust:central; width:auto; height:auto"><polygon id="key_0" onmousedown="keydown(0)" onmouseup="keyup(0)" points="0,0 12,0 12,70 18,70 18,130 0,130" style="fill:white;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_1" onmousedown="keydown(1)" onmouseup="keyup(1)" points="12,0 24,0 24,70 12,70" style="fill:black;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_2" onmousedown="keydown(2)" onmouseup="keyup(2)" points="24,0 36,0 36,130 18,130 18,70 24,70" style="fill:white;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_3" onmousedown="keydown(3)" onmouseup="keyup(3)" points="36,0 48,0 48,70 54,70 54,130 36,130" style="fill:white;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_4" onmousedown="keydown(4)" onmouseup="keyup(4)" points="48,0 60,0 60,70 48,70" style="fill:black;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_5" onmousedown="keydown(5)" onmouseup="keyup(5)" points="60,0 66,0 66,70 72,70 72,130 54,130 54,70 60,70" style="fill:white;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_6" onmousedown="keydown(6)" onmouseup="keyup(6)" points="66,0 78,0 78,70 66,70" style="fill:black;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_7" onmousedown="keydown(7)" onmouseup="keyup(7)" points="78,0 90,0 90,130 72,130 72,70 78,70" style="fill:white;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_8" onmousedown="keydown(8)" onmouseup="keyup(8)" points="90,0 102,0 102,70 108,70 108,130 90,130" style="fill:white;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_9" onmousedown="keydown(9)" onmouseup="keyup(9)" points="102,0 114,0 114,70 102,70" style="fill:black;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_10" onmousedown="keydown(10)" onmouseup="keyup(10)" points="114,0 120,0 120,70 126,70 126,130 108,130 108,70 114,70" style="fill:white;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_11" onmousedown="keydown(11)" onmouseup="keyup(11)" points="120,0 132,0 132,70 120,70" style="fill:black;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_12" onmousedown="keydown(12)" onmouseup="keyup(12)" points="132,0 138,0 138,70 144,70 144,130 126,130 126,70 132,70" style="fill:white;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_13" onmousedown="keydown(13)" onmouseup="keyup(13)" points="138,0 150,0 150,70 138,70" style="fill:black;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_14" onmousedown="keydown(14)" onmouseup="keyup(14)" points="150,0 162,0 162,130 144,130 144,70 150,70" style="fill:white;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_15" onmousedown="keydown(15)" onmouseup="keyup(15)" points="162,0 174,0 174,70 180,70 180,130 162,130" style="fill:white;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_16" onmousedown="keydown(16)" onmouseup="keyup(16)" points="174,0 186,0 186,70 174,70" style="fill:black;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_17" onmousedown="keydown(17)" onmouseup="keyup(17)" points="186,0 192,0 192,70 198,70 198,130 180,130 180,70 186,70" style="fill:white;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_18" onmousedown="keydown(18)" onmouseup="keyup(18)" points="192,0 204,0 204,70 192,70" style="fill:black;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_19" onmousedown="keydown(19)" onmouseup="keyup(19)" points="204,0 216,0 216,130 198,130 198,70 204,70" style="fill:white;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_20" onmousedown="keydown(20)" onmouseup="keyup(20)" points="216,0 228,0 228,70 234,70 234,130 216,130" style="fill:white;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_21" onmousedown="keydown(21)" onmouseup="keyup(21)" points="228,0 240,0 240,70 228,70" style="fill:black;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_22" onmousedown="keydown(22)" onmouseup="keyup(22)" points="240,0 246,0 246,70 252,70 252,130 234,130 234,70 240,70" style="fill:white;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_23" onmousedown="keydown(23)" onmouseup="keyup(23)" points="246,0 258,0 258,70 246,70" style="fill:black;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_24" onmousedown="keydown(24)" onmouseup="keyup(24)" points="258,0 264,0 264,70 270,70 270,130 252,130 252,70 258,70" style="fill:white;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_25" onmousedown="keydown(25)" onmouseup="keyup(25)" points="264,0 276,0 276,70 264,70" style="fill:black;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_26" onmousedown="keydown(26)" onmouseup="keyup(26)" points="276,0 288,0 288,130 270,130 270,70 276,70" style="fill:white;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_27" onmousedown="keydown(27)" onmouseup="keyup(27)" points="288,0 300,0 300,70 306,70 306,130 288,130" style="fill:white;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_28" onmousedown="keydown(28)" onmouseup="keyup(28)" points="300,0 312,0 312,70 300,70" style="fill:black;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_29" onmousedown="keydown(29)" onmouseup="keyup(29)" points="312,0 318,0 318,70 324,70 324,130 306,130 306,70 312,70" style="fill:white;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_30" onmousedown="keydown(30)" onmouseup="keyup(30)" points="318,0 330,0 330,70 318,70" style="fill:black;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_31" onmousedown="keydown(31)" onmouseup="keyup(31)" points="330,0 342,0 342,130 324,130 324,70 330,70" style="fill:white;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_32" onmousedown="keydown(32)" onmouseup="keyup(32)" points="342,0 354,0 354,70 360,70 360,130 342,130" style="fill:white;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_33" onmousedown="keydown(33)" onmouseup="keyup(33)" points="354,0 366,0 366,70 354,70" style="fill:black;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_34" onmousedown="keydown(34)" onmouseup="keyup(34)" points="366,0 372,0 372,70 378,70 378,130 360,130 360,70 366,70" style="fill:white;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_35" onmousedown="keydown(35)" onmouseup="keyup(35)" points="372,0 384,0 384,70 372,70" style="fill:black;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_36" onmousedown="keydown(36)" onmouseup="keyup(36)" points="384,0 390,0 390,70 396,70 396,130 378,130 378,70 384,70" style="fill:white;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_37" onmousedown="keydown(37)" onmouseup="keyup(37)" points="390,0 402,0 402,70 390,70" style="fill:black;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_38" onmousedown="keydown(38)" onmouseup="keyup(38)" points="402,0 414,0 414,130 396,130 396,70 402,70" style="fill:white;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_39" onmousedown="keydown(39)" onmouseup="keyup(39)" points="414,0 426,0 426,70 432,70 432,130 414,130" style="fill:white;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_40" onmousedown="keydown(40)" onmouseup="keyup(40)" points="426,0 438,0 438,70 426,70" style="fill:black;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_41" onmousedown="keydown(41)" onmouseup="keyup(41)" points="438,0 444,0 444,70 450,70 450,130 432,130 432,70 438,70" style="fill:white;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_42" onmousedown="keydown(42)" onmouseup="keyup(42)" points="444,0 456,0 456,70 444,70" style="fill:black;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_43" onmousedown="keydown(43)" onmouseup="keyup(43)" points="456,0 468,0 468,130 450,130 450,70 456,70" style="fill:white;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_44" onmousedown="keydown(44)" onmouseup="keyup(44)" points="468,0 480,0 480,70 486,70 486,130 468,130" style="fill:white;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_45" onmousedown="keydown(45)" onmouseup="keyup(45)" points="480,0 492,0 492,70 480,70" style="fill:black;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_46" onmousedown="keydown(46)" onmouseup="keyup(46)" points="492,0 498,0 498,70 504,70 504,130 486,130 486,70 492,70" style="fill:white;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_47" onmousedown="keydown(47)" onmouseup="keyup(47)" points="498,0 510,0 510,70 498,70" style="fill:black;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_48" onmousedown="keydown(48)" onmouseup="keyup(48)" points="510,0 516,0 516,70 522,70 522,130 504,130 504,70 510,70" style="fill:white;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_49" onmousedown="keydown(49)" onmouseup="keyup(49)" points="516,0 528,0 528,70 516,70" style="fill:black;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_50" onmousedown="keydown(50)" onmouseup="keyup(50)" points="528,0 540,0 540,130 522,130 522,70 528,70" style="fill:white;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_51" onmousedown="keydown(51)" onmouseup="keyup(51)" points="540,0 552,0 552,70 558,70 558,130 540,130" style="fill:white;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_52" onmousedown="keydown(52)" onmouseup="keyup(52)" points="552,0 564,0 564,70 552,70" style="fill:black;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_53" onmousedown="keydown(53)" onmouseup="keyup(53)" points="564,0 570,0 570,70 576,70 576,130 558,130 558,70 564,70" style="fill:white;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_54" onmousedown="keydown(54)" onmouseup="keyup(54)" points="570,0 582,0 582,70 570,70" style="fill:black;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_55" onmousedown="keydown(55)" onmouseup="keyup(55)" points="582,0 594,0 594,130 576,130 576,70 582,70" style="fill:white;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_56" onmousedown="keydown(56)" onmouseup="keyup(56)" points="594,0 606,0 606,70 612,70 612,130 594,130" style="fill:white;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_57" onmousedown="keydown(57)" onmouseup="keyup(57)" points="606,0 618,0 618,70 606,70" style="fill:black;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_58" onmousedown="keydown(58)" onmouseup="keyup(58)" points="618,0 624,0 624,70 630,70 630,130 612,130 612,70 618,70" style="fill:white;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_59" onmousedown="keydown(59)" onmouseup="keyup(59)" points="624,0 636,0 636,70 624,70" style="fill:black;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_60" onmousedown="keydown(60)" onmouseup="keyup(60)" points="636,0 642,0 642,70 648,70 648,130 630,130 630,70 636,70" style="fill:white;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_61" onmousedown="keydown(61)" onmouseup="keyup(61)" points="642,0 654,0 654,70 642,70" style="fill:black;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_62" onmousedown="keydown(62)" onmouseup="keyup(62)" points="654,0 666,0 666,130 648,130 648,70 654,70" style="fill:white;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_63" onmousedown="keydown(63)" onmouseup="keyup(63)" points="666,0 678,0 678,70 684,70 684,130 666,130" style="fill:white;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_64" onmousedown="keydown(64)" onmouseup="keyup(64)" points="678,0 690,0 690,70 678,70" style="fill:black;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_65" onmousedown="keydown(65)" onmouseup="keyup(65)" points="690,0 696,0 696,70 702,70 702,130 684,130 684,70 690,70" style="fill:white;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_66" onmousedown="keydown(66)" onmouseup="keyup(66)" points="696,0 708,0 708,70 696,70" style="fill:black;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_67" onmousedown="keydown(67)" onmouseup="keyup(67)" points="708,0 720,0 720,130 702,130 702,70 708,70" style="fill:white;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_68" onmousedown="keydown(68)" onmouseup="keyup(68)" points="720,0 732,0 732,70 738,70 738,130 720,130" style="fill:white;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_69" onmousedown="keydown(69)" onmouseup="keyup(69)" points="732,0 744,0 744,70 732,70" style="fill:black;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_70" onmousedown="keydown(70)" onmouseup="keyup(70)" points="744,0 750,0 750,70 756,70 756,130 738,130 738,70 744,70" style="fill:white;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_71" onmousedown="keydown(71)" onmouseup="keyup(71)" points="750,0 762,0 762,70 750,70" style="fill:black;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_72" onmousedown="keydown(72)" onmouseup="keyup(72)" points="762,0 768,0 768,70 774,70 774,130 756,130 756,70 762,70" style="fill:white;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_73" onmousedown="keydown(73)" onmouseup="keyup(73)" points="768,0 780,0 780,70 768,70" style="fill:black;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_74" onmousedown="keydown(74)" onmouseup="keyup(74)" points="780,0 792,0 792,130 774,130 774,70 780,70" style="fill:white;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_75" onmousedown="keydown(75)" onmouseup="keyup(75)" points="792,0 804,0 804,70 810,70 810,130 792,130" style="fill:white;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_76" onmousedown="keydown(76)" onmouseup="keyup(76)" points="804,0 816,0 816,70 804,70" style="fill:black;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_77" onmousedown="keydown(77)" onmouseup="keyup(77)" points="816,0 822,0 822,70 828,70 828,130 810,130 810,70 816,70" style="fill:white;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_78" onmousedown="keydown(78)" onmouseup="keyup(78)" points="822,0 834,0 834,70 822,70" style="fill:black;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_79" onmousedown="keydown(79)" onmouseup="keyup(79)" points="834,0 846,0 846,130 828,130 828,70 834,70" style="fill:white;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_80" onmousedown="keydown(80)" onmouseup="keyup(80)" points="846,0 858,0 858,70 864,70 864,130 846,130" style="fill:white;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_81" onmousedown="keydown(81)" onmouseup="keyup(81)" points="858,0 870,0 870,70 858,70" style="fill:black;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_82" onmousedown="keydown(82)" onmouseup="keyup(82)" points="870,0 876,0 876,70 882,70 882,130 864,130 864,70 870,70" style="fill:white;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_83" onmousedown="keydown(83)" onmouseup="keyup(83)" points="876,0 888,0 888,70 876,70" style="fill:black;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_84" onmousedown="keydown(84)" onmouseup="keyup(84)" points="888,0 894,0 894,70 900,70 900,130 882,130 882,70 888,70" style="fill:white;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_85" onmousedown="keydown(85)" onmouseup="keyup(85)" points="894,0 906,0 906,70 894,70" style="fill:black;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_86" onmousedown="keydown(86)" onmouseup="keyup(86)" points="906,0 918,0 918,130 900,130 900,70 906,70" style="fill:white;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon><polygon id="key_87" onmousedown="keydown(87)" onmouseup="keyup(87)" points="918,0 936,0 936,130 918,130" style="fill:white;stroke:gray;stroke-width:1;fill-rule:odd;"></polygon></svg>
<br/>
<button onClick="big_keyboard()" type="button">bigger</button>
<button onClick="small_keyboard()" type="button">smaller</button>
</div>
<br/>
<div align="center">
<audio src="src/resurgence.mp3" controls>
Your browser does not support html5 audio!
</audio>
<h3> Here's the score of the song you can sing with. Enjoy it!</h3>
<button onClick="zoom_in()" style="background-color:#CF6; alignment-adjust:central; text-height:text-size">zoom in</button>
<button onClick="zoom_out()" style="background-color:#CF6; alignment-adjust:central; text-height:text-size">zoom out</button>
<br/>
<img id="res_score" src="src/res_sco.jpg" alt="resurgence score" width="400" height="600"/>
</div>


<div id="snd" style="display:none" align="center"><audio id="ksnd_0" src="none" autoplay></audio><audio id="ksnd_1" src="none" autoplay></audio><audio id="ksnd_2" src="none" autoplay></audio><audio id="ksnd_3" src="none" autoplay></audio><audio id="ksnd_4" src="none" autoplay></audio><audio id="ksnd_5" src="none" autoplay></audio><audio id="ksnd_6" src="none" autoplay></audio><audio id="ksnd_7" src="none" autoplay></audio><audio id="ksnd_8" src="none" autoplay></audio><audio id="ksnd_9" src="none" autoplay></audio><audio id="ksnd_10" src="none" autoplay></audio><audio id="ksnd_11" src="none" autoplay></audio><audio id="ksnd_12" src="none" autoplay></audio><audio id="ksnd_13" src="none" autoplay></audio><audio id="ksnd_14" src="none" autoplay></audio><audio id="ksnd_15" src="none" autoplay></audio><audio id="ksnd_16" src="none" autoplay></audio><audio id="ksnd_17" src="none" autoplay></audio><audio id="ksnd_18" src="none" autoplay></audio><audio id="ksnd_19" src="none" autoplay></audio><audio id="ksnd_20" src="none" autoplay></audio><audio id="ksnd_21" src="none" autoplay></audio><audio id="ksnd_22" src="none" autoplay></audio><audio id="ksnd_23" src="none" autoplay></audio><audio id="ksnd_24" src="none" autoplay></audio><audio id="ksnd_25" src="none" autoplay></audio><audio id="ksnd_26" src="none" autoplay></audio><audio id="ksnd_27" src="none" autoplay></audio><audio id="ksnd_28" src="none" autoplay></audio><audio id="ksnd_29" src="none" autoplay></audio><audio id="ksnd_30" src="none" autoplay></audio><audio id="ksnd_31" src="none" autoplay></audio><audio id="ksnd_32" src="none" autoplay></audio><audio id="ksnd_33" src="none" autoplay></audio><audio id="ksnd_34" src="none" autoplay></audio><audio id="ksnd_35" src="none" autoplay></audio><audio id="ksnd_36" src="none" autoplay></audio><audio id="ksnd_37" src="none" autoplay></audio><audio id="ksnd_38" src="none" autoplay></audio><audio id="ksnd_39" src="none" autoplay></audio><audio id="ksnd_40" src="none" autoplay></audio><audio id="ksnd_41" src="none" autoplay></audio><audio id="ksnd_42" src="none" autoplay></audio><audio id="ksnd_43" src="none" autoplay></audio><audio id="ksnd_44" src="none" autoplay></audio><audio id="ksnd_45" src="none" autoplay></audio><audio id="ksnd_46" src="none" autoplay></audio><audio id="ksnd_47" src="none" autoplay></audio><audio id="ksnd_48" src="none" autoplay></audio><audio id="ksnd_49" src="none" autoplay></audio><audio id="ksnd_50" src="none" autoplay></audio><audio id="ksnd_51" src="none" autoplay></audio><audio id="ksnd_52" src="none" autoplay></audio><audio id="ksnd_53" src="none" autoplay></audio><audio id="ksnd_54" src="none" autoplay></audio><audio id="ksnd_55" src="none" autoplay></audio><audio id="ksnd_56" src="none" autoplay></audio><audio id="ksnd_57" src="none" autoplay></audio><audio id="ksnd_58" src="none" autoplay></audio><audio id="ksnd_59" src="none" autoplay></audio><audio id="ksnd_60" src="none" autoplay></audio><audio id="ksnd_61" src="none" autoplay></audio><audio id="ksnd_62" src="none" autoplay></audio><audio id="ksnd_63" src="none" autoplay></audio><audio id="ksnd_64" src="none" autoplay></audio><audio id="ksnd_65" src="none" autoplay></audio><audio id="ksnd_66" src="none" autoplay></audio><audio id="ksnd_67" src="none" autoplay></audio><audio id="ksnd_68" src="none" autoplay></audio><audio id="ksnd_69" src="none" autoplay></audio><audio id="ksnd_70" src="none" autoplay></audio><audio id="ksnd_71" src="none" autoplay></audio><audio id="ksnd_72" src="none" autoplay></audio><audio id="ksnd_73" src="none" autoplay></audio><audio id="ksnd_74" src="none" autoplay></audio><audio id="ksnd_75" src="none" autoplay></audio><audio id="ksnd_76" src="none" autoplay></audio><audio id="ksnd_77" src="none" autoplay></audio><audio id="ksnd_78" src="none" autoplay></audio><audio id="ksnd_79" src="none" autoplay></audio><audio id="ksnd_80" src="none" autoplay></audio><audio id="ksnd_81" src="none" autoplay></audio><audio id="ksnd_82" src="none" autoplay></audio><audio id="ksnd_83" src="none" autoplay></audio><audio id="ksnd_84" src="none" autoplay></audio><audio id="ksnd_85" src="none" autoplay></audio><audio id="ksnd_86" src="none" autoplay></audio><audio id="ksnd_87" src="none" autoplay></audio></div>

<div id="ICP_rec" align="center" style="display:block">
<p> 地址:清华园1号 邮编:100084 </p>
<p>www.scoreur.net 版权所有<br/> 
<a href="http://www.miitbeian.gov.cn/">
京ICP备14038813号-1
</a>
</div>
</body>

</html>
