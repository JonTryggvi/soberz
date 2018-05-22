--  trigger for uppdating user when a pending row is created in the sponsor_inquiries table

CREATE TRIGGER update_pending_users AFTER INSERT ON sponsor_inquiries
BEGIN
UPDATE Users
SET pending_sponsor_request = json_insert(pending_sponsor_request,"$["|| json_array_length(pending_sponsor_request) || "]", NEW.sponsor_inquiries_id)
WHERE id = NEW.who_is_asked;
UPDATE Users
SET sent_sponsor_request = json_insert(sent_sponsor_request, "$[" || json_array_length(sent_sponsor_request) || "]", NEW.sponsor_inquiries_id)
WHERE id = NEW.who_is_asking;
END;



-- make shure that if a pending_sponser row exists with the same user id's betwwen asking and asked we will ignore that instanse
CREATE UNIQUE index uniq_request ON sponsor_inquiries ( who_is_asking, who_is_asked ) 
