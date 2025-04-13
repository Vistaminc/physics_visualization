import{a as j,r as l,c as q,a4 as D,b as f,e,h as m,S as L,a5 as k,q as A,F as W,x as G,f as n,w as p,g as V,j as N,t as C,o as h,_ as H}from"./index-B25jyehn.js";const J={class:"magnetism-page"},K={class:"container"},O={class:"simulation-container"},P={class:"simulation-panel"},Q={class:"simulation-view"},X={class:"simulation-canvas"},Y={class:"meter"},Z={class:"simulation-controls"},aa={class:"control-group"},ea={class:"control-group"},la={class:"parameter-sliders"},ta={key:0,class:"parameter-slider"},sa={key:1,class:"parameter-slider"},na={class:"parameter-slider"},oa={key:0},ia={key:1},da={class:"control-buttons"},va={class:"data-panel"},ua={class:"data-grid"},ra={class:"data-item"},ca={class:"data-value"},ma={class:"data-item"},pa={class:"data-value"},ga={class:"data-item"},_a={class:"data-value"},fa={class:"data-item"},ha={class:"data-value"},ba=j({__name:"Magnetism",setup(xa){const t=l("moving-magnet"),i=l(5),b=l(5),v=l(5),w=l(!0),u=l(0),o=l(0),g=l(0),r=l(0),x=l(0),M=l(!1),F=l(!1),y=l(!1);let _=null,d=0;const T=q(()=>t.value==="moving-magnet"?{left:`${50+30*Math.sin(d*.2*i.value)}px`}:{}),R=()=>{M.value||(M.value=!0,F.value=!0,_=window.setInterval(()=>{if(d+=.1,t.value==="moving-magnet"){const c=Math.sin(d*.2*i.value),a=.2*i.value*Math.cos(d*.2*i.value);g.value=v.value*(1/(1+Math.abs(c)*2)),r.value=g.value*.5,u.value=-a*v.value*Math.sign(c)*.5,o.value=u.value*.1,x.value=o.value*30,y.value=Math.abs(o.value)>.2}else if(t.value==="moving-coil"){const c=Math.sin(d*.2*i.value),a=.2*i.value*Math.cos(d*.2*i.value);r.value=v.value*.2,g.value=r.value*(1+c*.5),u.value=a*r.value*v.value*.1,o.value=u.value*.1,x.value=o.value*30,y.value=Math.abs(o.value)>.2}else if(t.value==="changing-current"){const c=Math.sin(d*.3*b.value),a=.3*b.value*Math.cos(d*.3*b.value);r.value=c*v.value*.3,g.value=r.value*2,u.value=a*v.value*.15,o.value=u.value*.1,x.value=o.value*30,y.value=Math.abs(c)>.3}},100))},S=()=>{M.value=!1,F.value=!1,_&&(clearInterval(_),_=null)},U=()=>{S(),d=0,u.value=0,o.value=0,g.value=0,r.value=0,x.value=0,y.value=!1};return D(()=>{_&&clearInterval(_)}),(c,a)=>{const B=V("el-radio-button"),z=V("el-radio-group"),I=V("el-slider"),E=V("el-button"),$=V("el-checkbox");return h(),f("div",J,[e("div",K,[a[24]||(a[24]=e("div",{class:"page-header"},[e("h1",{class:"page-title"},[m("电磁感应 "),e("span",{class:"page-subtitle"},"Electromagnetism")]),e("p",{class:"page-description"}," 电磁感应是电流产生磁场以及磁场变化产生电流的现象。通过交互式模拟，探索电流与磁场的关系、电磁感应定律及其应用。 ")],-1)),e("div",O,[e("div",P,[e("div",Q,[e("div",X,[e("div",{class:k(["magnetism-system",t.value])},[e("div",{class:k(["magnet",{moving:F.value}]),style:A(T.value)},null,6),e("div",{class:k(["coil",{active:y.value}])},a[5]||(a[5]=[e("div",{class:"coil-wire"},null,-1)]),2),e("div",{class:k(["magnetic-field",{visible:w.value}])},[(h(),f(W,null,G(5,s=>e("div",{class:"field-line",key:s})),64))],2),e("div",Y,[e("div",{class:"meter-needle",style:A({transform:`rotate(${x.value}deg)`})},null,4)])],2)]),e("div",Z,[e("div",aa,[a[9]||(a[9]=e("h3",null,"实验类型",-1)),n(z,{modelValue:t.value,"onUpdate:modelValue":a[0]||(a[0]=s=>t.value=s),onChange:U},{default:p(()=>[n(B,{label:"moving-magnet"},{default:p(()=>a[6]||(a[6]=[m("移动磁铁")])),_:1}),n(B,{label:"moving-coil"},{default:p(()=>a[7]||(a[7]=[m("移动线圈")])),_:1}),n(B,{label:"changing-current"},{default:p(()=>a[8]||(a[8]=[m("变化电流")])),_:1})]),_:1},8,["modelValue"])]),e("div",ea,[a[12]||(a[12]=e("h3",null,"参数设置",-1)),e("div",la,[t.value==="moving-magnet"||t.value==="moving-coil"?(h(),f("div",ta,[a[10]||(a[10]=e("span",null,"运动速度",-1)),n(I,{modelValue:i.value,"onUpdate:modelValue":a[1]||(a[1]=s=>i.value=s),min:1,max:10,step:1,"show-input":""},null,8,["modelValue"])])):N("",!0),t.value==="changing-current"?(h(),f("div",sa,[a[11]||(a[11]=e("span",null,"电流变化率",-1)),n(I,{modelValue:b.value,"onUpdate:modelValue":a[2]||(a[2]=s=>b.value=s),min:1,max:10,step:1,"show-input":""},null,8,["modelValue"])])):N("",!0),e("div",na,[t.value==="moving-magnet"?(h(),f("span",oa,"磁铁强度")):(h(),f("span",ia,"线圈匝数")),n(I,{modelValue:v.value,"onUpdate:modelValue":a[3]||(a[3]=s=>v.value=s),min:1,max:10,step:1,"show-input":""},null,8,["modelValue"])])])]),e("div",da,[n(E,{type:"primary",onClick:R},{default:p(()=>a[13]||(a[13]=[m("开始实验")])),_:1}),n(E,{onClick:S,disabled:!M.value},{default:p(()=>a[14]||(a[14]=[m("暂停")])),_:1},8,["disabled"]),n(E,{onClick:U},{default:p(()=>a[15]||(a[15]=[m("重置")])),_:1}),n($,{modelValue:w.value,"onUpdate:modelValue":a[4]||(a[4]=s=>w.value=s)},{default:p(()=>a[16]||(a[16]=[m("显示磁场")])),_:1},8,["modelValue"])])])]),e("div",va,[a[21]||(a[21]=e("h3",null,"测量数据",-1)),e("div",ua,[e("div",ra,[a[17]||(a[17]=e("span",{class:"data-label"},"感应电动势 (V)",-1)),e("span",ca,C(u.value.toFixed(2)),1)]),e("div",ma,[a[18]||(a[18]=e("span",{class:"data-label"},"感应电流 (A)",-1)),e("span",pa,C(o.value.toFixed(2)),1)]),e("div",ga,[a[19]||(a[19]=e("span",{class:"data-label"},"磁通量 (Wb)",-1)),e("span",_a,C(g.value.toFixed(2)),1)]),e("div",fa,[a[20]||(a[20]=e("span",{class:"data-label"},"磁场强度 (T)",-1)),e("span",ha,C(r.value.toFixed(2)),1)])]),a[22]||(a[22]=e("div",{class:"chart-container"},[e("h4",null,"感应电动势-时间图像"),e("div",{class:"chart-placeholder"})],-1))])]),a[23]||(a[23]=L('<div class="theory-panel" data-v-0c197a19><h3 data-v-0c197a19>电磁感应理论</h3><div class="theory-section" data-v-0c197a19><h4 data-v-0c197a19>法拉第电磁感应定律</h4><p data-v-0c197a19>通过闭合回路的磁通量发生变化时，将在回路中产生感应电动势。感应电动势的大小与磁通量变化率成正比。</p><div class="formula" data-v-0c197a19><p data-v-0c197a19>ε = -dΦ/dt</p><p data-v-0c197a19>其中 ε 是感应电动势，Φ 是磁通量，t 是时间。</p></div></div><div class="theory-section" data-v-0c197a19><h4 data-v-0c197a19>楞次定律</h4><p data-v-0c197a19>感应电流的方向总是产生一个磁场，该磁场反对引起感应电流的磁通量变化。</p><div class="formula" data-v-0c197a19><p data-v-0c197a19>感应电流的方向可以通过右手规则确定</p></div></div><div class="theory-section" data-v-0c197a19><h4 data-v-0c197a19>安培环路定律</h4><p data-v-0c197a19>在静止的闭合环路上，磁场的线积分与穿过环路的电流成正比。</p><div class="formula" data-v-0c197a19><p data-v-0c197a19>∮B·dl = μ₀I</p><p data-v-0c197a19>其中 B 是磁感应强度，I 是穿过环路的电流，μ₀ 是真空磁导率。</p></div></div><div class="theory-section" data-v-0c197a19><h4 data-v-0c197a19>磁通量</h4><p data-v-0c197a19>通过一个表面的磁通量等于磁场强度与表面积的乘积。</p><div class="formula" data-v-0c197a19><p data-v-0c197a19>Φ = B·A·cosθ</p><p data-v-0c197a19>其中 B 是磁场强度，A 是面积，θ 是磁场方向与面积法线的夹角。</p></div></div><div class="important-notes" data-v-0c197a19><h4 data-v-0c197a19>电磁感应的应用</h4><ul data-v-0c197a19><li data-v-0c197a19>发电机：通过机械能转化为电能</li><li data-v-0c197a19>变压器：改变交流电的电压</li><li data-v-0c197a19>电磁波：无线通信的基础</li><li data-v-0c197a19>电磁感应炉：利用涡流加热导电物体</li></ul></div></div>',1))])])])}}}),Va=H(ba,[["__scopeId","data-v-0c197a19"]]);export{Va as default};
