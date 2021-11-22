var RedMetrics=(()=>{var ot=Object.create;var q=Object.defineProperty,at=Object.defineProperties,ut=Object.getOwnPropertyDescriptor,ct=Object.getOwnPropertyDescriptors,ft=Object.getOwnPropertyNames,Z=Object.getOwnPropertySymbols,lt=Object.getPrototypeOf,ee=Object.prototype.hasOwnProperty,dt=Object.prototype.propertyIsEnumerable;var te=(t,e,r)=>e in t?q(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r,R=(t,e)=>{for(var r in e||(e={}))ee.call(e,r)&&te(t,r,e[r]);if(Z)for(var r of Z(e))dt.call(e,r)&&te(t,r,e[r]);return t},D=(t,e)=>at(t,ct(e)),re=t=>q(t,"__esModule",{value:!0});var c=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports),pt=(t,e)=>{re(t);for(var r in e)q(t,r,{get:e[r],enumerable:!0})},ht=(t,e,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let s of ft(e))!ee.call(t,s)&&s!=="default"&&q(t,s,{get:()=>e[s],enumerable:!(r=ut(e,s))||r.enumerable});return t},mt=t=>ht(re(q(t!=null?ot(lt(t)):{},"default",t&&t.__esModule&&"default"in t?{get:()=>t.default,enumerable:!0}:{value:t,enumerable:!0})),t);var T=c((nr,se)=>{"use strict";se.exports=function(e,r){return function(){for(var n=new Array(arguments.length),i=0;i<n.length;i++)n[i]=arguments[i];return e.apply(r,n)}}});var p=c((ir,oe)=>{"use strict";var vt=T(),x=Object.prototype.toString;function L(t){return x.call(t)==="[object Array]"}function I(t){return typeof t=="undefined"}function yt(t){return t!==null&&!I(t)&&t.constructor!==null&&!I(t.constructor)&&typeof t.constructor.isBuffer=="function"&&t.constructor.isBuffer(t)}function xt(t){return x.call(t)==="[object ArrayBuffer]"}function Et(t){return typeof FormData!="undefined"&&t instanceof FormData}function bt(t){var e;return typeof ArrayBuffer!="undefined"&&ArrayBuffer.isView?e=ArrayBuffer.isView(t):e=t&&t.buffer&&t.buffer instanceof ArrayBuffer,e}function wt(t){return typeof t=="string"}function qt(t){return typeof t=="number"}function ne(t){return t!==null&&typeof t=="object"}function C(t){if(x.call(t)!=="[object Object]")return!1;var e=Object.getPrototypeOf(t);return e===null||e===Object.prototype}function gt(t){return x.call(t)==="[object Date]"}function Rt(t){return x.call(t)==="[object File]"}function Ct(t){return x.call(t)==="[object Blob]"}function ie(t){return x.call(t)==="[object Function]"}function St(t){return ne(t)&&ie(t.pipe)}function At(t){return typeof URLSearchParams!="undefined"&&t instanceof URLSearchParams}function Ot(t){return t.replace(/^\s*/,"").replace(/\s*$/,"")}function Ut(){return typeof navigator!="undefined"&&(navigator.product==="ReactNative"||navigator.product==="NativeScript"||navigator.product==="NS")?!1:typeof window!="undefined"&&typeof document!="undefined"}function j(t,e){if(!(t===null||typeof t=="undefined"))if(typeof t!="object"&&(t=[t]),L(t))for(var r=0,s=t.length;r<s;r++)e.call(null,t[r],r,t);else for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&e.call(null,t[n],n,t)}function F(){var t={};function e(n,i){C(t[i])&&C(n)?t[i]=F(t[i],n):C(n)?t[i]=F({},n):L(n)?t[i]=n.slice():t[i]=n}for(var r=0,s=arguments.length;r<s;r++)j(arguments[r],e);return t}function Pt(t,e,r){return j(e,function(n,i){r&&typeof n=="function"?t[i]=vt(n,r):t[i]=n}),t}function Nt(t){return t.charCodeAt(0)===65279&&(t=t.slice(1)),t}oe.exports={isArray:L,isArrayBuffer:xt,isBuffer:yt,isFormData:Et,isArrayBufferView:bt,isString:wt,isNumber:qt,isObject:ne,isPlainObject:C,isUndefined:I,isDate:gt,isFile:Rt,isBlob:Ct,isFunction:ie,isStream:St,isURLSearchParams:At,isStandardBrowserEnv:Ut,forEach:j,merge:F,extend:Pt,trim:Ot,stripBOM:Nt}});var H=c((or,ue)=>{"use strict";var E=p();function ae(t){return encodeURIComponent(t).replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"+").replace(/%5B/gi,"[").replace(/%5D/gi,"]")}ue.exports=function(e,r,s){if(!r)return e;var n;if(s)n=s(r);else if(E.isURLSearchParams(r))n=r.toString();else{var i=[];E.forEach(r,function(f,y){f===null||typeof f=="undefined"||(E.isArray(f)?y=y+"[]":f=[f],E.forEach(f,function(m){E.isDate(m)?m=m.toISOString():E.isObject(m)&&(m=JSON.stringify(m)),i.push(ae(y)+"="+ae(m))}))}),n=i.join("&")}if(n){var u=e.indexOf("#");u!==-1&&(e=e.slice(0,u)),e+=(e.indexOf("?")===-1?"?":"&")+n}return e}});var fe=c((ar,ce)=>{"use strict";var Bt=p();function S(){this.handlers=[]}S.prototype.use=function(e,r){return this.handlers.push({fulfilled:e,rejected:r}),this.handlers.length-1};S.prototype.eject=function(e){this.handlers[e]&&(this.handlers[e]=null)};S.prototype.forEach=function(e){Bt.forEach(this.handlers,function(s){s!==null&&e(s)})};ce.exports=S});var de=c((ur,le)=>{"use strict";var Dt=p();le.exports=function(e,r,s){return Dt.forEach(s,function(i){e=i(e,r)}),e}});var M=c((cr,pe)=>{"use strict";pe.exports=function(e){return!!(e&&e.__CANCEL__)}});var me=c((fr,he)=>{"use strict";var Tt=p();he.exports=function(e,r){Tt.forEach(e,function(n,i){i!==r&&i.toUpperCase()===r.toUpperCase()&&(e[r]=n,delete e[i])})}});var ye=c((lr,ve)=>{"use strict";ve.exports=function(e,r,s,n,i){return e.config=r,s&&(e.code=s),e.request=n,e.response=i,e.isAxiosError=!0,e.toJSON=function(){return{message:this.message,name:this.name,description:this.description,number:this.number,fileName:this.fileName,lineNumber:this.lineNumber,columnNumber:this.columnNumber,stack:this.stack,config:this.config,code:this.code}},e}});var _=c((dr,xe)=>{"use strict";var Lt=ye();xe.exports=function(e,r,s,n,i){var u=new Error(e);return Lt(u,r,s,n,i)}});var be=c((pr,Ee)=>{"use strict";var It=_();Ee.exports=function(e,r,s){var n=s.config.validateStatus;!s.status||!n||n(s.status)?e(s):r(It("Request failed with status code "+s.status,s.config,null,s.request,s))}});var qe=c((hr,we)=>{"use strict";var A=p();we.exports=A.isStandardBrowserEnv()?function(){return{write:function(r,s,n,i,u,o){var f=[];f.push(r+"="+encodeURIComponent(s)),A.isNumber(n)&&f.push("expires="+new Date(n).toGMTString()),A.isString(i)&&f.push("path="+i),A.isString(u)&&f.push("domain="+u),o===!0&&f.push("secure"),document.cookie=f.join("; ")},read:function(r){var s=document.cookie.match(new RegExp("(^|;\\s*)("+r+")=([^;]*)"));return s?decodeURIComponent(s[3]):null},remove:function(r){this.write(r,"",Date.now()-864e5)}}}():function(){return{write:function(){},read:function(){return null},remove:function(){}}}()});var Re=c((mr,ge)=>{"use strict";ge.exports=function(e){return/^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(e)}});var Se=c((vr,Ce)=>{"use strict";Ce.exports=function(e,r){return r?e.replace(/\/+$/,"")+"/"+r.replace(/^\/+/,""):e}});var Oe=c((yr,Ae)=>{"use strict";var jt=Re(),Ft=Se();Ae.exports=function(e,r){return e&&!jt(r)?Ft(e,r):r}});var Pe=c((xr,Ue)=>{"use strict";var k=p(),Ht=["age","authorization","content-length","content-type","etag","expires","from","host","if-modified-since","if-unmodified-since","last-modified","location","max-forwards","proxy-authorization","referer","retry-after","user-agent"];Ue.exports=function(e){var r={},s,n,i;return e&&k.forEach(e.split(`
`),function(o){if(i=o.indexOf(":"),s=k.trim(o.substr(0,i)).toLowerCase(),n=k.trim(o.substr(i+1)),s){if(r[s]&&Ht.indexOf(s)>=0)return;s==="set-cookie"?r[s]=(r[s]?r[s]:[]).concat([n]):r[s]=r[s]?r[s]+", "+n:n}}),r}});var De=c((Er,Be)=>{"use strict";var Ne=p();Be.exports=Ne.isStandardBrowserEnv()?function(){var e=/(msie|trident)/i.test(navigator.userAgent),r=document.createElement("a"),s;function n(i){var u=i;return e&&(r.setAttribute("href",u),u=r.href),r.setAttribute("href",u),{href:r.href,protocol:r.protocol?r.protocol.replace(/:$/,""):"",host:r.host,search:r.search?r.search.replace(/^\?/,""):"",hash:r.hash?r.hash.replace(/^#/,""):"",hostname:r.hostname,port:r.port,pathname:r.pathname.charAt(0)==="/"?r.pathname:"/"+r.pathname}}return s=n(window.location.href),function(u){var o=Ne.isString(u)?n(u):u;return o.protocol===s.protocol&&o.host===s.host}}():function(){return function(){return!0}}()});var z=c((br,Te)=>{"use strict";var O=p(),Mt=be(),_t=qe(),kt=H(),Kt=Oe(),zt=Pe(),Vt=De(),K=_();Te.exports=function(e){return new Promise(function(s,n){var i=e.data,u=e.headers;O.isFormData(i)&&delete u["Content-Type"];var o=new XMLHttpRequest;if(e.auth){var f=e.auth.username||"",y=e.auth.password?unescape(encodeURIComponent(e.auth.password)):"";u.Authorization="Basic "+btoa(f+":"+y)}var b=Kt(e.baseURL,e.url);if(o.open(e.method.toUpperCase(),kt(b,e.params,e.paramsSerializer),!0),o.timeout=e.timeout,o.onreadystatechange=function(){if(!(!o||o.readyState!==4)&&!(o.status===0&&!(o.responseURL&&o.responseURL.indexOf("file:")===0))){var a="getAllResponseHeaders"in o?zt(o.getAllResponseHeaders()):null,w=!e.responseType||e.responseType==="text"?o.responseText:o.response,it={data:w,status:o.status,statusText:o.statusText,headers:a,config:e,request:o};Mt(s,n,it),o=null}},o.onabort=function(){!o||(n(K("Request aborted",e,"ECONNABORTED",o)),o=null)},o.onerror=function(){n(K("Network Error",e,null,o)),o=null},o.ontimeout=function(){var a="timeout of "+e.timeout+"ms exceeded";e.timeoutErrorMessage&&(a=e.timeoutErrorMessage),n(K(a,e,"ECONNABORTED",o)),o=null},O.isStandardBrowserEnv()){var m=(e.withCredentials||Vt(b))&&e.xsrfCookieName?_t.read(e.xsrfCookieName):void 0;m&&(u[e.xsrfHeaderName]=m)}if("setRequestHeader"in o&&O.forEach(u,function(a,w){typeof i=="undefined"&&w.toLowerCase()==="content-type"?delete u[w]:o.setRequestHeader(w,a)}),O.isUndefined(e.withCredentials)||(o.withCredentials=!!e.withCredentials),e.responseType)try{o.responseType=e.responseType}catch(l){if(e.responseType!=="json")throw l}typeof e.onDownloadProgress=="function"&&o.addEventListener("progress",e.onDownloadProgress),typeof e.onUploadProgress=="function"&&o.upload&&o.upload.addEventListener("progress",e.onUploadProgress),e.cancelToken&&e.cancelToken.promise.then(function(a){!o||(o.abort(),n(a),o=null)}),i||(i=null),o.send(i)})}});var V=c((wr,je)=>{"use strict";var h=p(),Le=me(),Jt={"Content-Type":"application/x-www-form-urlencoded"};function Ie(t,e){!h.isUndefined(t)&&h.isUndefined(t["Content-Type"])&&(t["Content-Type"]=e)}function Xt(){var t;return typeof XMLHttpRequest!="undefined"?t=z():typeof process!="undefined"&&Object.prototype.toString.call(process)==="[object process]"&&(t=z()),t}var U={adapter:Xt(),transformRequest:[function(e,r){return Le(r,"Accept"),Le(r,"Content-Type"),h.isFormData(e)||h.isArrayBuffer(e)||h.isBuffer(e)||h.isStream(e)||h.isFile(e)||h.isBlob(e)?e:h.isArrayBufferView(e)?e.buffer:h.isURLSearchParams(e)?(Ie(r,"application/x-www-form-urlencoded;charset=utf-8"),e.toString()):h.isObject(e)?(Ie(r,"application/json;charset=utf-8"),JSON.stringify(e)):e}],transformResponse:[function(e){if(typeof e=="string")try{e=JSON.parse(e)}catch(r){}return e}],timeout:0,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",maxContentLength:-1,maxBodyLength:-1,validateStatus:function(e){return e>=200&&e<300}};U.headers={common:{Accept:"application/json, text/plain, */*"}};h.forEach(["delete","get","head"],function(e){U.headers[e]={}});h.forEach(["post","put","patch"],function(e){U.headers[e]=h.merge(Jt)});je.exports=U});var Me=c((qr,He)=>{"use strict";var Fe=p(),J=de(),Qt=M(),$t=V();function X(t){t.cancelToken&&t.cancelToken.throwIfRequested()}He.exports=function(e){X(e),e.headers=e.headers||{},e.data=J(e.data,e.headers,e.transformRequest),e.headers=Fe.merge(e.headers.common||{},e.headers[e.method]||{},e.headers),Fe.forEach(["delete","get","head","post","put","patch","common"],function(n){delete e.headers[n]});var r=e.adapter||$t.adapter;return r(e).then(function(n){return X(e),n.data=J(n.data,n.headers,e.transformResponse),n},function(n){return Qt(n)||(X(e),n&&n.response&&(n.response.data=J(n.response.data,n.response.headers,e.transformResponse))),Promise.reject(n)})}});var Q=c((gr,_e)=>{"use strict";var d=p();_e.exports=function(e,r){r=r||{};var s={},n=["url","method","data"],i=["headers","auth","proxy","params"],u=["baseURL","transformRequest","transformResponse","paramsSerializer","timeout","timeoutMessage","withCredentials","adapter","responseType","xsrfCookieName","xsrfHeaderName","onUploadProgress","onDownloadProgress","decompress","maxContentLength","maxBodyLength","maxRedirects","transport","httpAgent","httpsAgent","cancelToken","socketPath","responseEncoding"],o=["validateStatus"];function f(l,a){return d.isPlainObject(l)&&d.isPlainObject(a)?d.merge(l,a):d.isPlainObject(a)?d.merge({},a):d.isArray(a)?a.slice():a}function y(l){d.isUndefined(r[l])?d.isUndefined(e[l])||(s[l]=f(void 0,e[l])):s[l]=f(e[l],r[l])}d.forEach(n,function(a){d.isUndefined(r[a])||(s[a]=f(void 0,r[a]))}),d.forEach(i,y),d.forEach(u,function(a){d.isUndefined(r[a])?d.isUndefined(e[a])||(s[a]=f(void 0,e[a])):s[a]=f(void 0,r[a])}),d.forEach(o,function(a){a in r?s[a]=f(e[a],r[a]):a in e&&(s[a]=f(void 0,e[a]))});var b=n.concat(i).concat(u).concat(o),m=Object.keys(e).concat(Object.keys(r)).filter(function(a){return b.indexOf(a)===-1});return d.forEach(m,y),s}});var Ve=c((Rr,ze)=>{"use strict";var ke=p(),Gt=H(),Ke=fe(),Wt=Me(),P=Q();function g(t){this.defaults=t,this.interceptors={request:new Ke,response:new Ke}}g.prototype.request=function(e){typeof e=="string"?(e=arguments[1]||{},e.url=arguments[0]):e=e||{},e=P(this.defaults,e),e.method?e.method=e.method.toLowerCase():this.defaults.method?e.method=this.defaults.method.toLowerCase():e.method="get";var r=[Wt,void 0],s=Promise.resolve(e);for(this.interceptors.request.forEach(function(i){r.unshift(i.fulfilled,i.rejected)}),this.interceptors.response.forEach(function(i){r.push(i.fulfilled,i.rejected)});r.length;)s=s.then(r.shift(),r.shift());return s};g.prototype.getUri=function(e){return e=P(this.defaults,e),Gt(e.url,e.params,e.paramsSerializer).replace(/^\?/,"")};ke.forEach(["delete","get","head","options"],function(e){g.prototype[e]=function(r,s){return this.request(P(s||{},{method:e,url:r,data:(s||{}).data}))}});ke.forEach(["post","put","patch"],function(e){g.prototype[e]=function(r,s,n){return this.request(P(n||{},{method:e,url:r,data:s}))}});ze.exports=g});var G=c((Cr,Je)=>{"use strict";function $(t){this.message=t}$.prototype.toString=function(){return"Cancel"+(this.message?": "+this.message:"")};$.prototype.__CANCEL__=!0;Je.exports=$});var Qe=c((Sr,Xe)=>{"use strict";var Yt=G();function N(t){if(typeof t!="function")throw new TypeError("executor must be a function.");var e;this.promise=new Promise(function(n){e=n});var r=this;t(function(n){r.reason||(r.reason=new Yt(n),e(r.reason))})}N.prototype.throwIfRequested=function(){if(this.reason)throw this.reason};N.source=function(){var e,r=new N(function(n){e=n});return{token:r,cancel:e}};Xe.exports=N});var Ge=c((Ar,$e)=>{"use strict";$e.exports=function(e){return function(s){return e.apply(null,s)}}});var Ye=c((Or,We)=>{"use strict";We.exports=function(e){return typeof e=="object"&&e.isAxiosError===!0}});var tt=c((Ur,W)=>{"use strict";var Ze=p(),Zt=T(),B=Ve(),er=Q(),tr=V();function et(t){var e=new B(t),r=Zt(B.prototype.request,e);return Ze.extend(r,B.prototype,e),Ze.extend(r,e),r}var v=et(tr);v.Axios=B;v.create=function(e){return et(er(v.defaults,e))};v.Cancel=G();v.CancelToken=Qe();v.isCancel=M();v.all=function(e){return Promise.all(e)};v.spread=Ge();v.isAxiosError=Ye();W.exports=v;W.exports.default=v});var st=c((Pr,rt)=>{rt.exports=tt()});var rr={};pt(rr,{Client:()=>Y});var nt=mt(st()),Y=class{constructor(e){this.config=e;this.eventQueue=[];this.bufferingInterval=null;this.connected=!1;this.api=nt.default.create({params:{apikey:e.apiKey},baseURL:e.baseUrl,headers:{"Access-Control-Allow-Origin":e.baseUrl}})}get isConnected(){return this.connected}async connect(){var s;if(this.connected)throw new Error("RedMetrics client is already connected");let e="/key",{data:r}=await this.api.get(e);if(r)this.sessionId=r.key;else{let n=this.config.session?{version:this.config.session.gameVersion,screen_size:this.config.session.screenSize,software:this.config.session.software,external_id:this.config.session.externalId,platform:this.config.session.platform,custom_data:this.config.session.customData===void 0?void 0:JSON.stringify(this.config.session.customData)}:{},i="/session",{data:u}=await this.api.post(i,n);this.sessionId=u.id}this.connected=!0,this.bufferingInterval=setInterval(this.buff.bind(this),(s=this.config.bufferingDelay)!=null?s:6e4)}async disconnect(e){if(!this.connected)throw new Error("RedMetrics client is not connected");clearInterval(this.bufferingInterval),this.emit("end",R({},e)),await this.buff(),this.bufferingInterval=null,this.connected=!1}async buff(){if(this.connected&&this.eventQueue.length>0){let e=this.eventQueue.map(s=>D(R({},s),{session_id:this.sessionId})),r="/event";return await this.api.post(r,e).then(s=>{s.status==200&&(this.eventQueue=[])}),!0}else this.connected||console.error("\u274C redmetrics client not connected");return!1}emit(e,r){this.eventQueue.push(D(R({},r),{type:e,user_time:new Date().toISOString()}))}};module.exports.Client=Y;return rr;})();
