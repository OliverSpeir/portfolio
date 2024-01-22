---
title: "A11y Thoughts"
description: "Some tools I've found for and thoughts I have about Web Accessibility"
ogImage: "../../assets/imgs/theoryCrafting.png"
date: 2024-01-17T03:21:44Z
---

# Theorycrafting

This is really just a public notes and invitation for anyone else to give me their thoughts on these subjects.

Honestly slapped this post together, but I will come back as I solidify my thoughts.

## Server Side Rendering

This term is a bit unclear. Both static sites and "on demand generated" sites are server "rendered". Rendering meaning generating the HTML, JS, CSS and Images that comprise the website.

The main advantage of "on demand generation" (meaning you have the ability to change the assets per request) is ability to work with things like: cookies, request headers and dynamic data. 

The main advantage of static generation is obviously that there doesn't need to be a generation process on every requeset. The cost of generation obviously depends on how much *could* change and how much can be "pregenerated".


## Routing 

Client side routing is pretty nice, I think I like it but I'm curious what things will look like with MPA View Transitions.

I'm a big fan of Astro's lightweight router that allows MPA's to use Browser's SPA View Transitions API, I feel it brings a lot of functionality. Loading states and modules being saved between pages are pretty big benefits.

## Hydration

Hydration can happen "lazily" to improve page load time, meaning it the javascript executes after the page is displayed. Typically this is done with a [module script](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules), which downloads eagerly and in parallel with other resources (async) and executes deffered. This can cause issues with the [First Input Delay (FID)](https://web.dev/articles/fid).

Hydration can happen "eagerly" if interactivity is necessary ASAP, and this would be done with a non module script probably using `async` so it doesn't block unnessarily.

## Resumability

Defined as executing JS on the server and serializing it and then allowing the client to "resume" execution on the browser. This still requires the JS to be downloaded, but saves in theory on some execution time.

Not sure I love the term resumability, but downloading all JS in a service worker then only execute when it is used is a very powerful pattern.

Resumability needs consideration though, when it comes to [FID](https://web.dev/articles/fid) if the javascript doesn't begin execution until an event is triggered, this means there will be a delay while the javascript executes (even though it is resuming). In "resumable" frameworks like qwik there is a concept of [Speculative Module Fetching](https://www.builder.io/blog/speculative-module-fetching) which basically allows for certain parts of a page's total javascript that are likely to be a part of a `First Input` to be executed right away (basically like a module script).

## Partytown

Uses web workers to execute Javascript outside of the main thread. This is pretty serious, and it differs from a service worker which just downloads and caches the javascript. 

A web worker can actually execute the javascript outside the main thread, which is an improvement from a module script because it doesn't have to wait for the page to load to begin execution. 

## Signals

I am not 100% sure and haven't spent very much time on this concept. I think they are basically just a subscription model. They are in contrast to React's useState hook which has the downfall of rerending the entire component the state belongs to. 

Here's chatGPT's vanilla JS version of signals:

```js
function createSignal(initialValue) {
    let value = initialValue;
    const listeners = new Set();

    return [
        () => value, // getter
        (newValue) => {
            value = newValue;
            listeners.forEach((listener) => listener(value));
        }, // setter
        (listener) => { listeners.add(listener); } // subscribe
    ];
}
```
