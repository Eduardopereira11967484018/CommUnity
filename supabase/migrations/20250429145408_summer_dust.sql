/*
  # Update authentication and authorization policies

  1. Changes
    - Update profiles policies to allow authenticated users to insert their own profile
    - Update communities policies to allow authenticated users to view and create communities
    - Update community_members policies to allow authenticated users to manage their memberships
  
  2. Security
    - Maintain RLS while making resources accessible to authenticated users
    - Ensure users can only modify their own data
*/

-- Update profiles policies
CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Update communities policies to be more permissive for authenticated users
DROP POLICY IF EXISTS "Communities are viewable by everyone" ON communities;
CREATE POLICY "Communities are viewable by authenticated users" ON communities
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can create communities" ON communities;
CREATE POLICY "Any authenticated user can create communities" ON communities
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- Update community members policies
DROP POLICY IF EXISTS "Community members are viewable by everyone" ON community_members;
CREATE POLICY "Community members are viewable by authenticated users" ON community_members
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can join communities" ON community_members;
CREATE POLICY "Any authenticated user can join communities" ON community_members
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);