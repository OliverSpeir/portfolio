---
title: "A11y Thoughts"
description: "Some tools I've found for and thoughts I have about Web Accessibility"
ogImage: "../../assets/imgs/theoryCrafting.png"
date: 2024-01-17T03:21:44Z
---

# Theorycrafting

This is really just a public notes and invitation for anyone else to give me their thoughts on these subjects.

Honestly slapped this post together, but I will come back as I solidify my thoughts.

## Downloading client side JS

1. module scripts
2. qwik
3. partytown
4. inline scripts

## Prerendering

SSR vs Static

I rarely find a reason to SSR, I think edge middleware also plays a big role in this

## Routing 

Client side routing is pretty nice, I think I like it but I'm curious what things will look like with MPA View Transitions

I'm a big fan of astros lightweight router for SPA View Transitions, I feel it brings a lot of functionality like loading states and modules are preserved etc

## Hydration

The pitfall is you can hydrate JS that will never be used

"Lazy hydration" is a concept, Ryan Carniato says it is a myth but in theory it does make sense, I'm not sure I understand why he says it is a myth. 

## Resumability

Not sure I love the term resumability, but downloading all JS in a service worker only when it is used seems a lot better than lazy hydration 

Resumability needs consideration though, concepts such as "speculative module loading" or executing JS once it is in viewport to prevent slow click

Best case seems to be to download all JS lazily then execute on interaction

## Signals

No idea what they are but I want to