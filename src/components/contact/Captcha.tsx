"use client";

import { useEffect, useImperativeHandle, useRef, useState, type Ref } from "react";

type CaptchaApi = {
  render: (container:HTMLElement, options:Record<string,unknown>)=>string;
  reset:(id:string)=>void;
  remove:(id:string)=>void;
};
type CaptchaWindow = Window & { hcaptcha?:CaptchaApi; sodiolCaptchaReady?:()=>void };
let loading:Promise<CaptchaApi> | undefined;
function loadApi():Promise<CaptchaApi> {
  const target=window as CaptchaWindow;
  if(target.hcaptcha?.render) return Promise.resolve(target.hcaptcha);
  if(loading)return loading;
  loading=new Promise((resolve,reject)=>{
    const script=document.createElement("script");
    script.id="sodiol-hcaptcha";
    script.src="https://js.hcaptcha.com/1/api.js?render=explicit&recaptchacompat=off&onload=sodiolCaptchaReady";
    script.async=true;
    const timeout=setTimeout(()=>fail(),15000);
    const fail=()=>{clearTimeout(timeout);script.remove();loading=undefined;reject(new Error("Verification could not load."));};
    target.sodiolCaptchaReady=()=>{clearTimeout(timeout);if(target.hcaptcha)resolve(target.hcaptcha);else fail();};
    script.onerror=fail;
    document.head.appendChild(script);
  });
  return loading;
}
export type CaptchaHandle = { reset:()=>void; focus:()=>void };
export function Captcha({active,onToken,ref}:{active:boolean;onToken:(token:string)=>void;ref:Ref<CaptchaHandle>}) {
  const root=useRef<HTMLDivElement>(null);
  const container=useRef<HTMLDivElement>(null);
  const widget=useRef<string | null>(null);
  const [error,setError]=useState(false);
  const [retry,setRetry]=useState(0);
  const [ready,setReady]=useState(false);
  useImperativeHandle(ref,()=>({
    reset:()=>{onToken("");if(widget.current!==null)(window as CaptchaWindow).hcaptcha?.reset(widget.current);},
    focus:()=>{root.current?.focus();root.current?.scrollIntoView({block:"nearest",behavior:"instant"});},
  }),[onToken]);
  useEffect(()=>{
    if(!active)return;
    let cancelled=false;
    let api:CaptchaApi | undefined;
    loadApi().then(instance=>{
      if(cancelled)return;
      api=instance;
      widget.current=api.render(container.current!,{
        // Official Web3Forms free-plan sitekey, not a fabricated credential.
        sitekey:"50b2fe65-b00b-4b9e-ad62-3ba471098be2",theme:"dark",size:"compact",
        callback:(token:string)=>onToken(token),
        "expired-callback":()=>onToken(""),
        "chalexpired-callback":()=>onToken(""),
        "error-callback":()=>{onToken("");setError(true);},
      });
      setReady(true);setError(false);
    }).catch(()=>{if(!cancelled)setError(true);});
    return ()=>{cancelled=true;if(widget.current!==null){api?.remove(widget.current);widget.current=null;}};
  },[active,retry,onToken]);
  return <div ref={root} tabIndex={-1} aria-label="Anti-spam verification" data-captcha-area>
    <div ref={container} />
    {!active && <p>Anti-spam verification loads when you use the form.</p>}
    {active && !ready && !error && <p role="status">Loading verification…</p>}
    {error && <p role="status">Verification couldn’t load. <button type="button" onClick={()=>{setError(false);setReady(false);setRetry(value=>value+1);}}>Try again</button></p>}
  </div>;
}
