-- Fix app_settings RLS policy to allow admins identified either by auth_id or email

DROP POLICY IF EXISTS "app_settings_update_admin_only" ON app_settings;
CREATE POLICY "app_settings_update_admin_only" ON app_settings
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.role = 'ADMIN'
        AND (
          (u.auth_id IS NOT NULL AND u.auth_id = auth.uid())
          OR (
            u.auth_id IS NULL
            AND lower(u.email) = lower(COALESCE(auth.jwt() ->> 'email', ''))
          )
        )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.role = 'ADMIN'
        AND (
          (u.auth_id IS NOT NULL AND u.auth_id = auth.uid())
          OR (
            u.auth_id IS NULL
            AND lower(u.email) = lower(COALESCE(auth.jwt() ->> 'email', ''))
          )
        )
    )
  );
