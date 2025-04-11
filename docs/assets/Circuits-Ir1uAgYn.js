import{a as G,r as e,l as H,a4 as J,b as U,e as l,h as c,S as q,f as s,w as m,g as w,j as W,t as u,o as A,_ as O}from"./index-SwCIvmeZ.js";const Q={class:"circuits-page"},X={class:"container"},Y={class:"circuits-container"},Z={class:"circuit-panel"},$={class:"circuit-view"},aa={class:"circuit-controls"},la={class:"control-group"},ea={class:"control-group"},sa={class:"parameter-sliders"},ta={class:"parameter-slider"},da={class:"parameter-slider"},oa={class:"parameter-slider"},ua={key:0,class:"parameter-slider"},na={class:"control-buttons"},va={class:"results-panel"},ia={class:"results-grid"},ra={class:"result-item"},pa={class:"result-value"},ca={class:"result-item"},ma={class:"result-value"},_a={class:"result-item"},Va={class:"result-value"},fa={class:"result-item"},xa={class:"result-value"},ga={class:"component-results"},Ca={key:0,class:"component-group"},Ra={class:"component-values"},ba={class:"component-value"},wa={class:"component-value"},ya={class:"component-value"},Fa={key:1,class:"component-group"},ha={class:"component-values"},ka={class:"component-value"},Ia={class:"component-value"},Ua={class:"component-value"},Aa=G({__name:"Circuits",setup(Na){const r=e("series"),t=e(12),n=e(10),v=e(20),R=e(30),K=e(!0),_=e(0),o=e(0),y=e(0),L=e(100),p=e(0),i=e(0),N=e(0),V=e(0),f=e(0),T=e(0),x=e(0),g=e(0),j=e(0);let F=null,h=!1;const C=()=>{if(r.value==="series")_.value=n.value+v.value,o.value=t.value/_.value,p.value=o.value*n.value,i.value=o.value*v.value,V.value=o.value,f.value=o.value,x.value=p.value*V.value,g.value=i.value*f.value,y.value=x.value+g.value;else if(r.value==="parallel")_.value=1/(1/n.value+1/v.value),o.value=t.value/_.value,p.value=t.value,i.value=t.value,V.value=t.value/n.value,f.value=t.value/v.value,x.value=p.value*V.value,g.value=i.value*f.value,y.value=x.value+g.value;else if(r.value==="mixed"){const b=1/(1/v.value+1/R.value);_.value=n.value+b,o.value=t.value/_.value,p.value=o.value*n.value,i.value=t.value-p.value,N.value=i.value,V.value=o.value,f.value=i.value/v.value,T.value=N.value/R.value,x.value=p.value*V.value,g.value=i.value*f.value,j.value=N.value*T.value,y.value=x.value+g.value+j.value}L.value=100},D=()=>{k(),C()},E=()=>{if(h)return;h=!0;const b=()=>{h&&(F=requestAnimationFrame(b))};b()},k=()=>{h=!1,F!==null&&(cancelAnimationFrame(F),F=null)},M=()=>{k(),t.value=12,n.value=10,v.value=20,R.value=30,C()};return H(()=>{C()}),J(()=>{k()}),(b,a)=>{const S=w("el-radio-button"),P=w("el-radio-group"),I=w("el-slider"),B=w("el-button"),z=w("el-checkbox");return A(),U("div",Q,[l("div",X,[a[29]||(a[29]=l("div",{class:"page-header"},[l("h1",{class:"page-title"},[c("电路分析 "),l("span",{class:"page-subtitle"},"Circuits")]),l("p",{class:"page-description"}," 电路分析是研究电子元件连接形成的闭合回路中的电压、电流和功率的学科。通过可视化模拟，学习串并联电路、基尔霍夫定律及其应用。 ")],-1)),l("div",Y,[l("div",Z,[l("div",$,[a[19]||(a[19]=q('<div class="circuit-canvas" data-v-95ad2d01><div class="circuit-components" data-v-95ad2d01><div class="battery" data-v-95ad2d01></div><div class="resistor r1" data-v-95ad2d01></div><div class="resistor r2" data-v-95ad2d01></div><div class="resistor r3" data-v-95ad2d01></div><div class="wire" data-v-95ad2d01></div><div class="current-indicator" data-v-95ad2d01></div></div></div>',1)),l("div",aa,[l("div",la,[a[9]||(a[9]=l("h3",null,"电路类型",-1)),s(P,{modelValue:r.value,"onUpdate:modelValue":a[0]||(a[0]=d=>r.value=d),onChange:D},{default:m(()=>[s(S,{label:"series"},{default:m(()=>a[6]||(a[6]=[c("串联电路")])),_:1}),s(S,{label:"parallel"},{default:m(()=>a[7]||(a[7]=[c("并联电路")])),_:1}),s(S,{label:"mixed"},{default:m(()=>a[8]||(a[8]=[c("混合电路")])),_:1})]),_:1},8,["modelValue"])]),l("div",ea,[a[14]||(a[14]=l("h3",null,"参数设置",-1)),l("div",sa,[l("div",ta,[a[10]||(a[10]=l("span",null,"电源电压 (V)",-1)),s(I,{modelValue:t.value,"onUpdate:modelValue":a[1]||(a[1]=d=>t.value=d),min:0,max:24,step:.5,"show-input":"",onChange:C},null,8,["modelValue"])]),l("div",da,[a[11]||(a[11]=l("span",null,"电阻R₁ (Ω)",-1)),s(I,{modelValue:n.value,"onUpdate:modelValue":a[2]||(a[2]=d=>n.value=d),min:1,max:100,step:1,"show-input":"",onChange:C},null,8,["modelValue"])]),l("div",oa,[a[12]||(a[12]=l("span",null,"电阻R₂ (Ω)",-1)),s(I,{modelValue:v.value,"onUpdate:modelValue":a[3]||(a[3]=d=>v.value=d),min:1,max:100,step:1,"show-input":"",onChange:C},null,8,["modelValue"])]),r.value==="mixed"?(A(),U("div",ua,[a[13]||(a[13]=l("span",null,"电阻R₃ (Ω)",-1)),s(I,{modelValue:R.value,"onUpdate:modelValue":a[4]||(a[4]=d=>R.value=d),min:1,max:100,step:1,"show-input":"",onChange:C},null,8,["modelValue"])])):W("",!0)])]),l("div",na,[s(B,{type:"primary",onClick:E},{default:m(()=>a[15]||(a[15]=[c("开始模拟")])),_:1}),s(B,{onClick:k},{default:m(()=>a[16]||(a[16]=[c("停止")])),_:1}),s(B,{onClick:M},{default:m(()=>a[17]||(a[17]=[c("重置")])),_:1}),s(z,{modelValue:K.value,"onUpdate:modelValue":a[5]||(a[5]=d=>K.value=d)},{default:m(()=>a[18]||(a[18]=[c("显示数值")])),_:1},8,["modelValue"])])])]),l("div",va,[a[26]||(a[26]=l("h3",null,"电路分析结果",-1)),l("div",ia,[l("div",ra,[a[20]||(a[20]=l("span",{class:"result-label"},"总电流 (A)",-1)),l("span",pa,u(o.value.toFixed(2)),1)]),l("div",ca,[a[21]||(a[21]=l("span",{class:"result-label"},"总电阻 (Ω)",-1)),l("span",ma,u(_.value.toFixed(2)),1)]),l("div",_a,[a[22]||(a[22]=l("span",{class:"result-label"},"总功率 (W)",-1)),l("span",Va,u(y.value.toFixed(2)),1)]),l("div",fa,[a[23]||(a[23]=l("span",{class:"result-label"},"能量效率 (%)",-1)),l("span",xa,u(L.value.toFixed(1)),1)])]),a[27]||(a[27]=l("h3",null,"各元件参数",-1)),l("div",ga,[r.value!=="mixed"?(A(),U("div",Ca,[a[24]||(a[24]=l("h4",null,"电阻R₁",-1)),l("div",Ra,[l("div",ba,[l("span",null,"电压: "+u(p.value.toFixed(2))+" V",1)]),l("div",wa,[l("span",null,"电流: "+u(V.value.toFixed(2))+" A",1)]),l("div",ya,[l("span",null,"功率: "+u(x.value.toFixed(2))+" W",1)])])])):W("",!0),r.value!=="mixed"?(A(),U("div",Fa,[a[25]||(a[25]=l("h4",null,"电阻R₂",-1)),l("div",ha,[l("div",ka,[l("span",null,"电压: "+u(i.value.toFixed(2))+" V",1)]),l("div",Ia,[l("span",null,"电流: "+u(f.value.toFixed(2))+" A",1)]),l("div",Ua,[l("span",null,"功率: "+u(g.value.toFixed(2))+" W",1)])])])):W("",!0)])])]),a[28]||(a[28]=q('<div class="theory-panel" data-v-95ad2d01><h3 data-v-95ad2d01>电路分析基础</h3><div class="theory-section" data-v-95ad2d01><h4 data-v-95ad2d01>基尔霍夫定律</h4><p data-v-95ad2d01>基尔霍夫定律是分析电路的两个基本规则:</p><div class="formula" data-v-95ad2d01><p data-v-95ad2d01>电流定律 (KCL): 在任何节点，进入该节点的电流等于离开该节点的电流</p><p data-v-95ad2d01>电压定律 (KVL): 在任何闭合回路中，电压源的电压等于电路元件上的电压降之和</p></div></div><div class="theory-section" data-v-95ad2d01><h4 data-v-95ad2d01>串联电路</h4><p data-v-95ad2d01>在串联电路中，元件按顺序一个接一个连接，因此相同的电流流过每个元件。</p><div class="formula" data-v-95ad2d01><p data-v-95ad2d01>总电阻: Rtotal = R₁ + R₂ + ... + Rₙ</p><p data-v-95ad2d01>电流: I = V / Rtotal</p><p data-v-95ad2d01>各电阻上的电压: Vₙ = I × Rₙ</p></div></div><div class="theory-section" data-v-95ad2d01><h4 data-v-95ad2d01>并联电路</h4><p data-v-95ad2d01>在并联电路中，元件连接在相同的两点之间，因此每个元件承受相同的电压。</p><div class="formula" data-v-95ad2d01><p data-v-95ad2d01>总电阻: 1/Rtotal = 1/R₁ + 1/R₂ + ... + 1/Rₙ</p><p data-v-95ad2d01>各电阻上的电流: Iₙ = V / Rₙ</p><p data-v-95ad2d01>总电流: Itotal = I₁ + I₂ + ... + Iₙ</p></div></div><div class="important-notes" data-v-95ad2d01><h4 data-v-95ad2d01>电路分析方法</h4><ul data-v-95ad2d01><li data-v-95ad2d01>简单电路可以通过直接应用欧姆定律和基尔霍夫定律求解</li><li data-v-95ad2d01>复杂电路可以使用节点分析法或网孔分析法求解</li><li data-v-95ad2d01>电路模拟可以帮助直观理解电路行为和电能的流动</li></ul></div></div>',1))])])])}}}),Ba=O(Aa,[["__scopeId","data-v-95ad2d01"]]);export{Ba as default};
