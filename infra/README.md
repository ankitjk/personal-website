# Hosting ankitjk.com on AWS

`site.yaml` is a CloudFormation template that sets up everything the site
needs on AWS, as one stack in `us-east-1`:

- a private S3 bucket holding the built site (`web/dist/`)
- a CloudFront distribution serving it over HTTPS at CloudFront's own
  address (like `d1234abcd.cloudfront.net`) and, once the stack has a
  domain, at ankitjk.com, with www.ankitjk.com redirecting to ankitjk.com
- once there's a domain, its HTTPS certificate (from AWS Certificate
  Manager, or ACM)
- a role that GitHub Actions uses to upload new versions, signing in with
  GitHub's short-lived tokens instead of stored AWS keys
- a monthly cost budget that emails you if spending goes over

Once it's set up, `.github/workflows/deploy.yml` builds and publishes the
site on every push to `main`. With a domain, its DNS stays at Porkbun.

## Two ways to deploy

- **Without a domain.** The site goes live at the CloudFront address
  (the `DistributionDomainName` output, like `d1234abcd.cloudfront.net`).
  There's no certificate to validate and nothing to do at Porkbun. This is
  "First-time setup" below, as written.
- **With a domain.** The site is also served at the domain, with a
  certificate for it and www redirecting to it. You can add a domain to
  the stack at any time, following "Adding a domain" below. Nothing else
  is replaced: the bucket, distribution, role and GitHub variables all
  stay the same, and the CloudFront address keeps working.

The domain is the stack's `DomainName` parameter. It's empty by default,
which means no domain.

## First-time setup

You'll need the AWS CLI signed in to the new account as an administrator,
and the `gh` CLI signed in to GitHub. Run the commands from the repo root.

There are two good ways to be signed in to AWS as an administrator:

- **An IAM Identity Center user** with admin access: run
  `aws configure sso` once and follow the prompts, then add
  `--profile PROFILE_NAME` to the `aws` commands below (or set
  `AWS_PROFILE`).
- **AWS CloudShell**: sign in to the AWS console, switch to N. Virginia
  (us-east-1), open CloudShell, and upload `infra/site.yaml` through its
  Actions menu. Then use `--template-file site.yaml` in step 1. The `gh`
  steps still run on your own computer.

Never create access keys for the root user (the email you signed up with).
They can do anything in the account and can't be limited.

### 1. Create the stack

```sh
aws cloudformation deploy \
  --region us-east-1 \
  --stack-name ankitjk-site \
  --template-file infra/site.yaml \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides AlertEmail=YOUR_EMAIL
```

Replace `YOUR_EMAIL` with the address that should get cost alerts. It's
stored in the stack in AWS, not in this repo. The budget is $5 a month; add
`MonthlyBudgetUsd=10` (or any amount) after the email to change it.

`CAPABILITY_NAMED_IAM` is you agreeing that the stack creates an IAM role
with a fixed name (`ankitjk-site-github-deploy`).

Creating the CloudFront distribution takes most of the time, usually 5 to
15 minutes. The stack is done when its status is `CREATE_COMPLETE`.

To start with a domain straight away, add `DomainName=ankitjk.com` after
the email. The command then won't finish on its own: the stack stops and
waits at the certificate until you've done step 2 of "Adding a domain"
below. Leave it running and do that in a second terminal, then step 3
there once the stack is done. If the command gives up waiting (it stops
after about an hour), that's fine: the stack keeps going in AWS, and you
can watch it in the CloudFormation console instead.

Brand-new AWS accounts are often not allowed to create CloudFront
distributions yet ("Your account must be verified before you can add new
CloudFront resources"). The fix is a free AWS Support case (category
**Account and billing**) asking for CloudFront access. This shows up as a
rollback within a few minutes (or, with a domain, after the certificate is
validated); follow "If it fails" below once AWS replies.

### If it fails

If anything fails while the stack is first being created, CloudFormation
undoes everything it made and the stack ends in `ROLLBACK_COMPLETE`.
Running step 1 again then fails with "ROLLBACK_COMPLETE state and can not
be updated". To recover:

