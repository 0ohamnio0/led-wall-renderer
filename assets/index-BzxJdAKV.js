var e=(e,t)=>()=>(e&&(t=e(e=0)),t),t=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports);(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();function n(e){let t,n;return(t=e.match(/(#|0x)?([a-f0-9]{6})/i))?n=t[2]:(t=e.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?n=parseInt(t[1]).toString(16).padStart(2,0)+parseInt(t[2]).toString(16).padStart(2,0)+parseInt(t[3]).toString(16).padStart(2,0):(t=e.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(n=t[1]+t[1]+t[2]+t[2]+t[3]+t[3]),n?`#`+n:!1}function r(e){return l.find(t=>t.match(e))}function i(e){let t=document.createElement(`style`);t.innerHTML=e;let n=document.querySelector(`head link[rel=stylesheet], head style`);n?document.head.insertBefore(t,n):document.head.appendChild(t)}var a,o,s,c,l,u,d,f,p,m,h,g,ee,te=e((()=>{a=class e{constructor(t,n,r,i,a=`div`){this.parent=t,this.object=n,this.property=r,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(a),this.domElement.classList.add(`lil-controller`),this.domElement.classList.add(i),this.$name=document.createElement(`div`),this.$name.classList.add(`lil-name`),e.nextNameID=e.nextNameID||0,this.$name.id=`lil-gui-name-${++e.nextNameID}`,this.$widget=document.createElement(`div`),this.$widget.classList.add(`lil-widget`),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener(`keydown`,e=>e.stopPropagation()),this.domElement.addEventListener(`keyup`,e=>e.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(r)}name(e){return this._name=e,this.$name.textContent=e,this}onChange(e){return this._onChange=e,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(e){return this._onFinishChange=e,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(e=!0){return this.disable(!e)}disable(e=!0){return e===this._disabled?this:(this._disabled=e,this.domElement.classList.toggle(`lil-disabled`,e),this.$disable.toggleAttribute(`disabled`,e),this)}show(e=!0){return this._hidden=!e,this.domElement.style.display=this._hidden?`none`:``,this}hide(){return this.show(!1)}options(e){let t=this.parent.add(this.object,this.property,e);return t.name(this._name),this.destroy(),t}min(e){return this}max(e){return this}step(e){return this}decimals(e){return this}listen(e=!0){return this._listening=e,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);let e=this.save();e!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=e}getValue(){return this.object[this.property]}setValue(e){return this.getValue()!==e&&(this.object[this.property]=e,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(e){return this.setValue(e),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}},o=class extends a{constructor(e,t,n){super(e,t,n,`lil-boolean`,`label`),this.$input=document.createElement(`input`),this.$input.setAttribute(`type`,`checkbox`),this.$input.setAttribute(`aria-labelledby`,this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener(`change`,()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}},s={isPrimitive:!0,match:e=>typeof e==`string`,fromHexString:n,toHexString:n},c={isPrimitive:!0,match:e=>typeof e==`number`,fromHexString:e=>parseInt(e.substring(1),16),toHexString:e=>`#`+e.toString(16).padStart(6,0)},l=[s,c,{isPrimitive:!1,match:e=>Array.isArray(e)||ArrayBuffer.isView(e),fromHexString(e,t,n=1){let r=c.fromHexString(e);t[0]=(r>>16&255)/255*n,t[1]=(r>>8&255)/255*n,t[2]=(r&255)/255*n},toHexString([e,t,n],r=1){r=255/r;let i=e*r<<16^t*r<<8^n*r<<0;return c.toHexString(i)}},{isPrimitive:!1,match:e=>Object(e)===e,fromHexString(e,t,n=1){let r=c.fromHexString(e);t.r=(r>>16&255)/255*n,t.g=(r>>8&255)/255*n,t.b=(r&255)/255*n},toHexString({r:e,g:t,b:n},r=1){r=255/r;let i=e*r<<16^t*r<<8^n*r<<0;return c.toHexString(i)}}],u=class extends a{constructor(e,t,i,a){super(e,t,i,`lil-color`),this.$input=document.createElement(`input`),this.$input.setAttribute(`type`,`color`),this.$input.setAttribute(`tabindex`,-1),this.$input.setAttribute(`aria-labelledby`,this.$name.id),this.$text=document.createElement(`input`),this.$text.setAttribute(`type`,`text`),this.$text.setAttribute(`spellcheck`,`false`),this.$text.setAttribute(`aria-labelledby`,this.$name.id),this.$display=document.createElement(`div`),this.$display.classList.add(`lil-display`),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=r(this.initialValue),this._rgbScale=a,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener(`input`,()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener(`blur`,()=>{this._callOnFinishChange()}),this.$text.addEventListener(`input`,()=>{let e=n(this.$text.value);e&&this._setValueFromHexString(e)}),this.$text.addEventListener(`focus`,()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener(`blur`,()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(e){if(this._format.isPrimitive){let t=this._format.fromHexString(e);this.setValue(t)}else this._format.fromHexString(e,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(e){return this._setValueFromHexString(e),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}},d=class extends a{constructor(e,t,n){super(e,t,n,`lil-function`),this.$button=document.createElement(`button`),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener(`click`,e=>{e.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener(`touchstart`,()=>{},{passive:!0}),this.$disable=this.$button}},f=class extends a{constructor(e,t,n,r,i,a){super(e,t,n,`lil-number`),this._initInput(),this.min(r),this.max(i);let o=a!==void 0;this.step(o?a:this._getImplicitStep(),o),this.updateDisplay()}decimals(e){return this._decimals=e,this.updateDisplay(),this}min(e){return this._min=e,this._onUpdateMinMax(),this}max(e){return this._max=e,this._onUpdateMinMax(),this}step(e,t=!0){return this._step=e,this._stepExplicit=t,this}updateDisplay(){let e=this.getValue();if(this._hasSlider){let t=(e-this._min)/(this._max-this._min);t=Math.max(0,Math.min(t,1)),this.$fill.style.width=t*100+`%`}return this._inputFocused||(this.$input.value=this._decimals===void 0?e:e.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement(`input`),this.$input.setAttribute(`type`,`text`),this.$input.setAttribute(`aria-labelledby`,this.$name.id),window.matchMedia(`(pointer: coarse)`).matches&&(this.$input.setAttribute(`type`,`number`),this.$input.setAttribute(`step`,`any`)),this.$widget.appendChild(this.$input),this.$disable=this.$input;let e=()=>{let e=parseFloat(this.$input.value);isNaN(e)||(this._stepExplicit&&(e=this._snap(e)),this.setValue(this._clamp(e)))},t=e=>{let t=parseFloat(this.$input.value);isNaN(t)||(this._snapClampSetValue(t+e),this.$input.value=this.getValue())},n=e=>{e.key===`Enter`&&this.$input.blur(),e.code===`ArrowUp`&&(e.preventDefault(),t(this._step*this._arrowKeyMultiplier(e))),e.code===`ArrowDown`&&(e.preventDefault(),t(this._step*this._arrowKeyMultiplier(e)*-1))},r=e=>{this._inputFocused&&(e.preventDefault(),t(this._step*this._normalizeMouseWheel(e)))},i=!1,a,o,s,c,l,u=e=>{a=e.clientX,o=s=e.clientY,i=!0,c=this.getValue(),l=0,window.addEventListener(`mousemove`,d),window.addEventListener(`mouseup`,f)},d=e=>{if(i){let t=e.clientX-a,n=e.clientY-o;Math.abs(n)>5?(e.preventDefault(),this.$input.blur(),i=!1,this._setDraggingStyle(!0,`vertical`)):Math.abs(t)>5&&f()}if(!i){let t=e.clientY-s;l-=t*this._step*this._arrowKeyMultiplier(e),c+l>this._max?l=this._max-c:c+l<this._min&&(l=this._min-c),this._snapClampSetValue(c+l)}s=e.clientY},f=()=>{this._setDraggingStyle(!1,`vertical`),this._callOnFinishChange(),window.removeEventListener(`mousemove`,d),window.removeEventListener(`mouseup`,f)};this.$input.addEventListener(`input`,e),this.$input.addEventListener(`keydown`,n),this.$input.addEventListener(`wheel`,r,{passive:!1}),this.$input.addEventListener(`mousedown`,u),this.$input.addEventListener(`focus`,()=>{this._inputFocused=!0}),this.$input.addEventListener(`blur`,()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()})}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement(`div`),this.$slider.classList.add(`lil-slider`),this.$fill=document.createElement(`div`),this.$fill.classList.add(`lil-fill`),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add(`lil-has-slider`);let e=(e,t,n,r,i)=>(e-t)/(n-t)*(i-r)+r,t=t=>{let n=this.$slider.getBoundingClientRect(),r=e(t,n.left,n.right,this._min,this._max);this._snapClampSetValue(r)},n=e=>{this._setDraggingStyle(!0),t(e.clientX),window.addEventListener(`mousemove`,r),window.addEventListener(`mouseup`,i)},r=e=>{t(e.clientX)},i=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener(`mousemove`,r),window.removeEventListener(`mouseup`,i)},a=!1,o,s,c=e=>{e.preventDefault(),this._setDraggingStyle(!0),t(e.touches[0].clientX),a=!1},l=e=>{e.touches.length>1||(this._hasScrollBar?(o=e.touches[0].clientX,s=e.touches[0].clientY,a=!0):c(e),window.addEventListener(`touchmove`,u,{passive:!1}),window.addEventListener(`touchend`,d))},u=e=>{if(a){let t=e.touches[0].clientX-o,n=e.touches[0].clientY-s;Math.abs(t)>Math.abs(n)?c(e):(window.removeEventListener(`touchmove`,u),window.removeEventListener(`touchend`,d))}else e.preventDefault(),t(e.touches[0].clientX)},d=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener(`touchmove`,u),window.removeEventListener(`touchend`,d)},f=this._callOnFinishChange.bind(this),p;this.$slider.addEventListener(`mousedown`,n),this.$slider.addEventListener(`touchstart`,l,{passive:!1}),this.$slider.addEventListener(`wheel`,e=>{if(Math.abs(e.deltaX)<Math.abs(e.deltaY)&&this._hasScrollBar)return;e.preventDefault();let t=this._normalizeMouseWheel(e)*this._step;this._snapClampSetValue(this.getValue()+t),this.$input.value=this.getValue(),clearTimeout(p),p=setTimeout(f,400)},{passive:!1})}_setDraggingStyle(e,t=`horizontal`){this.$slider&&this.$slider.classList.toggle(`lil-active`,e),document.body.classList.toggle(`lil-dragging`,e),document.body.classList.toggle(`lil-${t}`,e)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(e){let{deltaX:t,deltaY:n}=e;return Math.floor(e.deltaY)!==e.deltaY&&e.wheelDelta&&(t=0,n=-e.wheelDelta/120,n*=this._stepExplicit?1:10),t+-n}_arrowKeyMultiplier(e){let t=this._stepExplicit?1:10;return e.shiftKey?t*=10:e.altKey&&(t/=10),t}_snap(e){let t=0;return this._hasMin?t=this._min:this._hasMax&&(t=this._max),e-=t,e=Math.round(e/this._step)*this._step,e+=t,e=parseFloat(e.toPrecision(15)),e}_clamp(e){return e<this._min&&(e=this._min),e>this._max&&(e=this._max),e}_snapClampSetValue(e){this.setValue(this._clamp(this._snap(e)))}get _hasScrollBar(){let e=this.parent.root.$children;return e.scrollHeight>e.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}},p=class extends a{constructor(e,t,n,r){super(e,t,n,`lil-option`),this.$select=document.createElement(`select`),this.$select.setAttribute(`aria-labelledby`,this.$name.id),this.$display=document.createElement(`div`),this.$display.classList.add(`lil-display`),this.$select.addEventListener(`change`,()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener(`focus`,()=>{this.$display.classList.add(`lil-focus`)}),this.$select.addEventListener(`blur`,()=>{this.$display.classList.remove(`lil-focus`)}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(r)}options(e){return this._values=Array.isArray(e)?e:Object.values(e),this._names=Array.isArray(e)?e:Object.keys(e),this.$select.replaceChildren(),this._names.forEach(e=>{let t=document.createElement(`option`);t.textContent=e,this.$select.appendChild(t)}),this.updateDisplay(),this}updateDisplay(){let e=this.getValue(),t=this._values.indexOf(e);return this.$select.selectedIndex=t,this.$display.textContent=t===-1?e:this._names[t],this}},m=class extends a{constructor(e,t,n){super(e,t,n,`lil-string`),this.$input=document.createElement(`input`),this.$input.setAttribute(`type`,`text`),this.$input.setAttribute(`spellcheck`,`false`),this.$input.setAttribute(`aria-labelledby`,this.$name.id),this.$input.addEventListener(`input`,()=>{this.setValue(this.$input.value)}),this.$input.addEventListener(`keydown`,e=>{e.code===`Enter`&&this.$input.blur()}),this.$input.addEventListener(`blur`,()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}},h=`.lil-gui {
  font-family: var(--font-family);
  font-size: var(--font-size);
  line-height: 1;
  font-weight: normal;
  font-style: normal;
  text-align: left;
  color: var(--text-color);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  --background-color: #1f1f1f;
  --text-color: #ebebeb;
  --title-background-color: #111111;
  --title-text-color: #ebebeb;
  --widget-color: #424242;
  --hover-color: #4f4f4f;
  --focus-color: #595959;
  --number-color: #2cc9ff;
  --string-color: #a2db3c;
  --font-size: 11px;
  --input-font-size: 11px;
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
  --font-family-mono: Menlo, Monaco, Consolas, "Droid Sans Mono", monospace;
  --padding: 4px;
  --spacing: 4px;
  --widget-height: 20px;
  --title-height: calc(var(--widget-height) + var(--spacing) * 1.25);
  --name-width: 45%;
  --slider-knob-width: 2px;
  --slider-input-width: 27%;
  --color-input-width: 27%;
  --slider-input-min-width: 45px;
  --color-input-min-width: 45px;
  --folder-indent: 7px;
  --widget-padding: 0 0 0 3px;
  --widget-border-radius: 2px;
  --checkbox-size: calc(0.75 * var(--widget-height));
  --scrollbar-width: 5px;
}
.lil-gui, .lil-gui * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.lil-gui.lil-root {
  width: var(--width, 245px);
  display: flex;
  flex-direction: column;
  background: var(--background-color);
}
.lil-gui.lil-root > .lil-title {
  background: var(--title-background-color);
  color: var(--title-text-color);
}
.lil-gui.lil-root > .lil-children {
  overflow-x: hidden;
  overflow-y: auto;
}
.lil-gui.lil-root > .lil-children::-webkit-scrollbar {
  width: var(--scrollbar-width);
  height: var(--scrollbar-width);
  background: var(--background-color);
}
.lil-gui.lil-root > .lil-children::-webkit-scrollbar-thumb {
  border-radius: var(--scrollbar-width);
  background: var(--focus-color);
}
@media (pointer: coarse) {
  .lil-gui.lil-allow-touch-styles, .lil-gui.lil-allow-touch-styles .lil-gui {
    --widget-height: 28px;
    --padding: 6px;
    --spacing: 6px;
    --font-size: 13px;
    --input-font-size: 16px;
    --folder-indent: 10px;
    --scrollbar-width: 7px;
    --slider-input-min-width: 50px;
    --color-input-min-width: 65px;
  }
}
.lil-gui.lil-force-touch-styles, .lil-gui.lil-force-touch-styles .lil-gui {
  --widget-height: 28px;
  --padding: 6px;
  --spacing: 6px;
  --font-size: 13px;
  --input-font-size: 16px;
  --folder-indent: 10px;
  --scrollbar-width: 7px;
  --slider-input-min-width: 50px;
  --color-input-min-width: 65px;
}
.lil-gui.lil-auto-place, .lil-gui.autoPlace {
  max-height: 100%;
  position: fixed;
  top: 0;
  right: 15px;
  z-index: 1001;
}

.lil-controller {
  display: flex;
  align-items: center;
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
}
.lil-controller.lil-disabled {
  opacity: 0.5;
}
.lil-controller.lil-disabled, .lil-controller.lil-disabled * {
  pointer-events: none !important;
}
.lil-controller > .lil-name {
  min-width: var(--name-width);
  flex-shrink: 0;
  white-space: pre;
  padding-right: var(--spacing);
  line-height: var(--widget-height);
}
.lil-controller .lil-widget {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: var(--widget-height);
}
.lil-controller.lil-string input {
  color: var(--string-color);
}
.lil-controller.lil-boolean {
  cursor: pointer;
}
.lil-controller.lil-color .lil-display {
  width: 100%;
  height: var(--widget-height);
  border-radius: var(--widget-border-radius);
  position: relative;
}
@media (hover: hover) {
  .lil-controller.lil-color .lil-display:hover:before {
    content: " ";
    display: block;
    position: absolute;
    border-radius: var(--widget-border-radius);
    border: 1px solid #fff9;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
}
.lil-controller.lil-color input[type=color] {
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.lil-controller.lil-color input[type=text] {
  margin-left: var(--spacing);
  font-family: var(--font-family-mono);
  min-width: var(--color-input-min-width);
  width: var(--color-input-width);
  flex-shrink: 0;
}
.lil-controller.lil-option select {
  opacity: 0;
  position: absolute;
  width: 100%;
  max-width: 100%;
}
.lil-controller.lil-option .lil-display {
  position: relative;
  pointer-events: none;
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  line-height: var(--widget-height);
  max-width: 100%;
  overflow: hidden;
  word-break: break-all;
  padding-left: 0.55em;
  padding-right: 1.75em;
  background: var(--widget-color);
}
@media (hover: hover) {
  .lil-controller.lil-option .lil-display.lil-focus {
    background: var(--focus-color);
  }
}
.lil-controller.lil-option .lil-display.lil-active {
  background: var(--focus-color);
}
.lil-controller.lil-option .lil-display:after {
  font-family: "lil-gui";
  content: "↕";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  padding-right: 0.375em;
}
.lil-controller.lil-option .lil-widget,
.lil-controller.lil-option select {
  cursor: pointer;
}
@media (hover: hover) {
  .lil-controller.lil-option .lil-widget:hover .lil-display {
    background: var(--hover-color);
  }
}
.lil-controller.lil-number input {
  color: var(--number-color);
}
.lil-controller.lil-number.lil-has-slider input {
  margin-left: var(--spacing);
  width: var(--slider-input-width);
  min-width: var(--slider-input-min-width);
  flex-shrink: 0;
}
.lil-controller.lil-number .lil-slider {
  width: 100%;
  height: var(--widget-height);
  background: var(--widget-color);
  border-radius: var(--widget-border-radius);
  padding-right: var(--slider-knob-width);
  overflow: hidden;
  cursor: ew-resize;
  touch-action: pan-y;
}
@media (hover: hover) {
  .lil-controller.lil-number .lil-slider:hover {
    background: var(--hover-color);
  }
}
.lil-controller.lil-number .lil-slider.lil-active {
  background: var(--focus-color);
}
.lil-controller.lil-number .lil-slider.lil-active .lil-fill {
  opacity: 0.95;
}
.lil-controller.lil-number .lil-fill {
  height: 100%;
  border-right: var(--slider-knob-width) solid var(--number-color);
  box-sizing: content-box;
}

.lil-dragging .lil-gui {
  --hover-color: var(--widget-color);
}
.lil-dragging * {
  cursor: ew-resize !important;
}
.lil-dragging.lil-vertical * {
  cursor: ns-resize !important;
}

.lil-gui .lil-title {
  height: var(--title-height);
  font-weight: 600;
  padding: 0 var(--padding);
  width: 100%;
  text-align: left;
  background: none;
  text-decoration-skip: objects;
}
.lil-gui .lil-title:before {
  font-family: "lil-gui";
  content: "▾";
  padding-right: 2px;
  display: inline-block;
}
.lil-gui .lil-title:active {
  background: var(--title-background-color);
  opacity: 0.75;
}
@media (hover: hover) {
  body:not(.lil-dragging) .lil-gui .lil-title:hover {
    background: var(--title-background-color);
    opacity: 0.85;
  }
  .lil-gui .lil-title:focus {
    text-decoration: underline var(--focus-color);
  }
}
.lil-gui.lil-root > .lil-title:focus {
  text-decoration: none !important;
}
.lil-gui.lil-closed > .lil-title:before {
  content: "▸";
}
.lil-gui.lil-closed > .lil-children {
  transform: translateY(-7px);
  opacity: 0;
}
.lil-gui.lil-closed:not(.lil-transition) > .lil-children {
  display: none;
}
.lil-gui.lil-transition > .lil-children {
  transition-duration: 300ms;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.2, 0.6, 0.35, 1);
  overflow: hidden;
  pointer-events: none;
}
.lil-gui .lil-children:empty:before {
  content: "Empty";
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
  display: block;
  height: var(--widget-height);
  font-style: italic;
  line-height: var(--widget-height);
  opacity: 0.5;
}
.lil-gui.lil-root > .lil-children > .lil-gui > .lil-title {
  border: 0 solid var(--widget-color);
  border-width: 1px 0;
  transition: border-color 300ms;
}
.lil-gui.lil-root > .lil-children > .lil-gui.lil-closed > .lil-title {
  border-bottom-color: transparent;
}
.lil-gui + .lil-controller {
  border-top: 1px solid var(--widget-color);
  margin-top: 0;
  padding-top: var(--spacing);
}
.lil-gui .lil-gui .lil-gui > .lil-title {
  border: none;
}
.lil-gui .lil-gui .lil-gui > .lil-children {
  border: none;
  margin-left: var(--folder-indent);
  border-left: 2px solid var(--widget-color);
}
.lil-gui .lil-gui .lil-controller {
  border: none;
}

.lil-gui label, .lil-gui input, .lil-gui button {
  -webkit-tap-highlight-color: transparent;
}
.lil-gui input {
  border: 0;
  outline: none;
  font-family: var(--font-family);
  font-size: var(--input-font-size);
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  background: var(--widget-color);
  color: var(--text-color);
  width: 100%;
}
@media (hover: hover) {
  .lil-gui input:hover {
    background: var(--hover-color);
  }
  .lil-gui input:active {
    background: var(--focus-color);
  }
}
.lil-gui input:disabled {
  opacity: 1;
}
.lil-gui input[type=text],
.lil-gui input[type=number] {
  padding: var(--widget-padding);
  -moz-appearance: textfield;
}
.lil-gui input[type=text]:focus,
.lil-gui input[type=number]:focus {
  background: var(--focus-color);
}
.lil-gui input[type=checkbox] {
  appearance: none;
  width: var(--checkbox-size);
  height: var(--checkbox-size);
  border-radius: var(--widget-border-radius);
  text-align: center;
  cursor: pointer;
}
.lil-gui input[type=checkbox]:checked:before {
  font-family: "lil-gui";
  content: "✓";
  font-size: var(--checkbox-size);
  line-height: var(--checkbox-size);
}
@media (hover: hover) {
  .lil-gui input[type=checkbox]:focus {
    box-shadow: inset 0 0 0 1px var(--focus-color);
  }
}
.lil-gui button {
  outline: none;
  cursor: pointer;
  font-family: var(--font-family);
  font-size: var(--font-size);
  color: var(--text-color);
  width: 100%;
  border: none;
}
.lil-gui .lil-controller button {
  height: var(--widget-height);
  text-transform: none;
  background: var(--widget-color);
  border-radius: var(--widget-border-radius);
}
@media (hover: hover) {
  .lil-gui .lil-controller button:hover {
    background: var(--hover-color);
  }
  .lil-gui .lil-controller button:focus {
    box-shadow: inset 0 0 0 1px var(--focus-color);
  }
}
.lil-gui .lil-controller button:active {
  background: var(--focus-color);
}

@font-face {
  font-family: "lil-gui";
  src: url("data:application/font-woff2;charset=utf-8;base64,d09GMgABAAAAAALkAAsAAAAABtQAAAKVAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHFQGYACDMgqBBIEbATYCJAMUCwwABCAFhAoHgQQbHAbIDiUFEYVARAAAYQTVWNmz9MxhEgodq49wYRUFKE8GWNiUBxI2LBRaVnc51U83Gmhs0Q7JXWMiz5eteLwrKwuxHO8VFxUX9UpZBs6pa5ABRwHA+t3UxUnH20EvVknRerzQgX6xC/GH6ZUvTcAjAv122dF28OTqCXrPuyaDER30YBA1xnkVutDDo4oCi71Ca7rrV9xS8dZHbPHefsuwIyCpmT7j+MnjAH5X3984UZoFFuJ0yiZ4XEJFxjagEBeqs+e1iyK8Xf/nOuwF+vVK0ur765+vf7txotUi0m3N0m/84RGSrBCNrh8Ee5GjODjF4gnWP+dJrH/Lk9k4oT6d+gr6g/wssA2j64JJGP6cmx554vUZnpZfn6ZfX2bMwPPrlANsB86/DiHjhl0OP+c87+gaJo/gY084s3HoYL/ZkWHTRfBXvvoHnnkHvngKun4KBE/ede7tvq3/vQOxDXB1/fdNz6XbPdcr0Vhpojj9dG+owuSKFsslCi1tgEjirjXdwMiov2EioadxmqTHUCIwo8NgQaeIasAi0fTYSPTbSmwbMOFduyh9wvBrESGY0MtgRjtgQR8Q1bRPohn2UoCRZf9wyYANMXFeJTysqAe0I4mrherOekFdKMrYvJjLvOIUM9SuwYB5DVZUwwVjJJOaUnZCmcEkIZZrKqNvRGRMvmFZsmhP4VMKCSXBhSqUBxgMS7h0cZvEd71AWkEhGWaeMFcNnpqyJkyXgYL7PQ1MoSq0wDAkRtJIijkZSmqYTiSImfLiSWXIZwhRh3Rug2X0kk1Dgj+Iu43u5p98ghopcpSo0Uyc8SnjlYX59WUeaMoDqmVD2TOWD9a4pCRAzf2ECgwGcrHjPOWY9bNxq/OL3I/QjwEAAAA=") format("woff2");
}`,g=!1,ee=class e{constructor({parent:e,autoPlace:t=e===void 0,container:n,width:r,title:a=`Controls`,closeFolders:o=!1,injectStyles:s=!0,touchStyles:c=!0}={}){if(this.parent=e,this.root=e?e.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement(`div`),this.domElement.classList.add(`lil-gui`),this.$title=document.createElement(`button`),this.$title.classList.add(`lil-title`),this.$title.setAttribute(`aria-expanded`,!0),this.$title.addEventListener(`click`,()=>this.openAnimated(this._closed)),this.$title.addEventListener(`touchstart`,()=>{},{passive:!0}),this.$children=document.createElement(`div`),this.$children.classList.add(`lil-children`),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(a),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add(`lil-root`),c&&this.domElement.classList.add(`lil-allow-touch-styles`),!g&&s&&(i(h),g=!0),n?n.appendChild(this.domElement):t&&(this.domElement.classList.add(`lil-auto-place`,`autoPlace`),document.body.appendChild(this.domElement)),r&&this.domElement.style.setProperty(`--width`,r+`px`),this._closeFolders=o}add(e,t,n,r,i){if(Object(n)===n)return new p(this,e,t,n);let a=e[t];switch(typeof a){case`number`:return new f(this,e,t,n,r,i);case`boolean`:return new o(this,e,t);case`string`:return new m(this,e,t);case`function`:return new d(this,e,t)}console.error(`gui.add failed
	property:`,t,`
	object:`,e,`
	value:`,a)}addColor(e,t,n=1){return new u(this,e,t,n)}addFolder(t){let n=new e({parent:this,title:t});return this.root._closeFolders&&n.close(),n}load(e,t=!0){return e.controllers&&this.controllers.forEach(t=>{t instanceof d||t._name in e.controllers&&t.load(e.controllers[t._name])}),t&&e.folders&&this.folders.forEach(t=>{t._title in e.folders&&t.load(e.folders[t._title])}),this}save(e=!0){let t={controllers:{},folders:{}};return this.controllers.forEach(e=>{if(!(e instanceof d)){if(e._name in t.controllers)throw Error(`Cannot save GUI with duplicate property "${e._name}"`);t.controllers[e._name]=e.save()}}),e&&this.folders.forEach(e=>{if(e._title in t.folders)throw Error(`Cannot save GUI with duplicate folder "${e._title}"`);t.folders[e._title]=e.save()}),t}open(e=!0){return this._setClosed(!e),this.$title.setAttribute(`aria-expanded`,!this._closed),this.domElement.classList.toggle(`lil-closed`,this._closed),this}close(){return this.open(!1)}_setClosed(e){this._closed!==e&&(this._closed=e,this._callOnOpenClose(this))}show(e=!0){return this._hidden=!e,this.domElement.style.display=this._hidden?`none`:``,this}hide(){return this.show(!1)}openAnimated(e=!0){return this._setClosed(!e),this.$title.setAttribute(`aria-expanded`,!this._closed),requestAnimationFrame(()=>{let t=this.$children.clientHeight;this.$children.style.height=t+`px`,this.domElement.classList.add(`lil-transition`);let n=e=>{e.target===this.$children&&(this.$children.style.height=``,this.domElement.classList.remove(`lil-transition`),this.$children.removeEventListener(`transitionend`,n))};this.$children.addEventListener(`transitionend`,n);let r=e?this.$children.scrollHeight:0;this.domElement.classList.toggle(`lil-closed`,!e),requestAnimationFrame(()=>{this.$children.style.height=r+`px`})}),this}title(e){return this._title=e,this.$title.textContent=e,this}reset(e=!0){return(e?this.controllersRecursive():this.controllers).forEach(e=>e.reset()),this}onChange(e){return this._onChange=e,this}_callOnChange(e){this.parent&&this.parent._callOnChange(e),this._onChange!==void 0&&this._onChange.call(this,{object:e.object,property:e.property,value:e.getValue(),controller:e})}onFinishChange(e){return this._onFinishChange=e,this}_callOnFinishChange(e){this.parent&&this.parent._callOnFinishChange(e),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:e.object,property:e.property,value:e.getValue(),controller:e})}onOpenClose(e){return this._onOpenClose=e,this}_callOnOpenClose(e){this.parent&&this.parent._callOnOpenClose(e),this._onOpenClose!==void 0&&this._onOpenClose.call(this,e)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(e=>e.destroy())}controllersRecursive(){let e=Array.from(this.controllers);return this.folders.forEach(t=>{e=e.concat(t.controllersRecursive())}),e}foldersRecursive(){let e=Array.from(this.folders);return this.folders.forEach(t=>{e=e.concat(t.foldersRecursive())}),e}}})),ne,_,v,y,re,b,x,S,C,w,ie,T,E,ae,D,O,k,A,j,M,oe,N,se,ce,le,P,F,I,L,ue,de,fe,pe,me,he,ge,_e,ve,ye,be,xe,Se,Ce,we,Te,Ee,De,Oe,ke,Ae,je,Me,Ne,Pe,Fe,Ie,Le,Re,ze,Be,Ve,He,Ue,We,Ge,Ke,qe,Je,Ye,Xe,Ze,Qe,$e,et,tt,nt,rt,it,at,ot,st,ct,lt,ut,dt,R,z,ft,pt,B,mt,ht,gt,_t,vt,yt,bt,xt,V,St,H,U,Ct,wt,Tt,Et,Dt,Ot,kt,At,jt,Mt,Nt,Pt,Ft,It,Lt,W,G,Rt,K,q,J,Y,zt,Bt,X,Z,Vt,Ht,Ut,Wt,Gt,Kt,qt,Jt,Yt,Xt,Zt,Qt,$t,Q,$,en,tn,nn,rn,an,on,sn,cn,ln,un,dn,fn=e((()=>{ne=(e,t,n)=>{if(!t.has(e))throw TypeError(`Cannot `+n)},_=(e,t,n)=>(ne(e,t,`read from private field`),n?n.call(e):t.get(e)),v=(e,t,n)=>{if(t.has(e))throw TypeError(`Cannot add the same private member more than once`);t instanceof WeakSet?t.add(e):t.set(e,n)},y=(e,t,n,r)=>(ne(e,t,`write to private field`),r?r.call(e,n):t.set(e,n),n),re=(e,t,n,r)=>({set _(r){y(e,t,r,n)},get _(){return _(e,t,r)}}),b=(e,t,n)=>(ne(e,t,`access private method`),n),x=new Uint8Array(8),S=new DataView(x.buffer),C=e=>[(e%256+256)%256],w=e=>(S.setUint16(0,e,!1),[x[0],x[1]]),ie=e=>(S.setInt16(0,e,!1),[x[0],x[1]]),T=e=>(S.setUint32(0,e,!1),[x[1],x[2],x[3]]),E=e=>(S.setUint32(0,e,!1),[x[0],x[1],x[2],x[3]]),ae=e=>(S.setInt32(0,e,!1),[x[0],x[1],x[2],x[3]]),D=e=>(S.setUint32(0,Math.floor(e/2**32),!1),S.setUint32(4,e,!1),[x[0],x[1],x[2],x[3],x[4],x[5],x[6],x[7]]),O=e=>(S.setInt16(0,2**8*e,!1),[x[0],x[1]]),k=e=>(S.setInt32(0,2**16*e,!1),[x[0],x[1],x[2],x[3]]),A=e=>(S.setInt32(0,2**30*e,!1),[x[0],x[1],x[2],x[3]]),j=(e,t=!1)=>{let n=Array(e.length).fill(null).map((t,n)=>e.charCodeAt(n));return t&&n.push(0),n},M=e=>e&&e[e.length-1],oe=e=>{let t;for(let n of e)(!t||n.presentationTimestamp>t.presentationTimestamp)&&(t=n);return t},N=(e,t,n=!0)=>{let r=e*t;return n?Math.round(r):r},se=e=>{let t=e*(Math.PI/180),n=Math.cos(t),r=Math.sin(t);return[n,r,0,-r,n,0,0,0,1]},ce=se(0),le=e=>[k(e[0]),k(e[1]),A(e[2]),k(e[3]),k(e[4]),A(e[5]),k(e[6]),k(e[7]),A(e[8])],P=e=>!e||typeof e!=`object`?e:Array.isArray(e)?e.map(P):Object.fromEntries(Object.entries(e).map(([e,t])=>[e,P(t)])),F=e=>e>=0&&e<2**32,I=(e,t,n)=>({type:e,contents:t&&new Uint8Array(t.flat(10)),children:n}),L=(e,t,n,r,i)=>I(e,[C(t),T(n),r??[]],i),ue=e=>e.fragmented?I(`ftyp`,[j(`iso5`),E(512),j(`iso5`),j(`iso6`),j(`mp41`)]):I(`ftyp`,[j(`isom`),E(512),j(`isom`),e.holdsAvc?j(`avc1`):[],j(`mp41`)]),de=e=>({type:`mdat`,largeSize:e}),fe=e=>({type:`free`,size:e}),pe=(e,t,n=!1)=>I(`moov`,null,[me(t,e),...e.map(e=>he(e,t)),n?Ke(e):null]),me=(e,t)=>{let n=N(Math.max(0,...t.filter(e=>e.samples.length>0).map(e=>{let t=oe(e.samples);return t.presentationTimestamp+t.duration})),Nt),r=Math.max(...t.map(e=>e.id))+1,i=!F(e)||!F(n),a=i?D:E;return L(`mvhd`,+i,0,[a(e),a(e),E(Nt),a(n),k(1),O(1),Array(10).fill(0),le(ce),Array(24).fill(0),E(r)])},he=(e,t)=>I(`trak`,null,[ge(e,t),_e(e,t)]),ge=(e,t)=>{let n=oe(e.samples),r=N(n?n.presentationTimestamp+n.duration:0,Nt),i=!F(t)||!F(r),a=i?D:E,o;return o=e.info.type===`video`?typeof e.info.rotation==`number`?se(e.info.rotation):e.info.rotation:ce,L(`tkhd`,+i,3,[a(t),a(t),E(e.id),E(0),a(r),Array(8).fill(0),w(0),w(0),O(e.info.type===`audio`?1:0),w(0),le(o),k(e.info.type===`video`?e.info.width:0),k(e.info.type===`video`?e.info.height:0)])},_e=(e,t)=>I(`mdia`,null,[ve(e,t),ye(e.info.type===`video`?`vide`:`soun`),be(e)]),ve=(e,t)=>{let n=oe(e.samples),r=N(n?n.presentationTimestamp+n.duration:0,e.timescale),i=!F(t)||!F(r),a=i?D:E;return L(`mdhd`,+i,0,[a(t),a(t),E(e.timescale),a(r),w(21956),w(0)])},ye=e=>L(`hdlr`,0,0,[j(`mhlr`),j(e),E(0),E(0),E(0),j(`mp4-muxer-hdlr`,!0)]),be=e=>I(`minf`,null,[e.info.type===`video`?xe():Se(),Ce(),Ee(e)]),xe=()=>L(`vmhd`,0,1,[w(0),w(0),w(0),w(0)]),Se=()=>L(`smhd`,0,0,[w(0),w(0)]),Ce=()=>I(`dinf`,null,[we()]),we=()=>L(`dref`,0,0,[E(1)],[Te()]),Te=()=>L(`url `,0,1),Ee=e=>{let t=e.compositionTimeOffsetTable.length>1||e.compositionTimeOffsetTable.some(e=>e.sampleCompositionTimeOffset!==0);return I(`stbl`,null,[De(e),Be(e),Ve(e),He(e),Ue(e),We(e),t?Ge(e):null])},De=e=>L(`stsd`,0,0,[E(1)],[e.info.type===`video`?Oe(it[e.info.codec],e):Le(ot[e.info.codec],e)]),Oe=(e,t)=>I(e,[[,,,,,,].fill(0),w(1),w(0),w(0),Array(12).fill(0),w(t.info.width),w(t.info.height),E(4718592),E(4718592),E(0),w(1),Array(32).fill(0),w(24),ie(65535)],[at[t.info.codec](t),t.info.decoderConfig.colorSpace?Me(t):null]),ke={bt709:1,bt470bg:5,smpte170m:6},Ae={bt709:1,smpte170m:6,"iec61966-2-1":13},je={rgb:0,bt709:1,bt470bg:5,smpte170m:6},Me=e=>I(`colr`,[j(`nclx`),w(ke[e.info.decoderConfig.colorSpace.primaries]),w(Ae[e.info.decoderConfig.colorSpace.transfer]),w(je[e.info.decoderConfig.colorSpace.matrix]),C((e.info.decoderConfig.colorSpace.fullRange?1:0)<<7)]),Ne=e=>e.info.decoderConfig&&I(`avcC`,[...new Uint8Array(e.info.decoderConfig.description)]),Pe=e=>e.info.decoderConfig&&I(`hvcC`,[...new Uint8Array(e.info.decoderConfig.description)]),Fe=e=>{if(!e.info.decoderConfig)return null;let t=e.info.decoderConfig;if(!t.colorSpace)throw Error(`'colorSpace' is required in the decoder config for VP9.`);let n=t.codec.split(`.`),r=Number(n[1]),i=Number(n[2]),a=(Number(n[3])<<4)+0+Number(t.colorSpace.fullRange);return L(`vpcC`,1,0,[C(r),C(i),C(a),C(2),C(2),C(2),w(0)])},Ie=()=>I(`av1C`,[129,0,0,0]),Le=(e,t)=>I(e,[[,,,,,,].fill(0),w(1),w(0),w(0),E(0),w(t.info.numberOfChannels),w(16),w(0),w(0),k(t.info.sampleRate)],[st[t.info.codec](t)]),Re=e=>{let t=new Uint8Array(e.info.decoderConfig.description);return L(`esds`,0,0,[E(58753152),C(32+t.byteLength),w(1),C(0),E(75530368),C(18+t.byteLength),C(64),C(21),T(0),E(130071),E(130071),E(92307584),C(t.byteLength),...t,E(109084800),C(1),C(2)])},ze=e=>{let t=3840,n=0,r=e.info.decoderConfig?.description;if(r){if(r.byteLength<18)throw TypeError(`Invalid decoder description provided for Opus; must be at least 18 bytes long.`);let e=ArrayBuffer.isView(r)?new DataView(r.buffer,r.byteOffset,r.byteLength):new DataView(r);t=e.getUint16(10,!0),n=e.getInt16(14,!0)}return I(`dOps`,[C(0),C(e.info.numberOfChannels),w(t),E(e.info.sampleRate),O(n),C(0)])},Be=e=>L(`stts`,0,0,[E(e.timeToSampleTable.length),e.timeToSampleTable.map(e=>[E(e.sampleCount),E(e.sampleDelta)])]),Ve=e=>{if(e.samples.every(e=>e.type===`key`))return null;let t=[...e.samples.entries()].filter(([,e])=>e.type===`key`);return L(`stss`,0,0,[E(t.length),t.map(([e])=>E(e+1))])},He=e=>L(`stsc`,0,0,[E(e.compactlyCodedChunkTable.length),e.compactlyCodedChunkTable.map(e=>[E(e.firstChunk),E(e.samplesPerChunk),E(1)])]),Ue=e=>L(`stsz`,0,0,[E(0),E(e.samples.length),e.samples.map(e=>E(e.size))]),We=e=>e.finalizedChunks.length>0&&M(e.finalizedChunks).offset>=2**32?L(`co64`,0,0,[E(e.finalizedChunks.length),e.finalizedChunks.map(e=>D(e.offset))]):L(`stco`,0,0,[E(e.finalizedChunks.length),e.finalizedChunks.map(e=>E(e.offset))]),Ge=e=>L(`ctts`,0,0,[E(e.compositionTimeOffsetTable.length),e.compositionTimeOffsetTable.map(e=>[E(e.sampleCount),E(e.sampleCompositionTimeOffset)])]),Ke=e=>I(`mvex`,null,e.map(qe)),qe=e=>L(`trex`,0,0,[E(e.id),E(1),E(0),E(0),E(0)]),Je=(e,t)=>I(`moof`,null,[Ye(e),...t.map(Ze)]),Ye=e=>L(`mfhd`,0,0,[E(e)]),Xe=e=>{let t=0,n=0,r=e.type===`delta`;return n|=+r,r?t|=1:t|=2,t<<24|n<<16|0},Ze=e=>I(`traf`,null,[Qe(e),$e(e),et(e)]),Qe=e=>{let t=0;t|=8,t|=16,t|=32,t|=131072;let n=e.currentChunk.samples[1]??e.currentChunk.samples[0],r={duration:n.timescaleUnitsToNextSample,size:n.size,flags:Xe(n)};return L(`tfhd`,0,t,[E(e.id),E(r.duration),E(r.size),E(r.flags)])},$e=e=>L(`tfdt`,1,0,[D(N(e.currentChunk.startTimestamp,e.timescale))]),et=e=>{let t=e.currentChunk.samples.map(e=>e.timescaleUnitsToNextSample),n=e.currentChunk.samples.map(e=>e.size),r=e.currentChunk.samples.map(Xe),i=e.currentChunk.samples.map(t=>N(t.presentationTimestamp-t.decodeTimestamp,e.timescale)),a=new Set(t),o=new Set(n),s=new Set(r),c=new Set(i),l=s.size===2&&r[0]!==r[1],u=a.size>1,d=o.size>1,f=!l&&s.size>1,p=c.size>1||[...c].some(e=>e!==0),m=0;return m|=1,m|=4*l,m|=256*u,m|=512*d,m|=1024*f,m|=2048*p,L(`trun`,1,m,[E(e.currentChunk.samples.length),E(e.currentChunk.offset-e.currentChunk.moofOffset||0),l?E(r[0]):[],e.currentChunk.samples.map((e,a)=>[u?E(t[a]):[],d?E(n[a]):[],f?E(r[a]):[],p?ae(i[a]):[]])])},tt=e=>I(`mfra`,null,[...e.map(nt),rt()]),nt=(e,t)=>L(`tfra`,1,0,[E(e.id),E(63),E(e.finalizedChunks.length),e.finalizedChunks.map(n=>[D(N(n.startTimestamp,e.timescale)),D(n.moofOffset),E(t+1),E(1),E(1)])]),rt=()=>L(`mfro`,0,0,[E(0)]),it={avc:`avc1`,hevc:`hvc1`,vp9:`vp09`,av1:`av01`},at={avc:Ne,hevc:Pe,vp9:Fe,av1:Ie},ot={aac:`mp4a`,opus:`Opus`},st={aac:Re,opus:ze},ct=class{},lt=class extends ct{constructor(){super(...arguments),this.buffer=null}},ut=class extends ct{constructor(e){if(super(),this.options=e,typeof e!=`object`)throw TypeError(`StreamTarget requires an options object to be passed to its constructor.`);if(e.onData){if(typeof e.onData!=`function`)throw TypeError(`options.onData, when provided, must be a function.`);if(e.onData.length<2)throw TypeError(`options.onData, when provided, must be a function that takes in at least two arguments (data and position). Ignoring the position argument, which specifies the byte offset at which the data is to be written, can lead to broken outputs.`)}if(e.chunked!==void 0&&typeof e.chunked!=`boolean`)throw TypeError(`options.chunked, when provided, must be a boolean.`);if(e.chunkSize!==void 0&&(!Number.isInteger(e.chunkSize)||e.chunkSize<1024))throw TypeError(`options.chunkSize, when provided, must be an integer and not smaller than 1024.`)}},dt=class extends ct{constructor(e,t){if(super(),this.stream=e,this.options=t,!(e instanceof FileSystemWritableFileStream))throw TypeError(`FileSystemWritableFileStreamTarget requires a FileSystemWritableFileStream instance.`);if(t!==void 0&&typeof t!=`object`)throw TypeError(`FileSystemWritableFileStreamTarget's options, when provided, must be an object.`);if(t&&t.chunkSize!==void 0&&(!Number.isInteger(t.chunkSize)||t.chunkSize<=0))throw TypeError(`options.chunkSize, when provided, must be a positive integer`)}},ft=class{constructor(){this.pos=0,v(this,R,new Uint8Array(8)),v(this,z,new DataView(_(this,R).buffer)),this.offsets=new WeakMap}seek(e){this.pos=e}writeU32(e){_(this,z).setUint32(0,e,!1),this.write(_(this,R).subarray(0,4))}writeU64(e){_(this,z).setUint32(0,Math.floor(e/2**32),!1),_(this,z).setUint32(4,e,!1),this.write(_(this,R).subarray(0,8))}writeAscii(e){for(let t=0;t<e.length;t++)_(this,z).setUint8(t%8,e.charCodeAt(t)),t%8==7&&this.write(_(this,R));e.length%8!=0&&this.write(_(this,R).subarray(0,e.length%8))}writeBox(e){if(this.offsets.set(e,this.pos),e.contents&&!e.children)this.writeBoxHeader(e,e.size??e.contents.byteLength+8),this.write(e.contents);else{let t=this.pos;if(this.writeBoxHeader(e,0),e.contents&&this.write(e.contents),e.children)for(let t of e.children)t&&this.writeBox(t);let n=this.pos,r=e.size??n-t;this.seek(t),this.writeBoxHeader(e,r),this.seek(n)}}writeBoxHeader(e,t){this.writeU32(e.largeSize?1:t),this.writeAscii(e.type),e.largeSize&&this.writeU64(t)}measureBoxHeader(e){return 8+(e.largeSize?8:0)}patchBox(e){let t=this.pos;this.seek(this.offsets.get(e)),this.writeBox(e),this.seek(t)}measureBox(e){if(e.contents&&!e.children)return this.measureBoxHeader(e)+e.contents.byteLength;{let t=this.measureBoxHeader(e);if(e.contents&&(t+=e.contents.byteLength),e.children)for(let n of e.children)n&&(t+=this.measureBox(n));return t}}},R=new WeakMap,z=new WeakMap,vt=class extends ft{constructor(e){super(),v(this,gt),v(this,pt,void 0),v(this,B,new ArrayBuffer(2**16)),v(this,mt,new Uint8Array(_(this,B))),v(this,ht,0),y(this,pt,e)}write(e){b(this,gt,_t).call(this,this.pos+e.byteLength),_(this,mt).set(e,this.pos),this.pos+=e.byteLength,y(this,ht,Math.max(_(this,ht),this.pos))}finalize(){b(this,gt,_t).call(this,this.pos),_(this,pt).buffer=_(this,B).slice(0,Math.max(_(this,ht),this.pos))}},pt=new WeakMap,B=new WeakMap,mt=new WeakMap,ht=new WeakMap,gt=new WeakSet,_t=function(e){let t=_(this,B).byteLength;for(;t<e;)t*=2;if(t===_(this,B).byteLength)return;let n=new ArrayBuffer(t),r=new Uint8Array(n);r.set(_(this,mt),0),y(this,B,n),y(this,mt,r)},yt=2**24,bt=2,jt=class extends ft{constructor(e){super(),v(this,Ct),v(this,Tt),v(this,Dt),v(this,kt),v(this,xt,void 0),v(this,V,[]),v(this,St,void 0),v(this,H,void 0),v(this,U,[]),y(this,xt,e),y(this,St,e.options?.chunked??!1),y(this,H,e.options?.chunkSize??yt)}write(e){_(this,V).push({data:e.slice(),start:this.pos}),this.pos+=e.byteLength}flush(){if(_(this,V).length===0)return;let e=[],t=[..._(this,V)].sort((e,t)=>e.start-t.start);e.push({start:t[0].start,size:t[0].data.byteLength});for(let n=1;n<t.length;n++){let r=e[e.length-1],i=t[n];i.start<=r.start+r.size?r.size=Math.max(r.size,i.start+i.data.byteLength-r.start):e.push({start:i.start,size:i.data.byteLength})}for(let t of e){t.data=new Uint8Array(t.size);for(let e of _(this,V))t.start<=e.start&&e.start<t.start+t.size&&t.data.set(e.data,e.start-t.start);_(this,St)?(b(this,Ct,wt).call(this,t.data,t.start),b(this,kt,At).call(this)):_(this,xt).options.onData?.(t.data,t.start)}_(this,V).length=0}finalize(){_(this,St)&&b(this,kt,At).call(this,!0)}},xt=new WeakMap,V=new WeakMap,St=new WeakMap,H=new WeakMap,U=new WeakMap,Ct=new WeakSet,wt=function(e,t){let n=_(this,U).findIndex(e=>e.start<=t&&t<e.start+_(this,H));n===-1&&(n=b(this,Dt,Ot).call(this,t));let r=_(this,U)[n],i=t-r.start,a=e.subarray(0,Math.min(_(this,H)-i,e.byteLength));r.data.set(a,i);let o={start:i,end:i+a.byteLength};if(b(this,Tt,Et).call(this,r,o),r.written[0].start===0&&r.written[0].end===_(this,H)&&(r.shouldFlush=!0),_(this,U).length>bt){for(let e=0;e<_(this,U).length-1;e++)_(this,U)[e].shouldFlush=!0;b(this,kt,At).call(this)}a.byteLength<e.byteLength&&b(this,Ct,wt).call(this,e.subarray(a.byteLength),t+a.byteLength)},Tt=new WeakSet,Et=function(e,t){let n=0,r=e.written.length-1,i=-1;for(;n<=r;){let a=Math.floor(n+(r-n+1)/2);e.written[a].start<=t.start?(n=a+1,i=a):r=a-1}for(e.written.splice(i+1,0,t),(i===-1||e.written[i].end<t.start)&&i++;i<e.written.length-1&&e.written[i].end>=e.written[i+1].start;)e.written[i].end=Math.max(e.written[i].end,e.written[i+1].end),e.written.splice(i+1,1)},Dt=new WeakSet,Ot=function(e){let t={start:Math.floor(e/_(this,H))*_(this,H),data:new Uint8Array(_(this,H)),written:[],shouldFlush:!1};return _(this,U).push(t),_(this,U).sort((e,t)=>e.start-t.start),_(this,U).indexOf(t)},kt=new WeakSet,At=function(e=!1){for(let t=0;t<_(this,U).length;t++){let n=_(this,U)[t];if(!(!n.shouldFlush&&!e)){for(let e of n.written)_(this,xt).options.onData?.(n.data.subarray(e.start,e.end),n.start+e.start);_(this,U).splice(t--,1)}}},Mt=class extends jt{constructor(e){super(new ut({onData:(t,n)=>e.stream.write({type:`write`,data:t,position:n}),chunked:!0,chunkSize:e.options?.chunkSize}))}},Nt=1e3,Pt=[`avc`,`hevc`,`vp9`,`av1`],Ft=[`aac`,`opus`],It=2082844800,Lt=[`strict`,`offset`,`cross-track-offset`],dn=class{constructor(e){if(v(this,Ht),v(this,Wt),v(this,Kt),v(this,Jt),v(this,Xt),v(this,Qt),v(this,Q),v(this,en),v(this,nn),v(this,an),v(this,sn),v(this,ln),v(this,W,void 0),v(this,G,void 0),v(this,Rt,void 0),v(this,K,void 0),v(this,q,null),v(this,J,null),v(this,Y,Math.floor(Date.now()/1e3)+It),v(this,zt,[]),v(this,Bt,1),v(this,X,[]),v(this,Z,[]),v(this,Vt,!1),b(this,Ht,Ut).call(this,e),e.video=P(e.video),e.audio=P(e.audio),e.fastStart=P(e.fastStart),this.target=e.target,y(this,W,{firstTimestampBehavior:`strict`,...e}),e.target instanceof lt)y(this,G,new vt(e.target));else if(e.target instanceof ut)y(this,G,new jt(e.target));else if(e.target instanceof dt)y(this,G,new Mt(e.target));else throw Error(`Invalid target: ${e.target}`);b(this,Jt,Yt).call(this),b(this,Wt,Gt).call(this)}addVideoChunk(e,t,n,r){if(!(e instanceof EncodedVideoChunk))throw TypeError(`addVideoChunk's first argument (sample) must be of type EncodedVideoChunk.`);if(t&&typeof t!=`object`)throw TypeError(`addVideoChunk's second argument (meta), when provided, must be an object.`);if(n!==void 0&&(!Number.isFinite(n)||n<0))throw TypeError(`addVideoChunk's third argument (timestamp), when provided, must be a non-negative real number.`);if(r!==void 0&&!Number.isFinite(r))throw TypeError(`addVideoChunk's fourth argument (compositionTimeOffset), when provided, must be a real number.`);let i=new Uint8Array(e.byteLength);e.copyTo(i),this.addVideoChunkRaw(i,e.type,n??e.timestamp,e.duration,t,r)}addVideoChunkRaw(e,t,n,r,i,a){if(!(e instanceof Uint8Array))throw TypeError(`addVideoChunkRaw's first argument (data) must be an instance of Uint8Array.`);if(t!==`key`&&t!==`delta`)throw TypeError(`addVideoChunkRaw's second argument (type) must be either 'key' or 'delta'.`);if(!Number.isFinite(n)||n<0)throw TypeError(`addVideoChunkRaw's third argument (timestamp) must be a non-negative real number.`);if(!Number.isFinite(r)||r<0)throw TypeError(`addVideoChunkRaw's fourth argument (duration) must be a non-negative real number.`);if(i&&typeof i!=`object`)throw TypeError(`addVideoChunkRaw's fifth argument (meta), when provided, must be an object.`);if(a!==void 0&&!Number.isFinite(a))throw TypeError(`addVideoChunkRaw's sixth argument (compositionTimeOffset), when provided, must be a real number.`);if(b(this,ln,un).call(this),!_(this,W).video)throw Error(`No video track declared.`);if(typeof _(this,W).fastStart==`object`&&_(this,q).samples.length===_(this,W).fastStart.expectedVideoChunks)throw Error(`Cannot add more video chunks than specified in 'fastStart' (${_(this,W).fastStart.expectedVideoChunks}).`);let o=b(this,Qt,$t).call(this,_(this,q),e,t,n,r,i,a);if(_(this,W).fastStart===`fragmented`&&_(this,J)){for(;_(this,Z).length>0&&_(this,Z)[0].decodeTimestamp<=o.decodeTimestamp;){let e=_(this,Z).shift();b(this,Q,$).call(this,_(this,J),e)}o.decodeTimestamp<=_(this,J).lastDecodeTimestamp?b(this,Q,$).call(this,_(this,q),o):_(this,X).push(o)}else b(this,Q,$).call(this,_(this,q),o)}addAudioChunk(e,t,n){if(!(e instanceof EncodedAudioChunk))throw TypeError(`addAudioChunk's first argument (sample) must be of type EncodedAudioChunk.`);if(t&&typeof t!=`object`)throw TypeError(`addAudioChunk's second argument (meta), when provided, must be an object.`);if(n!==void 0&&(!Number.isFinite(n)||n<0))throw TypeError(`addAudioChunk's third argument (timestamp), when provided, must be a non-negative real number.`);let r=new Uint8Array(e.byteLength);e.copyTo(r),this.addAudioChunkRaw(r,e.type,n??e.timestamp,e.duration,t)}addAudioChunkRaw(e,t,n,r,i){if(!(e instanceof Uint8Array))throw TypeError(`addAudioChunkRaw's first argument (data) must be an instance of Uint8Array.`);if(t!==`key`&&t!==`delta`)throw TypeError(`addAudioChunkRaw's second argument (type) must be either 'key' or 'delta'.`);if(!Number.isFinite(n)||n<0)throw TypeError(`addAudioChunkRaw's third argument (timestamp) must be a non-negative real number.`);if(!Number.isFinite(r)||r<0)throw TypeError(`addAudioChunkRaw's fourth argument (duration) must be a non-negative real number.`);if(i&&typeof i!=`object`)throw TypeError(`addAudioChunkRaw's fifth argument (meta), when provided, must be an object.`);if(b(this,ln,un).call(this),!_(this,W).audio)throw Error(`No audio track declared.`);if(typeof _(this,W).fastStart==`object`&&_(this,J).samples.length===_(this,W).fastStart.expectedAudioChunks)throw Error(`Cannot add more audio chunks than specified in 'fastStart' (${_(this,W).fastStart.expectedAudioChunks}).`);let a=b(this,Qt,$t).call(this,_(this,J),e,t,n,r,i);if(_(this,W).fastStart===`fragmented`&&_(this,q)){for(;_(this,X).length>0&&_(this,X)[0].decodeTimestamp<=a.decodeTimestamp;){let e=_(this,X).shift();b(this,Q,$).call(this,_(this,q),e)}a.decodeTimestamp<=_(this,q).lastDecodeTimestamp?b(this,Q,$).call(this,_(this,J),a):_(this,Z).push(a)}else b(this,Q,$).call(this,_(this,J),a)}finalize(){if(_(this,Vt))throw Error(`Cannot finalize a muxer more than once.`);if(_(this,W).fastStart===`fragmented`){for(let e of _(this,X))b(this,Q,$).call(this,_(this,q),e);for(let e of _(this,Z))b(this,Q,$).call(this,_(this,J),e);b(this,an,on).call(this,!1)}else _(this,q)&&b(this,nn,rn).call(this,_(this,q)),_(this,J)&&b(this,nn,rn).call(this,_(this,J));let e=[_(this,q),_(this,J)].filter(Boolean);if(_(this,W).fastStart===`in-memory`){let t;for(let n=0;n<2;n++){let n=pe(e,_(this,Y)),r=_(this,G).measureBox(n);t=_(this,G).measureBox(_(this,K));let i=_(this,G).pos+r+t;for(let e of _(this,zt)){e.offset=i;for(let{data:n}of e.samples)i+=n.byteLength,t+=n.byteLength}if(i<2**32)break;t>=2**32&&(_(this,K).largeSize=!0)}let n=pe(e,_(this,Y));_(this,G).writeBox(n),_(this,K).size=t,_(this,G).writeBox(_(this,K));for(let e of _(this,zt))for(let t of e.samples)_(this,G).write(t.data),t.data=null}else if(_(this,W).fastStart===`fragmented`){let t=_(this,G).pos,n=tt(e);_(this,G).writeBox(n);let r=_(this,G).pos-t;_(this,G).seek(_(this,G).pos-4),_(this,G).writeU32(r)}else{let t=_(this,G).offsets.get(_(this,K)),n=_(this,G).pos-t;_(this,K).size=n,_(this,K).largeSize=n>=2**32,_(this,G).patchBox(_(this,K));let r=pe(e,_(this,Y));if(typeof _(this,W).fastStart==`object`){_(this,G).seek(_(this,Rt)),_(this,G).writeBox(r);let e=t-_(this,G).pos;_(this,G).writeBox(fe(e))}else _(this,G).writeBox(r)}b(this,sn,cn).call(this),_(this,G).finalize(),y(this,Vt,!0)}},W=new WeakMap,G=new WeakMap,Rt=new WeakMap,K=new WeakMap,q=new WeakMap,J=new WeakMap,Y=new WeakMap,zt=new WeakMap,Bt=new WeakMap,X=new WeakMap,Z=new WeakMap,Vt=new WeakMap,Ht=new WeakSet,Ut=function(e){if(typeof e!=`object`)throw TypeError(`The muxer requires an options object to be passed to its constructor.`);if(!(e.target instanceof ct))throw TypeError(`The target must be provided and an instance of Target.`);if(e.video){if(!Pt.includes(e.video.codec))throw TypeError(`Unsupported video codec: ${e.video.codec}`);if(!Number.isInteger(e.video.width)||e.video.width<=0)throw TypeError(`Invalid video width: ${e.video.width}. Must be a positive integer.`);if(!Number.isInteger(e.video.height)||e.video.height<=0)throw TypeError(`Invalid video height: ${e.video.height}. Must be a positive integer.`);let t=e.video.rotation;if(typeof t==`number`&&![0,90,180,270].includes(t))throw TypeError(`Invalid video rotation: ${t}. Has to be 0, 90, 180 or 270.`);if(Array.isArray(t)&&(t.length!==9||t.some(e=>typeof e!=`number`)))throw TypeError(`Invalid video transformation matrix: ${t.join()}`);if(e.video.frameRate!==void 0&&(!Number.isInteger(e.video.frameRate)||e.video.frameRate<=0))throw TypeError(`Invalid video frame rate: ${e.video.frameRate}. Must be a positive integer.`)}if(e.audio){if(!Ft.includes(e.audio.codec))throw TypeError(`Unsupported audio codec: ${e.audio.codec}`);if(!Number.isInteger(e.audio.numberOfChannels)||e.audio.numberOfChannels<=0)throw TypeError(`Invalid number of audio channels: ${e.audio.numberOfChannels}. Must be a positive integer.`);if(!Number.isInteger(e.audio.sampleRate)||e.audio.sampleRate<=0)throw TypeError(`Invalid audio sample rate: ${e.audio.sampleRate}. Must be a positive integer.`)}if(e.firstTimestampBehavior&&!Lt.includes(e.firstTimestampBehavior))throw TypeError(`Invalid first timestamp behavior: ${e.firstTimestampBehavior}`);if(typeof e.fastStart==`object`){if(e.video){if(e.fastStart.expectedVideoChunks===void 0)throw TypeError(`'fastStart' is an object but is missing property 'expectedVideoChunks'.`);if(!Number.isInteger(e.fastStart.expectedVideoChunks)||e.fastStart.expectedVideoChunks<0)throw TypeError(`'expectedVideoChunks' must be a non-negative integer.`)}if(e.audio){if(e.fastStart.expectedAudioChunks===void 0)throw TypeError(`'fastStart' is an object but is missing property 'expectedAudioChunks'.`);if(!Number.isInteger(e.fastStart.expectedAudioChunks)||e.fastStart.expectedAudioChunks<0)throw TypeError(`'expectedAudioChunks' must be a non-negative integer.`)}}else if(![!1,`in-memory`,`fragmented`].includes(e.fastStart))throw TypeError(`'fastStart' option must be false, 'in-memory', 'fragmented' or an object.`);if(e.minFragmentDuration!==void 0&&(!Number.isFinite(e.minFragmentDuration)||e.minFragmentDuration<0))throw TypeError(`'minFragmentDuration' must be a non-negative number.`)},Wt=new WeakSet,Gt=function(){if(_(this,G).writeBox(ue({holdsAvc:_(this,W).video?.codec===`avc`,fragmented:_(this,W).fastStart===`fragmented`})),y(this,Rt,_(this,G).pos),_(this,W).fastStart===`in-memory`)y(this,K,de(!1));else if(_(this,W).fastStart!==`fragmented`){if(typeof _(this,W).fastStart==`object`){let e=b(this,Kt,qt).call(this);_(this,G).seek(_(this,G).pos+e)}y(this,K,de(!0)),_(this,G).writeBox(_(this,K))}b(this,sn,cn).call(this)},Kt=new WeakSet,qt=function(){if(typeof _(this,W).fastStart!=`object`)return;let e=0,t=[_(this,W).fastStart.expectedVideoChunks,_(this,W).fastStart.expectedAudioChunks];for(let n of t)n&&(e+=8*Math.ceil(2/3*n),e+=4*n,e+=12*Math.ceil(2/3*n),e+=4*n,e+=8*n);return e+=4096,e},Jt=new WeakSet,Yt=function(){if(_(this,W).video&&y(this,q,{id:1,info:{type:`video`,codec:_(this,W).video.codec,width:_(this,W).video.width,height:_(this,W).video.height,rotation:_(this,W).video.rotation??0,decoderConfig:null},timescale:_(this,W).video.frameRate??57600,samples:[],finalizedChunks:[],currentChunk:null,firstDecodeTimestamp:void 0,lastDecodeTimestamp:-1,timeToSampleTable:[],compositionTimeOffsetTable:[],lastTimescaleUnits:null,lastSample:null,compactlyCodedChunkTable:[]}),_(this,W).audio&&(y(this,J,{id:_(this,W).video?2:1,info:{type:`audio`,codec:_(this,W).audio.codec,numberOfChannels:_(this,W).audio.numberOfChannels,sampleRate:_(this,W).audio.sampleRate,decoderConfig:null},timescale:_(this,W).audio.sampleRate,samples:[],finalizedChunks:[],currentChunk:null,firstDecodeTimestamp:void 0,lastDecodeTimestamp:-1,timeToSampleTable:[],compositionTimeOffsetTable:[],lastTimescaleUnits:null,lastSample:null,compactlyCodedChunkTable:[]}),_(this,W).audio.codec===`aac`)){let e=b(this,Xt,Zt).call(this,2,_(this,W).audio.sampleRate,_(this,W).audio.numberOfChannels);_(this,J).info.decoderConfig={codec:_(this,W).audio.codec,description:e,numberOfChannels:_(this,W).audio.numberOfChannels,sampleRate:_(this,W).audio.sampleRate}}},Xt=new WeakSet,Zt=function(e,t,n){let r=[96e3,88200,64e3,48e3,44100,32e3,24e3,22050,16e3,12e3,11025,8e3,7350].indexOf(t),i=n,a=``;a+=e.toString(2).padStart(5,`0`),a+=r.toString(2).padStart(4,`0`),r===15&&(a+=t.toString(2).padStart(24,`0`)),a+=i.toString(2).padStart(4,`0`);let o=Math.ceil(a.length/8)*8;a=a.padEnd(o,`0`);let s=new Uint8Array(a.length/8);for(let e=0;e<a.length;e+=8)s[e/8]=parseInt(a.slice(e,e+8),2);return s},Qt=new WeakSet,$t=function(e,t,n,r,i,a,o){let s=r/1e6,c=(r-(o??0))/1e6,l=i/1e6,u=b(this,en,tn).call(this,s,c,e);return s=u.presentationTimestamp,c=u.decodeTimestamp,a?.decoderConfig&&(e.info.decoderConfig===null?e.info.decoderConfig=a.decoderConfig:Object.assign(e.info.decoderConfig,a.decoderConfig)),{presentationTimestamp:s,decodeTimestamp:c,duration:l,data:t,size:t.byteLength,type:n,timescaleUnitsToNextSample:N(l,e.timescale)}},Q=new WeakSet,$=function(e,t){_(this,W).fastStart!==`fragmented`&&e.samples.push(t);let n=N(t.presentationTimestamp-t.decodeTimestamp,e.timescale);if(e.lastTimescaleUnits!==null){let r=N(t.decodeTimestamp,e.timescale,!1),i=Math.round(r-e.lastTimescaleUnits);if(e.lastTimescaleUnits+=i,e.lastSample.timescaleUnitsToNextSample=i,_(this,W).fastStart!==`fragmented`){let t=M(e.timeToSampleTable);t.sampleCount===1?(t.sampleDelta=i,t.sampleCount++):t.sampleDelta===i?t.sampleCount++:(t.sampleCount--,e.timeToSampleTable.push({sampleCount:2,sampleDelta:i}));let r=M(e.compositionTimeOffsetTable);r.sampleCompositionTimeOffset===n?r.sampleCount++:e.compositionTimeOffsetTable.push({sampleCount:1,sampleCompositionTimeOffset:n})}}else e.lastTimescaleUnits=0,_(this,W).fastStart!==`fragmented`&&(e.timeToSampleTable.push({sampleCount:1,sampleDelta:N(t.duration,e.timescale)}),e.compositionTimeOffsetTable.push({sampleCount:1,sampleCompositionTimeOffset:n}));e.lastSample=t;let r=!1;if(!e.currentChunk)r=!0;else{let n=t.presentationTimestamp-e.currentChunk.startTimestamp;if(_(this,W).fastStart===`fragmented`){let i=_(this,q)??_(this,J),a=_(this,W).minFragmentDuration??1;e===i&&t.type===`key`&&n>=a&&(r=!0,b(this,an,on).call(this))}else r=n>=.5}r&&(e.currentChunk&&b(this,nn,rn).call(this,e),e.currentChunk={startTimestamp:t.presentationTimestamp,samples:[]}),e.currentChunk.samples.push(t)},en=new WeakSet,tn=function(e,t,n){let r=_(this,W).firstTimestampBehavior===`strict`,i=n.lastDecodeTimestamp===-1;if(r&&i&&t!==0)throw Error(`The first chunk for your media track must have a timestamp of 0 (received DTS=${t}).Non-zero first timestamps are often caused by directly piping frames or audio data from a MediaStreamTrack into the encoder. Their timestamps are typically relative to the age of thedocument, which is probably what you want.

If you want to offset all timestamps of a track such that the first one is zero, set firstTimestampBehavior: 'offset' in the options.
`);if(_(this,W).firstTimestampBehavior===`offset`||_(this,W).firstTimestampBehavior===`cross-track-offset`){n.firstDecodeTimestamp===void 0&&(n.firstDecodeTimestamp=t);let r;r=_(this,W).firstTimestampBehavior===`offset`?n.firstDecodeTimestamp:Math.min(_(this,q)?.firstDecodeTimestamp??1/0,_(this,J)?.firstDecodeTimestamp??1/0),t-=r,e-=r}if(t<n.lastDecodeTimestamp)throw Error(`Timestamps must be monotonically increasing (DTS went from ${n.lastDecodeTimestamp*1e6} to ${t*1e6}).`);return n.lastDecodeTimestamp=t,{presentationTimestamp:e,decodeTimestamp:t}},nn=new WeakSet,rn=function(e){if(_(this,W).fastStart===`fragmented`)throw Error(`Can't finalize individual chunks if 'fastStart' is set to 'fragmented'.`);if(e.currentChunk){if(e.finalizedChunks.push(e.currentChunk),_(this,zt).push(e.currentChunk),(e.compactlyCodedChunkTable.length===0||M(e.compactlyCodedChunkTable).samplesPerChunk!==e.currentChunk.samples.length)&&e.compactlyCodedChunkTable.push({firstChunk:e.finalizedChunks.length,samplesPerChunk:e.currentChunk.samples.length}),_(this,W).fastStart===`in-memory`){e.currentChunk.offset=0;return}e.currentChunk.offset=_(this,G).pos;for(let t of e.currentChunk.samples)_(this,G).write(t.data),t.data=null;b(this,sn,cn).call(this)}},an=new WeakSet,on=function(e=!0){if(_(this,W).fastStart!==`fragmented`)throw Error(`Can't finalize a fragment unless 'fastStart' is set to 'fragmented'.`);let t=[_(this,q),_(this,J)].filter(e=>e&&e.currentChunk);if(t.length===0)return;let n=re(this,Bt)._++;if(n===1){let e=pe(t,_(this,Y),!0);_(this,G).writeBox(e)}let r=_(this,G).pos,i=Je(n,t);_(this,G).writeBox(i);{let e=de(!1),n=0;for(let e of t)for(let t of e.currentChunk.samples)n+=t.size;let r=_(this,G).measureBox(e)+n;r>=2**32&&(e.largeSize=!0,r=_(this,G).measureBox(e)+n),e.size=r,_(this,G).writeBox(e)}for(let e of t){e.currentChunk.offset=_(this,G).pos,e.currentChunk.moofOffset=r;for(let t of e.currentChunk.samples)_(this,G).write(t.data),t.data=null}let a=_(this,G).pos;_(this,G).seek(_(this,G).offsets.get(i));let o=Je(n,t);_(this,G).writeBox(o),_(this,G).seek(a);for(let e of t)e.finalizedChunks.push(e.currentChunk),_(this,zt).push(e.currentChunk),e.currentChunk=null;e&&b(this,sn,cn).call(this)},sn=new WeakSet,cn=function(){_(this,G)instanceof jt&&_(this,G).flush()},ln=new WeakSet,un=function(){if(_(this,Vt))throw Error(`Cannot add new video or audio chunks after the file has been finalized.`)}}));t((()=>{te(),fn();var e=3584,t=960,n=256,r=768,i=0,a=832,o=document.getElementById(`c`);o.width=e,o.height=t;function s(){let n=e/t,r=window.innerWidth-40,i=window.innerHeight-100,a=r,s=a/n;s>i&&(s=i,a=s*n),o.style.width=a+`px`,o.style.height=s+`px`}window.addEventListener(`resize`,s),s();var c=o.getContext(`webgl2`,{preserveDrawingBuffer:!0,alpha:!1});c||alert(`WebGL2 not supported`);var l={baseColorR:.97,baseColorG:2,baseColorB:.71,wispColorR:2.91,wispColorG:2.79,wispColorB:2.54,caveSpeed:1,twistAmount:2.5,gyroidScale1:6,gyroidScale2:15,glowIntensity:.71,wispSize:1.5,wispPulseSpeed:.79,reflectionDim:.34,exposure:67e3,maxSteps:69,epsilon:.0037,saturation:0,viewX:-.45,viewY:0},u=new ee({title:`Tunnelwisp`}),d=u.addFolder(`Base Color`);d.add(l,`baseColorR`,0,3,.01).name(`R`),d.add(l,`baseColorG`,0,3,.01).name(`G`),d.add(l,`baseColorB`,0,3,.01).name(`B`);var f=u.addFolder(`Wisp Color`);f.add(l,`wispColorR`,0,5,.01).name(`R`),f.add(l,`wispColorG`,0,5,.01).name(`G`),f.add(l,`wispColorB`,0,5,.01).name(`B`);var p=u.addFolder(`Cave`);p.add(l,`caveSpeed`,0,3,.01).name(`Speed`),p.add(l,`twistAmount`,0,6,.1).name(`Twist`),p.add(l,`gyroidScale1`,1,20,.5).name(`Gyroid Scale 1`),p.add(l,`gyroidScale2`,1,50,.5).name(`Gyroid Scale 2`);var m=u.addFolder(`View Offset`);m.add(l,`viewX`,-1,1,.01).name(`X`),m.add(l,`viewY`,-1,1,.01).name(`Y`);var h=u.addFolder(`Glow`);h.add(l,`glowIntensity`,0,3,.01).name(`Intensity`),h.add(l,`wispSize`,.1,5,.1).name(`Wisp Size`),h.add(l,`wispPulseSpeed`,0,3,.01).name(`Pulse Speed`),h.add(l,`reflectionDim`,.01,1,.01).name(`Reflection Dim`);var g=u.addFolder(`Tone Mapping`);g.add(l,`exposure`,1e3,1e6,1e3).name(`Exposure`),g.add(l,`maxSteps`,20,150,1).name(`Max Steps`),g.add(l,`epsilon`,0,.01,1e-4).name(`Epsilon`),g.add(l,`saturation`,0,1,.01).name(`Saturation`);var ne=`#version 300 es
in vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0, 1); }
`,_=`#version 300 es
precision highp float;
out vec4 O;

uniform vec2 iResolution;
uniform float iTime;

uniform vec3 u_baseColor;
uniform vec3 u_wispColor;
uniform float u_caveSpeed;
uniform float u_twistAmount;
uniform float u_gyroidScale1;
uniform float u_gyroidScale2;
uniform float u_glowIntensity;
uniform float u_wispSize;
uniform float u_wispPulseSpeed;
uniform float u_reflectionDim;
uniform float u_exposure;
uniform float u_maxSteps;
uniform float u_epsilon;
uniform float u_saturation;
uniform vec2 u_viewOffset;

// Door black box mask
uniform vec4 u_doorRect; // x, y, w, h in pixels

float g(vec4 p, float s) {
  return abs(dot(sin(p *= s), cos(p.zxwy)) - 1.) / s;
}

void main() {
  vec2 C = gl_FragCoord.xy;

  // Black box: door area
  if (C.x >= u_doorRect.x && C.x < u_doorRect.x + u_doorRect.z &&
      C.y >= u_doorRect.y && C.y < u_doorRect.y + u_doorRect.w) {
    O = vec4(0, 0, 0, 1);
    return;
  }

  float i, d, z, s, T = iTime;
  vec4 o = vec4(0), q, p;
  vec4 U = vec4(2, 1, 0, 3);
  vec2 r = iResolution.xy;

  for (
    i = 0.;
    ++i < u_maxSteps;
    z += d + u_epsilon,
    q = vec4(normalize(vec3(C - .5 * r + u_viewOffset * r.y, r.y)) * z, .2),
    q.z += T / (3e1 / u_caveSpeed),
    s = q.y + .1,
    q.y = abs(s),
    p = q,
    p.y -= .11,
    p.xy *= mat2(cos(11. * vec4(0, 1, 3, 0) + u_twistAmount * p.z)),
    p.y -= .2,
    d = abs(g(p, u_gyroidScale1) - g(p, u_gyroidScale2)) / 4.,
    p = 1. + cos(.7 * U + 5. * q.z)
  )
    o += u_glowIntensity * (s > 0. ? 1. : u_reflectionDim) * p.w * p / max(s > 0. ? d : d * d * d, 5e-4);

  float pulse = 1.4 + sin(T * u_wispPulseSpeed) * sin(1.7 * T * u_wispPulseSpeed) * sin(2.3 * T * u_wispPulseSpeed);
  o += pulse * 1e3 * vec4(u_wispColor, 1) / (length(q.xy) / u_wispSize);

  o.rgb *= u_baseColor;

  // Desaturation: luminance-based B&W mix
  vec4 mapped = tanh(o / u_exposure);
  float lum = dot(mapped.rgb, vec3(0.2126, 0.7152, 0.0722));
  mapped.rgb = mix(vec3(lum), mapped.rgb, u_saturation);

  O = mapped;
}
`;function v(e,t){let n=c.createShader(e);return c.shaderSource(n,t),c.compileShader(n),c.getShaderParameter(n,c.COMPILE_STATUS)?n:(console.error(c.getShaderInfoLog(n)),null)}var y=v(c.VERTEX_SHADER,ne),re=v(c.FRAGMENT_SHADER,_),b=c.createProgram();c.attachShader(b,y),c.attachShader(b,re),c.linkProgram(b),c.getProgramParameter(b,c.LINK_STATUS)||console.error(c.getProgramInfoLog(b)),c.useProgram(b);var x=c.createBuffer();c.bindBuffer(c.ARRAY_BUFFER,x),c.bufferData(c.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),c.STATIC_DRAW);var S=c.getAttribLocation(b,`a_pos`);c.enableVertexAttribArray(S),c.vertexAttribPointer(S,2,c.FLOAT,!1,0,0);var C={};for(let e of[`iResolution`,`iTime`,`u_baseColor`,`u_wispColor`,`u_caveSpeed`,`u_twistAmount`,`u_gyroidScale1`,`u_gyroidScale2`,`u_glowIntensity`,`u_wispSize`,`u_wispPulseSpeed`,`u_reflectionDim`,`u_exposure`,`u_maxSteps`,`u_epsilon`,`u_saturation`,`u_viewOffset`,`u_doorRect`])C[e]=c.getUniformLocation(b,e);c.viewport(0,0,e,t);var w=performance.now();function ie(){let o=(performance.now()-w)/1e3;c.uniform2f(C.iResolution,e,t),c.uniform1f(C.iTime,o),c.uniform4f(C.u_doorRect,n,i,r,a),c.uniform3f(C.u_baseColor,l.baseColorR,l.baseColorG,l.baseColorB),c.uniform3f(C.u_wispColor,l.wispColorR,l.wispColorG,l.wispColorB),c.uniform1f(C.u_caveSpeed,l.caveSpeed),c.uniform1f(C.u_twistAmount,l.twistAmount),c.uniform1f(C.u_gyroidScale1,l.gyroidScale1),c.uniform1f(C.u_gyroidScale2,l.gyroidScale2),c.uniform1f(C.u_glowIntensity,l.glowIntensity),c.uniform1f(C.u_wispSize,l.wispSize),c.uniform1f(C.u_wispPulseSpeed,l.wispPulseSpeed),c.uniform1f(C.u_reflectionDim,l.reflectionDim),c.uniform1f(C.u_exposure,l.exposure),c.uniform1f(C.u_maxSteps,l.maxSteps),c.uniform1f(C.u_epsilon,l.epsilon),c.uniform1f(C.u_saturation,l.saturation),c.uniform2f(C.u_viewOffset,l.viewX,l.viewY),c.drawArrays(c.TRIANGLE_STRIP,0,4),D&&se(),requestAnimationFrame(ie)}var T=30,E=60,ae=T*E,D=!1,O=0,k=null,A=null,j=document.getElementById(`btn-record`),M=document.getElementById(`status`);j.addEventListener(`click`,()=>{D?N():oe()});function oe(){k=new dn({target:new lt,video:{codec:`avc`,width:e,height:t},fastStart:`in-memory`}),A=new VideoEncoder({output:(e,t)=>k.addVideoChunk(e,t),error:e=>console.error(`VideoEncoder error:`,e)}),A.configure({codec:`avc1.640033`,width:e,height:t,bitrate:8e7,framerate:T}),D=!0,O=0,j.textContent=`■ STOP`,j.classList.add(`recording`),M.textContent=`Recording...`}async function N(){D=!1,j.textContent=`...`,M.textContent=`Encoding...`,await A.flush(),A.close(),k.finalize();let n=k.target.buffer,r=new Blob([n],{type:`video/mp4`}),i=URL.createObjectURL(r),a=document.createElement(`a`);a.href=i,a.download=`tunnelwisp-${e}x${t}-${E}s.mp4`,a.click(),URL.revokeObjectURL(i),k=null,A=null,j.textContent=`● REC (1 min)`,j.classList.remove(`recording`),M.textContent=`Done — MP4 downloaded`}function se(){let e=new VideoFrame(o,{timestamp:O*1e6/T,duration:1e6/T}),t=O%(T*2)==0;A.encode(e,{keyFrame:t}),e.close(),O++;let n=O/T;M.textContent=`Recording ${Math.floor(n/60)}:${Math.floor(n%60).toString().padStart(2,`0`)} / 1:00  (${O}/${ae} frames)`,O>=ae&&N()}ie()}))();