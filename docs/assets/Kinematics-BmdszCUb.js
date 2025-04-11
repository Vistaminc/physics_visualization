import{a as P,r as u,c as T,a4 as q,b as i,e,h as r,j as p,q as B,f as o,w as m,g as b,t as g,o as d,_ as K}from"./index-SwCIvmeZ.js";const A={class:"kinematics-page"},z={class:"container"},D={class:"simulation-container"},E={class:"simulation-panel"},G={class:"simulation-view"},H={class:"simulation-canvas"},J={class:"coordinate-system"},L={key:0,class:"trajectory"},O={class:"simulation-controls"},Q={class:"control-group"},R={class:"control-group"},W={class:"parameter-sliders"},X={key:0,class:"parameter-slider"},Y={key:1,class:"parameter-slider"},Z={key:2,class:"parameter-slider"},$={class:"control-buttons"},ll={class:"data-panel"},el={class:"data-grid"},tl={class:"data-item"},sl={class:"data-value"},al={class:"data-item"},ol={class:"data-value"},nl={class:"data-item"},ul={class:"data-value"},il={key:0,class:"data-item"},dl={class:"data-value"},vl={class:"theory-panel"},rl={key:0,class:"theory-section"},pl={key:1,class:"theory-section"},ml={key:2,class:"theory-section"},I=.05,cl=P({__name:"Kinematics",setup(fl){const t=u("uniform"),a=u(5),_=u(2),k=u(45),j=u(!0),s=u(0),c=u(0),y=u(a.value),v=u({x:50,y:150}),U=T(()=>t.value==="uniform"?0:t.value==="accelerated"?_.value:t.value==="projectile"?9.8:0);let f=null;const S=()=>{f||(f=window.setInterval(()=>{if(s.value+=I,t.value==="uniform")c.value=a.value*s.value,y.value=a.value,v.value.x=50+c.value*5;else if(t.value==="accelerated")c.value=a.value*s.value+.5*_.value*s.value*s.value,y.value=a.value+_.value*s.value,v.value.x=50+c.value*5;else if(t.value==="projectile"){const V=k.value*Math.PI/180,l=a.value*Math.cos(V)*s.value,x=a.value*Math.sin(V)*s.value-.5*9.8*s.value*s.value;c.value=Math.sqrt(l*l+x*x),y.value=Math.sqrt(Math.pow(a.value*Math.cos(V),2)+Math.pow(a.value*Math.sin(V)-9.8*s.value,2)),v.value.x=50+l*5,v.value.y=150-x*5,v.value.y>300&&w()}},I*1e3))},w=()=>{f&&(clearInterval(f),f=null)},C=()=>{w(),s.value=0,c.value=0,y.value=a.value,v.value={x:50,y:150}};return q(()=>{f&&clearInterval(f)}),(V,l)=>{const x=b("el-radio-button"),F=b("el-radio-group"),M=b("el-slider"),h=b("el-button"),N=b("el-checkbox");return d(),i("div",A,[e("div",z,[l[31]||(l[31]=e("div",{class:"page-header"},[e("h1",{class:"page-title"},[r("运动学 "),e("span",{class:"page-subtitle"},"Kinematics")]),e("p",{class:"page-description"}," 运动学是力学的一个分支，主要研究物体运动的描述方法，包括位置、速度和加速度等运动学量，而不考虑引起运动的原因。 ")],-1)),e("div",D,[e("div",E,[e("div",G,[e("div",H,[e("div",J,[l[5]||(l[5]=e("div",{class:"x-axis"},null,-1)),l[6]||(l[6]=e("div",{class:"y-axis"},null,-1)),e("div",{class:"object",style:B({left:v.value.x+"px",top:v.value.y+"px"})},null,4),j.value?(d(),i("div",L)):p("",!0)])]),e("div",O,[e("div",Q,[l[10]||(l[10]=e("h3",null,"运动类型",-1)),o(F,{modelValue:t.value,"onUpdate:modelValue":l[0]||(l[0]=n=>t.value=n),onChange:C},{default:m(()=>[o(x,{label:"uniform"},{default:m(()=>l[7]||(l[7]=[r("匀速直线运动")])),_:1}),o(x,{label:"accelerated"},{default:m(()=>l[8]||(l[8]=[r("匀加速直线运动")])),_:1}),o(x,{label:"projectile"},{default:m(()=>l[9]||(l[9]=[r("抛体运动")])),_:1})]),_:1},8,["modelValue"])]),e("div",R,[l[14]||(l[14]=e("h3",null,"参数设置",-1)),e("div",W,[t.value==="uniform"||t.value==="accelerated"||t.value==="projectile"?(d(),i("div",X,[l[11]||(l[11]=e("span",null,"初速度 (m/s)",-1)),o(M,{modelValue:a.value,"onUpdate:modelValue":l[1]||(l[1]=n=>a.value=n),min:0,max:20,step:.5,"show-input":""},null,8,["modelValue"])])):p("",!0),t.value==="accelerated"?(d(),i("div",Y,[l[12]||(l[12]=e("span",null,"加速度 (m/s²)",-1)),o(M,{modelValue:_.value,"onUpdate:modelValue":l[2]||(l[2]=n=>_.value=n),min:0,max:10,step:.1,"show-input":""},null,8,["modelValue"])])):p("",!0),t.value==="projectile"?(d(),i("div",Z,[l[13]||(l[13]=e("span",null,"发射角度 (°)",-1)),o(M,{modelValue:k.value,"onUpdate:modelValue":l[3]||(l[3]=n=>k.value=n),min:0,max:90,step:1,"show-input":""},null,8,["modelValue"])])):p("",!0)])]),e("div",$,[o(h,{type:"primary",onClick:S},{default:m(()=>l[15]||(l[15]=[r("开始")])),_:1}),o(h,{onClick:w},{default:m(()=>l[16]||(l[16]=[r("暂停")])),_:1}),o(h,{onClick:C},{default:m(()=>l[17]||(l[17]=[r("重置")])),_:1}),o(N,{modelValue:j.value,"onUpdate:modelValue":l[4]||(l[4]=n=>j.value=n)},{default:m(()=>l[18]||(l[18]=[r("显示轨迹")])),_:1},8,["modelValue"])])])]),e("div",ll,[l[23]||(l[23]=e("h3",null,"运动数据",-1)),e("div",el,[e("div",tl,[l[19]||(l[19]=e("span",{class:"data-label"},"时间 (s)",-1)),e("span",sl,g(s.value.toFixed(2)),1)]),e("div",al,[l[20]||(l[20]=e("span",{class:"data-label"},"位置 (m)",-1)),e("span",ol,g(c.value.toFixed(2)),1)]),e("div",nl,[l[21]||(l[21]=e("span",{class:"data-label"},"速度 (m/s)",-1)),e("span",ul,g(y.value.toFixed(2)),1)]),t.value==="accelerated"||t.value==="projectile"?(d(),i("div",il,[l[22]||(l[22]=e("span",{class:"data-label"},"加速度 (m/s²)",-1)),e("span",dl,g(U.value.toFixed(2)),1)])):p("",!0)]),l[24]||(l[24]=e("div",{class:"chart-container"},[e("h4",null,"位置-时间图像"),e("div",{class:"chart-placeholder"})],-1)),l[25]||(l[25]=e("div",{class:"chart-container"},[e("h4",null,"速度-时间图像"),e("div",{class:"chart-placeholder"})],-1))])]),e("div",vl,[l[29]||(l[29]=e("h3",null,"理论知识",-1)),t.value==="uniform"?(d(),i("div",rl,l[26]||(l[26]=[e("h4",null,"匀速直线运动",-1),e("p",null,"物体沿着直线运动，且速度大小和方向保持不变的运动。",-1),e("div",{class:"formula"},[e("p",null,"位置方程: x = x₀ + vt"),e("p",null,"其中 x₀ 是初始位置，v 是速度，t 是时间。")],-1)]))):p("",!0),t.value==="accelerated"?(d(),i("div",pl,l[27]||(l[27]=[e("h4",null,"匀加速直线运动",-1),e("p",null,"物体沿着直线运动，且加速度大小和方向保持不变的运动。",-1),e("div",{class:"formula"},[e("p",null,"位置方程: x = x₀ + v₀t + ½at²"),e("p",null,"速度方程: v = v₀ + at"),e("p",null,"其中 x₀ 是初始位置，v₀ 是初速度，a 是加速度，t 是时间。")],-1)]))):p("",!0),t.value==="projectile"?(d(),i("div",ml,l[28]||(l[28]=[e("h4",null,"抛体运动",-1),e("p",null,"物体在重力作用下的二维运动，可以分解为水平方向的匀速运动和竖直方向的匀加速运动。",-1),e("div",{class:"formula"},[e("p",null,"水平位置: x = x₀ + v₀cosθ·t"),e("p",null,"竖直位置: y = y₀ + v₀sinθ·t - ½gt²"),e("p",null,"其中 θ 是发射角度，g 是重力加速度。")],-1)]))):p("",!0),l[30]||(l[30]=e("div",{class:"important-notes"},[e("h4",null,"重要结论"),e("ul",null,[e("li",null,"匀速直线运动中，位移与时间成正比"),e("li",null,"匀加速直线运动中，位移与时间的平方成正比"),e("li",null,"抛体运动的轨迹是抛物线")])],-1))])])])])}}}),_l=K(cl,[["__scopeId","data-v-e8980c20"]]);export{_l as default};