1. Find out what went wrong: on the stack's **Events** tab in the
   CloudFormation console, look for the first `CREATE_FAILED` event (the
   earliest one; later failures are usually knock-on effects). Its status
   reason says why.
2. Fix the cause, then delete the failed stack and wait for it to go:

   ```sh
   aws cloudformation delete-stack --region us-east-1 \
     --stack-name ankitjk-site
   aws cloudformation wait stack-delete-complete --region us-east-1 \
     --stack-name ankitjk-site
   ```

3. Run step 1 again.

If you gave a domain, keep the validation CNAMEs at Porkbun. ACM normally
gives the same validation record for the same domain in the same account,
so the new certificate should validate on its own. If the stack waits at
the certificate for more than half an hour, check the records in step 2 of
"Adding a domain" again.

### 2. Read the stack's outputs

```sh
aws cloudformation describe-stacks --region us-east-1 \
  --stack-name ankitjk-site \
  --query 'Stacks[0].Outputs' --output table
```

You'll use these values below:

- `SiteUrl`, where the site is: the CloudFront address
  (`https://d1234abcd.cloudfront.net`), or with a domain,
  `https://ankitjk.com`
- `DistributionDomainName`, like `d1234abcd.cloudfront.net`
- `DeployRoleArn`, `BucketName`, `DistributionId`

With a domain there's also `WwwUrl`, the www address that redirects to
`SiteUrl`.

### 3. Set the GitHub repo variables

These tell the deploy workflow where to publish. They're repository
*variables*, not secrets: none of them gives access to anything on its own.

```sh
gh variable set AWS_ROLE_ARN --body 'DeployRoleArn value'
gh variable set S3_BUCKET --body 'BucketName value'
gh variable set CLOUDFRONT_DISTRIBUTION_ID --body 'DistributionId value'
```

Until `AWS_ROLE_ARN` is set, the deploy workflow skips itself.

### 4. Publish the site for the first time

```sh
gh workflow run deploy.yml --ref main
gh run watch
```

From now on, every push to `main` (each merged pull request) deploys
automatically. The site is at the `DistributionDomainName` address
(`https://d1234abcd.cloudfront.net`). With a domain, check it there before
changing DNS.

### 5. Check the budget alert

AWS Budgets emails the address directly, so unlike some AWS alerts there's
no confirmation email to click. To confirm it's set up, open **Billing and
Cost Management > Budgets** in the AWS console: `ankitjk-site-monthly`
should be listed with your email under its alerts. It emails you when the
month's spending passes 80% of the budget, and when AWS forecasts it will go
over. Check your spam folder the first time one is expected.

## Adding a domain

Once you own a domain (the steps use ankitjk.com; use your own if it's
different, without `www.` or `https://`), add it to the stack you already
have. If you gave the domain in step 1 of the first-time setup, skip to
step 2 here.

### 1. Update the stack with the domain

```sh
aws cloudformation deploy \
  --region us-east-1 \
  --stack-name ankitjk-site \
  --template-file infra/site.yaml \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides DomainName=ankitjk.com
```

The other parameters (like `AlertEmail`) keep their current values. This
creates the certificate, then adds the domain and its www address to the
distribution and turns on the www redirect, all in place: the site keeps
working at the CloudFront address the whole time, and the GitHub variables
don't change.

Like a first deploy with a domain, this command won't finish on its own:
the stack waits at the certificate until step 2 is done. Leave it running
and open a second terminal. If the command gives up waiting, the update
keeps going in AWS; watch it in the CloudFormation console.

If the update fails, CloudFormation puts the stack back the way it was,
without a domain, and it ends in `UPDATE_ROLLBACK_COMPLETE`. The site
keeps working at the CloudFront address. Find the first `UPDATE_FAILED`
event on the stack's **Events** tab, fix the cause, and run this step
again; there's no need to delete anything.

### 2. Prove you own the domain (certificate validation)

