import{S as ge,C as ye,A as he,D as be,P as Ve,W as xe,d as Me,M as X,e as Pe,f as Y,G as Se,g as ke,h as ae,B as C,L as le,i as se,j as _e,k as je,V as M,l as Ce,Q as Ge}from"./three.module-B_RPcjEZ.js";import{O as Fe}from"./OrbitControls-BbrUZaix.js";import{a as Le,r as u,a3 as H,l as ze,n as Ue,b as Ie,e as t,h as v,S as Ae,f as s,g as G,w as c,t as E,o as Be,_ as De}from"./index-B25jyehn.js";const He={class:"projectile-motion"},Ee={class:"container"},Ne={class:"simulation-container"},Re={class:"simulation-content"},We={class:"simulation-controls"},qe={class:"control-group"},Oe={class:"control-group"},Qe={class:"control-group"},Te={class:"control-group"},Je={class:"control-group"},Ke={class:"view-controls"},Xe={class:"control-actions"},Ye={class:"simulation-metrics"},Ze={class:"metric-card"},$e={class:"metric-value"},et={class:"metric-card"},tt={class:"metric-value"},ot={class:"metric-card"},at={class:"metric-value"},lt=Le({__name:"ProjectileMotion",setup(st){const F=u(45),P=u(20),N=u(1),R=u(.1),h=u("sphere"),L=u("3d"),z=u(!0),W=u(!0),U=u(!1),q=u(0),O=u(0),Q=u(0),b=u(null);let f,n,d,S,i,k,w,y,Z=new Ce,$,p=new M(0,0,0),V=new M,I=new M,_=[],T=[],A=!1,B=0,j=0;const ne=o=>o.toFixed(2),ie=()=>{if(!b.value)return;n=new ge,n.background=new ye(15790320);const o=new he(16777215,.5);n.add(o);const e=new be(16777215,.8);e.position.set(10,20,15),e.castShadow=!0,e.shadow.mapSize.width=2048,e.shadow.mapSize.height=2048,n.add(e);const l=b.value.clientWidth,r=400;d=new Ve(45,l/r,.1,1e3),d.position.set(15,10,15),d.lookAt(0,0,0),f=new xe({antialias:!0}),f.setSize(l,r),f.shadowMap.enabled=!0,b.value.innerHTML="",b.value.appendChild(f.domElement),S=new Fe(d,f.domElement),S.enableDamping=!0,S.dampingFactor=.1;const g=new Me(30,30),m=new X({color:8956552,side:Pe});k=new Y(g,m),k.rotation.x=-Math.PI/2,k.position.y=0,k.receiveShadow=!0,n.add(k);const x=new Se(30,30);n.add(x);const a=new ke(5);n.add(a);const J=new ae(2,.5,2),K=new X({color:8947899}),D=new Y(J,K);D.position.set(0,.25,0),D.castShadow=!0,D.receiveShadow=!0,n.add(D);const ve=new C,pe=new le({color:16711680});w=new se(ve,pe),n.add(w);const fe=new C,we=new le({color:35071,transparent:!0,opacity:.5});y=new se(fe,we),n.add(y),ee(),te()},ee=()=>{let o;switch(h.value){case"cube":o=new ae(.5,.5,.5);break;case"cone":o=new je(.3,.8,16);break;case"sphere":default:o=new _e(.3,32,32);break}const e=new X({color:16090946,metalness:.3,roughness:.4});i&&n.remove(i),i=new Y(o,e),i.castShadow=!0,i.position.copy(p),h.value==="cone"&&(i.rotation.x=Math.PI/2),n.add(i)},de=()=>{if(d){switch(L.value){case"side":d.position.set(15,5,0);break;case"top":d.position.set(0,20,0);break;case"3d":default:d.position.set(15,10,15);break}d.lookAt(new M(0,5,0)),S.update()}},re=()=>{oe();const o=F.value*Math.PI/180,e=P.value*Math.cos(o),l=P.value*Math.sin(o);V.set(e,l,0),ue(),A=!0,B=0,j=0,Z.start()},ue=()=>{T=[];const o=9.8,e=F.value*Math.PI/180,l=P.value,r=l*Math.cos(e),g=l*Math.sin(e),m=2*g/o;for(let a=0;a<=m;a+=m/100){const J=r*a,K=g*a-.5*o*a*a;T.push(new M(J,K,0))}const x=new C().setFromPoints(T);y.geometry.dispose(),y.geometry=x},ce=o=>{if(!A||U.value)return;const e=new M(0,-9.8,0),l=R.value*V.lengthSq(),r=V.clone().normalize().multiplyScalar(-l);I.copy(e),I.add(r.divideScalar(N.value)),V.add(I.clone().multiplyScalar(o));const g=V.clone().multiplyScalar(o).add(I.clone().multiplyScalar(.5*o*o));if(p.add(g),i.position.copy(p),h.value==="cone"){const m=new Ge;m.setFromUnitVectors(new M(0,1,0),V.clone().normalize()),i.quaternion.copy(m)}if(z.value){_.push(p.clone()),_.length>500&&_.shift();const m=new C().setFromPoints(_);w.geometry.dispose(),w.geometry=m}p.y>j&&(j=p.y,O.value=j),p.y<=0&&(p.y=0,q.value=B,Q.value=p.x,A=!1),B+=o},te=()=>{$=requestAnimationFrame(te);const o=Math.min(Z.getDelta(),.05);ce(o),S.update(),f.render(n,d)},oe=()=>{p.set(0,.5,0),V.set(0,0,0),i&&(i.position.copy(p),h.value==="cone"&&(i.rotation.x=Math.PI/2,i.rotation.y=0,i.rotation.z=0)),_=[];const o=new C().setFromPoints([]);w.geometry.dispose(),w.geometry=o,q.value=0,O.value=0,Q.value=0,A=!1,B=0,j=0},me=()=>{U.value=!U.value};return H(h,()=>{ee()}),H(L,()=>{de()}),H(W,o=>{y.visible=o}),H(z,o=>{w.visible=o}),ze(()=>{ie();const o=()=>{if(!b.value||!d||!f)return;const e=b.value.clientWidth,l=400;d.aspect=e/l,d.updateProjectionMatrix(),f.setSize(e,l)};window.addEventListener("resize",o),Ue(()=>{window.removeEventListener("resize",o),cancelAnimationFrame($),f&&f.dispose(),n&&n.clear(),w&&w.geometry&&w.geometry.dispose(),y&&y.geometry&&y.geometry.dispose()})}),(o,e)=>{const l=G("el-slider"),r=G("el-radio"),g=G("el-radio-group"),m=G("el-checkbox"),x=G("el-button");return Be(),Ie("div",He,[t("div",Ee,[e[30]||(e[30]=t("div",{class:"module-header"},[t("h1",null,[v("抛体运动 "),t("span",{class:"module-subtitle"},"Projectile Motion")]),t("p",{class:"module-description"}," 抛体运动是物体在重力作用下沿抛物线轨迹运动的过程。现实中，空气阻力会影响物体的运动轨迹，使其偏离理想抛物线。 本模拟展示了考虑空气阻力的更真实的抛体运动。 ")],-1)),t("div",Ne,[e[28]||(e[28]=t("div",{class:"simulation-header"},[t("h2",null,"3D模拟实验：抛体运动与空气阻力"),t("p",null,"通过调整发射角度、初速度、质量和空气阻力系数，观察物体在空中的运动轨迹变化。")],-1)),t("div",Re,[t("div",{class:"simulation-canvas",ref_key:"simulationCanvas",ref:b},null,512),t("div",We,[e[27]||(e[27]=t("h3",null,"控制面板",-1)),t("div",qe,[e[8]||(e[8]=t("label",null,"发射角度 (度)",-1)),s(l,{modelValue:F.value,"onUpdate:modelValue":e[0]||(e[0]=a=>F.value=a),min:0,max:90,step:1,"show-input":""},null,8,["modelValue"])]),t("div",Oe,[e[9]||(e[9]=t("label",null,"初速度 (m/s)",-1)),s(l,{modelValue:P.value,"onUpdate:modelValue":e[1]||(e[1]=a=>P.value=a),min:1,max:50,step:1,"show-input":""},null,8,["modelValue"])]),t("div",Qe,[e[10]||(e[10]=t("label",null,"物体质量 (kg)",-1)),s(l,{modelValue:N.value,"onUpdate:modelValue":e[2]||(e[2]=a=>N.value=a),min:.1,max:10,step:.1,"show-input":""},null,8,["modelValue"])]),t("div",Te,[e[11]||(e[11]=t("label",null,"空气阻力系数",-1)),s(l,{modelValue:R.value,"onUpdate:modelValue":e[3]||(e[3]=a=>R.value=a),min:0,max:1,step:.01,"format-tooltip":ne,"show-input":""},null,8,["modelValue"])]),t("div",Je,[e[15]||(e[15]=t("label",null,"物体形状",-1)),s(g,{modelValue:h.value,"onUpdate:modelValue":e[4]||(e[4]=a=>h.value=a)},{default:c(()=>[s(r,{label:"sphere"},{default:c(()=>e[12]||(e[12]=[v("球形")])),_:1}),s(r,{label:"cube"},{default:c(()=>e[13]||(e[13]=[v("立方体")])),_:1}),s(r,{label:"cone"},{default:c(()=>e[14]||(e[14]=[v("圆锥体")])),_:1})]),_:1},8,["modelValue"])]),t("div",Ke,[e[21]||(e[21]=t("h3",null,"视角控制",-1)),s(g,{modelValue:L.value,"onUpdate:modelValue":e[5]||(e[5]=a=>L.value=a)},{default:c(()=>[s(r,{label:"3d"},{default:c(()=>e[16]||(e[16]=[v("3D视角")])),_:1}),s(r,{label:"side"},{default:c(()=>e[17]||(e[17]=[v("侧视图")])),_:1}),s(r,{label:"top"},{default:c(()=>e[18]||(e[18]=[v("俯视图")])),_:1})]),_:1},8,["modelValue"]),s(m,{modelValue:z.value,"onUpdate:modelValue":e[6]||(e[6]=a=>z.value=a)},{default:c(()=>e[19]||(e[19]=[v("显示轨迹")])),_:1},8,["modelValue"]),s(m,{modelValue:W.value,"onUpdate:modelValue":e[7]||(e[7]=a=>W.value=a)},{default:c(()=>e[20]||(e[20]=[v("显示理想抛物线")])),_:1},8,["modelValue"])]),t("div",Xe,[s(x,{type:"primary",onClick:re},{default:c(()=>e[22]||(e[22]=[v("发射")])),_:1}),s(x,{onClick:oe},{default:c(()=>e[23]||(e[23]=[v("重置")])),_:1}),s(x,{onClick:me},{default:c(()=>[v(E(U.value?"继续":"暂停"),1)]),_:1})]),t("div",Ye,[t("div",Ze,[t("div",$e,E(q.value.toFixed(2))+" s",1),e[24]||(e[24]=t("div",{class:"metric-label"},"飞行时间",-1))]),t("div",et,[t("div",tt,E(O.value.toFixed(2))+" m",1),e[25]||(e[25]=t("div",{class:"metric-label"},"最大高度",-1))]),t("div",ot,[t("div",at,E(Q.value.toFixed(2))+" m",1),e[26]||(e[26]=t("div",{class:"metric-label"},"水平距离",-1))])])])]),e[29]||(e[29]=Ae('<div class="theory-section" data-v-23644c93><div class="formula-display" data-v-23644c93><h3 data-v-23644c93>抛体运动公式</h3><div class="formula" data-v-23644c93><p data-v-23644c93><strong data-v-23644c93>理想情况 (无空气阻力):</strong></p><span class="formula-text" data-v-23644c93>x = v₀·cos(θ)·t</span><span class="formula-text" data-v-23644c93>y = v₀·sin(θ)·t - (1/2)·g·t²</span></div><div class="formula" data-v-23644c93><p data-v-23644c93><strong data-v-23644c93>考虑空气阻力:</strong></p><span class="formula-text" data-v-23644c93>F_drag = -b·v²</span><p data-v-23644c93>其中 b 是空气阻力系数，与物体的形状、大小和空气密度有关</p></div></div><div class="key-points" data-v-23644c93><h3 data-v-23644c93>关键要点</h3><ul data-v-23644c93><li data-v-23644c93>理想抛体运动轨迹为抛物线，但空气阻力会使实际轨迹偏离抛物线。</li><li data-v-23644c93>空气阻力与速度的平方成正比，方向与速度方向相反。</li><li data-v-23644c93>物体质量越大，空气阻力对其运动的影响越小。</li><li data-v-23644c93>物体形状会影响空气阻力的大小，流线型物体受到的阻力较小。</li><li data-v-23644c93>理想情况下，相同初速度和角度的抛体运动具有对称的轨迹，但空气阻力会破坏这种对称性。</li></ul></div></div>',1))])])])}}}),rt=De(lt,[["__scopeId","data-v-23644c93"]]);export{rt as default};
