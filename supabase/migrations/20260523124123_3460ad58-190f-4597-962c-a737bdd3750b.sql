DELETE FROM public.reservations WHERE user_id IS NULL;
ALTER TABLE public.reservations ALTER COLUMN user_id SET NOT NULL;