# Hosting ankitjk.com on AWS

`site.yaml` is a CloudFormation template that sets up everything the site
needs on AWS, as one stack in `us-east-1`:

- a private S3 bucket holding the built site (`web/dist/`)
- a CloudFront distribution serving it at ankitjk.com over HTTPS, with
  www.ankitjk.com redirecting to ankitjk.com
- the HTTPS certificate (from AWS Certificate Manager, or ACM)
- a role that GitHub Actions uses to upload new versions, signing in with
  GitHub's short-lived tokens instead of stored AWS keys
- a monthly cost budget that emails you if spending goes over

Once it's set up, `.github/workflows/deploy.yml` builds and publishes the
site on every push to `main`. The DNS stays at Porkbun.

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

This command won't finish on its own yet: the stack stops and waits at the
certificate until step 2 is done. Leave it running and open a second
terminal. If the command gives up waiting (it stops after about an hour),
that's fine: the stack keeps going in AWS, and you can watch it in the
CloudFormation console instead.

Brand-new AWS accounts are often not allowed to create CloudFront
distributions yet ("Your account must be verified before you can add new
CloudFront resources"). The fix is a free AWS Support case (category
**Account and billing**) asking for CloudFront access. Since the
distribution is only created after the certificate is validated, this would
show up as a rollback after step 2; follow "If it fails" below once AWS
replies.

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
certificate then shows as Issued, and the stack carries on to create the
CloudFront distribution, which takes another 5 to 15 minutes. The stack is
done when its status is `CREATE_COMPLETE`.

Keep these CNAME records forever: ACM uses them to renew the certificate
automatically each year.

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

Keep the validation CNAMEs at Porkbun. ACM normally gives the same
validation record for the same domain in the same account, so the new
certificate should validate on its own. If the stack waits at the
certificate for more than half an hour, check the records in step 2 again.

### 3. Read the stack's outputs

```sh
aws cloudformation describe-stacks --region us-east-1 \
  --stack-name ankitjk-site \
  --query 'Stacks[0].Outputs' --output table
```

You'll use all four values below:

- `DistributionDomainName`, like `d1234abcd.cloudfront.net`
- `DeployRoleArn`, `BucketName`, `DistributionId`

### 4. Set the GitHub repo variables

These tell the deploy workflow where to publish. They're repository
*variables*, not secrets: none of them gives access to anything on its own.

```sh
gh variable set AWS_ROLE_ARN --body 'DeployRoleArn value'
gh variable set S3_BUCKET --body 'BucketName value'
gh variable set CLOUDFRONT_DISTRIBUTION_ID --body 'DistributionId value'
```

Until `AWS_ROLE_ARN` is set, the deploy workflow skips itself.

### 5. Publish the site for the first time

```sh
gh workflow run deploy.yml --ref main
gh run watch
```

From now on, every push to `main` (each merged pull request) deploys
automatically. You can check it worked at the `DistributionDomainName`
address (`https://d1234abcd.cloudfront.net`) before changing DNS.

### 6. Point ankitjk.com at CloudFront

At Porkbun, on the same DNS page as step 2:

1. **Delete Porkbun's default parking records.** New domains usually come
   with an ALIAS record for the bare domain and a CNAME for `*` (and sometimes
   `www`), both pointing at `pixie.porkbun.com`. Delete those. Leave any MX
   or TXT records alone; those are for email. Don't touch the `_...` ACM
   records from step 2.
2. Add **Type** ALIAS, **Host** blank, **Answer** the
   `DistributionDomainName` value.
3. Add **Type** CNAME, **Host** `www`, **Answer** the same value.

Within a few minutes (up to an hour while old records expire),
https://ankitjk.com should show the site and https://www.ankitjk.com should
redirect to it.

### 7. Check the budget alert

AWS Budgets emails the address directly, so unlike some AWS alerts there's
no confirmation email to click. To confirm it's set up, open **Billing and
Cost Management > Budgets** in the AWS console: `ankitjk-site-monthly`
should be listed with your email under its alerts. It emails you when the
month's spending passes 80% of the budget, and when AWS forecasts it will go
over. Check your spam folder the first time one is expected.

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
- An AWS account can have only one GitHub sign-in provider
  (`token.actions.githubusercontent.com`). If another stack ever needs one,
  it has to reuse the one this stack creates.
