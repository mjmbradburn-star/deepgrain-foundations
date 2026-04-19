alter table public.enquiries
  add constraint enquiries_name_len check (char_length(name) between 1 and 200),
  add constraint enquiries_email_len check (char_length(email) between 3 and 320),
  add constraint enquiries_org_len check (organisation is null or char_length(organisation) <= 200),
  add constraint enquiries_size_len check (size is null or char_length(size) <= 50),
  add constraint enquiries_message_len check (char_length(message) between 1 and 5000);