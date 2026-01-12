# Email Error Fix Plan

## Problem
The error `535-5.7.8 username and password not accepted` is occurring on the career page submit, but the contact page works with the same credentials.

## Analysis
Both Contact and Career pages use the same `transporter` configuration in `server/routes.ts`:
- Contact endpoint: `/api/contact` - Works correctly
- Career endpoint: `/api/careers/apply` - Throws SMTP error

## Key Differences Found
1. **Contact page** wraps email sending in try/catch and continues even if email fails
2. **Career page** does not have proper error handling around the Promise.all for emails

## Solution
Update the career application endpoint to match the contact endpoint's error handling pattern - catch email errors and continue with success response (since the application is still saved to database).

## Steps
1. [ ] Add try/catch around Promise.all in career endpoint
2. [ ] Log email errors but don't fail the request
3. [ ] Test both endpoints work correctly

