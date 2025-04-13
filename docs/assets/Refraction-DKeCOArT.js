import{a as P,r as n,c as k,l as T,b as f,e as a,h as C,S as $,j as w,q as b,t as o,f as s,w as I,g as M,o as g,_ as j}from"./index-B25jyehn.js";const q={class:"refraction-page"},z={class:"container"},D={class:"refraction-container"},E={class:"simulation-panel"},G={class:"simulation-view"},H={class:"simulation-canvas"},J={class:"refraction-system"},K={class:"angle-indicator incident-angle"},L={class:"angle-value"},O={class:"angle-indicator refracted-angle"},Q={class:"angle-value"},W={class:"media-labels"},X={class:"medium1"},Y={class:"medium2"},Z={key:0,class:"total-reflection-indicator"},aa={class:"simulation-controls"},ea={class:"control-group"},sa={class:"media-selectors"},la={class:"medium-selector"},ta={class:"medium-selector"},na={class:"control-group"},oa={class:"control-group"},da={class:"wavelength-slider"},ia={class:"control-buttons"},va={class:"data-panel"},ua={class:"data-grid"},ra={class:"data-item"},ca={class:"data-value"},pa={class:"data-item"},ma={class:"data-value"},_a={class:"data-item"},fa={class:"data-value"},ba={class:"data-item"},ga={class:"data-value"},ha={key:0,class:"light-intensity"},ya={class:"intensity-bars"},Va={class:"intensity-bar"},xa={class:"bar-container"},wa={class:"bar-value"},Ia={key:0,class:"intensity-bar"},Ma={class:"bar-container"},Fa={class:"bar-value"},Ra={key:1,class:"critical-angle"},ka={class:"critical-angle-value"},Ca=P({__name:"Refraction",setup(Ua){const U={空气:1,水:1.33,玻璃:1.5,钻石:2.42},h=n("空气"),y=n("玻璃"),v=n(30),A=n(580),N=n(!0),F=n(!0),d=k(()=>U[h.value]),i=k(()=>U[y.value]),u=n(0),S=n(0),r=n(!1),B=k(()=>d.value<=i.value?90:Math.asin(i.value/d.value)*(180/Math.PI)),V=n(0),x=n(0),c=()=>{S.value=180-v.value;const R=v.value*(Math.PI/180),e=d.value/i.value*Math.sin(R);if(Math.abs(e)>1&&d.value>i.value)r.value=!0,u.value=0,V.value=1,x.value=0;else{r.value=!1;const l=Math.asin(e);u.value=180-l*(180/Math.PI);const p=Math.cos(R),m=Math.cos(l),_=Math.pow((d.value*p-i.value*m)/(d.value*p+i.value*m),2);V.value=_,x.value=1-_}};return T(()=>{c()}),(R,e)=>{const l=M("el-option"),p=M("el-select"),m=M("el-slider"),_=M("el-checkbox");return g(),f("div",q,[a("div",z,[e[29]||(e[29]=a("div",{class:"page-header"},[a("h1",{class:"page-title"},[C("光的折射 "),a("span",{class:"page-subtitle"},"Refraction")]),a("p",{class:"page-description"}," 光的折射是光线从一种介质进入另一种介质时，传播方向发生偏折的现象。通过本模拟，可以观察和探索折射定律以及光在不同介质中传播的行为。 ")],-1)),a("div",D,[a("div",E,[a("div",G,[a("div",H,[a("div",J,[e[9]||(e[9]=a("div",{class:"media-boundary"},null,-1)),a("div",{class:"light-source",style:b({transform:`rotate(${v.value}deg)`})},e[6]||(e[6]=[a("div",{class:"beam incident-beam"},null,-1)]),4),a("div",{class:"refracted-beam",style:b({transform:`rotate(${u.value}deg)`})},null,4),a("div",{class:"reflected-beam",style:b({transform:`rotate(${S.value}deg)`})},null,4),a("div",K,[e[7]||(e[7]=a("div",{class:"angle-arc"},null,-1)),a("div",L,o(v.value.toFixed(1))+"°",1)]),a("div",O,[e[8]||(e[8]=a("div",{class:"angle-arc"},null,-1)),a("div",Q,o(u.value.toFixed(1))+"°",1)]),a("div",W,[a("div",X,o(h.value),1),a("div",Y,o(y.value),1)]),e[10]||(e[10]=a("div",{class:"normal-line"},null,-1)),r.value?(g(),f("div",Z,"全反射")):w("",!0)])]),a("div",aa,[a("div",ea,[e[13]||(e[13]=a("h3",null,"介质类型",-1)),a("div",sa,[a("div",la,[e[11]||(e[11]=a("span",null,"上方介质",-1)),s(p,{modelValue:h.value,"onUpdate:modelValue":e[0]||(e[0]=t=>h.value=t),onChange:c},{default:I(()=>[s(l,{label:"空气 (n=1.00)",value:"空气"}),s(l,{label:"水 (n=1.33)",value:"水"}),s(l,{label:"玻璃 (n=1.50)",value:"玻璃"}),s(l,{label:"钻石 (n=2.42)",value:"钻石"})]),_:1},8,["modelValue"])]),a("div",ta,[e[12]||(e[12]=a("span",null,"下方介质",-1)),s(p,{modelValue:y.value,"onUpdate:modelValue":e[1]||(e[1]=t=>y.value=t),onChange:c},{default:I(()=>[s(l,{label:"空气 (n=1.00)",value:"空气"}),s(l,{label:"水 (n=1.33)",value:"水"}),s(l,{label:"玻璃 (n=1.50)",value:"玻璃"}),s(l,{label:"钻石 (n=2.42)",value:"钻石"})]),_:1},8,["modelValue"])])])]),a("div",na,[e[14]||(e[14]=a("h3",null,"入射角 (°)",-1)),s(m,{modelValue:v.value,"onUpdate:modelValue":e[2]||(e[2]=t=>v.value=t),min:0,max:90,step:1,"show-input":"",onInput:c},null,8,["modelValue"])]),a("div",oa,[e[16]||(e[16]=a("h3",null,"波长 (nm)",-1)),a("div",da,[s(m,{modelValue:A.value,"onUpdate:modelValue":e[3]||(e[3]=t=>A.value=t),min:380,max:780,step:10,"show-input":"",onInput:c},null,8,["modelValue"]),e[15]||(e[15]=a("div",{class:"color-spectrum"},null,-1))])]),a("div",ia,[s(_,{modelValue:N.value,"onUpdate:modelValue":e[4]||(e[4]=t=>N.value=t)},{default:I(()=>e[17]||(e[17]=[C("显示角度")])),_:1},8,["modelValue"]),s(_,{modelValue:F.value,"onUpdate:modelValue":e[5]||(e[5]=t=>F.value=t)},{default:I(()=>e[18]||(e[18]=[C("显示光强")])),_:1},8,["modelValue"])])])]),a("div",va,[e[27]||(e[27]=a("h3",null,"折射数据",-1)),a("div",ua,[a("div",ra,[e[19]||(e[19]=a("span",{class:"data-label"},"介质1折射率",-1)),a("span",ca,o(d.value.toFixed(2)),1)]),a("div",pa,[e[20]||(e[20]=a("span",{class:"data-label"},"介质2折射率",-1)),a("span",ma,o(i.value.toFixed(2)),1)]),a("div",_a,[e[21]||(e[21]=a("span",{class:"data-label"},"入射角 (°)",-1)),a("span",fa,o(v.value.toFixed(1)),1)]),a("div",ba,[e[22]||(e[22]=a("span",{class:"data-label"},"折射角 (°)",-1)),a("span",ga,o(r.value?"---":u.value.toFixed(1)),1)])]),F.value?(g(),f("div",ha,[e[25]||(e[25]=a("h4",null,"光强比例",-1)),a("div",ya,[a("div",Va,[e[23]||(e[23]=a("div",{class:"bar-label"},"反射光",-1)),a("div",xa,[a("div",{class:"bar-fill reflected",style:b({width:V.value*100+"%"})},null,4)]),a("div",wa,o((V.value*100).toFixed(1))+"%",1)]),r.value?w("",!0):(g(),f("div",Ia,[e[24]||(e[24]=a("div",{class:"bar-label"},"折射光",-1)),a("div",Ma,[a("div",{class:"bar-fill refracted",style:b({width:x.value*100+"%"})},null,4)]),a("div",Fa,o((x.value*100).toFixed(1))+"%",1)]))])])):w("",!0),d.value>i.value?(g(),f("div",Ra,[e[26]||(e[26]=a("h4",null,"临界角",-1)),a("div",ka,[a("span",null,"临界角: "+o(B.value.toFixed(1))+"°",1)])])):w("",!0)])]),e[28]||(e[28]=$('<div class="theory-panel" data-v-909a5ea7><h3 data-v-909a5ea7>光的折射理论</h3><div class="theory-section" data-v-909a5ea7><h4 data-v-909a5ea7>折射定律</h4><p data-v-909a5ea7>折射定律（斯涅尔定律）描述了光从一种介质进入另一种介质时发生折射的规律。</p><div class="formula" data-v-909a5ea7><p data-v-909a5ea7>n₁ sin θ₁ = n₂ sin θ₂</p><p data-v-909a5ea7>其中 n₁ 和 n₂ 是两种介质的折射率，θ₁ 是入射角，θ₂ 是折射角。</p></div></div><div class="theory-section" data-v-909a5ea7><h4 data-v-909a5ea7>折射率</h4><p data-v-909a5ea7>折射率是光在真空中的速度与在特定介质中的速度之比。</p><div class="formula" data-v-909a5ea7><p data-v-909a5ea7>n = c / v</p><p data-v-909a5ea7>其中 c 是光在真空中的速度，v 是光在该介质中的速度。</p></div></div><div class="theory-section" data-v-909a5ea7><h4 data-v-909a5ea7>全反射</h4><p data-v-909a5ea7>当光从折射率较高的介质射向折射率较低的介质时，若入射角大于临界角，则会发生全反射现象。</p><div class="formula" data-v-909a5ea7><p data-v-909a5ea7>sin θc = n₂ / n₁ (n₁ &gt; n₂)</p><p data-v-909a5ea7>其中 θc 是临界角，n₁ 和 n₂ 分别是入射介质和折射介质的折射率。</p></div></div><div class="theory-section" data-v-909a5ea7><h4 data-v-909a5ea7>菲涅耳方程</h4><p data-v-909a5ea7>菲涅耳方程描述了光在界面上的反射和透射的强度关系。</p><div class="formula" data-v-909a5ea7><p data-v-909a5ea7>光的能量守恒：入射光能量 = 反射光能量 + 折射光能量</p></div></div><div class="important-notes" data-v-909a5ea7><h4 data-v-909a5ea7>折射的应用</h4><ul data-v-909a5ea7><li data-v-909a5ea7>光纤通信利用全反射原理传输信息</li><li data-v-909a5ea7>透镜利用折射原理成像</li><li data-v-909a5ea7>棱镜利用折射使不同波长的光发生色散</li><li data-v-909a5ea7>水中物体看起来比实际位置更浅</li></ul></div></div>',1))])])])}}}),Na=j(Ca,[["__scopeId","data-v-909a5ea7"]]);export{Na as default};
