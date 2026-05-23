# Email Setup Guide - CarDefiner

This guide explains how the email notification system works and how to test it.

## 📧 Email System Overview

Your application now has a complete email notification system with two main triggers:

### 1. **Form Submission Email** (When user fills out the form and clicks "Next")
- **Recipient:** Admin email (cardefiner@gmail.com)
- **Content:** Vehicle report request details from the form
- **Endpoint:** `/api/send-report-request`
- **Triggered by:** User submitting the vehicle information form

### 2. **Payment Completion Emails** (When payment is successful)
- **To Admin:** Payment success notification with transaction details
- **To Customer:** Order confirmation email with instructions
- **Endpoint:** `/api/orders/complete`
- **Triggered by:** Payment completion (requires webhook setup)

---

## ✅ Current Configuration

### Gmail SMTP Settings
Your `.env.local` file has been configured with the following Gmail credentials:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=cardefiner@gmail.com
SMTP_PASS=jrci zrox clwb iner
EMAIL_FROM="CarDefiner <cardefiner@gmail.com>"
ADMIN_EMAIL=cardefiner@gmail.com
```

These credentials are using Google's App Password feature, which is required for SMTP access to Gmail.

---

## 🔄 Order Creation Flow

When a user submits the form and selects a plan:

1. **Order is created** in the database with status "pending"
   - Order ID is generated
   - Customer email, vehicle info, and package details are stored
   
2. **Admin notification email is sent**
   - Contains customer details and order ID
   - Sent to: `cardefiner@gmail.com`
   
3. **User is redirected to Stripe payment**
   - Order ID is stored in browser session
   - User completes payment on Stripe

4. **After payment (REQUIRES WEBHOOK)** 
   - Payment completion triggers email notifications
   - Both admin and customer receive emails

---

## 🚀 Setting Up Stripe Webhook (IMPORTANT!)

For payment confirmation emails to be sent automatically, you need to set up a Stripe webhook.

### Steps:
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers > Webhooks**
3. Click **Add endpoint**
4. **Endpoint URL:** `https://cardefiner.com/api/webhooks/stripe` (replace with your domain)
5. **Select events:**
   - `checkout.session.completed`
6. Click **Add endpoint**
7. Copy the **Signing Secret** and add it to your `.env.local`:

```
STRIPE_WEBHOOK_SECRET=whsec_...
```

### What happens when webhook is triggered:
- Stripe sends a POST request to your endpoint when payment is completed
- Your app receives the payment confirmation
- Order status is updated to "completed"
- Admin and customer confirmation emails are sent automatically

---

## 🧪 Testing the Email System

### Option 1: Test Form Submission Email (No Payment Required)

1. Open your app and click "Get Report" button
2. Fill in the vehicle form:
   - Vehicle Type: `Car`
   - VIN/Plate: Any value
   - Email: `test@example.com`
   - Country: Your location
3. Click "Next"
4. **Expected:** Admin email is sent immediately to `cardefiner@gmail.com`
5. Check the email inbox for the notification

### Option 2: Test Payment + Confirmation Emails (Manual)

Once you complete a Stripe payment:

1. **Get the Order ID** from the database or check your logs
   - When the form is submitted, the order ID is printed in console logs
   
2. **Manually trigger the completion email** using API:

```bash
curl -X POST https://cardefiner.com/api/orders/complete \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "YOUR_ORDER_ID",
    "paymentId": "stripe_payment_id"
  }'
```

3. **Expected:** Both admin and customer emails are sent

### Option 3: Monitor Email Delivery

Check the email delivery status in your database:

```sql
SELECT * FROM email_outbox WHERE created_at > NOW() - INTERVAL 1 HOUR;
SELECT * FROM email_failures;
```

---

## 📧 Email Templates

### Form Submission Email
**Subject:** `New Vehicle Report Request - [Vehicle Type]`

**Content includes:**
- Customer email
- Vehicle type
- VIN/Plate number
- Selected package
- Price and currency
- Country
- Order ID (if available)

### Payment Confirmation (Admin)
**Subject:** `Payment Successful! - [Order Number]`

**Content includes:**
- Payment status
- Transaction ID
- Product details
- Amount paid
- Customer information
- VIN of the vehicle

### Payment Confirmation (Customer)
**Subject:** `Order Confirmed: Your Report is processing! [Order Number]`

**Content includes:**
- Order confirmation
- Amount paid
- Wait time notice (12-13 hours for report)
- Instructions to check the order

---

## 🔧 Troubleshooting

### Emails Not Being Sent?

1. **Check Gmail credentials:**
   - Make sure SMTP_USER and SMTP_PASS are correct
   - Verify Gmail App Password is being used (not regular password)
   
2. **Check SMTP configuration:**
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=465
   SMTP_SECURE=true
   ```

3. **Check database email tables:**
   ```sql
   SELECT * FROM email_outbox LIMIT 10;
   SELECT * FROM email_failures LIMIT 10;
   ```

4. **Enable Less Secure App Access (if needed):**
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Scroll to "Less secure app access"
   - If using App Password, this shouldn't be needed

5. **Test SMTP connection manually:**
   ```bash
   # Test with telnet or mail service tools
   telnet smtp.gmail.com 465
   ```

### Payment Emails Not Triggering?

1. **Stripe webhook not set up:**
   - Follow the "Setting Up Stripe Webhook" section above
   - Test webhook delivery in Stripe Dashboard
   
2. **Order not being created:**
   - Check browser console for errors
   - Check server logs for order creation failures
   
3. **Database not receiving payment data:**
   - Verify database connection is working
   - Check orders table has the right schema

---

## 📋 Summary of Endpoints

| Endpoint | Method | Purpose | Sends Email |
|----------|--------|---------|-----------|
| `/api/send-report-request` | POST | Process form submission | Yes (Admin) |
| `/api/orders/create` | POST | Create order | No |
| `/api/orders/complete` | POST | Mark order as complete | Yes (Both) |
| `/api/send-email` | POST | Send any email type | Yes |

---

## 🎯 Next Steps

1. ✅ **Gmail SMTP is configured** - Ready for sending
2. ⏳ **Set up Stripe webhook** - For automatic payment confirmations
3. 🧪 **Test form submission** - Verify admin emails are received
4. ✅ **Test payment flow** - Confirm customer gets confirmation emails
5. 📊 **Monitor email delivery** - Check email_outbox and email_failures tables regularly

---

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review application logs for error messages
3. Verify all environment variables are set correctly
4. Test individual endpoints with curl or Postman
