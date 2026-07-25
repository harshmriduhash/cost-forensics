-- Allow authenticated users to insert and delete their own recommendations (needed for AI generation, dismiss, and manual notes)
CREATE POLICY "insert own recs" ON public.recommendations FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "delete own recs" ON public.recommendations FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Add notes column for user-authored context on a recommendation
ALTER TABLE public.recommendations ADD COLUMN IF NOT EXISTS notes text;