---
title: "Creating an endpoint that sends emails"
description: "How to set up a serverless function that sends emails and use it on a static website"
ogImage: "../../assets/imgs/nodemailer.png"
date: 2024-01-17T03:21:44Z
---

The concept here is you have a static site with a contact form, and you want to be able to have your contact form send an email when it is submitted.

One solution is to use [nodemailer](https://www.nodemailer.com/) to send the emails. This post will outline using a serverless function to accomplish this. This function will be a [progressive enhancement](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement) meaning it will work with or without javascript.

See [alternative methods](#alternatives) for other options.

:::note
This example uses Gmail as the SMTP, but it is possible to have your domain blacklisted by using workspaces like this, either use an actual Gmail address, or another SMTP.
:::


## Contents

## Serverless function

_As far as I am aware it is easiest to handle CORS yourself (instead of API gateway), but I could be wrong about this. If anyone has better ideas please reach out and I'll update this._

This function is set up for netlify but netlify just uses AWS Lambda functions, just like vercel, so it could be easily hosted on any of the three.

### Overview of function

1. Handle CORS / Block origins
2. Create `transporter` with nodemailer based on environmental variables
3. Parse the body of the POST request and optionally validate some fields
4. Send the email
5. Return either redirect or json depending on if JS is used to submit the form

### Example function

[nodemailer-netlify-example](https://github.com/OliverSpeir/nodemailer-netlify-example), this function takes about 1 second to execute.

Validation with [validator.js isEmail](https://github.com/validatorjs/validator.js/tree/master) and it set up to easily add [your own validatio rules](https://github.com/OliverSpeir/nodemailer-netlify-example/blob/77eb9dd13fc762320e6e15900374e0819edd34a9/src/utils/index.ts#L11-L28) based on any fields you have in your form.

It will parse either `URLSearchParams` or `JSON.parse()` based on whether there is a `"Content-Type": "application/json"` header.

This function assumes the form will have the default `enctype=application/x-www-form-urlencoded`.

## Showing success message without JS

1. Use a fragment link (`/example/#fragment`)
2. Have a dedicated success / error page

I think option 1 is what most users expect, and it's done with CSS and a returning a redirect to `/form/#success` when the form is submitted without JS.

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

Can be anything you want obviously, but the trick to having it work as a **_progressive enhancement_** is using the form action and method properties. You'll also need to be sure to set the headers to properly so the function knows you're using Javascript to submit.

```html ins={2-3}
<form action="https://yourdomain.netlify.app/.netlify/functions/example" method="POST">
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

I've taken [React Email's clone of Github Access Token](https://demo.react.email/preview/github-access-token.tsx?view=source&lang=markup) and edited the HTML directly a few times as well. It's not a bad experience, you can use liveserver to preview it.

## Why netlify?

Netlify's free tier allows for commercial use (unlike vercel's) and the DX compared to AWS Lambda functions made it my go-to platform for serverless functions. I use it to host functions used by sites that aren't hosted on netlify as well.∏

## Alternatives

For SMTP I personally use [Proton](https://proton.me/) and have heard [MxRoute](https://mxroute.com/) has a good lifetime purchase option for low volume.

If you are using Astro's [hybrid/server output](https://docs.astro.build/en/guides/server-side-rendering/) instead of a purely static build, and deploying to either netlify or vercel, you can use nodemailer in an api route inside your project. This will allow you not to worry about CORS and simplify things in general.

If you are deploying to Cloudflare [MailChannels](https://developers.cloudflare.com/pages/functions/plugins/mailchannels) is an option, see this [blog post](https://support.mailchannels.com/hc/en-us/articles/4565898358413-Sending-Email-from-Cloudflare-Workers-using-MailChannels-Send-API) for more details.

Another very common solution to this problem, is using a service like [Sendgrid](https://sendgrid.com/), which has a good free tier, or [Amazon SES](https://aws.amazon.com/ses/) where you pay for what you use. [Web3Forms](https://web3forms.com/) also offers a great free tier. These services will allow you to send email via an API without having to use SMTP directly.

This function could also serve useful if you're using a service that provides an API and you'd like to do some validation or protect your API key, and if you do this just skip the nodemailer parts and send a fetch request instead.
