const v=e=>history.state&&history.replaceState(e,""),b=!!document.startViewTransition,y=()=>!!document.querySelector('[name="astro-view-transitions-enabled"]'),S=e=>document.dispatchEvent(new Event(e)),A=()=>S("astro:page-load"),h="data-astro-transition-persist";let u=0;history.state?(u=history.state.index,scrollTo({left:history.state.scrollX,top:history.state.scrollY})):y()&&history.replaceState({index:u,scrollX,scrollY},"");const x=(e,t)=>{let r=!1,o=!1;return(...n)=>{if(r){o=!0;return}e(...n),r=!0,setTimeout(()=>{o&&(o=!1,e(...n)),r=!1},t)}};async function L(e){try{let t=await fetch(e),r=await t.text();return{ok:t.ok,html:r,redirected:t.redirected?t.url:void 0,mediaType:t.headers.get("content-type")?.replace(/;.*$/,"")}}catch{return{ok:!1}}}function T(){let e=document.querySelector('[name="astro-view-transitions-fallback"]');return e?e.getAttribute("content"):"animate"}function k(){for(let e of document.scripts)e.dataset.astroExec=""}function R(){let e=Promise.resolve();for(let t of Array.from(document.scripts)){if(""===t.dataset.astroExec)continue;let r=document.createElement("script");for(let o of(r.innerHTML=t.innerHTML,t.attributes)){if("src"===o.name){let t=new Promise(e=>{r.onload=e});e=e.then(()=>t)}r.setAttribute(o.name,o.value)}r.dataset.astroExec="",t.replaceWith(r)}return e}function P(e){let t=e.effect;return!!(t&&t instanceof KeyframeEffect)&&!!t.target&&"infinite"===window.getComputedStyle(t.target,t.pseudoElement).animationIterationCount}const Y=new DOMParser;async function E(e,t,r,o){let n=t=>{let r=t.getAttribute(h),o=r&&e.head.querySelector(`[${h}="${r}"]`);if(o)return o;if(t.matches("link[rel=stylesheet]")){let r=t.getAttribute("href");return e.head.querySelector(`link[rel=stylesheet][href="${r}"]`)}if("SCRIPT"===t.tagName){for(let r of e.scripts)if(t.textContent&&t.textContent===r.textContent||t.type===r.type&&t.src===r.src)return r}return null},a=()=>{e.querySelectorAll("head noscript").forEach(e=>e.remove());let o=document.documentElement,a=[...o.attributes].filter(({name:e})=>(o.removeAttribute(e),e.startsWith("data-astro-")));for(let t of([...e.documentElement.attributes,...a].forEach(({name:e,value:t})=>o.setAttribute(e,t)),Array.from(document.head.children))){let e=n(t);e?e.remove():t.remove()}document.head.append(...e.head.children);let l=document.body;for(let t of(document.body.replaceWith(e.body),l.querySelectorAll(`[${h}]`))){let e=t.getAttribute(h),r=document.querySelector(`[${h}="${e}"]`);r&&r.replaceWith(t)}scrollTo({left:0,top:0,behavior:"instant"});let i=0,s=0;if(!r&&t.hash){let e=decodeURIComponent(t.hash.slice(1)),r=document.getElementById(e);r&&(r.scrollIntoView(),i=Math.max(0,r.offsetLeft+r.offsetWidth-document.documentElement.clientWidth),s=r.offsetTop)}else r&&scrollTo(r.scrollX,r.scrollY);r||history.pushState({index:++u,scrollX:i,scrollY:s},"",t.href),S("astro:after-swap")},l=[];for(let t of e.querySelectorAll("head link[rel=stylesheet]"))if(!document.querySelector(`[${h}="${t.getAttribute(h)}"], link[rel=stylesheet]`)){let e=document.createElement("link");e.setAttribute("rel","preload"),e.setAttribute("as","style"),e.setAttribute("href",t.getAttribute("href")),l.push(new Promise(t=>{["load","error"].forEach(r=>e.addEventListener(r,t)),document.head.append(e)}))}if(l.length&&await Promise.all(l),"animate"===o){let e=document.getAnimations();document.documentElement.dataset.astroTransitionFallback="old";let t=document.getAnimations().filter(t=>!e.includes(t)&&!P(t)),r=Promise.all(t.map(e=>e.finished));await r,a(),document.documentElement.dataset.astroTransitionFallback="new"}else a()}async function g(e,t,r){let o;let n=t.href,{html:a,ok:l,mediaType:i,redirected:s}=await L(n);if(s&&(t=new URL(s)),!l||!("text/html"===i||"application/xhtml+xml"===i)){location.href=n;return}let c=Y.parseFromString(a,i);if(!c.querySelector('[name="astro-view-transitions-enabled"]')){location.href=n;return}r||history.replaceState({index:u,scrollX,scrollY},""),document.documentElement.dataset.astroTransition=e,o=b?document.startViewTransition(()=>E(c,t,r)).finished:E(c,t,r,T());try{await o}finally{await R(),k(),A()}}function q(e){if(document.querySelector(`link[rel=prefetch][href="${e}"]`))return;if(navigator.connection){let e=navigator.connection;if(e.saveData||/(2|3)g/.test(e.effectiveType||""))return}let t=document.createElement("link");t.setAttribute("rel","prefetch"),t.setAttribute("href",e),document.head.append(t)}if(b||"none"!==T()){k(),document.addEventListener("click",e=>{let t=e.target;if(t instanceof Element&&"A"!==t.tagName&&(t=t.closest("a")),!(!t||!(t instanceof HTMLAnchorElement)||void 0!==t.dataset.astroReload||t.hasAttribute("download")||!t.href||t.target&&"_self"!==t.target||t.origin!==location.origin||0!==e.button||e.metaKey||e.ctrlKey||e.altKey||e.shiftKey||e.defaultPrevented||!y())){if(location.pathname===t.pathname&&location.search===t.search){if(t.hash)return;if(e.preventDefault(),location.hash){history.replaceState({index:u,scrollX,scrollY:-(scrollY+1)},"");let e={index:++u,scrollX:0,scrollY:0};history.pushState(e,"",t.href)}scrollTo({left:0,top:0,behavior:"instant"});return}e.preventDefault(),g("forward",new URL(t.href))}}),addEventListener("popstate",e=>{if(!y()&&e.state){history.scrollRestoration&&(history.scrollRestoration="manual"),location.reload();return}if(null===e.state){history.scrollRestoration&&(history.scrollRestoration="auto");return}history.scrollRestoration&&(history.scrollRestoration="manual");let t=history.state,r=t.index,o=r>u?"forward":"back";u=r,t.scrollY<0?scrollTo(t.scrollX,-(t.scrollY+1)):g(o,new URL(location.href),t)}),["mouseenter","touchstart","focus"].forEach(e=>{document.addEventListener(e,e=>{if(e.target instanceof HTMLAnchorElement){let t=e.target;t.origin===location.origin&&t.pathname!==location.pathname&&y()&&q(t.pathname)}},{passive:!0,capture:!0})}),addEventListener("load",A);let e=()=>{v({...history.state,scrollX,scrollY})};"onscrollend"in window?addEventListener("scrollend",e):addEventListener("scroll",x(e,300))}