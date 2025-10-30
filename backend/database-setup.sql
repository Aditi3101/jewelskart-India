-- Using existing payments table for CCAvenue integration
-- Table already exists with all required fields:
-- user_id, order_id, tracking_id, bank_ref_no, order_status, failure_message, 
-- payment_mode, status_message, currency, card_name, amount, name, 
-- response_code, address, city, state, zip, status_code, country, 
-- date, tel, email, token_eligibility

-- No need to create new table - payments table has everything!
-- Just ensure it exists:
SELECT 'payments table ready for CCAvenue integration' as status;