ACM won't issue the certificate until it sees a special CNAME record in
the domain's DNS. There's one for ankitjk.com and one for www.ankitjk.com
(sometimes they're the same record). Find them in any of these places:

- **CloudFormation console** (region N. Virginia / us-east-1): open the
  `ankitjk-site` stack, then the **Events** tab. The `Certificate` row says
  "Content of DNS Record is: {Name: ..., Type: CNAME, Value: ...}".
- **ACM console** (us-east-1): open the pending certificate; the
  **Domains** section lists the CNAME name and value for each domain.
- **Command line**:

  ```sh
  aws acm list-certificates --region us-east-1
  aws acm describe-certificate --region us-east-1 \
    --certificate-arn ARN_FROM_THE_LIST \
    --query 'Certificate.DomainValidationOptions[].ResourceRecord'
  ```

Each record looks like this (made-up values):

- Name: `_3f1c2e9a7b.ankitjk.com.`
- Value: `_8d4b6a1f0c.xlfgrmvvlj.acm-validations.aws.`

Add each one at Porkbun:

1. Sign in, go to **Domain Management**, and click **DNS** next to
   ankitjk.com.
2. Add a record: **Type** CNAME, **Host** the name *without* the
   `.ankitjk.com.` ending (here `_3f1c2e9a7b`, since Porkbun adds the domain
   itself), **Answer** the value, and leave the TTL as it is.
3. Save.

Validation usually takes a few minutes, sometimes up to half an hour. The
certificate then shows as Issued, and the stack carries on to set up the
CloudFront distribution with the domain, which takes another 5 to 15
minutes. The stack is done when its status is `UPDATE_COMPLETE` (or
`CREATE_COMPLETE` if you gave the domain when first creating it).

Keep these CNAME records forever: ACM uses them to renew the certificate
automatically each year.

### 3. Point ankitjk.com at CloudFront

At Porkbun, on the same DNS page as step 2:

1. **Delete Porkbun's default parking records.** New domains usually come
   with an ALIAS record for the bare domain and a CNAME for `*` (and sometimes
   `www`), both pointing at `pixie.porkbun.com`. Delete those. Leave any MX
   or TXT records alone; those are for email. Don't touch the `_...` ACM
   records from step 2.
2. Add **Type** ALIAS, **Host** blank, **Answer** the
   `DistributionDomainName` value (it's the same as before the domain was
   added).
3. Add **Type** CNAME, **Host** `www`, **Answer** the same value.

Within a few minutes (up to an hour while old records expire),
https://ankitjk.com should show the site and https://www.ankitjk.com should
redirect to it.

## Changing the AWS setup later

The deploy workflow only publishes the site; it never changes the AWS
resources. To change those:

1. Edit `infra/site.yaml` in a pull request like any other change.
2. Once it's merged, preview what would change:

   ```sh
   aws cloudformation deploy \
     --region us-east-1 \
     --stack-name ankitjk-site \
     --template-file infra/site.yaml \
     --capabilities CAPABILITY_NAMED_IAM \
     --no-execute-changeset
   ```

   This prints a command to see the change set. Look especially for
   anything marked as **Replacement**, which means a resource is deleted
   and made again.
3. Run the same command without `--no-execute-changeset` to apply it.

Parameters you leave out (like `AlertEmail`) keep their current values. To
change one, add `--parameter-overrides Name=value`.

## Notes

- Paths without a file extension (`/about`, `/projects/genmodel`) are pages
  of the React app, so CloudFront serves `index.html` for them and
  react-router shows the right page. A missing file (like `/nope.png`) gets
  a real 404 showing the site's "Page not found" page. A made-up page
  address (like `/nope`) also shows "Page not found", but with status 200,
  since CloudFront can't know which page addresses the app has.
- The response headers use AWS's managed security headers policy, which has
  no Content-Security-Policy: a strict one would block the small inline
  script in `web/index.html` that applies dark mode before the page draws.
- Without a domain, the CloudFront address uses CloudFront's own
  certificate, which can't be limited to newer TLS versions the way the
  domain's certificate is (TLS 1.2 or newer). Browsers use TLS 1.2 or 1.3
  anyway.
- An AWS account can have only one GitHub sign-in provider
  (`token.actions.githubusercontent.com`). If another stack ever needs one,
  it has to reuse the one this stack creates.
