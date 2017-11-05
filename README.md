# Hound
## A (very) simple tracking server

### `tl;dr`
Hound tracks clicks of links and gives also tracking pixels. 
Hound can be installed and run directly after handling config.json

#### Installation
`npm install -g houndtrack`
You then just need to set up the `config.json` file in the installation directory.

`hound` will launch hound.

### Hound ?

#### What is Hound ? 
Hound is a mini tracking server, capable of handling some analytics (think Google Analytics) and to some extent, tracking pixels.

#### What should I know before using Hound ?
You should have some knowledge on web analytics. If you got here for some reason, I would think you do. 

However, I'm going to explain how to use Hound here :

#### How to use Hound ?

First of all:
* Hound is intended for developers and handy users
* The most difficult about Hound is that it does not have a user interface

Now that that's out of the way :

* Hound gets analytics from URLs and redirects
* Hound gets analytics from Tracking Pixels
* Hound works via Campaigns and Tracking Pixels linked to Campaings (think Google Analytics)

If you are not a developer or don't know how to call an API, please reach to someone who does, or simply use Google Analytics.
Hound is intended for micro-analytics, like link sending, not website tracking.

## Elemental Notions

### Campaign
A Campaign, or Analytics Campaign, or Tracking Campaign, is a timeframe where you need analytics to be collected for some resource.

You can think of a campaign as the advertising of a new product:
* The campaign would be a time where you place ads of your product
* Your ads are tracked (campaign, source, medium)
* You know where users clicked the most and saw your ad

### Tracking Pixel
A tracking pixel is a small image (1px * 1px, hence the name) that is requested along with some data. This allows the server to
link the image to a campaign and add analytics.

#### Why is a tracking pixel needed ?
Hound works via redirections. As I stated before, it's intended for link sharing more than website tracking. This means that user
interaction is needed (click). A Tracking Pixel is an embedded image requested by the browser, hence making the "same" request
the user would by clicking.

#### When do I need a tracking pixel ?
You would place tracking pixels on emails / websites / marketing-mails that will request it when opened.

### Campaing Analytics

#### Referrer
The referrer is the site where the user first found your link and clicked on it

#### Source
The source is where the campaign is coming from. You are free to set whatever you want, but here are some examples: 
`newsletter`, `marketing-email`, `affiliate`.

#### Medium
The campaign medium is how you are using your campaign: `review`, `pay-per-click`. You can set whatever you want.

## Simple explanation

Hound will give you links to track clicks and tracking pixels. These can trigger webhooks for you to receive events.
Hound also sets a cookie on the redirection link so it can track users. This cookie represents a user and will be available on all
links your domain holds. This means that you can cross check users between campaigns.

# API
Ok so you are ready to use the API ?

With the api you can create campaigns and tracking pixels. The latter must be linked to an exisiting campaign.

The api also offers some utility routes, that give you the link to send to your users when using redirects or tracking pixels.

And last but not least, the API offers simple analytics based on your campaigns.

## Creation

#### `POST`  /api/campaigns/new
* Creates a new Campaign
Parameters are

| Name | Required | Type | Description |
|:----:|:--------:|:----:|:-----------:|
|`id`| `true` | String | The id for the campaign (ex: 'MyCampaign') | 
|`redirect_uri`| `true` | `string` | The redirect uri your campaign will lead to. Not only is this required, but it's the most important part of Hound. (ex: `http://mysupersite.com`) |
|`name`| `false` | String | The name of your campaign (ex: 'My Campaign') |
|`description`| `false` | String | A simple description of yoour campaign |

##### Response
* Campaign

#### `POST` /api/pixels/new
* Creates a new Pixel

| Name | Required | Type | Description |
|:----:|:--------:|:----:|:-----------:|
|`id`| `true` | String | The id for the campaign (ex: 'MyCampaign') | 
| `campaign` | `true` | String | The id of the associated campaign |

##### Response
* Campaign

#### `POST` /api/webhook

* Creates a new webhook

| Name | Required | Type | Description |
|:----:|:--------:|:----:|:-----------:|
|`url`| `true` | String | The url that you need the webhook to call |

More info on this later.

## Data

#### `GET` /api/campaigns

Returns all current campaigns and RAW statistics

`Response`
```json
[
    {
        "id": "TestCampaign",
        "name": "Testing Campaign",
        "redir": "http://poulet.com",
        "description": "Plep",
        "analytics": [
            {
                "r": "facebook",
                "s": "HubSpot",
                "m": "",
                "e": null,
                "u": "3c8a3b2b-f5c1-f6db-9353-d3e98cc36ba5",
                "d": 1509799687227
            }
        ]
    }
]
```

#### `GET` /api/pixels

Returns all current pixels
`Response`
```json
[
    {
        "id": "TestPixel",
        "campaign": "TestCampaign",
        "analytics": []
    }
]
```

## Analytics

#### `GET` /api/analytics
Returns analytics on all current campaigns.

Analytics are pre-treated objects like so:
```json
	[{
        "id": "TestCampaign",
        "name": "Testing Campaign",
        "analytics": {
            "users": 8,
            "referrers": {
                "facebook": 5,
                "twitter": 3
            },
            "sources": {
                "HubSpot": 5,
                "AnotherSource": 3
            },
            "mediums": {
                "(N/A)": 8
            },
            "dates": {
                "1509799687227": 1,
                "1509799728758": 1,
                "1509799744348": 1,
                "1509799764043": 1,
                "1509799805303": 1,
                "1509800092448": 1,
                "1509800152808": 1,
                "1509800183146": 1
            }
        }
    }]
```

#### `GET` /api/analytics/{id}

Returns analytics on given campaign id.

#### `GET` /api/analytics/pixels

Returns analytics on all current pixels. For the time being alias of `GET` `api/pixels`.

#### `GET` /api/analytics/pixels/{id}

Returns analytics for given pixel id.

## Utility methods

#### `GET` /api/campaigns/{id}

Returns link to campaign with given `query` parameters .

| Name | Required | Type | Description |
|:----:|:--------:|:----:|:-----------:|
|`referrer`| false | String| The referrer for analytics, ex: `facebook`, `linkedin`|
|`source`| false | String| The source for your campaign analytics|
|`medium`| false | String| The medium for your campaign analytics|
|`extra`| false | String| Some extra information you would like to add|
|`redir_fallback`| false | String| An redirection fallback url in case all fails|

#### `GET` /api/pixels/{id}

Returns link to tracking pixel with given query parameters. These all are the same than `GET` `/api/campaigns/{id}`

## Webhook

Webhooks are triggered by events. In this case, a click or tracking pixel action.

You will receive data concerning the event, as well as the event name, beign `link_clicked` or `tracking_pixel`.