## CABS - Cloudfront Authorization@edge BallotShield

Note: please refer to the [upstream repo](https://github.com/aws-samples/cloudfront-authorization-at-edge) for a great explanation of what all this does. 

### What does all of this do?

Mostly, nothing. This is a forked AWS Repo that builds infrastructure to authenticate against for a CloudFront distribution. 

BUT: Currently the only thing in here that is used is the code for the Lambda functions. _Everything else_ has already been migrated to Terraform, and now lives in the Infrastructure repository. 

### How to compile the Lambda functions

As mentioned [here](https://github.com/aws-samples/cloudfront-authorization-at-edge#deployment), essentially just run `npm install` for the first time and `npm run build` and it will create the appropriate files in the src folders. As it stands, the only files that are deployed out of this repository are:

```
└── lambda-edge
    ├── check-auth
    │   ├── bundle.js
    │   ├── configuration.json
    │   └── package.json
    ├── http-headers
    │   ├── bundle.js
    │   ├── configuration.json
    │   └── package.json
    ├── parse-auth
    │   ├── bundle.js
    │   ├── configuration.json
    │   └── package.json
    ├── refresh-auth
    │   ├── bundle.js
    │   ├── configuration.json
    │   └── package.json
    └── sign-out
        ├── bundle.js
        ├── configuration.json
        └── package.json
```