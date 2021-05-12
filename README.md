# Branded Chatbot Window

![version](https://img.shields.io/badge/version-1.5.3-blue)

A simple chatbot window written in React and based on `react-chat-window` that lets your connect with a chatbot endpoint and themize the appearance of the chat to fit a branding.

## Usage

Just include this snippet of code inside your HTML and set your configuration variables to communicate with your chatbot endpoint.

```javascript
window.chatbotSettings = {
  chatbotEndpoint: 'https://your-endpoint.here/webhooks/webhook_id',
  agentProfile: {
    teamName: 'Your bot name',
    teamExplanation: 'your bot short description'
  }
};

(function(){var w=window;var d=document;var l=function(){var x=d.getElementsByTagName('script')[0];var c=d.createElement('div');c.id='chatbotContainer';x.parentNode.insertBefore(c,x);var s=d.createElement('script');s.type='text/javascript';s.async=true;s.src='https://d1hbk1yt8xmke0.cloudfront.net/153/branded-chatbot-window.min.js';x.parentNode.insertBefore(s,x);};if(d.readyState==='complete'){l();}else if(w.attachEvent){w.attachEvent('onload',l);}else{w.addEventListener('load',l,false);}})();
```

## Configuration

|variable|type|required|description|
|:-------|:--:|:------:|:----------|
|`chatbotEndpoint`|`string`|yes|The endpoint you want to connect your chatbot to.|
|`agentProfile`|`object`|yes|Information about the chatbot visible to the users.|
|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`teamName`|`string`|yes|Visible chatbot name in the application.|
|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`teamExplanation`|`string`|No|Short description for your chatbot|
|`showEmoji`|`bool`|no|Whether or not to show the emoji button in the input bar. Defaults to `true`.|
|`showFileIcon`|`bool`|no|Whether or not to show the file button in the input bar. Defaults to `true`.|
|`userTimeout`|`integer`|no|Number of seconds until a new conversation is created. Defaults to `2147483647`|
|`isWebView`|`boolean`|no|Enable webchat for webview in apps. Defaults to `false`|

## Releasing new versions

If you want to publish a new version of the chatbot window to our CDN servers, you must configure an [IAM Access Keys](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_access-keys.html?icmpid=docs_iam_console) and populate your `.env` file with the provided `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_S3_BUCKET`.

> ### **IMPORTANT**
> Check that your `package.json` has a newer version number for the release!

Then just run the following command: `yarn release`
