---
title: "Nodemailer"
description: "How to set up a serverless function that sends emails and use it on a static website"
ogImage: "../../assets/imgs/nodemailer.png"
date: 2024-01-17T03:21:44Z
---

# Creating an endpoint that sends emails

The concept here is you a static site with a contact form, and you want to be able to have your contact form send an email when it is submitted.

This post will outline using a serverless function to accomplish this. This function will be a [progressive enhancement](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement) meaning it will work with or without javascript. 

## Serverless function

*As far as I am aware it is easiest to handle CORS yourself, but I could be wrong about this. If anyone has better ideas please reach out and I'll update this.*

### Overview of function:

1. Handle CORS / Block origins
2. Create `transporter` with nodemailer based on environmental variables
3. Parse the body of the POST request and optionally validate some fields
4. Send the email
5. Return either redirect or json depending on if JS is used to submit the form

### Example function

[nodemailer-netlify-example](https://github.com/OliverSpeir/nodemailer-netlify-example), this function takes about 1 second to execute.

This has validation with [validator.js isEmail](https://github.com/validatorjs/validator.js/tree/master) and it set up to easily add [your own validation](https://github.com/OliverSpeir/nodemailer-netlify-example/blob/77eb9dd13fc762320e6e15900374e0819edd34a9/src/utils/index.ts#L11-L28) based on any fields you have in your form. 

It will parse either `URLSearchParams` or `JSON.parse()` based on whether there is a `"Content-Type": "application/json"` header. 

This function assumes the form will have the default `enctype=application/x-www-form-urlencoded`. 

## Showing success message without JS

1. Use a fragment link (`/example/#fragment`)
2. Have a dedicated success / error page

I think option 1 is most user expected, and it's done with CSS and a returning a redirect to `/form/#success` when the form is submitted without JS.

```html
<div id="success">Message sent!</div>
```
```css
#success {
	display: none;
}
#success:target {
	display: block;
}
```

## Structure of form

Can be anything you want obviously, but the trick to having it work as a ***progressive enhancement*** is using the form action and method properties. You'll also need to be sure to set the headers to properly so the function knows you're using Javascript to submit.

```html ins={2-3}
<form
	action="https://yourdomain.netlify.app/.netlify/functions/example"
	method="POST"
>
	<input type="email" name="email" />
	<input type="text" name="subject" />
	<textarea name="message" />
	<button type="submit">Send</button>
</form>
```

```js ins={3-5}
const response = await fetch(form.action, {
	method: "POST",
	headers: {
		"Content-Type": "application/json",
	},
	body: JSON.stringify(payload),
});
```

## Creating email HTML

Basically it's tables and inline css, [more info](https://www.smashingmagazine.com/2021/04/complete-guide-html-email-templates-tools/).

[React Email](https://react.email/) is quite nice honestly, it has a dev server and supports Tailwind CSS. I've created a work around for an issue with exporting the html directly, [react-email-export-workaround](https://github.com/OliverSpeir/react-email-export-workaround).

I've taken [React Email's Github Access Token clone email template](https://demo.react.email/preview/github-access-token.tsx?view=source&lang=markup) and edited the HTML directly a few times as well.

## Why netlify?

Netlify's free tier allows for commercial use (unlike vercel's) and the DX compared to AWS Lambda functions made it my go-to platform for serverless functions. I use it to host functions used by sites that aren't hosted on netlify as well.