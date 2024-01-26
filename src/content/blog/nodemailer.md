---
title: "Nodemailer"
description: "How to set up a serverless function that sends emails"
ogImage: "../../assets/imgs/nodemailer.png"
date: 2024-01-17T03:21:44Z
---

# Creating an endpoint that sends emails

The concept here is you have a contact form and you want to be able to send emails when someone submits this 

## Implementation options

1. Your function can return a redirect
2. Your function can return a 200 status 

If you want your form to work without javascript, you'll want to return a redirect (it can be that same url as your form, or with a #id)

## Serverless function

*As far as I am aware it is easiest to handle CORS yourself, but I could be wrong about this. If anyone has better ideas please reach out and I'll update this.*

### Overview of function:

1. CORS
2. Create `transporter` with nodemailer based on environmental variables
3. Send the email
4. Return either redirect or status 

### Example function

[nodemailer-netlify-example](https://github.com/OliverSpeir/nodemailer-netlify-example)

## Creating email HTML

Basically it's tables and inline css, [more info](https://www.smashingmagazine.com/2021/04/complete-guide-html-email-templates-tools/)

[React Email](https://react.email/) is quite nice honestly, it has a dev server and everything. I've created a work around for an issue with exporting the html directly, [react-email-export-workaround](https://github.com/OliverSpeir/react-email-export-workaround)

I've taken [React Email's Github Access Token clone email template](https://demo.react.email/preview/github-access-token.tsx) and edited the HTML directly a few times as well 

## Showing success message without JS

1. Use a fragment link (`/example/#fragment`)
2. Have a dedicated success page

I think option 1 is most user expected, and it's done with CSS

redirect to `/form/#success`

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