# Branded Chatbot Window

![version](https://img.shields.io/badge/version-1.1.1-blue)

A simple chatbot window written in React and based on `react-chat-window` that lets your connect with a chatbot endpoint and themize the appearance of the chat to fit a branding.

## Usage

Just include this snippet of code inside your HTML and set your configuration variables to communicate with your chatbot endpoint.

```javascript
window.chatbotSettings = {
  chatbotEndpoint: 'https://your-endpoint.here/webhooks/webhook_id',
  agentProfile: {
    teamName: 'Your team name',
    imageUrl: 'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png'
  },
  theme: {
    brandColor: 'magenta'
  }
};

(function(){var w=window;var d=document;var l=function(){var x=d.getElementsByTagName('script')[0];var c=d.createElement('div');c.id='chatbotContainer';x.parentNode.insertBefore(c,x);var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://d1hbk1yt8xmke0.cloudfront.net/111/branded-chatbot-window.min.js';x.parentNode.insertBefore(s,x);};if(d.readyState==='complete'){l();}else if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}})();
```

## Configuration

|variable|type|required|description|
|:-------|:--:|:------:|:----------|
|`chatbotEndpoint`|`string`|yes|The endpoint you want to connect your chatbot to.|
|`agentProfile`|`object`|yes|Information about the chatbot visible to the users.|
|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`teamName`|`string`|yes|Visible chatbot name in the application.|
|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`imageUrl`|`string`|yes|An avatar for your chatbot.|
|`theme`|`object`|no|Object for customising your chatbot.|
|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`brandColor`|`string`||A base color to change header, buttons, and messages `background-color`.|
|`showEmoji`|`bool`|no|Whether or not to show the emoji button in the input bar. Defaults to `true`.|

## Releasing new versions

If you want to publish a new version of the chatbot window to our CDN servers, you must configure an [IAM Access Keys](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html?icmpid=docs_iam_console) and populate your `.env` file with the provided `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_S3_BUCKET`.

> ### **IMPORTANT**
> Check that your `package.json` has a newer version number for the release!

Then just run the following command: `yarn release`
