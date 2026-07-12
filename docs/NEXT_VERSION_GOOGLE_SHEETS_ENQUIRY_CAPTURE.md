# Next Version: Google Sheets Enquiry Capture

## Goal

Capture structured checkout and corporate enquiry data in Google Sheets while keeping WhatsApp as the primary confirmation channel.

This is planned for the next version after the current WhatsApp-first revamp. It should not add an admin dashboard, database, payment gateway, or automatic purchase confirmation.

## Recommended Flow

1. User fills checkout or corporate enquiry form.
2. User reviews the enquiry details.
3. User clicks the WhatsApp confirmation button.
4. The app submits structured enquiry data to a server-side Google Sheets adapter.
5. The same enquiry ID appears in both Google Sheets and the WhatsApp message.
6. WhatsApp opens with the customer-ready confirmation message.

If Google Sheets submission fails, the user should still be able to continue to WhatsApp. The failure should be visible in logs for follow-up, but it should not block a sale.

## Why Google Sheets First

- Fast operational setup for Version 1.
- Easy for the owner to review orders without a custom admin dashboard.
- Keeps WhatsApp as the source of final confirmation.
- Avoids introducing Supabase/admin complexity before it is needed.
- Creates a useful source for manual invoice generation later.

## Proposed Architecture

- `src/features/orders/order-enquiry.ts`
  - Shared types and validation for order enquiry payloads.
  - Normalizes checkout data before delivery.

- `src/features/orders/actions.ts`
  - Server action or route handler for submitting an enquiry.
  - Calls the Google Sheets adapter.
  - Returns a recoverable status.

- `src/features/orders/google-sheets.ts`
  - Server-only Google Sheets adapter.
  - Reads credentials from environment variables.
  - Appends rows to the configured sheet.

- `src/lib/whatsapp.ts`
  - Continues to own WhatsApp message construction.
  - Include the same enquiry ID stored in Google Sheets.

## Suggested Sheet Columns

- `created_at`
- `enquiry_id`
- `source`
- `customer_name`
- `mobile_number`
- `delivery_address`
- `desired_date`
- `items_json`
- `subtotal`
- `delivery_fee`
- `total`
- `notes`
- `whatsapp_message_preview`
- `status`

Suggested initial status values:

- `new`
- `confirmed`
- `paid`
- `fulfilled`
- `cancelled`

## Privacy And Analytics

- Do not send customer names, phone numbers, addresses, notes, or free-text details to analytics.
- It is acceptable to send customer/order details to Google Sheets as operational order data, but the privacy policy should disclose this.
- Keep Google credentials server-only. Never expose them in client code.

## Environment Variables

Exact names can be finalized during implementation, but likely variables are:

- `GOOGLE_SHEETS_CLIENT_EMAIL`
- `GOOGLE_SHEETS_PRIVATE_KEY`
- `GOOGLE_SHEETS_SPREADSHEET_ID`
- `GOOGLE_SHEETS_ORDER_SHEET_NAME`

## Failure Handling

- If Sheets submission succeeds: open WhatsApp normally.
- If Sheets submission fails: open WhatsApp anyway and show a non-blocking message only if needed.
- Log the error server-side.
- Do not show raw Google API errors to customers.

## Invoice Follow-Up

Do not add a customer-facing invoice in this phase.

Later, invoices can be generated from:

- Google Sheets rows, manually or with Apps Script.
- A future admin dashboard if/when Supabase is introduced.

Use the label `Order Summary` before WhatsApp confirmation. Use `Invoice` only after Tiny Bitty confirms stock, schedule, and payment instructions.

## Implementation Checklist

- [ ] Define shared order enquiry payload type.
- [ ] Add server-side Google Sheets adapter.
- [ ] Add environment variable documentation to `.env.example`.
- [ ] Add submit action/route with recoverable failure handling.
- [ ] Wire checkout confirmation flow to submit the enquiry before opening WhatsApp.
- [ ] Add enquiry ID to both WhatsApp message and Google Sheets row.
- [ ] Add unit tests for payload normalization and adapter behavior.
- [ ] Add form flow tests for successful and failed Sheets submission.
- [ ] Update privacy copy if operational data capture is added.
- [ ] Run `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build`.

## Out Of Scope For This Phase

- Admin dashboard.
- Supabase database.
- Payment gateway.
- Automatic invoice issuing.
- Customer accounts.
- Order history pages.
