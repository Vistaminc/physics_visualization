import{C as Rt,V as _,M as U,T as I,Q as lt,d as mt,e as T,R as Lt,f as At,g as Ct,S as Nt,h as It,A as Ut,D as zt,P as Yt,W as Vt,i as Zt,j as ot,k as Ht,l as at,G as Ft,m as Kt,n as _t,B as H,L as ft,o as yt,p as Gt,q as Xt,r as Wt}from"./three.module-CTKGZbPP.js";import{a as Bt,r as v,a3 as B,l as qt,n as Qt,b as Jt,e as a,h as D,S as $t,f as m,g as F,w as E,t as q,o as te,_ as ee}from"./index-SwCIvmeZ.js";const bt={type:"change"},ht={type:"start"},Pt={type:"end"},Q=new Lt,gt=new At,se=Math.cos(70*Ct.DEG2RAD),d=new _,g=2*Math.PI,h={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},nt=1e-6;class ie extends Rt{constructor(t,s=null){super(t,s),this.state=h.NONE,this.target=new _,this.cursor=new _,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:U.ROTATE,MIDDLE:U.DOLLY,RIGHT:U.PAN},this.touches={ONE:I.ROTATE,TWO:I.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new _,this._lastQuaternion=new lt,this._lastTargetPosition=new _,this._quat=new lt().setFromUnitVectors(t.up,new _(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new mt,this._sphericalDelta=new mt,this._scale=1,this._panOffset=new _,this._rotateStart=new T,this._rotateEnd=new T,this._rotateDelta=new T,this._panStart=new T,this._panEnd=new T,this._panDelta=new T,this._dollyStart=new T,this._dollyEnd=new T,this._dollyDelta=new T,this._dollyDirection=new _,this._mouse=new T,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=ae.bind(this),this._onPointerDown=oe.bind(this),this._onPointerUp=ne.bind(this),this._onContextMenu=pe.bind(this),this._onMouseWheel=re.bind(this),this._onKeyDown=ce.bind(this),this._onTouchStart=de.bind(this),this._onTouchMove=ue.bind(this),this._onMouseDown=le.bind(this),this._onMouseMove=he.bind(this),this._interceptControlDown=me.bind(this),this._interceptControlUp=_e.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(t){super.connect(t),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(t){t.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=t}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(bt),this.update(),this.state=h.NONE}update(t=null){const s=this.object.position;d.copy(s).sub(this.target),d.applyQuaternion(this._quat),this._spherical.setFromVector3(d),this.autoRotate&&this.state===h.NONE&&this._rotateLeft(this._getAutoRotationAngle(t)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let o=this.minAzimuthAngle,l=this.maxAzimuthAngle;isFinite(o)&&isFinite(l)&&(o<-Math.PI?o+=g:o>Math.PI&&(o-=g),l<-Math.PI?l+=g:l>Math.PI&&(l-=g),o<=l?this._spherical.theta=Math.max(o,Math.min(l,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(o+l)/2?Math.max(o,this._spherical.theta):Math.min(l,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const u=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=u!=this._spherical.radius}if(d.setFromSpherical(this._spherical),d.applyQuaternion(this._quatInverse),s.copy(this.target).add(d),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let u=null;if(this.object.isPerspectiveCamera){const y=d.length();u=this._clampDistance(y*this._scale);const k=y-u;this.object.position.addScaledVector(this._dollyDirection,k),this.object.updateMatrixWorld(),r=!!k}else if(this.object.isOrthographicCamera){const y=new _(this._mouse.x,this._mouse.y,0);y.unproject(this.object);const k=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=k!==this.object.zoom;const L=new _(this._mouse.x,this._mouse.y,0);L.unproject(this.object),this.object.position.sub(L).add(y),this.object.updateMatrixWorld(),u=d.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;u!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(u).add(this.object.position):(Q.origin.copy(this.object.position),Q.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Q.direction))<se?this.object.lookAt(this.target):(gt.setFromNormalAndCoplanarPoint(this.object.up,this.target),Q.intersectPlane(gt,this.target))))}else if(this.object.isOrthographicCamera){const u=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),u!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>nt||8*(1-this._lastQuaternion.dot(this.object.quaternion))>nt||this._lastTargetPosition.distanceToSquared(this.target)>nt?(this.dispatchEvent(bt),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(t){return t!==null?g/60*this.autoRotateSpeed*t:g/60/60*this.autoRotateSpeed}_getZoomScale(t){const s=Math.abs(t*.01);return Math.pow(.95,this.zoomSpeed*s)}_rotateLeft(t){this._sphericalDelta.theta-=t}_rotateUp(t){this._sphericalDelta.phi-=t}_panLeft(t,s){d.setFromMatrixColumn(s,0),d.multiplyScalar(-t),this._panOffset.add(d)}_panUp(t,s){this.screenSpacePanning===!0?d.setFromMatrixColumn(s,1):(d.setFromMatrixColumn(s,0),d.crossVectors(this.object.up,d)),d.multiplyScalar(t),this._panOffset.add(d)}_pan(t,s){const o=this.domElement;if(this.object.isPerspectiveCamera){const l=this.object.position;d.copy(l).sub(this.target);let r=d.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*t*r/o.clientHeight,this.object.matrix),this._panUp(2*s*r/o.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(t*(this.object.right-this.object.left)/this.object.zoom/o.clientWidth,this.object.matrix),this._panUp(s*(this.object.top-this.object.bottom)/this.object.zoom/o.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(t,s){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const o=this.domElement.getBoundingClientRect(),l=t-o.left,r=s-o.top,u=o.width,y=o.height;this._mouse.x=l/u*2-1,this._mouse.y=-(r/y)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(t){return Math.max(this.minDistance,Math.min(this.maxDistance,t))}_handleMouseDownRotate(t){this._rotateStart.set(t.clientX,t.clientY)}_handleMouseDownDolly(t){this._updateZoomParameters(t.clientX,t.clientX),this._dollyStart.set(t.clientX,t.clientY)}_handleMouseDownPan(t){this._panStart.set(t.clientX,t.clientY)}_handleMouseMoveRotate(t){this._rotateEnd.set(t.clientX,t.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const s=this.domElement;this._rotateLeft(g*this._rotateDelta.x/s.clientHeight),this._rotateUp(g*this._rotateDelta.y/s.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(t){this._dollyEnd.set(t.clientX,t.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(t){this._panEnd.set(t.clientX,t.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(t){this._updateZoomParameters(t.clientX,t.clientY),t.deltaY<0?this._dollyIn(this._getZoomScale(t.deltaY)):t.deltaY>0&&this._dollyOut(this._getZoomScale(t.deltaY)),this.update()}_handleKeyDown(t){let s=!1;switch(t.code){case this.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(g*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),s=!0;break;case this.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(-g*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),s=!0;break;case this.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(g*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),s=!0;break;case this.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(-g*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),s=!0;break}s&&(t.preventDefault(),this.update())}_handleTouchStartRotate(t){if(this._pointers.length===1)this._rotateStart.set(t.pageX,t.pageY);else{const s=this._getSecondPointerPosition(t),o=.5*(t.pageX+s.x),l=.5*(t.pageY+s.y);this._rotateStart.set(o,l)}}_handleTouchStartPan(t){if(this._pointers.length===1)this._panStart.set(t.pageX,t.pageY);else{const s=this._getSecondPointerPosition(t),o=.5*(t.pageX+s.x),l=.5*(t.pageY+s.y);this._panStart.set(o,l)}}_handleTouchStartDolly(t){const s=this._getSecondPointerPosition(t),o=t.pageX-s.x,l=t.pageY-s.y,r=Math.sqrt(o*o+l*l);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enablePan&&this._handleTouchStartPan(t)}_handleTouchStartDollyRotate(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enableRotate&&this._handleTouchStartRotate(t)}_handleTouchMoveRotate(t){if(this._pointers.length==1)this._rotateEnd.set(t.pageX,t.pageY);else{const o=this._getSecondPointerPosition(t),l=.5*(t.pageX+o.x),r=.5*(t.pageY+o.y);this._rotateEnd.set(l,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const s=this.domElement;this._rotateLeft(g*this._rotateDelta.x/s.clientHeight),this._rotateUp(g*this._rotateDelta.y/s.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(t){if(this._pointers.length===1)this._panEnd.set(t.pageX,t.pageY);else{const s=this._getSecondPointerPosition(t),o=.5*(t.pageX+s.x),l=.5*(t.pageY+s.y);this._panEnd.set(o,l)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(t){const s=this._getSecondPointerPosition(t),o=t.pageX-s.x,l=t.pageY-s.y,r=Math.sqrt(o*o+l*l);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const u=(t.pageX+s.x)*.5,y=(t.pageY+s.y)*.5;this._updateZoomParameters(u,y)}_handleTouchMoveDollyPan(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enablePan&&this._handleTouchMovePan(t)}_handleTouchMoveDollyRotate(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enableRotate&&this._handleTouchMoveRotate(t)}_addPointer(t){this._pointers.push(t.pointerId)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let s=0;s<this._pointers.length;s++)if(this._pointers[s]==t.pointerId){this._pointers.splice(s,1);return}}_isTrackingPointer(t){for(let s=0;s<this._pointers.length;s++)if(this._pointers[s]==t.pointerId)return!0;return!1}_trackPointer(t){let s=this._pointerPositions[t.pointerId];s===void 0&&(s=new T,this._pointerPositions[t.pointerId]=s),s.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){const s=t.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[s]}_customWheelEvent(t){const s=t.deltaMode,o={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(s){case 1:o.deltaY*=16;break;case 2:o.deltaY*=100;break}return t.ctrlKey&&!this._controlActive&&(o.deltaY*=10),o}}function oe(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i)))}function ae(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function ne(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Pt),this.state=h.NONE;break;case 1:const t=this._pointers[0],s=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:s.x,pageY:s.y});break}}function le(i){let t;switch(i.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case U.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=h.DOLLY;break;case U.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=h.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=h.ROTATE}break;case U.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=h.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=h.PAN}break;default:this.state=h.NONE}this.state!==h.NONE&&this.dispatchEvent(ht)}function he(i){switch(this.state){case h.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case h.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case h.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function re(i){this.enabled===!1||this.enableZoom===!1||this.state!==h.NONE||(i.preventDefault(),this.dispatchEvent(ht),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(Pt))}function ce(i){this.enabled!==!1&&this._handleKeyDown(i)}function de(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case I.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(i),this.state=h.TOUCH_ROTATE;break;case I.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(i),this.state=h.TOUCH_PAN;break;default:this.state=h.NONE}break;case 2:switch(this.touches.TWO){case I.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=h.TOUCH_DOLLY_PAN;break;case I.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=h.TOUCH_DOLLY_ROTATE;break;default:this.state=h.NONE}break;default:this.state=h.NONE}this.state!==h.NONE&&this.dispatchEvent(ht)}function ue(i){switch(this._trackPointer(i),this.state){case h.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case h.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case h.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case h.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=h.NONE}}function pe(i){this.enabled!==!1&&i.preventDefault()}function me(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function _e(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const fe={class:"projectile-motion"},ye={class:"container"},be={class:"simulation-container"},ge={class:"simulation-content"},Pe={class:"simulation-controls"},we={class:"control-group"},ve={class:"control-group"},Ee={class:"control-group"},Me={class:"control-group"},De={class:"control-group"},Se={class:"view-controls"},Te={class:"control-actions"},xe={class:"simulation-metrics"},Oe={class:"metric-card"},je={class:"metric-value"},ke={class:"metric-card"},Re={class:"metric-value"},Le={class:"metric-card"},Ae={class:"metric-value"},Ce=Bt({__name:"ProjectileMotion",setup(i){const t=v(45),s=v(20),o=v(1),l=v(.1),r=v("sphere"),u=v("3d"),y=v(!0),k=v(!0),L=v(!1),J=v(0),$=v(0),tt=v(0),A=v(null);let x,f,P,z,b,Y,O,R,rt=new Wt,ct,S=new _(0,0,0),C=new _,K=new _,V=[],et=[],G=!1,X=0,Z=0;const wt=n=>n.toFixed(2),vt=()=>{if(!A.value)return;f=new Nt,f.background=new It(15790320);const n=new Ut(16777215,.5);f.add(n);const e=new zt(16777215,.8);e.position.set(10,20,15),e.castShadow=!0,e.shadow.mapSize.width=2048,e.shadow.mapSize.height=2048,f.add(e);const p=A.value.clientWidth,w=400;P=new Yt(45,p/w,.1,1e3),P.position.set(15,10,15),P.lookAt(0,0,0),x=new Vt({antialias:!0}),x.setSize(p,w),x.shadowMap.enabled=!0,A.value.innerHTML="",A.value.appendChild(x.domElement),z=new ie(P,x.domElement),z.enableDamping=!0,z.dampingFactor=.1;const j=new Zt(30,30),M=new ot({color:8956552,side:Ht});Y=new at(j,M),Y.rotation.x=-Math.PI/2,Y.position.y=0,Y.receiveShadow=!0,f.add(Y);const N=new Ft(30,30);f.add(N);const c=new Kt(5);f.add(c);const st=new _t(2,.5,2),it=new ot({color:8947899}),W=new at(st,it);W.position.set(0,.25,0),W.castShadow=!0,W.receiveShadow=!0,f.add(W);const xt=new H,Ot=new ft({color:16711680});O=new yt(xt,Ot),f.add(O);const jt=new H,kt=new ft({color:35071,transparent:!0,opacity:.5});R=new yt(jt,kt),f.add(R),dt(),ut()},dt=()=>{let n;switch(r.value){case"cube":n=new _t(.5,.5,.5);break;case"cone":n=new Xt(.3,.8,16);break;case"sphere":default:n=new Gt(.3,32,32);break}const e=new ot({color:16090946,metalness:.3,roughness:.4});b&&f.remove(b),b=new at(n,e),b.castShadow=!0,b.position.copy(S),r.value==="cone"&&(b.rotation.x=Math.PI/2),f.add(b)},Et=()=>{if(P){switch(u.value){case"side":P.position.set(15,5,0);break;case"top":P.position.set(0,20,0);break;case"3d":default:P.position.set(15,10,15);break}P.lookAt(new _(0,5,0)),z.update()}},Mt=()=>{pt();const n=t.value*Math.PI/180,e=s.value*Math.cos(n),p=s.value*Math.sin(n);C.set(e,p,0),Dt(),G=!0,X=0,Z=0,rt.start()},Dt=()=>{et=[];const n=9.8,e=t.value*Math.PI/180,p=s.value,w=p*Math.cos(e),j=p*Math.sin(e),M=2*j/n;for(let c=0;c<=M;c+=M/100){const st=w*c,it=j*c-.5*n*c*c;et.push(new _(st,it,0))}const N=new H().setFromPoints(et);R.geometry.dispose(),R.geometry=N},St=n=>{if(!G||L.value)return;const e=new _(0,-9.8,0),p=l.value*C.lengthSq(),w=C.clone().normalize().multiplyScalar(-p);K.copy(e),K.add(w.divideScalar(o.value)),C.add(K.clone().multiplyScalar(n));const j=C.clone().multiplyScalar(n).add(K.clone().multiplyScalar(.5*n*n));if(S.add(j),b.position.copy(S),r.value==="cone"){const M=new lt;M.setFromUnitVectors(new _(0,1,0),C.clone().normalize()),b.quaternion.copy(M)}if(y.value){V.push(S.clone()),V.length>500&&V.shift();const M=new H().setFromPoints(V);O.geometry.dispose(),O.geometry=M}S.y>Z&&(Z=S.y,$.value=Z),S.y<=0&&(S.y=0,J.value=X,tt.value=S.x,G=!1),X+=n},ut=()=>{ct=requestAnimationFrame(ut);const n=Math.min(rt.getDelta(),.05);St(n),z.update(),x.render(f,P)},pt=()=>{S.set(0,.5,0),C.set(0,0,0),b&&(b.position.copy(S),r.value==="cone"&&(b.rotation.x=Math.PI/2,b.rotation.y=0,b.rotation.z=0)),V=[];const n=new H().setFromPoints([]);O.geometry.dispose(),O.geometry=n,J.value=0,$.value=0,tt.value=0,G=!1,X=0,Z=0},Tt=()=>{L.value=!L.value};return B(r,()=>{dt()}),B(u,()=>{Et()}),B(k,n=>{R.visible=n}),B(y,n=>{O.visible=n}),qt(()=>{vt();const n=()=>{if(!A.value||!P||!x)return;const e=A.value.clientWidth,p=400;P.aspect=e/p,P.updateProjectionMatrix(),x.setSize(e,p)};window.addEventListener("resize",n),Qt(()=>{window.removeEventListener("resize",n),cancelAnimationFrame(ct),x&&x.dispose(),f&&f.clear(),O&&O.geometry&&O.geometry.dispose(),R&&R.geometry&&R.geometry.dispose()})}),(n,e)=>{const p=F("el-slider"),w=F("el-radio"),j=F("el-radio-group"),M=F("el-checkbox"),N=F("el-button");return te(),Jt("div",fe,[a("div",ye,[e[30]||(e[30]=a("div",{class:"module-header"},[a("h1",null,[D("抛体运动 "),a("span",{class:"module-subtitle"},"Projectile Motion")]),a("p",{class:"module-description"}," 抛体运动是物体在重力作用下沿抛物线轨迹运动的过程。现实中，空气阻力会影响物体的运动轨迹，使其偏离理想抛物线。 本模拟展示了考虑空气阻力的更真实的抛体运动。 ")],-1)),a("div",be,[e[28]||(e[28]=a("div",{class:"simulation-header"},[a("h2",null,"3D模拟实验：抛体运动与空气阻力"),a("p",null,"通过调整发射角度、初速度、质量和空气阻力系数，观察物体在空中的运动轨迹变化。")],-1)),a("div",ge,[a("div",{class:"simulation-canvas",ref_key:"simulationCanvas",ref:A},null,512),a("div",Pe,[e[27]||(e[27]=a("h3",null,"控制面板",-1)),a("div",we,[e[8]||(e[8]=a("label",null,"发射角度 (度)",-1)),m(p,{modelValue:t.value,"onUpdate:modelValue":e[0]||(e[0]=c=>t.value=c),min:0,max:90,step:1,"show-input":""},null,8,["modelValue"])]),a("div",ve,[e[9]||(e[9]=a("label",null,"初速度 (m/s)",-1)),m(p,{modelValue:s.value,"onUpdate:modelValue":e[1]||(e[1]=c=>s.value=c),min:1,max:50,step:1,"show-input":""},null,8,["modelValue"])]),a("div",Ee,[e[10]||(e[10]=a("label",null,"物体质量 (kg)",-1)),m(p,{modelValue:o.value,"onUpdate:modelValue":e[2]||(e[2]=c=>o.value=c),min:.1,max:10,step:.1,"show-input":""},null,8,["modelValue"])]),a("div",Me,[e[11]||(e[11]=a("label",null,"空气阻力系数",-1)),m(p,{modelValue:l.value,"onUpdate:modelValue":e[3]||(e[3]=c=>l.value=c),min:0,max:1,step:.01,"format-tooltip":wt,"show-input":""},null,8,["modelValue"])]),a("div",De,[e[15]||(e[15]=a("label",null,"物体形状",-1)),m(j,{modelValue:r.value,"onUpdate:modelValue":e[4]||(e[4]=c=>r.value=c)},{default:E(()=>[m(w,{label:"sphere"},{default:E(()=>e[12]||(e[12]=[D("球形")])),_:1}),m(w,{label:"cube"},{default:E(()=>e[13]||(e[13]=[D("立方体")])),_:1}),m(w,{label:"cone"},{default:E(()=>e[14]||(e[14]=[D("圆锥体")])),_:1})]),_:1},8,["modelValue"])]),a("div",Se,[e[21]||(e[21]=a("h3",null,"视角控制",-1)),m(j,{modelValue:u.value,"onUpdate:modelValue":e[5]||(e[5]=c=>u.value=c)},{default:E(()=>[m(w,{label:"3d"},{default:E(()=>e[16]||(e[16]=[D("3D视角")])),_:1}),m(w,{label:"side"},{default:E(()=>e[17]||(e[17]=[D("侧视图")])),_:1}),m(w,{label:"top"},{default:E(()=>e[18]||(e[18]=[D("俯视图")])),_:1})]),_:1},8,["modelValue"]),m(M,{modelValue:y.value,"onUpdate:modelValue":e[6]||(e[6]=c=>y.value=c)},{default:E(()=>e[19]||(e[19]=[D("显示轨迹")])),_:1},8,["modelValue"]),m(M,{modelValue:k.value,"onUpdate:modelValue":e[7]||(e[7]=c=>k.value=c)},{default:E(()=>e[20]||(e[20]=[D("显示理想抛物线")])),_:1},8,["modelValue"])]),a("div",Te,[m(N,{type:"primary",onClick:Mt},{default:E(()=>e[22]||(e[22]=[D("发射")])),_:1}),m(N,{onClick:pt},{default:E(()=>e[23]||(e[23]=[D("重置")])),_:1}),m(N,{onClick:Tt},{default:E(()=>[D(q(L.value?"继续":"暂停"),1)]),_:1})]),a("div",xe,[a("div",Oe,[a("div",je,q(J.value.toFixed(2))+" s",1),e[24]||(e[24]=a("div",{class:"metric-label"},"飞行时间",-1))]),a("div",ke,[a("div",Re,q($.value.toFixed(2))+" m",1),e[25]||(e[25]=a("div",{class:"metric-label"},"最大高度",-1))]),a("div",Le,[a("div",Ae,q(tt.value.toFixed(2))+" m",1),e[26]||(e[26]=a("div",{class:"metric-label"},"水平距离",-1))])])])]),e[29]||(e[29]=$t('<div class="theory-section" data-v-23644c93><div class="formula-display" data-v-23644c93><h3 data-v-23644c93>抛体运动公式</h3><div class="formula" data-v-23644c93><p data-v-23644c93><strong data-v-23644c93>理想情况 (无空气阻力):</strong></p><span class="formula-text" data-v-23644c93>x = v₀·cos(θ)·t</span><span class="formula-text" data-v-23644c93>y = v₀·sin(θ)·t - (1/2)·g·t²</span></div><div class="formula" data-v-23644c93><p data-v-23644c93><strong data-v-23644c93>考虑空气阻力:</strong></p><span class="formula-text" data-v-23644c93>F_drag = -b·v²</span><p data-v-23644c93>其中 b 是空气阻力系数，与物体的形状、大小和空气密度有关</p></div></div><div class="key-points" data-v-23644c93><h3 data-v-23644c93>关键要点</h3><ul data-v-23644c93><li data-v-23644c93>理想抛体运动轨迹为抛物线，但空气阻力会使实际轨迹偏离抛物线。</li><li data-v-23644c93>空气阻力与速度的平方成正比，方向与速度方向相反。</li><li data-v-23644c93>物体质量越大，空气阻力对其运动的影响越小。</li><li data-v-23644c93>物体形状会影响空气阻力的大小，流线型物体受到的阻力较小。</li><li data-v-23644c93>理想情况下，相同初速度和角度的抛体运动具有对称的轨迹，但空气阻力会破坏这种对称性。</li></ul></div></div>',1))])])])}}}),Ue=ee(Ce,[["__scopeId","data-v-23644c93"]]);export{Ue as default};
