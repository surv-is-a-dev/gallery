/**!
 * Extension Exposer
 * @author 0znzw <meow@miyo.lol> (@link https://scratch.mit.edu/users/0znzw/)
 * @version 1.1
 * @license MIT AND LGPL-3.0
 * @comment Thanks to Yoreni for the original idea. I rewrote the entire extension.
 * Do not remove this comment
 */
(function(Scratch) {
  'use strict';
  if (!Scratch.extensions.unsandboxed) {
    throw new Error(`"Breaking Eternity" extension must be ran unsandboxed.`);
  }
  const Decimal = (() => {
    const globalThis = {};
    /**! @license MIT License
      Copyright (c) 2024 Timothy Stiles https://github.com/Patashu/break_eternity.js/
      Permission is hereby granted, free of charge, to any person obtaining a copy
      of this software and associated documentation files (the "Software"), to deal
      in the Software without restriction, including without limitation the rights
      to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
      copies of the Software, and to permit persons to whom the Software is
      furnished to do so, subject to the following conditions:
      The above copyright notice and this permission notice shall be included in all
      copies or substantial portions of the Software.
      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
      IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
      FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
      AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
      LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
      OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
      SOFTWARE.
    */
    // prettier-ignore
    !function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e="undefined"!=typeof globalThis?globalThis:e||self).Decimal=t()}(this,(function(){"use strict";function e(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function t(e,t){for(var i=0;i<t.length;i++){var r=t[i];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function i(e,i,r){return i&&t(e.prototype,i),r&&t(e,r),Object.defineProperty(e,"prototype",{writable:!1}),e}var r=function(){function t(i){e(this,t),this.map=new Map,this.first=void 0,this.last=void 0,this.maxSize=i}return i(t,[{key:"size",get:function(){return this.map.size}},{key:"get",value:function(e){var t=this.map.get(e);if(void 0!==t)return t!==this.first&&(t===this.last?(this.last=t.prev,this.last.next=void 0):(t.prev.next=t.next,t.next.prev=t.prev),t.next=this.first,this.first.prev=t,this.first=t),t.value}},{key:"set",value:function(e,t){if(!(this.maxSize<1)){if(this.map.has(e))throw new Error("Cannot update existing keys in the cache");var i=new n(e,t);for(void 0===this.first?(this.first=i,this.last=i):(i.next=this.first,this.first.prev=i,this.first=i),this.map.set(e,i);this.map.size>this.maxSize;){var r=this.last;this.map.delete(r.key),this.last=r.prev,this.last.next=void 0}}}}]),t}(),n=i((function t(i,r){e(this,t),this.next=void 0,this.prev=void 0,this.key=i,this.value=r})),a=9e15,s=Math.log10(9e15),u=1/9e15,o=function(){for(var e=[],t=-323;t<=308;t++)e.push(Number("1e"+t));return function(t){return e[t+323]}}(),l=[2,Math.E,3,4,5,6,7,8,9,10],h=[[1,1.0891180521811203,1.1789767925673957,1.2701455431742086,1.3632090180450092,1.4587818160364217,1.5575237916251419,1.6601571006859253,1.767485818836978,1.8804192098842727,2],[1,1.1121114330934079,1.231038924931609,1.3583836963111375,1.4960519303993531,1.6463542337511945,1.8121385357018724,1.996971324618307,2.2053895545527546,2.4432574483385254,Math.E],[1,1.1187738849693603,1.2464963939368214,1.38527004705667,1.5376664685821402,1.7068895236551784,1.897001227148399,2.1132403089001035,2.362480153784171,2.6539010333870774,3],[1,1.1367350847096405,1.2889510672956703,1.4606478703324786,1.6570295196661111,1.8850062585672889,2.1539465047453485,2.476829779693097,2.872061932789197,3.3664204535587183,4],[1,1.1494592900767588,1.319708228183931,1.5166291280087583,1.748171114438024,2.0253263297298045,2.3636668498288547,2.7858359149579424,3.3257226212448145,4.035730287722532,5],[1,1.159225940787673,1.343712473580932,1.5611293155111927,1.8221199554561318,2.14183924486326,2.542468319282638,3.0574682501653316,3.7390572020926873,4.6719550537360774,6],[1,1.1670905356972596,1.3632807444991446,1.5979222279405536,1.8842640123816674,2.2416069644878687,2.69893426559423,3.3012632110403577,4.121250340630164,5.281493033448316,7],[1,1.1736630594087796,1.379783782386201,1.6292821855668218,1.9378971836180754,2.3289975651071977,2.8384347394720835,3.5232708454565906,4.478242031114584,5.868592169644505,8],[1,1.1793017514670474,1.394054150657457,1.65664127441059,1.985170999970283,2.4069682290577457,2.9647310119960752,3.7278665320924946,4.814462547283592,6.436522247411611,9],[1,1.1840100246247336,1.4061375836156955,1.6802272208863964,2.026757028388619,2.4770056063449646,3.080525271755482,3.9191964192627284,5.135152840833187,6.989961179534715,10]],g=[[-1,-.9194161097107025,-.8335625019330468,-.7425599821143978,-.6466611521029437,-.5462617907227869,-.4419033816638769,-.3342645487554494,-.224140440909962,-.11241087890006762,0],[-1,-.90603157029014,-.80786507256596,-.7064666939634,-.60294836853664,-.49849837513117,-.39430303318768,-.29147201034755,-.19097820800866,-.09361896280296,0],[-1,-.9021579584316141,-.8005762598234203,-.6964780623319391,-.5911906810998454,-.486050182576545,-.3823089430815083,-.28106046722897615,-.1831906535795894,-.08935809204418144,0],[-1,-.8917227442365535,-.781258746326964,-.6705130326902455,-.5612813129406509,-.4551067709033134,-.35319256652135966,-.2563741554088552,-.1651412821106526,-.0796919581982668,0],[-1,-.8843387974366064,-.7678744063886243,-.6529563724510552,-.5415870994657841,-.4352842206588936,-.33504449124791424,-.24138853420685147,-.15445285440944467,-.07409659641336663,0],[-1,-.8786709358426346,-.7577735191184886,-.6399546189952064,-.527284921869926,-.4211627631006314,-.3223479611761232,-.23107655627789858,-.1472057700818259,-.07035171210706326,0],[-1,-.8740862815291583,-.7497032990976209,-.6297119746181752,-.5161838335958787,-.41036238255751956,-.31277212146489963,-.2233976621705518,-.1418697367979619,-.06762117662323441,0],[-1,-.8702632331800649,-.7430366914122081,-.6213373075161548,-.5072025698095242,-.40171437727184167,-.30517930701410456,-.21736343968190863,-.137710238299109,-.06550774483471955,0],[-1,-.8670016295947213,-.7373984232432306,-.6143173985094293,-.49973884395492807,-.394584953527678,-.2989649949848695,-.21245647317021688,-.13434688362382652,-.0638072667348083,0],[-1,-.8641642839543857,-.732534623168535,-.6083127477059322,-.4934049257184696,-.3885773075899922,-.29376029055315767,-.2083678561173622,-.13155653399373268,-.062401588652553186,0]],f=function(e){return b.fromValue_noAlloc(e)},m=function(e,t,i){return b.fromComponents(e,t,i)},c=function(e,t,i){return b.fromComponents_noNormalize(e,t,i)},v=function(e,t){var i=t+1,r=Math.ceil(Math.log10(Math.abs(e))),n=Math.round(e*Math.pow(10,i-r))*Math.pow(10,r-i);return parseFloat(n.toFixed(Math.max(i-r,0)))},y=function(e){return Math.sign(e)*Math.log10(Math.abs(e))},d=.5671432904097838,N=function(e){var t,i,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1e-10,n=!(arguments.length>2&&void 0!==arguments[2])||arguments[2];if(!Number.isFinite(e))return e;if(n){if(0===e)return e;if(1===e)return d;t=e<10?0:Math.log(e)-Math.log(Math.log(e))}else{if(0===e)return-1/0;t=e<=-.1?-2:Math.log(-e)-Math.log(-Math.log(-e))}for(var a=0;a<100;++a){if(i=(e*Math.exp(-t)+t*t)/(t+1),Math.abs(i-t)<r*Math.abs(i))return i;t=i}throw Error("Iteration failed to converge: ".concat(e.toString()))};function p(e){var t,i,r,n,a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1e-10,s=!(arguments.length>2&&void 0!==arguments[2])||arguments[2];if(!Number.isFinite(e.mag))return new b(e);if(s){if(e.eq(b.dZero))return c(0,0,0);if(e.eq(b.dOne))return b.fromNumber(d);t=b.ln(e)}else{if(e.eq(b.dZero))return new b(b.dNegInf);t=b.ln(e.neg())}for(var u=0;u<100;++u){if(i=t.neg().exp(),r=t.sub(e.mul(i)),n=t.sub(r.div(t.add(1).sub(t.add(2).mul(r).div(b.mul(2,t).add(2))))),b.abs(n.sub(t)).lt(b.abs(n).mul(a)))return n;t=n}throw Error("Iteration failed to converge: ".concat(e.toString()))}var b=function(){function t(i){e(this,t),this.sign=0,this.mag=0,this.layer=0,i instanceof t?this.fromDecimal(i):"number"==typeof i?this.fromNumber(i):"string"==typeof i&&this.fromString(i)}return i(t,[{key:"m",get:function(){if(0===this.sign)return 0;if(0===this.layer){var e,t=Math.floor(Math.log10(this.mag));return e=5e-324===this.mag?5:this.mag/o(t),this.sign*e}if(1===this.layer){var i=this.mag-Math.floor(this.mag);return this.sign*Math.pow(10,i)}return this.sign},set:function(e){this.layer<=2?this.fromMantissaExponent(e,this.e):(this.sign=Math.sign(e),0===this.sign&&(this.layer=0,this.exponent=0))}},{key:"e",get:function(){return 0===this.sign?0:0===this.layer?Math.floor(Math.log10(this.mag)):1===this.layer?Math.floor(this.mag):2===this.layer?Math.floor(Math.sign(this.mag)*Math.pow(10,Math.abs(this.mag))):this.mag*Number.POSITIVE_INFINITY},set:function(e){this.fromMantissaExponent(this.m,e)}},{key:"s",get:function(){return this.sign},set:function(e){0===e?(this.sign=0,this.layer=0,this.mag=0):this.sign=e}},{key:"mantissa",get:function(){return this.m},set:function(e){this.m=e}},{key:"exponent",get:function(){return this.e},set:function(e){this.e=e}},{key:"normalize",value:function(){if(0===this.sign||0===this.mag&&0===this.layer||this.mag===Number.NEGATIVE_INFINITY&&this.layer>0&&Number.isFinite(this.layer))return this.sign=0,this.mag=0,this.layer=0,this;if(0===this.layer&&this.mag<0&&(this.mag=-this.mag,this.sign=-this.sign),this.mag===Number.POSITIVE_INFINITY||this.layer===Number.POSITIVE_INFINITY||this.mag===Number.NEGATIVE_INFINITY||this.layer===Number.NEGATIVE_INFINITY)return this.mag=Number.POSITIVE_INFINITY,this.layer=Number.POSITIVE_INFINITY,this;if(0===this.layer&&this.mag<u)return this.layer+=1,this.mag=Math.log10(this.mag),this;var e=Math.abs(this.mag),t=Math.sign(this.mag);if(e>=a)return this.layer+=1,this.mag=t*Math.log10(e),this;for(;e<s&&this.layer>0;)this.layer-=1,0===this.layer?this.mag=Math.pow(10,this.mag):(this.mag=t*Math.pow(10,e),e=Math.abs(this.mag),t=Math.sign(this.mag));return 0===this.layer&&(this.mag<0?(this.mag=-this.mag,this.sign=-this.sign):0===this.mag&&(this.sign=0)),(Number.isNaN(this.sign)||Number.isNaN(this.layer)||Number.isNaN(this.mag))&&(this.sign=Number.NaN,this.layer=Number.NaN,this.mag=Number.NaN),this}},{key:"fromComponents",value:function(e,t,i){return this.sign=e,this.layer=t,this.mag=i,this.normalize(),this}},{key:"fromComponents_noNormalize",value:function(e,t,i){return this.sign=e,this.layer=t,this.mag=i,this}},{key:"fromMantissaExponent",value:function(e,t){return this.layer=1,this.sign=Math.sign(e),e=Math.abs(e),this.mag=t+Math.log10(e),this.normalize(),this}},{key:"fromMantissaExponent_noNormalize",value:function(e,t){return this.fromMantissaExponent(e,t),this}},{key:"fromDecimal",value:function(e){return this.sign=e.sign,this.layer=e.layer,this.mag=e.mag,this}},{key:"fromNumber",value:function(e){return this.mag=Math.abs(e),this.sign=Math.sign(e),this.layer=0,this.normalize(),this}},{key:"fromString",value:function(e){var i=arguments.length>1&&void 0!==arguments[1]&&arguments[1],r=e,n=t.fromStringCache.get(r);if(void 0!==n)return this.fromDecimal(n);var a=(e=e.replace(",","")).split("^^^");if(2===a.length){var s=parseFloat(a[0]),u=parseFloat(a[1]),o=a[1].split(";"),l=1;if(2===o.length&&(l=parseFloat(o[1]),isFinite(l)||(l=1)),isFinite(s)&&isFinite(u)){var h=t.pentate(s,u,l,i);return this.sign=h.sign,this.layer=h.layer,this.mag=h.mag,t.fromStringCache.maxSize>=1&&t.fromStringCache.set(r,t.fromDecimal(this)),this}}var g=e.split("^^");if(2===g.length){var c=parseFloat(g[0]),v=parseFloat(g[1]),d=g[1].split(";"),N=1;if(2===d.length&&(N=parseFloat(d[1]),isFinite(N)||(N=1)),isFinite(c)&&isFinite(v)){var p=t.tetrate(c,v,N,i);return this.sign=p.sign,this.layer=p.layer,this.mag=p.mag,t.fromStringCache.maxSize>=1&&t.fromStringCache.set(r,t.fromDecimal(this)),this}}var b,k,w=e.split("^");if(2===w.length){var M=parseFloat(w[0]),I=parseFloat(w[1]);if(isFinite(M)&&isFinite(I)){var _=t.pow(M,I);return this.sign=_.sign,this.layer=_.layer,this.mag=_.mag,t.fromStringCache.maxSize>=1&&t.fromStringCache.set(r,t.fromDecimal(this)),this}}var q=(e=e.trim().toLowerCase()).split("pt");if(2===q.length){b=10;var F=!1;"-"==q[0][0]&&(F=!0,q[0]=q[0].slice(1)),k=parseFloat(q[0]),q[1]=q[1].replace("(",""),q[1]=q[1].replace(")","");var S=parseFloat(q[1]);if(isFinite(S)||(S=1),isFinite(b)&&isFinite(k)){var x=t.tetrate(b,k,S,i);return this.sign=x.sign,this.layer=x.layer,this.mag=x.mag,t.fromStringCache.maxSize>=1&&t.fromStringCache.set(r,t.fromDecimal(this)),F&&(this.sign*=-1),this}}if(2===(q=e.split("p")).length){b=10;var E=!1;"-"==q[0][0]&&(E=!0,q[0]=q[0].slice(1)),k=parseFloat(q[0]),q[1]=q[1].replace("(",""),q[1]=q[1].replace(")","");var T=parseFloat(q[1]);if(isFinite(T)||(T=1),isFinite(b)&&isFinite(k)){var O=t.tetrate(b,k,T,i);return this.sign=O.sign,this.layer=O.layer,this.mag=O.mag,t.fromStringCache.maxSize>=1&&t.fromStringCache.set(r,t.fromDecimal(this)),E&&(this.sign*=-1),this}}if(2===(q=e.split("f")).length){b=10;var z=!1;"-"==q[0][0]&&(z=!0,q[0]=q[0].slice(1)),q[0]=q[0].replace("(",""),q[0]=q[0].replace(")","");var C=parseFloat(q[0]);if(q[1]=q[1].replace("(",""),q[1]=q[1].replace(")",""),k=parseFloat(q[1]),isFinite(C)||(C=1),isFinite(b)&&isFinite(k)){var V=t.tetrate(b,k,C,i);return this.sign=V.sign,this.layer=V.layer,this.mag=V.mag,t.fromStringCache.maxSize>=1&&t.fromStringCache.set(r,t.fromDecimal(this)),z&&(this.sign*=-1),this}}var A=e.split("e"),P=A.length-1;if(0===P){var Z=parseFloat(e);if(isFinite(Z))return this.fromNumber(Z),t.fromStringCache.size>=1&&t.fromStringCache.set(r,t.fromDecimal(this)),this}else if(1===P){var D=parseFloat(e);if(isFinite(D)&&0!==D)return this.fromNumber(D),t.fromStringCache.maxSize>=1&&t.fromStringCache.set(r,t.fromDecimal(this)),this}var Y=e.split("e^");if(2===Y.length){this.sign=1,"-"==Y[0].charAt(0)&&(this.sign=-1);for(var L="",G=0;G<Y[1].length;++G){var U=Y[1].charCodeAt(G);if(!(U>=43&&U<=57||101===U)){if(this.layer=parseFloat(L),this.mag=parseFloat(Y[1].substr(G+1)),this.layer<0||this.layer%1!=0){var X=t.tetrate(10,this.layer,this.mag,i);this.sign=X.sign,this.layer=X.layer,this.mag=X.mag}return this.normalize(),t.fromStringCache.maxSize>=1&&t.fromStringCache.set(r,t.fromDecimal(this)),this}L+=Y[1].charAt(G)}}if(P<1)return this.sign=0,this.layer=0,this.mag=0,t.fromStringCache.maxSize>=1&&t.fromStringCache.set(r,t.fromDecimal(this)),this;var W=parseFloat(A[0]);if(0===W)return this.sign=0,this.layer=0,this.mag=0,t.fromStringCache.maxSize>=1&&t.fromStringCache.set(r,t.fromDecimal(this)),this;var j=parseFloat(A[A.length-1]);if(P>=2){var B=parseFloat(A[A.length-2]);isFinite(B)&&(j*=Math.sign(B),j+=y(B))}if(isFinite(W))if(1===P)this.sign=Math.sign(W),this.layer=1,this.mag=j+Math.log10(Math.abs(W));else{if(this.sign=Math.sign(W),this.layer=P,2===P){var R=t.mul(m(1,2,j),f(W));return this.sign=R.sign,this.layer=R.layer,this.mag=R.mag,t.fromStringCache.maxSize>=1&&t.fromStringCache.set(r,t.fromDecimal(this)),this}this.mag=j}else this.sign="-"===A[0]?-1:1,this.layer=P,this.mag=j;return this.normalize(),t.fromStringCache.maxSize>=1&&t.fromStringCache.set(r,t.fromDecimal(this)),this}},{key:"fromValue",value:function(e){return e instanceof t?this.fromDecimal(e):"number"==typeof e?this.fromNumber(e):"string"==typeof e?this.fromString(e):(this.sign=0,this.layer=0,this.mag=0,this)}},{key:"toNumber",value:function(){return this.mag===Number.POSITIVE_INFINITY&&this.layer===Number.POSITIVE_INFINITY&&1===this.sign?Number.POSITIVE_INFINITY:this.mag===Number.POSITIVE_INFINITY&&this.layer===Number.POSITIVE_INFINITY&&-1===this.sign?Number.NEGATIVE_INFINITY:Number.isFinite(this.layer)?0===this.layer?this.sign*this.mag:1===this.layer?this.sign*Math.pow(10,this.mag):this.mag>0?this.sign>0?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY:0:Number.NaN}},{key:"mantissaWithDecimalPlaces",value:function(e){return isNaN(this.m)?Number.NaN:0===this.m?0:v(this.m,e)}},{key:"magnitudeWithDecimalPlaces",value:function(e){return isNaN(this.mag)?Number.NaN:0===this.mag?0:v(this.mag,e)}},{key:"toString",value:function(){return isNaN(this.layer)||isNaN(this.sign)||isNaN(this.mag)?"NaN":this.mag===Number.POSITIVE_INFINITY||this.layer===Number.POSITIVE_INFINITY?1===this.sign?"Infinity":"-Infinity":0===this.layer?this.mag<1e21&&this.mag>1e-7||0===this.mag?(this.sign*this.mag).toString():this.m+"e"+this.e:1===this.layer?this.m+"e"+this.e:this.layer<=5?(-1===this.sign?"-":"")+"e".repeat(this.layer)+this.mag:(-1===this.sign?"-":"")+"(e^"+this.layer+")"+this.mag}},{key:"toExponential",value:function(e){return 0===this.layer?(this.sign*this.mag).toExponential(e):this.toStringWithDecimalPlaces(e)}},{key:"toFixed",value:function(e){return 0===this.layer?(this.sign*this.mag).toFixed(e):this.toStringWithDecimalPlaces(e)}},{key:"toPrecision",value:function(e){return this.e<=-7?this.toExponential(e-1):e>this.e?this.toFixed(e-this.exponent-1):this.toExponential(e-1)}},{key:"valueOf",value:function(){return this.toString()}},{key:"toJSON",value:function(){return this.toString()}},{key:"toStringWithDecimalPlaces",value:function(e){return 0===this.layer?this.mag<1e21&&this.mag>1e-7||0===this.mag?(this.sign*this.mag).toFixed(e):v(this.m,e)+"e"+v(this.e,e):1===this.layer?v(this.m,e)+"e"+v(this.e,e):this.layer<=5?(-1===this.sign?"-":"")+"e".repeat(this.layer)+v(this.mag,e):(-1===this.sign?"-":"")+"(e^"+this.layer+")"+v(this.mag,e)}},{key:"abs",value:function(){return c(0===this.sign?0:1,this.layer,this.mag)}},{key:"neg",value:function(){return c(-this.sign,this.layer,this.mag)}},{key:"negate",value:function(){return this.neg()}},{key:"negated",value:function(){return this.neg()}},{key:"sgn",value:function(){return this.sign}},{key:"round",value:function(){return this.mag<0?c(0,0,0):0===this.layer?m(this.sign,0,Math.round(this.mag)):new t(this)}},{key:"floor",value:function(){return this.mag<0?-1===this.sign?c(-1,0,1):c(0,0,0):-1===this.sign?this.neg().ceil().neg():0===this.layer?m(this.sign,0,Math.floor(this.mag)):new t(this)}},{key:"ceil",value:function(){return this.mag<0?1===this.sign?c(1,0,1):c(0,0,0):-1===this.sign?this.neg().floor().neg():0===this.layer?m(this.sign,0,Math.ceil(this.mag)):new t(this)}},{key:"trunc",value:function(){return this.mag<0?c(0,0,0):0===this.layer?m(this.sign,0,Math.trunc(this.mag)):new t(this)}},{key:"add",value:function(e){var i,r,n=f(e);if(this.eq(t.dInf)&&n.eq(t.dNegInf)||this.eq(t.dNegInf)&&n.eq(t.dInf))return new t(t.dNaN);if(!Number.isFinite(this.layer))return new t(this);if(!Number.isFinite(n.layer))return new t(n);if(0===this.sign)return new t(n);if(0===n.sign)return new t(this);if(this.sign===-n.sign&&this.layer===n.layer&&this.mag===n.mag)return c(0,0,0);if(this.layer>=2||n.layer>=2)return this.maxabs(n);if(t.cmpabs(this,n)>0?(i=new t(this),r=new t(n)):(i=new t(n),r=new t(this)),0===i.layer&&0===r.layer)return t.fromNumber(i.sign*i.mag+r.sign*r.mag);var a=i.layer*Math.sign(i.mag),s=r.layer*Math.sign(r.mag);if(a-s>=2)return i;if(0===a&&-1===s){if(Math.abs(r.mag-Math.log10(i.mag))>17)return i;var u=Math.pow(10,Math.log10(i.mag)-r.mag),o=r.sign+i.sign*u;return m(Math.sign(o),1,r.mag+Math.log10(Math.abs(o)))}if(1===a&&0===s){if(Math.abs(i.mag-Math.log10(r.mag))>17)return i;var l=Math.pow(10,i.mag-Math.log10(r.mag)),h=r.sign+i.sign*l;return m(Math.sign(h),1,Math.log10(r.mag)+Math.log10(Math.abs(h)))}if(Math.abs(i.mag-r.mag)>17)return i;var g=Math.pow(10,i.mag-r.mag),v=r.sign+i.sign*g;return m(Math.sign(v),1,r.mag+Math.log10(Math.abs(v)))}},{key:"plus",value:function(e){return this.add(e)}},{key:"sub",value:function(e){return this.add(f(e).neg())}},{key:"subtract",value:function(e){return this.sub(e)}},{key:"minus",value:function(e){return this.sub(e)}},{key:"mul",value:function(e){var i,r,n=f(e);if(this.eq(t.dInf)&&n.eq(t.dNegInf)||this.eq(t.dNegInf)&&n.eq(t.dInf))return new t(t.dNegInf);if(this.mag==Number.POSITIVE_INFINITY&&n.eq(t.dZero)||this.eq(t.dZero)&&this.mag==Number.POSITIVE_INFINITY)return new t(t.dNaN);if(this.eq(t.dNegInf)&&n.eq(t.dNegInf))return new t(t.dInf);if(!Number.isFinite(this.layer))return new t(this);if(!Number.isFinite(n.layer))return new t(n);if(0===this.sign||0===n.sign)return c(0,0,0);if(this.layer===n.layer&&this.mag===-n.mag)return c(this.sign*n.sign,0,1);if(this.layer>n.layer||this.layer==n.layer&&Math.abs(this.mag)>Math.abs(n.mag)?(i=new t(this),r=new t(n)):(i=new t(n),r=new t(this)),0===i.layer&&0===r.layer)return t.fromNumber(i.sign*r.sign*i.mag*r.mag);if(i.layer>=3||i.layer-r.layer>=2)return m(i.sign*r.sign,i.layer,i.mag);if(1===i.layer&&0===r.layer)return m(i.sign*r.sign,1,i.mag+Math.log10(r.mag));if(1===i.layer&&1===r.layer)return m(i.sign*r.sign,1,i.mag+r.mag);if(2===i.layer&&1===r.layer){var a=m(Math.sign(i.mag),i.layer-1,Math.abs(i.mag)).add(m(Math.sign(r.mag),r.layer-1,Math.abs(r.mag)));return m(i.sign*r.sign,a.layer+1,a.sign*a.mag)}if(2===i.layer&&2===r.layer){var s=m(Math.sign(i.mag),i.layer-1,Math.abs(i.mag)).add(m(Math.sign(r.mag),r.layer-1,Math.abs(r.mag)));return m(i.sign*r.sign,s.layer+1,s.sign*s.mag)}throw Error("Bad arguments to mul: "+this+", "+e)}},{key:"multiply",value:function(e){return this.mul(e)}},{key:"times",value:function(e){return this.mul(e)}},{key:"div",value:function(e){var t=f(e);return this.mul(t.recip())}},{key:"divide",value:function(e){return this.div(e)}},{key:"divideBy",value:function(e){return this.div(e)}},{key:"dividedBy",value:function(e){return this.div(e)}},{key:"recip",value:function(){return 0===this.mag?new t(t.dNaN):this.mag===Number.POSITIVE_INFINITY?c(0,0,0):0===this.layer?m(this.sign,0,1/this.mag):m(this.sign,this.layer,-this.mag)}},{key:"reciprocal",value:function(){return this.recip()}},{key:"reciprocate",value:function(){return this.recip()}},{key:"mod",value:function(e){var i=arguments.length>1&&void 0!==arguments[1]&&arguments[1],r=f(e),n=r.abs();if(this.eq(t.dZero)||n.eq(t.dZero))return c(0,0,0);if(i){var a=this.abs().mod(n);return-1==this.sign!=(-1==r.sign)&&(a=r.abs().sub(a)),a.mul(r.sign)}var s=this.toNumber(),u=n.toNumber();return isFinite(s)&&isFinite(u)&&0!=s&&0!=u?new t(s%u):this.sub(n).eq(this)?c(0,0,0):n.sub(this).eq(n)?new t(this):-1==this.sign?this.abs().mod(n).neg():this.sub(this.div(n).floor().mul(n))}},{key:"modulo",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return this.mod(e,t)}},{key:"modular",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return this.mod(e,t)}},{key:"cmp",value:function(e){var t=f(e);return this.sign>t.sign?1:this.sign<t.sign?-1:this.sign*this.cmpabs(e)}},{key:"cmpabs",value:function(e){var t=f(e),i=this.mag>0?this.layer:-this.layer,r=t.mag>0?t.layer:-t.layer;return i>r?1:i<r?-1:this.mag>t.mag?1:this.mag<t.mag?-1:0}},{key:"compare",value:function(e){return this.cmp(e)}},{key:"isNan",value:function(){return isNaN(this.sign)||isNaN(this.layer)||isNaN(this.mag)}},{key:"isFinite",value:function(e){function t(){return e.apply(this,arguments)}return t.toString=function(){return e.toString()},t}((function(){return isFinite(this.sign)&&isFinite(this.layer)&&isFinite(this.mag)}))},{key:"eq",value:function(e){var t=f(e);return this.sign===t.sign&&this.layer===t.layer&&this.mag===t.mag}},{key:"equals",value:function(e){return this.eq(e)}},{key:"neq",value:function(e){return!this.eq(e)}},{key:"notEquals",value:function(e){return this.neq(e)}},{key:"lt",value:function(e){return-1===this.cmp(e)}},{key:"lte",value:function(e){return!this.gt(e)}},{key:"gt",value:function(e){return 1===this.cmp(e)}},{key:"gte",value:function(e){return!this.lt(e)}},{key:"max",value:function(e){var i=f(e);return this.lt(i)?new t(i):new t(this)}},{key:"min",value:function(e){var i=f(e);return this.gt(i)?new t(i):new t(this)}},{key:"maxabs",value:function(e){var i=f(e);return this.cmpabs(i)<0?new t(i):new t(this)}},{key:"minabs",value:function(e){var i=f(e);return this.cmpabs(i)>0?new t(i):new t(this)}},{key:"clamp",value:function(e,t){return this.max(e).min(t)}},{key:"clampMin",value:function(e){return this.max(e)}},{key:"clampMax",value:function(e){return this.min(e)}},{key:"cmp_tolerance",value:function(e,t){var i=f(e);return this.eq_tolerance(i,t)?0:this.cmp(i)}},{key:"compare_tolerance",value:function(e,t){return this.cmp_tolerance(e,t)}},{key:"eq_tolerance",value:function(e,t){var i=f(e);if(null==t&&(t=1e-7),this.sign!==i.sign)return!1;if(Math.abs(this.layer-i.layer)>1)return!1;var r=this.mag,n=i.mag;return this.layer>i.layer&&(n=y(n)),this.layer<i.layer&&(r=y(r)),Math.abs(r-n)<=t*Math.max(Math.abs(r),Math.abs(n))}},{key:"equals_tolerance",value:function(e,t){return this.eq_tolerance(e,t)}},{key:"neq_tolerance",value:function(e,t){return!this.eq_tolerance(e,t)}},{key:"notEquals_tolerance",value:function(e,t){return this.neq_tolerance(e,t)}},{key:"lt_tolerance",value:function(e,t){var i=f(e);return!this.eq_tolerance(i,t)&&this.lt(i)}},{key:"lte_tolerance",value:function(e,t){var i=f(e);return this.eq_tolerance(i,t)||this.lt(i)}},{key:"gt_tolerance",value:function(e,t){var i=f(e);return!this.eq_tolerance(i,t)&&this.gt(i)}},{key:"gte_tolerance",value:function(e,t){var i=f(e);return this.eq_tolerance(i,t)||this.gt(i)}},{key:"pLog10",value:function(){return this.lt(t.dZero)?c(0,0,0):this.log10()}},{key:"absLog10",value:function(){return 0===this.sign?new t(t.dNaN):this.layer>0?m(Math.sign(this.mag),this.layer-1,Math.abs(this.mag)):m(1,0,Math.log10(this.mag))}},{key:"log10",value:function(){return this.sign<=0?new t(t.dNaN):this.layer>0?m(Math.sign(this.mag),this.layer-1,Math.abs(this.mag)):m(this.sign,0,Math.log10(this.mag))}},{key:"log",value:function(e){return e=f(e),this.sign<=0||e.sign<=0||1===e.sign&&0===e.layer&&1===e.mag?new t(t.dNaN):0===this.layer&&0===e.layer?m(this.sign,0,Math.log(this.mag)/Math.log(e.mag)):t.div(this.log10(),e.log10())}},{key:"log2",value:function(){return this.sign<=0?new t(t.dNaN):0===this.layer?m(this.sign,0,Math.log2(this.mag)):1===this.layer?m(Math.sign(this.mag),0,3.321928094887362*Math.abs(this.mag)):2===this.layer?m(Math.sign(this.mag),1,Math.abs(this.mag)+.5213902276543247):m(Math.sign(this.mag),this.layer-1,Math.abs(this.mag))}},{key:"ln",value:function(){return this.sign<=0?new t(t.dNaN):0===this.layer?m(this.sign,0,Math.log(this.mag)):1===this.layer?m(Math.sign(this.mag),0,2.302585092994046*Math.abs(this.mag)):2===this.layer?m(Math.sign(this.mag),1,Math.abs(this.mag)+.36221568869946325):m(Math.sign(this.mag),this.layer-1,Math.abs(this.mag))}},{key:"logarithm",value:function(e){return this.log(e)}},{key:"pow",value:function(e){var i=f(e),r=new t(this),n=new t(i);if(0===r.sign)return n.eq(0)?c(1,0,1):r;if(1===r.sign&&0===r.layer&&1===r.mag)return r;if(0===n.sign)return c(1,0,1);if(1===n.sign&&0===n.layer&&1===n.mag)return r;var a=r.absLog10().mul(n).pow10();return-1===this.sign?Math.abs(n.toNumber()%2)%2==1?a.neg():Math.abs(n.toNumber()%2)%2==0?a:new t(t.dNaN):a}},{key:"pow10",value:function(){if(this.eq(t.dInf))return new t(t.dInf);if(this.eq(t.dNegInf))return c(0,0,0);if(!Number.isFinite(this.layer)||!Number.isFinite(this.mag))return new t(t.dNaN);var e=new t(this);if(0===e.layer){var i=Math.pow(10,e.sign*e.mag);if(Number.isFinite(i)&&Math.abs(i)>=.1)return m(1,0,i);if(0===e.sign)return c(1,0,1);e=c(e.sign,e.layer+1,Math.log10(e.mag))}return e.sign>0&&e.mag>=0?m(e.sign,e.layer+1,e.mag):e.sign<0&&e.mag>=0?m(-e.sign,e.layer+1,-e.mag):c(1,0,1)}},{key:"pow_base",value:function(e){return f(e).pow(this)}},{key:"root",value:function(e){var t=f(e);return this.lt(0)&&t.mod(2,!0).eq(1)?this.neg().root(t).neg():this.pow(t.recip())}},{key:"factorial",value:function(){return this.mag<0||0===this.layer?this.add(1).gamma():1===this.layer?t.exp(t.mul(this,t.ln(this).sub(1))):t.exp(this)}},{key:"gamma",value:function(){if(this.mag<0)return this.recip();if(0===this.layer){if(this.lt(c(1,0,24)))return t.fromNumber(function(e){if(!isFinite(e))return e;if(e<-50)return e===Math.trunc(e)?Number.NEGATIVE_INFINITY:0;for(var t=1;e<10;)t*=e,++e;var i=.9189385332046727;i+=((e-=1)+.5)*Math.log(e),i-=e;var r=e*e,n=e;return i+=1/(12*n),i-=1/(360*(n*=r)),i+=1/(1260*(n*=r)),i-=1/(1680*(n*=r)),i+=1/(1188*(n*=r)),i-=691/(360360*(n*=r)),i+=7/(1092*(n*=r)),i-=3617/(122400*(n*=r)),Math.exp(i)/t}(this.sign*this.mag));var e=this.mag-1,i=.9189385332046727;i+=(e+.5)*Math.log(e);var r=e*e,n=e,a=12*n,s=1/a,u=(i-=e)+s;if(u===i)return t.exp(i);if((u=(i=u)-(s=1/(a=360*(n*=r))))===i)return t.exp(i);i=u;var o=1/(a=1260*(n*=r));return i+=o,i-=o=1/(a=1680*(n*=r)),t.exp(i)}return 1===this.layer?t.exp(t.mul(this,t.ln(this).sub(1))):t.exp(this)}},{key:"lngamma",value:function(){return this.gamma().ln()}},{key:"exp",value:function(){return this.mag<0?c(1,0,1):0===this.layer&&this.mag<=709.7?t.fromNumber(Math.exp(this.sign*this.mag)):0===this.layer?m(1,1,this.sign*Math.log10(Math.E)*this.mag):1===this.layer?m(1,2,this.sign*(Math.log10(.4342944819032518)+this.mag)):m(1,this.layer+1,this.sign*this.mag)}},{key:"sqr",value:function(){return this.pow(2)}},{key:"sqrt",value:function(){if(0===this.layer)return t.fromNumber(Math.sqrt(this.sign*this.mag));if(1===this.layer)return m(1,2,Math.log10(this.mag)-.3010299956639812);var e=t.div(c(this.sign,this.layer-1,this.mag),c(1,0,2));return e.layer+=1,e.normalize(),e}},{key:"cube",value:function(){return this.pow(3)}},{key:"cbrt",value:function(){return this.lt(0)?this.neg().pow(1/3).neg():this.pow(1/3)}},{key:"tetrate",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:2,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:c(1,0,1),r=arguments.length>2&&void 0!==arguments[2]&&arguments[2];if(1===e)return t.pow(this,i);if(0===e)return new t(i);if(this.eq(t.dOne))return c(1,0,1);if(this.eq(-1))return t.pow(this,i);if(e===Number.POSITIVE_INFINITY){var n=this.toNumber();if(n<=1.444667861009766&&n>=.06598803584531254){var a=t.ln(this).neg(),s=a.lambertw().div(a);if(n<1)return s;var u=a.lambertw(!1).div(a);return n>1.444667861009099&&(s=u=t.fromNumber(Math.E)),(i=f(i)).eq(u)?u:i.lt(u)?s:new t(t.dInf)}return new t(n>1.444667861009766?t.dInf:t.dNaN)}if(this.eq(t.dZero)){var o=Math.abs((e+1)%2);return o>1&&(o=2-o),t.fromNumber(o)}if(e<0)return t.iteratedlog(i,this,-e,r);i=new t(i);var l=e,h=l-(e=Math.trunc(e));if(this.gt(t.dZero)&&(this.lt(1)||this.lte(1.444667861009766)&&i.lte(t.ln(this).neg().lambertw(!1).div(t.ln(this).neg())))&&(l>1e4||!r)){var g=Math.min(1e4,e);i=i.eq(t.dOne)?this.pow(h):this.lt(1)?i.pow(1-h).mul(this.pow(i).pow(h)):i.layeradd(h,this);for(var m=0;m<g;++m){var v=i;if(i=this.pow(i),v.eq(i))return i}return l>1e4&&Math.ceil(l)%2==1?this.pow(i):i}0!==h&&(i.eq(t.dOne)?this.gt(10)||r?i=this.pow(h):(i=t.fromNumber(t.tetrate_critical(this.toNumber(),h)),this.lt(2)&&(i=i.sub(1).mul(this.minus(1)).plus(1))):i=this.eq(10)?i.layeradd10(h,r):this.lt(1)?i.pow(1-h).mul(this.pow(i).pow(h)):i.layeradd(h,this,r));for(var y=0;y<e;++y){if(i=this.pow(i),!isFinite(i.layer)||!isFinite(i.mag))return i.normalize();if(i.layer-this.layer>3)return c(i.sign,i.layer+(e-y-1),i.mag);if(y>1e4)return i}return i}},{key:"iteratedexp",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:2,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:c(1,0,1),i=arguments.length>2&&void 0!==arguments[2]&&arguments[2];return this.tetrate(e,t,i)}},{key:"iteratedlog",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:10,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,r=arguments.length>2&&void 0!==arguments[2]&&arguments[2];if(i<0)return t.tetrate(e,-i,this,r);e=f(e);var n=t.fromDecimal(this),a=i,s=a-(i=Math.trunc(i));if(n.layer-e.layer>3){var u=Math.min(i,n.layer-e.layer-3);i-=u,n.layer-=u}for(var o=0;o<i;++o){if(n=n.log(e),!isFinite(n.layer)||!isFinite(n.mag))return n.normalize();if(o>1e4)return n}return s>0&&s<1&&(n=e.eq(10)?n.layeradd10(-s,r):n.layeradd(-s,e,r)),n}},{key:"slog",value:function(){for(var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:10,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:100,r=arguments.length>2&&void 0!==arguments[2]&&arguments[2],n=.001,a=!1,s=!1,u=this.slog_internal(e,r).toNumber(),o=1;o<i;++o){var l=new t(e).tetrate(u,t.dOne,r),h=l.gt(this);if(o>1&&s!=h&&(a=!0),s=h,a?n/=2:n*=2,u+=n=Math.abs(n)*(h?-1:1),0===n)break}return t.fromNumber(u)}},{key:"slog_internal",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:10,i=arguments.length>1&&void 0!==arguments[1]&&arguments[1];if((e=f(e)).lte(t.dZero))return new t(t.dNaN);if(e.eq(t.dOne))return new t(t.dNaN);if(e.lt(t.dOne))return this.eq(t.dOne)?c(0,0,0):this.eq(t.dZero)?c(-1,0,1):new t(t.dNaN);if(this.mag<0||this.eq(t.dZero))return c(-1,0,1);if(e.lt(1.444667861009766)){var r=t.ln(e).neg(),n=r.lambertw().div(r);if(this.eq(n))return new t(t.dInf);if(this.gt(n))return new t(t.dNaN)}var a=0,s=t.fromDecimal(this);if(s.layer-e.layer>3){var u=s.layer-e.layer-3;a+=u,s.layer-=u}for(var o=0;o<100;++o)if(s.lt(t.dZero))s=t.pow(e,s),a-=1;else{if(s.lte(t.dOne))return i?t.fromNumber(a+s.toNumber()-1):t.fromNumber(a+t.slog_critical(e.toNumber(),s.toNumber()));a+=1,s=t.log(s,e)}return t.fromNumber(a)}},{key:"layeradd10",value:function(e){var i=arguments.length>1&&void 0!==arguments[1]&&arguments[1];e=t.fromValue_noAlloc(e).toNumber();var r=t.fromDecimal(this);if(e>=1){r.mag<0&&r.layer>0?(r.sign=0,r.mag=0,r.layer=0):-1===r.sign&&0==r.layer&&(r.sign=1,r.mag=-r.mag);var n=Math.trunc(e);e-=n,r.layer+=n}if(e<=-1){var a=Math.trunc(e);if(e-=a,r.layer+=a,r.layer<0)for(var s=0;s<100;++s){if(r.layer++,r.mag=Math.log10(r.mag),!isFinite(r.mag))return 0===r.sign&&(r.sign=1),r.layer<0&&(r.layer=0),r.normalize();if(r.layer>=0)break}}for(;r.layer<0;)r.layer++,r.mag=Math.log10(r.mag);return 0===r.sign&&(r.sign=1,0===r.mag&&r.layer>=1&&(r.layer-=1,r.mag=1)),r.normalize(),0!==e?r.layeradd(e,10,i):r}},{key:"layeradd",value:function(e,i){var r=arguments.length>2&&void 0!==arguments[2]&&arguments[2],n=f(i);if(n.gt(1)&&n.lte(1.444667861009766)){var a=t.excess_slog(this,i,r),s=a[0].toNumber(),u=a[1],o=s+e,l=t.ln(i).neg(),h=l.lambertw().div(l),g=l.lambertw(!1).div(l),m=t.dOne;1==u?m=h.mul(g).sqrt():2==u&&(m=g.mul(2));var c=n.pow(m),v=Math.floor(o),y=o-v,d=m.pow(1-y).mul(c.pow(y));return t.tetrate(n,v,d,r)}var N=this.slog(i,100,r).toNumber(),p=N+e;return p>=0?t.tetrate(i,p,t.dOne,r):Number.isFinite(p)?p>=-1?t.log(t.tetrate(i,p+1,t.dOne,r),i):t.log(t.log(t.tetrate(i,p+2,t.dOne,r),i),i):new t(t.dNaN)}},{key:"lambertw",value:function(){var e=!(arguments.length>0&&void 0!==arguments[0])||arguments[0];return this.lt(-.3678794411710499)?new t(t.dNaN):e?this.abs().lt("1e-300")?new t(this):this.mag<0?t.fromNumber(N(this.toNumber())):0===this.layer?t.fromNumber(N(this.sign*this.mag)):this.lt("eee15")?p(this):this.ln():1===this.sign?new t(t.dNaN):0===this.layer?t.fromNumber(N(this.sign*this.mag,1e-10,!1)):1==this.layer?p(this,1e-10,!1):this.neg().recip().lambertw().neg()}},{key:"ssqrt",value:function(){return this.linear_sroot(2)}},{key:"linear_sroot",value:function(e){if(1==e)return this;if(this.eq(t.dInf))return new t(t.dInf);if(!this.isFinite())return new t(t.dNaN);if(e>0&&e<1)return this.root(e);if(e>-2&&e<-1)return t.fromNumber(e).add(2).pow(this.recip());if(e<=0)return new t(t.dNaN);if(e==Number.POSITIVE_INFINITY){var i=this.toNumber();return i<Math.E&&i>.36787944117144233?this.pow(this.recip()):new t(t.dNaN)}if(this.eq(1))return c(1,0,1);if(this.lt(0))return new t(t.dNaN);if(this.lte("1ee-16"))return new t(e%2==1?this:t.dNaN);if(this.gt(1)){var r=t.dTen;this.gte(t.tetrate(10,e,1,!0))&&(r=this.iteratedlog(10,e-1,!0)),e<=1&&(r=this.root(e));for(var n=t.dZero,a=r.layer,s=r.iteratedlog(10,a,!0),u=s,o=s.div(2),l=!0;l;)o=n.add(s).div(2),t.iteratedexp(10,a,o,!0).tetrate(e,1,!0).gt(this)?s=o:n=o,o.eq(u)?l=!1:u=o;return t.iteratedexp(10,a,o,!0)}for(var h=1,g=m(1,10,1),f=m(1,10,1),v=m(1,10,1),y=m(1,1,-16),d=t.dZero,N=m(1,10,1),p=y.pow10().recip(),b=t.dZero,k=p,w=p,M=Math.ceil(e)%2==0,I=0,_=m(1,10,1),q=!1,F=t.dZero,S=!1;h<4;){if(2==h){if(M)break;v=m(1,10,1),y=g,h=3,N=m(1,10,1),_=m(1,10,1)}for(q=!1;y.neq(v);){if(F=y,y.pow10().recip().tetrate(e,1,!0).eq(1)&&y.pow10().recip().lt(.4))p=y.pow10().recip(),k=y.pow10().recip(),w=y.pow10().recip(),b=t.dZero,I=-1,3==h&&(_=y);else if(y.pow10().recip().tetrate(e,1,!0).eq(y.pow10().recip())&&!M&&y.pow10().recip().lt(.4))p=y.pow10().recip(),k=y.pow10().recip(),w=y.pow10().recip(),b=t.dZero,I=0;else if(y.pow10().recip().tetrate(e,1,!0).eq(y.pow10().recip().mul(2).tetrate(e,1,!0)))p=y.pow10().recip(),k=t.dZero,w=p.mul(2),b=p,I=M?-1:0;else{for(d=y.mul(12e-17),p=y.pow10().recip(),k=y.add(d).pow10().recip(),b=p.sub(k),w=p.add(b);k.tetrate(e,1,!0).eq(p.tetrate(e,1,!0))||w.tetrate(e,1,!0).eq(p.tetrate(e,1,!0))||k.gte(p)||w.lte(p);)d=d.mul(2),k=y.add(d).pow10().recip(),b=p.sub(k),w=p.add(b);if((1==h&&w.tetrate(e,1,!0).gt(p.tetrate(e,1,!0))&&k.tetrate(e,1,!0).gt(p.tetrate(e,1,!0))||3==h&&w.tetrate(e,1,!0).lt(p.tetrate(e,1,!0))&&k.tetrate(e,1,!0).lt(p.tetrate(e,1,!0)))&&(_=y),w.tetrate(e,1,!0).lt(p.tetrate(e,1,!0)))I=-1;else if(M)I=1;else if(3==h&&y.gt_tolerance(g,1e-8))I=0;else{for(;k.tetrate(e,1,!0).eq_tolerance(p.tetrate(e,1,!0),1e-8)||w.tetrate(e,1,!0).eq_tolerance(p.tetrate(e,1,!0),1e-8)||k.gte(p)||w.lte(p);)d=d.mul(2),k=y.add(d).pow10().recip(),b=p.sub(k),w=p.add(b);I=w.tetrate(e,1,!0).sub(p.tetrate(e,1,!0)).lt(p.tetrate(e,1,!0).sub(k.tetrate(e,1,!0)))?0:1}}if(-1==I&&(S=!0),1==h&&1==I||3==h&&0!=I)if(v.eq(m(1,10,1)))y=y.mul(2);else{var x=!1;if(q&&(1==I&&1==h||-1==I&&3==h)&&(x=!0),y=y.add(v).div(2),x)break}else if(v.eq(m(1,10,1)))v=y,y=y.div(2);else{var E=!1;if(q&&(1==I&&1==h||-1==I&&3==h)&&(E=!0),v=v.sub(N),y=y.sub(N),E)break}if(v.sub(y).div(2).abs().gt(N.mul(1.5))&&(q=!0),N=v.sub(y).div(2).abs(),y.gt("1e18"))break;if(y.eq(F))break}if(y.gt("1e18"))break;if(!S)break;if(_==m(1,10,1))break;1==h?g=_:3==h&&(f=_),h++}v=g;for(var T=y=m(1,1,-18),O=t.dZero,z=!0;z;)if(O=v.eq(m(1,10,1))?y.mul(2):v.add(y).div(2),t.pow(10,O).recip().tetrate(e,1,!0).gt(this)?y=O:v=O,O.eq(T)?z=!1:T=O,y.gt("1e18"))return new t(t.dNaN);if(O.eq_tolerance(g,1e-15)){if(f.eq(m(1,10,1)))return new t(t.dNaN);for(v=m(1,10,1),T=y=f,O=t.dZero,z=!0;z;)if(O=v.eq(m(1,10,1))?y.mul(2):v.add(y).div(2),t.pow(10,O).recip().tetrate(e,1,!0).gt(this)?y=O:v=O,O.eq(T)?z=!1:T=O,y.gt("1e18"))return new t(t.dNaN);return O.pow10().recip()}return O.pow10().recip()}},{key:"pentate",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:2,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:c(1,0,1),r=arguments.length>2&&void 0!==arguments[2]&&arguments[2];i=new t(i);var n=e,a=n-(e=Math.floor(e)),s=t.dZero,u=t.dZero;if(0!==a){if(!i.eq(t.dOne))return this.pentate(i.penta_log(this,void 0,r).plus(n).toNumber(),1,r);++e,i=t.fromNumber(a)}if(e>0)for(var o=0;o<e;){if(u=s,s=i,i=this.tetrate(i.toNumber(),t.dOne,r),++o,this.gt(0)&&this.lte(1)&&i.gt(0)&&i.lte(1))return this.tetrate(e-o,i,r);if(i.eq(s)||i.eq(u)&&o%2==e%2)return i.normalize();if(!isFinite(i.layer)||!isFinite(i.mag))return i.normalize();if(o>1e4)return i}else for(var l=0;l<-e;++l){if(s=i,(i=i.slog(this,void 0,r)).eq(s))return i.normalize();if(!isFinite(i.layer)||!isFinite(i.mag))return i.normalize();if(l>100)return i}return i}},{key:"penta_log",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:10,i=arguments.length>1&&void 0!==arguments[1]?arguments[1]:100,r=arguments.length>2&&void 0!==arguments[2]&&arguments[2];if((e=new t(e)).lte(1))return new t(t.dNaN);if(this.eq(1))return c(0,0,0);if(this.eq(t.dInf))return new t(t.dInf);var n=new t(1),a=0,s=1;if(this.lt(-1)){if(this.lte(-2))return new t(t.dNaN);var u=e.tetrate(this.toNumber(),1,r);if(this.eq(u))return new t(t.dNegInf);if(this.gt(u))return new t(t.dNaN)}if(this.gt(1)){for(;n.lt(this);)if(a++,n=t.tetrate(e,n.toNumber(),1,r),a>1e3)return new t(t.dNaN)}else for(;n.gt(this);)if(a--,n=t.slog(n,e,r),a>100)return new t(t.dNaN);for(var o=1;o<i;++o){var l=e.pentate(a,t.dOne,r);if(l.eq(this))break;var h=l.gt(this);if(a+=s=Math.abs(s)*(h?-1:1),0===(s/=2))break}return t.fromNumber(a)}},{key:"linear_penta_root",value:function(e){return 1==e?this:e<0?new t(t.dNaN):this.eq(t.dInf)?new t(t.dInf):this.isFinite()?e>0&&e<1?this.root(e):this.eq(1)?c(1,0,1):this.lt(0)?new t(t.dNaN):this.lt(1)?this.linear_sroot(e):t.increasingInverse((function(i){return t.pentate(i,e,1,!0)}))(this):new t(t.dNaN)}},{key:"sin",value:function(){return this.mag<0?new t(this):0===this.layer?t.fromNumber(Math.sin(this.sign*this.mag)):c(0,0,0)}},{key:"cos",value:function(){return this.mag<0?c(1,0,1):0===this.layer?t.fromNumber(Math.cos(this.sign*this.mag)):c(0,0,0)}},{key:"tan",value:function(){return this.mag<0?new t(this):0===this.layer?t.fromNumber(Math.tan(this.sign*this.mag)):c(0,0,0)}},{key:"asin",value:function(){return this.mag<0?new t(this):0===this.layer?t.fromNumber(Math.asin(this.sign*this.mag)):new t(t.dNaN)}},{key:"acos",value:function(){return this.mag<0?t.fromNumber(Math.acos(this.toNumber())):0===this.layer?t.fromNumber(Math.acos(this.sign*this.mag)):new t(t.dNaN)}},{key:"atan",value:function(){return this.mag<0?new t(this):0===this.layer?t.fromNumber(Math.atan(this.sign*this.mag)):t.fromNumber(Math.atan(Infinity*this.sign))}},{key:"sinh",value:function(){return this.exp().sub(this.negate().exp()).div(2)}},{key:"cosh",value:function(){return this.exp().add(this.negate().exp()).div(2)}},{key:"tanh",value:function(){return this.sinh().div(this.cosh())}},{key:"asinh",value:function(){return t.ln(this.add(this.sqr().add(1).sqrt()))}},{key:"acosh",value:function(){return t.ln(this.add(this.sqr().sub(1).sqrt()))}},{key:"atanh",value:function(){return this.abs().gte(1)?new t(t.dNaN):t.ln(this.add(1).div(t.fromNumber(1).sub(this))).div(2)}},{key:"ascensionPenalty",value:function(e){return 0===e?new t(this):this.root(t.pow(10,e))}},{key:"egg",value:function(){return this.add(9)}},{key:"lessThanOrEqualTo",value:function(e){return this.cmp(e)<1}},{key:"lessThan",value:function(e){return this.cmp(e)<0}},{key:"greaterThanOrEqualTo",value:function(e){return this.cmp(e)>-1}},{key:"greaterThan",value:function(e){return this.cmp(e)>0}}],[{key:"fromComponents",value:function(e,i,r){return(new t).fromComponents(e,i,r)}},{key:"fromComponents_noNormalize",value:function(e,i,r){return(new t).fromComponents_noNormalize(e,i,r)}},{key:"fromMantissaExponent",value:function(e,i){return(new t).fromMantissaExponent(e,i)}},{key:"fromMantissaExponent_noNormalize",value:function(e,i){return(new t).fromMantissaExponent_noNormalize(e,i)}},{key:"fromDecimal",value:function(e){return(new t).fromDecimal(e)}},{key:"fromNumber",value:function(e){return(new t).fromNumber(e)}},{key:"fromString",value:function(e){var i=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return(new t).fromString(e,i)}},{key:"fromValue",value:function(e){return(new t).fromValue(e)}},{key:"fromValue_noAlloc",value:function(e){if(e instanceof t)return e;if("string"==typeof e){var i=t.fromStringCache.get(e);return void 0!==i?i:t.fromString(e)}return"number"==typeof e?t.fromNumber(e):c(0,0,0)}},{key:"abs",value:function(e){return f(e).abs()}},{key:"neg",value:function(e){return f(e).neg()}},{key:"negate",value:function(e){return f(e).neg()}},{key:"negated",value:function(e){return f(e).neg()}},{key:"sign",value:function(e){return f(e).sign}},{key:"sgn",value:function(e){return f(e).sign}},{key:"round",value:function(e){return f(e).round()}},{key:"floor",value:function(e){return f(e).floor()}},{key:"ceil",value:function(e){return f(e).ceil()}},{key:"trunc",value:function(e){return f(e).trunc()}},{key:"add",value:function(e,t){return f(e).add(t)}},{key:"plus",value:function(e,t){return f(e).add(t)}},{key:"sub",value:function(e,t){return f(e).sub(t)}},{key:"subtract",value:function(e,t){return f(e).sub(t)}},{key:"minus",value:function(e,t){return f(e).sub(t)}},{key:"mul",value:function(e,t){return f(e).mul(t)}},{key:"multiply",value:function(e,t){return f(e).mul(t)}},{key:"times",value:function(e,t){return f(e).mul(t)}},{key:"div",value:function(e,t){return f(e).div(t)}},{key:"divide",value:function(e,t){return f(e).div(t)}},{key:"recip",value:function(e){return f(e).recip()}},{key:"reciprocal",value:function(e){return f(e).recip()}},{key:"reciprocate",value:function(e){return f(e).reciprocate()}},{key:"mod",value:function(e,t){var i=arguments.length>2&&void 0!==arguments[2]&&arguments[2];return f(e).mod(t,i)}},{key:"modulo",value:function(e,t){var i=arguments.length>2&&void 0!==arguments[2]&&arguments[2];return f(e).modulo(t,i)}},{key:"modular",value:function(e,t){var i=arguments.length>2&&void 0!==arguments[2]&&arguments[2];return f(e).modular(t,i)}},{key:"cmp",value:function(e,t){return f(e).cmp(t)}},{key:"cmpabs",value:function(e,t){return f(e).cmpabs(t)}},{key:"compare",value:function(e,t){return f(e).cmp(t)}},{key:"isNaN",value:function(e){function t(t){return e.apply(this,arguments)}return t.toString=function(){return e.toString()},t}((function(e){return e=f(e),isNaN(e.sign)||isNaN(e.layer)||isNaN(e.mag)}))},{key:"isFinite",value:function(e){function t(t){return e.apply(this,arguments)}return t.toString=function(){return e.toString()},t}((function(e){return e=f(e),isFinite(e.sign)&&isFinite(e.layer)&&isFinite(e.mag)}))},{key:"eq",value:function(e,t){return f(e).eq(t)}},{key:"equals",value:function(e,t){return f(e).eq(t)}},{key:"neq",value:function(e,t){return f(e).neq(t)}},{key:"notEquals",value:function(e,t){return f(e).notEquals(t)}},{key:"lt",value:function(e,t){return f(e).lt(t)}},{key:"lte",value:function(e,t){return f(e).lte(t)}},{key:"gt",value:function(e,t){return f(e).gt(t)}},{key:"gte",value:function(e,t){return f(e).gte(t)}},{key:"max",value:function(e,t){return f(e).max(t)}},{key:"min",value:function(e,t){return f(e).min(t)}},{key:"minabs",value:function(e,t){return f(e).minabs(t)}},{key:"maxabs",value:function(e,t){return f(e).maxabs(t)}},{key:"clamp",value:function(e,t,i){return f(e).clamp(t,i)}},{key:"clampMin",value:function(e,t){return f(e).clampMin(t)}},{key:"clampMax",value:function(e,t){return f(e).clampMax(t)}},{key:"cmp_tolerance",value:function(e,t,i){return f(e).cmp_tolerance(t,i)}},{key:"compare_tolerance",value:function(e,t,i){return f(e).cmp_tolerance(t,i)}},{key:"eq_tolerance",value:function(e,t,i){return f(e).eq_tolerance(t,i)}},{key:"equals_tolerance",value:function(e,t,i){return f(e).eq_tolerance(t,i)}},{key:"neq_tolerance",value:function(e,t,i){return f(e).neq_tolerance(t,i)}},{key:"notEquals_tolerance",value:function(e,t,i){return f(e).notEquals_tolerance(t,i)}},{key:"lt_tolerance",value:function(e,t,i){return f(e).lt_tolerance(t,i)}},{key:"lte_tolerance",value:function(e,t,i){return f(e).lte_tolerance(t,i)}},{key:"gt_tolerance",value:function(e,t,i){return f(e).gt_tolerance(t,i)}},{key:"gte_tolerance",value:function(e,t,i){return f(e).gte_tolerance(t,i)}},{key:"pLog10",value:function(e){return f(e).pLog10()}},{key:"absLog10",value:function(e){return f(e).absLog10()}},{key:"log10",value:function(e){return f(e).log10()}},{key:"log",value:function(e,t){return f(e).log(t)}},{key:"log2",value:function(e){return f(e).log2()}},{key:"ln",value:function(e){return f(e).ln()}},{key:"logarithm",value:function(e,t){return f(e).logarithm(t)}},{key:"pow",value:function(e,t){return f(e).pow(t)}},{key:"pow10",value:function(e){return f(e).pow10()}},{key:"root",value:function(e,t){return f(e).root(t)}},{key:"factorial",value:function(e,t){return f(e).factorial()}},{key:"gamma",value:function(e,t){return f(e).gamma()}},{key:"lngamma",value:function(e,t){return f(e).lngamma()}},{key:"exp",value:function(e){return f(e).exp()}},{key:"sqr",value:function(e){return f(e).sqr()}},{key:"sqrt",value:function(e){return f(e).sqrt()}},{key:"cube",value:function(e){return f(e).cube()}},{key:"cbrt",value:function(e){return f(e).cbrt()}},{key:"tetrate",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:2,i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:c(1,0,1),r=arguments.length>3&&void 0!==arguments[3]&&arguments[3];return f(e).tetrate(t,i,r)}},{key:"iteratedexp",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:2,i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:c(1,0,1),r=arguments.length>3&&void 0!==arguments[3]&&arguments[3];return f(e).iteratedexp(t,i,r)}},{key:"iteratedlog",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:10,i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1,r=arguments.length>3&&void 0!==arguments[3]&&arguments[3];return f(e).iteratedlog(t,i,r)}},{key:"layeradd10",value:function(e,t){var i=arguments.length>2&&void 0!==arguments[2]&&arguments[2];return f(e).layeradd10(t,i)}},{key:"layeradd",value:function(e,t){var i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:10,r=arguments.length>3&&void 0!==arguments[3]&&arguments[3];return f(e).layeradd(t,i,r)}},{key:"slog",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:10,i=arguments.length>2&&void 0!==arguments[2]&&arguments[2];return f(e).slog(t,100,i)}},{key:"lambertw",value:function(e,t){return f(e).lambertw(t)}},{key:"ssqrt",value:function(e){return f(e).ssqrt()}},{key:"linear_sroot",value:function(e,t){return f(e).linear_sroot(t)}},{key:"pentate",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:2,i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:c(1,0,1),r=arguments.length>3&&void 0!==arguments[3]&&arguments[3];return f(e).pentate(t,i,r)}},{key:"penta_log",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:10,i=arguments.length>2&&void 0!==arguments[2]&&arguments[2];return f(e).penta_log(t,100,i)}},{key:"linear_penta_root",value:function(e,t){return f(e).linear_penta_root(t)}},{key:"sin",value:function(e){return f(e).sin()}},{key:"cos",value:function(e){return f(e).cos()}},{key:"tan",value:function(e){return f(e).tan()}},{key:"asin",value:function(e){return f(e).asin()}},{key:"acos",value:function(e){return f(e).acos()}},{key:"atan",value:function(e){return f(e).atan()}},{key:"sinh",value:function(e){return f(e).sinh()}},{key:"cosh",value:function(e){return f(e).cosh()}},{key:"tanh",value:function(e){return f(e).tanh()}},{key:"asinh",value:function(e){return f(e).asinh()}},{key:"acosh",value:function(e){return f(e).acosh()}},{key:"atanh",value:function(e){return f(e).atanh()}},{key:"affordGeometricSeries",value:function(e,t,i,r){return this.affordGeometricSeries_core(f(e),f(t),f(i),r)}},{key:"sumGeometricSeries",value:function(e,t,i,r){return this.sumGeometricSeries_core(e,f(t),f(i),r)}},{key:"affordArithmeticSeries",value:function(e,t,i,r){return this.affordArithmeticSeries_core(f(e),f(t),f(i),f(r))}},{key:"sumArithmeticSeries",value:function(e,t,i,r){return this.sumArithmeticSeries_core(f(e),f(t),f(i),f(r))}},{key:"efficiencyOfPurchase",value:function(e,t,i){return this.efficiencyOfPurchase_core(f(e),f(t),f(i))}},{key:"randomDecimalForTesting",value:function(e){if(20*Math.random()<1)return c(0,0,0);var t=Math.random()>.5?1:-1;if(20*Math.random()<1)return c(t,0,1);var i=Math.floor(Math.random()*(e+1)),r=0===i?616*Math.random()-308:16*Math.random();Math.random()>.9&&(r=Math.trunc(r));var n=Math.pow(10,r);return Math.random()>.9&&(n=Math.trunc(n)),m(t,i,n)}},{key:"affordGeometricSeries_core",value:function(e,i,r,n){var a=i.mul(r.pow(n));return t.floor(e.div(a).mul(r.sub(1)).add(1).log10().div(r.log10()))}},{key:"sumGeometricSeries_core",value:function(e,i,r,n){return i.mul(r.pow(n)).mul(t.sub(1,r.pow(e))).div(t.sub(1,r))}},{key:"affordArithmeticSeries_core",value:function(e,t,i,r){var n=t.add(r.mul(i)).sub(i.div(2)),a=n.pow(2);return n.neg().add(a.add(i.mul(e).mul(2)).sqrt()).div(i).floor()}},{key:"sumArithmeticSeries_core",value:function(e,t,i,r){var n=t.add(r.mul(i));return e.div(2).mul(n.mul(2).plus(e.sub(1).mul(i)))}},{key:"efficiencyOfPurchase_core",value:function(e,t,i){return e.div(t).add(e.div(i))}},{key:"slog_critical",value:function(e,i){return e>10?i-1:t.critical_section(e,i,g)}},{key:"tetrate_critical",value:function(e,i){return t.critical_section(e,i,h)}},{key:"critical_section",value:function(e,t,i){(t*=10)<0&&(t=0),t>10&&(t=10),e<2&&(e=2),e>10&&(e=10);for(var r=0,n=0,a=0;a<l.length;++a){if(l[a]==e){r=i[a][Math.floor(t)],n=i[a][Math.ceil(t)];break}if(l[a]<e&&l[a+1]>e){var s=(e-l[a])/(l[a+1]-l[a]);r=i[a][Math.floor(t)]*(1-s)+i[a+1][Math.floor(t)]*s,n=i[a][Math.ceil(t)]*(1-s)+i[a+1][Math.ceil(t)]*s;break}}var u=t-Math.floor(t);return r<=0||n<=0?r*(1-u)+n*u:Math.pow(e,Math.log(r)/Math.log(e)*(1-u)+Math.log(n)/Math.log(e)*u)}},{key:"excess_slog",value:function(e,i){var r=arguments.length>2&&void 0!==arguments[2]&&arguments[2];e=f(e);var n=i=f(i);if(1==(i=i.toNumber())||i<=0)return[new t(t.dNaN),0];if(i>1.444667861009766)return[e.slog(i,100,r),0];var a=t.ln(i).neg(),s=a.lambertw().div(a),u=t.dInf;if(i>1&&(u=a.lambertw(!1).div(a)),i>1.444667861009099&&(s=u=t.fromNumber(Math.E)),e.lt(s))return[e.slog(i,100,r),0];if(e.eq(s))return[new t(t.dInf),0];if(e.eq(u))return[new t(t.dNegInf),2];if(e.gt(u)){var o=u.mul(2),l=n.pow(o),h=0;if(e.gte(o)&&e.lt(l))h=0;else if(e.gte(l)){var g=l;for(h=1;g.lt(e);)if(h+=1,(g=n.pow(g)).layer>3){var m=Math.floor(e.layer-g.layer+1);g=n.iteratedexp(m,g,r),h+=m}g.gt(e)&&(g=g.log(i),h-=1)}else if(e.lt(o)){var c=o;for(h=0;c.gt(e);)c=c.log(i),h-=1}for(var v=0,y=0,d=.5,N=o,p=t.dZero;d>1e-16;){if(y=v+d,N=o.pow(1-y).mul(l.pow(y)),(p=t.iteratedexp(i,h,N)).eq(e))return[new t(h+y),2];p.lt(e)&&(v+=d),d/=2}return p.neq_tolerance(e,1e-7)?[new t(t.dNaN),0]:[new t(h+v),2]}if(e.lt(u)&&e.gt(s)){var b=s.mul(u).sqrt(),k=n.pow(b),w=0;if(e.lte(b)&&e.gt(k))w=0;else if(e.lte(k)){var M=k;for(w=1;M.gt(e);)M=n.pow(M),w+=1;M.lt(e)&&(M=M.log(i),w-=1)}else if(e.gt(b)){var I=b;for(w=0;I.lt(e);)I=I.log(i),w-=1}for(var _=0,q=0,F=.5,S=b,x=t.dZero;F>1e-16;){if(q=_+F,S=b.pow(1-q).mul(k.pow(q)),(x=t.iteratedexp(i,w,S)).eq(e))return[new t(w+q),1];x.gt(e)&&(_+=F),F/=2}return x.neq_tolerance(e,1e-7)?[new t(t.dNaN),0]:[new t(w+_),1]}throw new Error("Unhandled behavior in excess_slog")}},{key:"increasingInverse",value:function(e){var i=arguments.length>1&&void 0!==arguments[1]&&arguments[1],r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:120,n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:t.dLayerMax.neg(),s=arguments.length>4&&void 0!==arguments[4]?arguments[4]:t.dLayerMax,o=arguments.length>5&&void 0!==arguments[5]?arguments[5]:t.dLayerMax.neg(),l=arguments.length>6&&void 0!==arguments[6]?arguments[6]:t.dLayerMax;return function(h){if(h=new t(h),n=new t(n),s=new t(s),o=new t(o),l=new t(l),h.isNan()||s.lt(n)||h.lt(o)||h.gt(l))return new t(t.dNaN);var g=function(e){return new t(e)},f=!0;if(s.lt(0))f=!1;else if(n.gt(0))f=!0;else{var m=e(t.dZero);if(m.eq(h))return c(0,0,0);f=h.gt(m),i&&(f=!f)}var v,y=f;if(f){if(s.lt(u))f=!0;else if(n.gt(u))f=!1;else{var d=e(new t(u));f=h.lt(d),i&&(f=!f)}if(f){v=!0;var N=t.pow(10,a).recip();if(s.lt(N))f=!1;else if(n.gt(N))f=!0;else{var p=e(new t(N));f=h.gt(p),i&&(f=!f)}if(f)g=function(e){return t.pow(10,e).recip()};else{var b=t.tetrate(10,a);if(s.lt(b))f=!1;else if(n.gt(b))f=!0;else{var k=e(new t(b));f=h.gt(k),i&&(f=!f)}g=f?function(e){return t.tetrate(10,new t(e).toNumber()).recip()}:function(e){return new t(e).gt(Math.log10(Number.MAX_VALUE))?t.dZero:t.tetrate(10,t.pow(10,e).toNumber()).recip()}}}else{if(v=!1,s.lt(a))f=!0;else if(n.gt(a))f=!1;else{var w=e(new t(a));f=h.lt(w),i&&(f=!f)}if(f)g=function(e){return new t(e)};else{var M=t.pow(10,a);if(s.lt(M))f=!0;else if(n.gt(M))f=!1;else{var I=e(new t(M));f=h.lt(I),i&&(f=!f)}if(f)g=function(e){return t.pow(10,e)};else{var _=t.tetrate(10,a);if(s.lt(_))f=!0;else if(n.gt(_))f=!1;else{var q=e(new t(_));f=h.lt(q),i&&(f=!f)}g=f?function(e){return t.tetrate(10,new t(e).toNumber())}:function(e){return new t(e).gt(Math.log10(Number.MAX_VALUE))?t.dInf:t.tetrate(10,t.pow(10,e).toNumber())}}}}}else{if(v=!0,s.lt(-u))f=!1;else if(n.gt(-u))f=!0;else{var F=e(new t(-u));f=h.gt(F),i&&(f=!f)}if(f){var S=t.pow(10,a).recip().neg();if(s.lt(S))f=!0;else if(n.gt(S))f=!1;else{var x=e(new t(S));f=h.lt(x),i&&(f=!f)}if(f)g=function(e){return t.pow(10,e).recip().neg()};else{var E=t.tetrate(10,a).neg();if(s.lt(E))f=!0;else if(n.gt(E))f=!1;else{var T=e(new t(E));f=h.lt(T),i&&(f=!f)}g=f?function(e){return t.tetrate(10,new t(e).toNumber()).recip().neg()}:function(e){return new t(e).gt(Math.log10(Number.MAX_VALUE))?t.dZero:t.tetrate(10,t.pow(10,e).toNumber()).recip().neg()}}}else{if(v=!1,s.lt(-a))f=!1;else if(n.gt(-a))f=!0;else{var O=e(new t(-a));f=h.gt(O),i&&(f=!f)}if(f)g=function(e){return t.neg(e)};else{var z=t.pow(10,a).neg();if(s.lt(z))f=!1;else if(n.gt(z))f=!0;else{var C=e(new t(z));f=h.gt(C),i&&(f=!f)}if(f)g=function(e){return t.pow(10,e).neg()};else{var V=t.tetrate(10,a).neg();if(s.lt(V))f=!1;else if(n.gt(V))f=!0;else{var A=e(new t(V));f=h.gt(A),i&&(f=!f)}g=f?function(e){return t.tetrate(10,new t(e).toNumber()).neg()}:function(e){return new t(e).gt(Math.log10(Number.MAX_VALUE))?t.dNegInf:t.tetrate(10,t.pow(10,e).toNumber()).neg()}}}}}for(var P=y!=v!=i,Z=P?function(e,i){return t.gt(e,i)}:function(e,i){return t.lt(e,i)},D=.001,Y=!1,L=!1,G=1,U=t.dOne,X=0,W=!1,j=1;j<r;++j){W=!1,X=G,(U=g(G)).gt(s)&&(U=s,W=!0),U.lt(n)&&(U=n,W=!0);var B=e(U);if(B.eq(h)&&!W)break;var R=Z(B,h);if(j>1&&L!=R&&(Y=!0),L=R,Y?D/=2:D*=2,R!=P&&U.eq(s)||R==P&&U.eq(n))return new t(t.dNaN);if(G+=D=Math.abs(D)*(R?-1:1),0===D||X==G)break}return g(G)}}}]),t}();return b.dZero=c(0,0,0),b.dOne=c(1,0,1),b.dNegOne=c(-1,0,1),b.dTwo=c(1,0,2),b.dTen=c(1,0,10),b.dNaN=c(Number.NaN,Number.NaN,Number.NaN),b.dInf=c(1,Number.POSITIVE_INFINITY,Number.POSITIVE_INFINITY),b.dNegInf=c(-1,Number.POSITIVE_INFINITY,Number.POSITIVE_INFINITY),b.dNumberMax=m(1,0,Number.MAX_VALUE),b.dNumberMin=m(1,0,Number.MIN_VALUE),b.dLayerSafeMax=m(1,Number.MAX_SAFE_INTEGER,a-1),b.dLayerSafeMin=m(1,Number.MAX_SAFE_INTEGER,-(a-1)),b.dLayerMax=m(1,Number.MAX_VALUE,a-1),b.dLayerMin=m(1,Number.MAX_VALUE,-(a-1)),b.fromStringCache=new r(1023),f=b.fromValue_noAlloc,m=b.fromComponents,c=b.fromComponents_noNormalize,b.fromMantissaExponent,b.fromMantissaExponent_noNormalize,b}));
    return globalThis.Decimal;
  })();
  const { BlockType, ArgumentType, Cast, vm } = Scratch;
  const { runtime } = vm, extId = 'Yorenibreaketernity';
  class BDecimal {
    static get vpInfinity() { return new BDecimal(new Decimal(Decimal.dInf)); };
    static get vnInfinity() { return new BDecimal(new Decimal(Decimal.dNegInf)); };
    static get vZero() { return new BDecimal(new Decimal(Decimal.dZero)); };
    static get vnZero() { return new BDecimal(-0); };
    static get vpOne() { return new BDecimal(new Decimal(Decimal.dOne)); };
    static get vnOne() { return new BDecimal(new Decimal(Decimal.dNegOne)); };
    static get vNaN() { return new BDecimal(new Decimal(Decimal.dNaN)); };
    static isNaN(n) { return Decimal.isNaN(n); }
    static isFinite(n) { return Decimal.isFinite(n); }
    static skipCast = false;
    constructor(value, dontCast) {
      dontCast = dontCast || this.constructor.skipCast;
      this.$ = this.constructor.toDecimal(value, dontCast);
    }
    toString() {
      if (this.$.sign === -1 && this.$.mag === 0 && this.$.layer === 0) return '-0';
      return this.$.toString();
    }
    toBigInt() {
      if (this.$.sign === -1 && this.$.mag === 0 && this.$.layer === 0) return -0n;
      return BigInt(this.$.trunc().toString());
    }
    toNumber() {
      const str = this.toString();
      if (str === '-0') return -0;
      const n = parseInt(str);
      if (this.constructor.isNaN(n)) return Infinity;
      return +n;
    }
    static from(value, dontCast) {
      if (this.isNaN(value)) return this.vNaN;
      if (!this.isFinite(value)) {
        if (value === Infinity) return this.vpInfinity;
        if (value === -Infinity) return this.vnInfinity;
      }
      return new this(value, dontCast);
    }
    static exportScratch(value) {
      if (typeof value === 'boolean') return value;
      if (this.isNaN(value)) return NaN;
      if (this.skipCast) return this.from(value);
      return this.from(value).toString();
    }
    static toDecimal(value, dontCast) {
      if (value instanceof Decimal) return value;
      if (value instanceof this) return value.$;
      if (!value || (this.isNaN(value) && typeof value !== 'string')) return Decimal.dZero;
      if (value === -0 || value === -0n || value === '-0') {
        value = Decimal.dZero;
        value.sign = -1;
        return value;
      }
      if (typeof value === 'bigint') value = String(value);
      try {
        if (dontCast) return new Decimal(value);
        return new Decimal(Cast.toString(value));
      } catch {/*no-op*/}
      return Decimal.dZero;
    }
    static _op1(fn, a) { return this.exportScratch(Decimal[fn](this.from(a).$)); }
    static _op2(fn, a, b) { return this.exportScratch(Decimal[fn](this.from(a).$, this.from(b).$)); }
    static add(a, b) { return this._op2('add', a, b); }
    add(n) { return this.constructor.add(this, n); }
    static subtract(a, b) { return this._op2('sub', a, b); }
    subtract(n) { return this.constructor.subtract(this, n); }
    static multiply(a, b) { return this._op2('mul', a, b); }
    multiply(n) { return this.constructor.multiply(this, n); }
    static divide(a, b) { return this._op2('div', a, b); }
    divide(n) { return this.constructor.divide(this, n); }
    static pow(a, b) { return this._op2('pow', a, b); }
    pow(n) { return this.constructor.pow(this, n); }
    static tetrate(a, b) { return this._op2('tetrate', a, b); }
    tetrate(n) { return this.constructor.tetrate(this, n); }
    static pentate(a, b) { return this._op2('pentate', a, b); }
    pentate(n) { return this.constructor.pentate(this, n); }
    static root(a, b) { return this._op2('root', a, b); }
    root(n) { return this.constructor.root(this, n); }
    static mod(a, b) { return this._op2('mod', a, b); }
    mod(n) { return this.constructor.mod(this, n); }
    static round(n) { return this._op1('round', n); }
    round(n) { return this.constructor.round(this); }
    static ceil(n) { return this._op1('ceil', n); }
    ceil() { return this.constructor.ceil(this); }
    static floor(n) { return this._op1('floor', n); }
    floor() { return this.constructor.floor(this); }
    static trunc(n) { return this._op1('trunc', n); }
    trunc() { return this.constructor.trunc(this); }
    static log(a, b) { return this._op2('log', a, b); }
    log(n) { return this.constructor.log(this, n); }
    static slog(a, b) { return this._op2('slog', a, b); }
    slog(n) { return this.constructor.slog(this, n); }
    static abs(n) { return this._op1('abs', n); }
    abs() { return this.constructor.abs(this); }
    static neg(n) { return this._op1('neg', n); }
    neg() { return this.constructor.neg(this); }
    static ln(n) { return this._op1('ln', n); }
    ln() { return this.constructor.ln(this); }
    static exp(n) { return this._op1('exp', n); }
    exp() { return this.constructor.exp(this); }
    static sqrt(n) { return this._op1('sqrt', n); }
    sqrt() { return this.constructor.sqrt(this); }
    static ssqrt(n) { return this._op1('ssqrt', n); }
    ssqrt() { return this.constructor.ssqrt(this); }
    static gamma(n) { return this._op1('gamma', n); }
    gamma() { return this.constructor.gamma(this); }
    static factorial(n) { return this._op1('factorial', n); }
    factorial() { return this.constructor.factorial(this); }
    static equals(a, b) { return this._op2('eq', a, b); }
    equals(n) { return this.constructor.equals(this, n); }
    static lessThan(a, b) { return this._op2('lt', a, b); }
    lessThan(n) { return this.constructor.lessThan(this, n); }
    static lessThanOrEquals(a, b) { return this._op2('lte', a, b); }
    lessThanOrEquals(n) { return this.constructor.lessThanOrEquals(this, n); }
    static greaterThan(a, b) { return this._op2('gt', a, b); }
    greaterThan(n) { return this.constructor.greaterThan(this, n); }
    static greaterThanOrEquals(a, b) { return this._op2('gte', a, b); }
    greaterThanOrEquals(n) { return this.constructor.greaterThanOrEquals(this, n); }
    static min(values) {
      let lowest = this.vpInfinity.$;
      for (let i = 0; i < values.length; ++i) {
        const n = BDecimal.toDecimal(values[i]);
        if (lowest.lt(n)) continue;
        lowest = n;
      }
      return this.exportScratch(lowest);
    }
    min(n) { return this.constructor.min([this, n]); }
    static max(values) {
      let highest = this.vnInfinity.$;
      for (let i = 0; i < values.length; ++i) {
        const n = BDecimal.toDecimal(values[i]);
        if (highest.gt(n)) continue;
        highest = n;
      }
      return this.exportScratch(highest);
    }
    max(n) { return this.constructor.max([this, n]); }
    static absmin(values) {
      const lowest = [this.vpInfinity.$, this.vpInfinity.$];
      for (let i = 0; i < values.length; ++i) {
        const n = BDecimal.toDecimal(values[i]);
        const abs = n.abs();
        if (lowest[1].lt(abs)) continue;
        lowest[0] = n;
        lowest[1] = abs;
      }
      return this.exportScratch(lowest[0]);
    }
    absmin(n) { return this.constructor.absmin([this, n]); }
    static absmax(values) {
      const highest = [this.vZero.$, this.vZero.$];
      for (let i = 0; i < values.length; ++i) {
        const n = BDecimal.toDecimal(values[i]);
        const abs = n.abs();
        if (highest[1].gt(abs)) continue;
        highest[0] = n;
        highest[1] = abs;
      }
      return this.exportScratch(highest[0]);
    }
    maxabs(n) { return this.constructor.absmax([this, n]); }
    static cmp(a, b) { return this._op2('cmp', a, b); }
    cmp(n) { return this.constructor.cmp(this, n); }
    static cmpabs(a, b) { return this._op2('cmpabs', a, b); }
    cmpabs(n) { return this.constructor.cmpabs(this, n); }
    static clamp(min, n, max) { return this.scratchExport(this.toDecimal(n).clamp(min, max)); }
    clamp(min, max) { return this.constructor.clamp(min, this, max); }
    static getSign(n) { return this.exportScratch(this.from(n).$.sign ?? 0); }
    static getMag(n) { return this.exportScratch(this.from(n).$.mag ?? 0); }
    get sign() { return this.exportScratch(this.$.sign ?? 0); }
    get mag() { return this.exportScratch(this.$.mag ?? 0); }
    static sin(n) { return this._op1('sin', n); }
    sin() { return this.constructor.sin(this); }
    static cos(n) { return this._op1('cos', n); }
    cos() { return this.constructor.cos(this); }
    static tan(n) { return this._op1('tan', n); }
    tan() { return this.constructor.tan(this); }
    static asin(n) { return this._op1('asin', n); }
    asin() { return this.constructor.asin(this); }
    static acos(n) { return this._op1('acos', n); }
    acos() { return this.constructor.acos(this); }
    static atan(n) { return this._op1('atan', n); }
    atan() { return this.constructor.atan(this); }
    static sinh(n) { return this._op1('sinh', n); }
    sinh() { return this.constructor.sinh(this); }
    static cosh(n) { return this._op1('cosh', n); }
    cosh() { return this.constructor.cosh(this); }
    static tanh(n) { return this._op1('tanh', n); }
    tanh() { return this.constructor.tanh(this); }
    static asinh(n) { return this._op1('asinh', n); }
    asinh() { return this.constructor.asinh(this); }
    static acosh(n) { return this._op1('acosh', n); }
    acosh() { return this.constructor.acosh(this); }
    static atanh(n) { return this._op1('atanh', n); }
    atanh() { return this.constructor.atanh(this); }
    // recip, iteratedexp, iteratedlog, layeradd10, layeradd, lambertw, linear_sroot, penta_log, linear_penta_root
  }
  class FDecimalMath {
    static isNaN = BDecimal.isNaN.bind(BDecimal);
    static get dNegZero() { return BDecimal.vnZero.$; }
    static rad2deg(n) { return BDecimal.toDecimal(n).mul(new Decimal(180)).div(new Decimal(Math.PI)); }
    static deg2rad(n) { return BDecimal.toDecimal(n).mul(new Decimal(Math.PI)).div(new Decimal(180)); }
    static truncDigits(n, d) { d = BDecimal.toDecimal(d); return BDecimal.toDecimal(n).mul(d).round().div(d); }
    static wrapClamp(n, min, max) {
      min = BDecimal.toDecimal(min);
      max = BDecimal.toDecimal(max);
      n = BDecimal.toDecimal(n);
      const r = max.sub(min).add(Decimal.dOne);
      return n.sub(n.sub(min).div(r).floor().mul(r));
    }
    static scale(n, mina, maxa, nmin, nmax) {
      mina = BDecimal.toDecimal(mina);
      nmin = BDecimal.toDecimal(nmin);
      nmax = BDecimal.toDecimal(nmax);
      const p = BDecimal.toDecimal(n).sub(mina).div(BDecimal.toDecimal(maxa).sub(mina));
      return p.mul(nmax.sub(nmin)).add(nmin);
    }
    static atan2(y, x) {
      y = BDecimal.toDecimal(y);
      x = BDecimal.toDecimal(x);
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/atan2/
      // https://pubs.opengroup.org/onlinepubs/9699919799/functions/atan2.html
      const PI = new Decimal(Math.PI);
      const tPId4 = new Decimal(3 * Math.PI / 4);
      const PId4 = new Decimal(Math.PI / 4);
      const PId2 = new Decimal(Math.PI / 2);
      if (x.equals(Decimal.dNegInf)) {
        if (y.equals(Decimal.dInf)) return tPId4;
        if (y.equals(Decimal.dNegInf)) return tPId4.neg();
        if (y.gte(Decimal.dZero)) return PI;
        if (y.lte(this.dNegZero)) return PI.neg();
      } else if (x.equals(Decimal.dInf)) {
        if (y.equals(Decimal.dInf)) return PId4;
        if (y.equals(Decimal.dNegInf)) return PId4.neg();
      } else if (x.equals(Decimal.dZero)) {
        if (y.equals(Decimal.dZero)) return Decimal.dZero;
        if (y.equals(this.dNegZero)) return this.dNegZero;
      } else if (x.equals(this.dNegZero)) {
        if (y.equals(Decimal.dZero)) return PI;
        if (y.equals(this.dNegZero)) return PI.neg();
        if (y.equals(Decimal.dInf) || y.gte(Decimal.dOne)) return PId2;
        if (y.equals(Decimal.dNegInf || y.lte(Decimal.dNegOne))) return PId2.neg();
      } else if (x.lte(Decimal.dNegOne)) {
        if (y.equals(Decimal.dInf)) return PId2;
        if (y.equals(Decimal.dNegInf)) return PId2.neg();
        if (y.equals(Decimal.dOne)) return tPId4;
        if (y.equals(Decimal.dNegOne)) return tPId4.neg();
        if (y.equals(Decimal.dZero)) return PI;
        if (y.equals(this.dNegZero)) return PI.neg();
      }
      const r = y.div(x).atan();
      if (x.lt(Decimal.dZero)) {
        if (y.gte(Decimal.dZero)) return PI.add(r);
        if (y.lt(Decimal.dZero)) return PI.neg().add(r);
      }
      return r;
    }
  }
  class BDecimalMath extends FDecimalMath {
    static exportScratch = BDecimal.exportScratch.bind(BDecimal);
    static rad2deg(n) { return this.exportScratch(super.rad2deg(n)); }
    static deg2rad(n) { return this.exportScratch(super.deg2rad(n)); }
    static truncDigits(n, d) { return this.exportScratch(super.truncDigits(n, d)); }
    static truncDigitsPow10(n, d) { return this.exportScratch(super.truncDigits(
      n, new Decimal(Decimal.dTen).pow(BDecimal.toDecimal(d)),
    )); }
    static scratch_sin(d) { return this.truncDigits(super.deg2rad(d).sin(), 1e10); }
    static scratch_cos(d) { return this.truncDigits(super.deg2rad(d).cos(), 1e10); }
    static scratch_tan(d) {
      d = BDecimal.toDecimal(d).mod(new Decimal(360));
      if (d.equals(new Decimal(-270)) || d.equals(new Decimal(90)))  return this.exportScratch(BDecimal.vpInfinity);
      if (d.equals(new Decimal(270))  || d.equals(new Decimal(-90))) return this.exportScratch(BDecimal.vnInfinity);
      return this.truncDigits(super.deg2rad(d).tan(), 1e10);
    }
    static scratch_asin(d) { return this.rad2deg(BDecimal.toDecimal(d).asin()); }
    static scratch_acos(d) { return this.rad2deg(BDecimal.toDecimal(d).acos()); }
    static scratch_atan(d) { return this.rad2deg(BDecimal.toDecimal(d).atan()); }
    static scratch_sinh(d) { return this.rad2deg(BDecimal.toDecimal(d).sinh()); }
    static scratch_cosh(d) { return this.rad2deg(BDecimal.toDecimal(d).cosh()); }
    static scratch_tanh(d) { return this.rad2deg(BDecimal.toDecimal(d).tanh()); }
    static scratch_asinh(d) { return this.rad2deg(BDecimal.toDecimal(d).asinh()); }
    static scratch_acosh(d) { return this.rad2deg(BDecimal.toDecimal(d).acosh()); }
    static scratch_atanh(d) { return this.rad2deg(BDecimal.toDecimal(d).atanh()); }
    static atan2(y, x) { return this.exportScratch(super.atan2(y, x)); }
    static scratch_atan2(y, x) { return this.rad2deg(super.atan2(y, x)); }
    static wrapClamp(n, min, max) { return this.exportScratch(super.wrapClamp(n, min, max)); }
    static scale(n, mina, maxa, nmin, nmax) { return this.exportScratch(super.scale(n, mina, maxa, nmin, nmax)); }
    static negabs(n) { return this.exportScratch(BDecimal.toDecimal(n).abs().neg()); }
  }
  class extension {
    static exports = {
      Decimal,
      BDecimal,
      BDecimalMath,
      FDecimalMath,
    };
    getInfo() {
      return {
        id: extId,
        name: 'Breaking Eternity',
        blocks: [{
          opcode: 'sign',
          blockType: BlockType.REPORTER,
          text: Scratch.translate('sign of [a]'),
          arguments: {
            a: { type: ArgumentType.STRING, defaultValue: '1' },
          },
        },{
          opcode: 'add',
          blockType: BlockType.REPORTER,
          text: '[num1] + [num2]',
          arguments: {
            num1: { type: ArgumentType.STRING, defaultValue: '5' },
            num2: { type: ArgumentType.STRING, defaultValue: '2' },
          },
        }, {
          opcode: 'sub',
          blockType: BlockType.REPORTER,
          text: '[num1] - [num2]',
          arguments: {
            num1: { type: ArgumentType.STRING, defaultValue: '5' },
            num2: { type: ArgumentType.STRING, defaultValue: '2' },
          },
        }, {
          opcode: 'mul',
          blockType: BlockType.REPORTER,
          text: '[num1] * [num2]',
          arguments: {
            num1: { type: ArgumentType.STRING, defaultValue: '5' },
            num2: { type: ArgumentType.STRING, defaultValue: '2' },
          },
        }, {
          opcode: 'div',
          blockType: BlockType.REPORTER,
          text: '[num1] / [num2]',
          arguments: {
            num1: { type: ArgumentType.STRING, defaultValue: '5' },
            num2: { type: ArgumentType.STRING, defaultValue: '2' },
          },
        }, '---', {
          opcode: 'pow',
          blockType: BlockType.REPORTER,
          text: '[num1] ** [num2]',
          arguments: {
            num1: { type: ArgumentType.STRING, defaultValue: '10' },
            num2: { type: ArgumentType.STRING, defaultValue: '4' },
          },
        }, {
          opcode: 'tet',
          blockType: BlockType.REPORTER,
          text: Scratch.translate('[num1] tetrate [num2]'),
          arguments: {
            num1: { type: ArgumentType.STRING, defaultValue: '10' },
            num2: { type: ArgumentType.STRING, defaultValue: '4' },
          },
        }, {
          opcode: 'pent',
          blockType: BlockType.REPORTER,
          text: Scratch.translate('[num1] pentate [num2]'),
          arguments: {
            num1: { type: ArgumentType.STRING, defaultValue: '10' },
            num2: { type: ArgumentType.STRING, defaultValue: '4' },
          }
        }, '---', {
          opcode: 'root',
          blockType: BlockType.REPORTER,
          text: Scratch.translate('[root]root [num]'),
          arguments: {
            root: { type: ArgumentType.STRING, defaultValue: '2' },
            num: { type: ArgumentType.STRING, defaultValue: '4' },
          },
        }, '---', {
          opcode: 'eq',
          blockType: BlockType.BOOLEAN,
          text: '[num1] = [num2]',
          arguments: {
            num1: { type: ArgumentType.STRING, defaultValue: '25' },
            num2: { type: ArgumentType.STRING, defaultValue: '50' },
          },
        }, {
          opcode: 'lt',
          blockType: BlockType.BOOLEAN,
          text: '[num1] < [num2]',
          arguments: {
            num1: { type: ArgumentType.STRING, defaultValue: '25' },
            num2: { type: ArgumentType.STRING, defaultValue: '50' },
          },
        }, {
          opcode: 'gt',
          blockType: BlockType.BOOLEAN,
          text: '[num1] > [num2]',
          arguments: {
            num1: { type: ArgumentType.STRING, defaultValue: '25' },
            num2: { type: ArgumentType.STRING, defaultValue: '50' },
          }
        }, {
          opcode: 'lte',
          blockType: BlockType.BOOLEAN,
          text: '[num1] <= [num2]',
          arguments: {
            num1: { type: ArgumentType.STRING, defaultValue: '25' },
            num2: { type: ArgumentType.STRING, defaultValue: '50' },
          },
        }, {
          opcode: 'gte',
          blockType: BlockType.BOOLEAN,
          text: '[num1] >= [num2]',
          arguments: {
            num1: { type: ArgumentType.STRING, defaultValue: '25' },
            num2: { type: ArgumentType.STRING, defaultValue: '50' },
          },
        }, '---', {
          opcode: 'log2',
          func: 'log',
          blockType: BlockType.REPORTER,
          text: Scratch.translate('[base] [function] of [num]'),
          arguments: {
            base: { type: ArgumentType.STRING, defaultValue: '10' },
            num: { type: ArgumentType.STRING, defaultValue: '12' },
            function: { type: ArgumentType.STRING, menu: 'logFunctions' },
          },
        }, {
          opcode: 'round2',
          func: 'round',
          blockType: BlockType.REPORTER,
          text: Scratch.translate('[round] of [num]'),
          arguments: {
            num: { type: ArgumentType.STRING, defaultValue: '1.75' },
            round: { type: ArgumentType.STRING, menu: 'roundFunctions' },
          },
        }, {
          opcode: 'maths2',
          func: 'maths',
          blockType: BlockType.REPORTER,
          text: Scratch.translate('[function] of [num]'),
          arguments: {
            num: { type: ArgumentType.STRING, defaultValue: '1' },
            function: { type: ArgumentType.STRING, menu: 'mathFunctions' },
          },
        }, {
          opcode: 'trunc2',
          blockType: BlockType.REPORTER,
          text: Scratch.translate('trunc [n] to [d] decimal(s)'),
          arguments: {
            n: { type: ArgumentType.STRING, defaultValue: '3.14' },
            d: { type: ArgumentType.STRING, defaultValue: '1' },
          },
        }, '---', {
          opcode: 'degatan2',
          blockType: BlockType.REPORTER,
          text: Scratch.translate('deg atan2 y [y] x [x]'),
          arguments: {
            y: { type: ArgumentType.STRING, defaultValue: '2' },
            x: { type: ArgumentType.STRING, defaultValue: '5' },
          },
        }, {
          opcode: 'radatan2',
          blockType: BlockType.REPORTER,
          text: Scratch.translate('rad atan2 y [y] x [x]'),
          arguments: {
            y: { type: ArgumentType.STRING, defaultValue: '2' },
            x: { type: ArgumentType.STRING, defaultValue: '5' },
          },
        }, {
          opcode: 'trig1',
          blockType: BlockType.REPORTER,
          text: Scratch.translate('deg [fn] of [a]'),
          arguments: {
            a: { type: ArgumentType.STRING, defaultValue: '3' },
            fn: { type: ArgumentType.STRING, menu: 'trigFunctions' },
          },
        }, {
          opcode: 'trig2',
          blockType: BlockType.REPORTER,
          text: Scratch.translate('rad [fn] of [a]'),
          arguments: {
            a: { type: ArgumentType.STRING, defaultValue: '3' },
            fn: { type: ArgumentType.STRING, menu: 'trigFunctions' },
          },
        }, '---', {
          opcode: 'minmax1',
          blockType: BlockType.REPORTER,
          text: Scratch.translate('[a] [minmax] [b]'),
          arguments: {
            a: { type: ArgumentType.STRING, defaultValue: '5' },
            b: { type: ArgumentType.STRING, defaultValue: '9' },
            minmax: { type: ArgumentType.STRING, menu: 'minMax' },
          },
        }, {
          opcode: 'minmax2',
          blockType: BlockType.REPORTER,
          text: Scratch.translate('[minmax] of [a]'),
          arguments: {
            a: { type: ArgumentType.STRING, defaultValue: '[1,2]' },
            minmax: { type: ArgumentType.STRING, menu: 'minMax' },
          },
        }, {
          opcode: 'clamp',
          blockType: BlockType.REPORTER,
          text: Scratch.translate('clamp [n] between [min] and [max]'),
          arguments: {
            min: { type: ArgumentType.STRING, defaultValue: '1' },
            max: { type: ArgumentType.STRING, defaultValue: '5' },
            n: { type: ArgumentType.STRING, defaultValue: '8' },
          },
        }, {
          opcode: 'wrapClamp',
          blockType: BlockType.REPORTER,
          text: Scratch.translate('wrap clamp [n] between [min] and [max]'),
          arguments: {
            min: { type: ArgumentType.STRING, defaultValue: '1' },
            max: { type: ArgumentType.STRING, defaultValue: '360' },
            n: { type: ArgumentType.STRING, defaultValue: '15' },
          },
        }, {
          opcode: 'scale',
          blockType: BlockType.REPORTER,
          text: Scratch.translate('map [n] from [a] - [b] to [x] - [y]'),
          arguments: {
            a: { type: ArgumentType.STRING, defaultValue: '0' },
            b: { type: ArgumentType.STRING, defaultValue: '5' },
            x: { type: ArgumentType.STRING, defaultValue: '0' },
            y: { type: ArgumentType.STRING, defaultValue: '10' },
            n: { type: ArgumentType.STRING, defaultValue: '2.5' },
          },
        }, '---', {
          opcode: 'cmp',
          blockType: BlockType.REPORTER,
          text: Scratch.translate('[a] [cmp] [b]'),
          arguments: {
            a: { type: ArgumentType.STRING, defaultValue: '5' },
            b: { type: ArgumentType.STRING, defaultValue: '-4' },
            cmp: { type: ArgumentType.STRING, menu: 'cmp' },
          },
        }, {
          opcode: 'isNaN',
          blockType: BlockType.BOOLEAN,
          text: Scratch.translate('is [a] NaN?'),
          arguments: {
            a: { type: ArgumentType.STRING, defaultValue: 'hi' },
          },
        }, {
          opcode: 'isFinite',
          blockType: BlockType.BOOLEAN,
          text: Scratch.translate('is [a] Finite?'),
          arguments: {
            a: { type: ArgumentType.STRING, defaultValue: '1.0' },
          },
        }, {
          hideFromPalette: true, // Depricated
          opcode: 'log',
          blockType: BlockType.REPORTER,
          text: '[base] [function] of [num]',
          arguments: {
            base: { type: ArgumentType.NUMBER, defaultValue: 10 },
            num: { type: ArgumentType.STRING },
            function: { type: ArgumentType.STRING, menu: 'LOG' },
          },
        }, {
          hideFromPalette: true, // Depricated
          opcode: 'round',
          blockType: BlockType.REPORTER,
          text: '[round] of [num] ',
          arguments: {
            num: { type: ArgumentType.STRING },
            round: { type: ArgumentType.STRING, menu: 'ROUND' },
          },
        }, {
          hideFromPalette: true, // Depricated
          opcode: 'maths',
          blockType: BlockType.REPORTER,
          text: '[function] of [num]',
          arguments: {
            num: { type: ArgumentType.STRING },
            function: { type: ArgumentType.STRING, menu: 'MATHS_FUNCTIONS' },
          },
        }],
        menus: {
          ROUND: { acceptReporters: false, items: ['round', 'floor', 'ceil', 'trunc'] },
          MATHS_FUNCTIONS: { acceptReporters: false, items: ['abs', 'neg', 'ln', 'e^', 'sqrt', 'ssqrt', 'gamma', 'factorial'] },
          LOG: { acceptReporters: false, items: ['log', 'slog'] },
          roundFunctions: { acceptReporters: true, items: [
            {text: Scratch.translate('(1) round'), value: 'round'},
            {text: Scratch.translate('(2) floor'), value: 'floor'},
            {text: Scratch.translate('(3) ceil'), value: 'ceil'},
            {text: Scratch.translate('(4) trunc'), value: 'trunc'},
          ] },
          mathFunctions: { acceptReporters: true, items: [
            {text: Scratch.translate('(1) abs'), value: 'abs'},
            {text: Scratch.translate('(2) neg'), value: 'neg'},
            {text: Scratch.translate('(3) ln'), value: 'ln'},
            {text: Scratch.translate('(4) e^'), value: 'e^'},
            {text: Scratch.translate('(5) sqrt'), value: 'sqrt'},
            {text: Scratch.translate('(6) ssqrt'), value: 'ssqrt'},
            {text: Scratch.translate('(7) gamma'), value: 'gamma'},
            {text: Scratch.translate('(8) factorial'), value: 'factorial'},
            {text: Scratch.translate('(9) neg-abs'), value: 'neg-abs'},
          ] },
          logFunctions: { acceptReporters: true, items: [
            {text: Scratch.translate('(1) log'), value: 'log'},
            {text: Scratch.translate('(2) slog'), value: 'slog'},
          ] },
          trigFunctions: { acceptReporters: true, items: [
            {text: Scratch.translate('(1) sin'), value: 'sin'},
            {text: Scratch.translate('(2) cos'), value: 'cos'},
            {text: Scratch.translate('(3) tan'), value: 'tan'},
            {text: Scratch.translate('(4) asin'), value: 'asin'},
            {text: Scratch.translate('(5) acos'), value: 'acos'},
            {text: Scratch.translate('(6) atan'), value: 'atan'},
            {text: Scratch.translate('(7) sinh'), value: 'sinh'},
            {text: Scratch.translate('(8) cosh'), value: 'cosh'},
            {text: Scratch.translate('(9) tanh'), value: 'tanh'},
            {text: Scratch.translate('(10) asinh'), value: 'asinh'},
            {text: Scratch.translate('(11) acosh'), value: 'acosh'},
            {text: Scratch.translate('(12) atanh'), value: 'atanh'},
          ] },
          minMax: { acceptReporters: true, items: [
            {text: Scratch.translate('(1) min'), value: 'min'},
            {text: Scratch.translate('(2) max'), value: 'max'},
            {text: Scratch.translate('(3) abs-min'), value: 'abs-min'},
            {text: Scratch.translate('(4) abs-max'), value: 'abs-max'},
          ] },
          cmp: { acceptReporters: true, items: [
            {text: Scratch.translate('(1) cmp'), value: 'cmp'},
            {text: Scratch.translate('(2) abs-cmp'), value: 'abs-cmp'},
          ] },
        },
      };
    }
    /**
     * Convert's a translatable menu value to a index or a string.
     * @param {string|number} value Item in valid format.
     * @param {number} [count] Modulo value. this is optional.
     * @returns {string}
     */
    _asValue(value, count) {/**!@see https://surv-is-a-dev.github.io/static/0001tt.txt*/
      if (typeof value === 'number') return ((+value % (1+count || 1)) || 1).toString();
      value = Cast.toString(value).toLowerCase();
      if (value[0] !== '(') return value;
      const match = value.match(/^\([0-9]+\) ?/);
      if (match && match[0]) {
        const v = parseInt(match[0].trim().slice(1, -1));
        if (count) return ((v % (1+count || 1)) || 1).toString();
        return v.toString();
      }
      return value;
    }
    add({ num1, num2 }) { return BDecimal.add(num1, num2); }
    sub({ num1, num2 }) { return BDecimal.subtract(num1, num2); }
    div({ num1, num2 }) { return BDecimal.divide(num1, num2); }
    mul({ num1, num2 }) { return BDecimal.multiply(num1, num2); }
    pow({ num1, num2 }) { return BDecimal.pow(num1, num2); }
    tet({ num1, num2 }) { return BDecimal.tetrate(num1, num2); }
    pent({ num1, num2 }) { return BDecimal.pentate(num1, num2); }
    root({ root, num }) { return BDecimal.root(root, num); }
    gt({ num1, num2 }) { return BDecimal.greaterThan(num1, num2); }
    gte({ num1, num2 }) { return BDecimal.greaterThanOrEquals(num1, num2); }
    lt({ num1, num2 }) { return BDecimal.lessThan(num1, num2); }
    lte({ num1, num2 }) { return BDecimal.lessThanOrEquals(num1, num2); }
    eq({ num1, num2 }) { return BDecimal.equals(num1, num2); }
    clamp({ min, n, max }) { return BDecimal.clamp(min, n, max); }
    wrapClamp({ n, min, max }) { return BDecimalMath.wrapClamp(n, min, max); }
    scale({ n, a, b, x, y }) { return BDecimalMath.scale(n, a, b, x, y); }
    isNaN({ a }) { return BDecimal.isNaN(a); }
    isFinite({ a }) { return BDecimal.isFinite(a); }
    sign({ a }) { return BDecimal.getSign(a); }
    radatan2({ y, x }) { return BDecimalMath.atan2(y, x); }
    degatan2({ y, x }) { return BDecimalMath.scratch_atan2(y, x); }
    trunc2({ n, d }) { return BDecimalMath.truncDigitsPow10(n, d); }
    round({ round: fn, num })  {
      switch(this._asValue(fn, 4)) {
        case '1': case 'round': return BDecimal.round(num);
        case '2': case 'floor': return BDecimal.floor(num);
        case '3': case 'ceil': return BDecimal.ceil(num);
        case '4': case 'trunc': return BDecimal.trunc(num);
        case '0': default: return BDecimal.exportScratch(BDecimal.vZero);
      }
    }
    maths({ function: fn, num }) {
      switch(this._asValue(fn, 8)) {
        case '1': case 'abs': return BDecimal.abs(num);
        case '2': case 'neg': return BDecimal.neg(num);
        case '3': case 'ln': return BDecimal.ln(num);
        case '4': case 'e^': case 'exp': return BDecimal.exp(num);
        case '5': case 'sqrt': return BDecimal.sqrt(num);
        case '6': case 'ssqrt': return BDecimal.ssqrt(num);
        case '7': case 'gamma': return BDecimal.gamma(num);
        case '8': case 'factorial': return BDecimal.factorial(num);
        case '9': case 'neg-abs': return BDecimalMath.negabs(num);
        case '0': default: return BDecimal.exportScratch(BDecimal.vZero);
      }
    }
    log({ function: fn, base, num }) {
      switch(this._asValue(fn, 2)) {
        case '1': case 'log': return BDecimal.log(base, num);
        case '2': case 'slog': return BDecimal.slog(base, num);
        case '0': default: return BDecimal.exportScratch(BDecimal.vZero);
      }
    }
    minmax1({ minmax, a, b }) {
      switch(this._asValue(minmax, 4)) {
        case '1': case 'min': return BDecimal.min([a, b]);
        case '2': case 'max': return BDecimal.max([a, b]);
        case '3': case 'abs-min': return BDecimal.absmin([a, b]);
        case '4': case 'abs-max': return BDecimal.absmax([a, b]);
        case '0': default: return BDecimal.exportScratch(BDecimal.vZero);
      }
    }
    minmax2({ minmax, a }) {
      if (!Array.isArray(a)) {
        try {
          a = JSON.parse(a);
          if (!Array.isArray(a)) return BDecimal.exportScratch(BDecimal.vZero);
        } catch {
          return BDecimal.exportScratch(BDecimal.vZero);
        }
      }
      a = a.map(value => Cast.toString(value ?? NaN));
      switch(this._asValue(minmax, 4)) {
        case '1': case 'min': return BDecimal.min(a);
        case '2': case 'max': return BDecimal.max(a);
        case '3': case 'abs-min': return BDecimal.absmin(a);
        case '4': case 'abs-max': return BDecimal.absmax(a);
        case '0': default: return BDecimal.exportScratch(BDecimal.vZero);
      }
    }
    cmp({ cmp, a, b }) {
      switch(this._asValue(cmp, 2)) {
        case '1': case 'cmp': return BDecimal.cmp(a, b);
        case '2': case 'abs-cmp': return BDecimal.cmpabs(a, b);
        case '0': default: return BDecimal.exportScratch(BDecimal.vZero);
      }
    }
    trig1({ fn, a, real }) {
      real = real || false;
      switch(this._asValue(fn)) {
        case '1': case 'sin': {
          if (real) return BDecimal.sin(a);
          return BDecimalMath.scratch_sin(a);
        };
        case '2': case 'cos': {
          if (real) return BDecimal.cos(a);
          return BDecimalMath.scratch_cos(a);
        };
        case '3': case 'tan': {
          if (real) return BDecimal.tan(a);
          return BDecimalMath.scratch_tan(a);
        };
        case '4': case 'asin': {
          if (real) return BDecimal.asin(a);
          return BDecimalMath.scratch_asin(a);
        };
        case '5': case 'acos': {
          if (real) return BDecimal.acos(a);
          return BDecimalMath.scratch_acos(a);
        };
        case '6': case 'atan': {
          if (real) return BDecimal.atan(a);
          return BDecimalMath.scratch_atan(a);
        };
        case '7': case 'sinh': {
          if (real) return BDecimal.sinh(a);
          return BDecimalMath.scratch_sinh(a);
        };
        case '8': case 'cosh': {
          if (real) return BDecimal.cosh(a);
          return BDecimalMath.scratch_cosh(a);
        };
        case '9': case 'tanh': {
          if (real) return BDecimal.tanh(a);
          return BDecimalMath.scratch_tanh(a);
        };
        case '10': case 'asinh': {
          if (real) return BDecimal.asinh(a);
          return BDecimalMath.scratch_asinh(a);
        };
        case '11': case 'acosh': {
          if (real) return BDecimal.acosh(a);
          return BDecimalMath.scratch_acosh(a);
        };
        case '12': case 'atanh': {
          if (real) return BDecimal.atanh(a);
          return BDecimalMath.scratch_atanh(a);
        };
      }
    }
    trig2({ fn, a }) { return this.trig1({ fn, a, real: true }); }
  }
  Scratch.extensions.register(runtime[`cext_${extId}`] = new extension());
})(Scratch);
