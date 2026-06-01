-- PTR Phase 1 Initial Schema
-- Migration: 001_initial_schema.sql

-- =========================================================
-- TABLES
-- =========================================================

CREATE TABLE users (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username    text NOT NULL,
  avatar_url  text,
  created_at  timestamptz DEFAULT now()
);

CREATE TABLE servers (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  icon_url    text,
  owner_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at  timestamptz DEFAULT now()
);

CREATE TABLE server_members (
  server_id   uuid NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role        text NOT NULL DEFAULT 'member'
                CHECK (role IN ('owner', 'admin', 'member')),
  joined_at   timestamptz DEFAULT now(),
  PRIMARY KEY (server_id, user_id)
);

CREATE TABLE channels (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id   uuid NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  name        text NOT NULL,
  type        text NOT NULL DEFAULT 'text'
                CHECK (type IN ('text', 'watch', 'voice', 'music')),
  position    integer DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);

CREATE TABLE channel_presence (
  channel_id  uuid NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at   timestamptz DEFAULT now(),
  PRIMARY KEY (channel_id, user_id)
);

CREATE TABLE messages (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id  uuid NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content     text NOT NULL,
  created_at  timestamptz DEFAULT now()
);

CREATE TABLE invites (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  server_id   uuid NOT NULL REFERENCES servers(id) ON DELETE CASCADE,
  created_by  uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  code        text UNIQUE NOT NULL,
  expires_at  timestamptz,
  max_uses    integer,
  uses        integer DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);

CREATE TABLE channel_sessions (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id       uuid UNIQUE NOT NULL REFERENCES channels(id) ON DELETE CASCADE,
  host_id          uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  media_url        text,
  media_type       text,
  is_playing       boolean DEFAULT false,
  current_position float DEFAULT 0,
  updated_at       timestamptz DEFAULT now()
);

-- =========================================================
-- INDEXES
-- =========================================================

CREATE INDEX idx_servers_owner_id      ON servers(owner_id);
CREATE INDEX idx_server_members_server ON server_members(server_id);
CREATE INDEX idx_server_members_user   ON server_members(user_id);
CREATE INDEX idx_channels_server_id    ON channels(server_id);
CREATE INDEX idx_channel_presence_ch   ON channel_presence(channel_id);
CREATE INDEX idx_channel_presence_user ON channel_presence(user_id);
CREATE INDEX idx_messages_channel_id   ON messages(channel_id);
CREATE INDEX idx_messages_user_id      ON messages(user_id);
CREATE INDEX idx_messages_created_at   ON messages(created_at DESC);
CREATE INDEX idx_invites_server_id     ON invites(server_id);
CREATE INDEX idx_invites_code          ON invites(code);
CREATE INDEX idx_channel_sessions_ch   ON channel_sessions(channel_id);

-- =========================================================
-- ROW LEVEL SECURITY
-- =========================================================

ALTER TABLE users           ENABLE ROW LEVEL SECURITY;
ALTER TABLE servers         ENABLE ROW LEVEL SECURITY;
ALTER TABLE server_members  ENABLE ROW LEVEL SECURITY;
ALTER TABLE channels        ENABLE ROW LEVEL SECURITY;
ALTER TABLE channel_presence ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages        ENABLE ROW LEVEL SECURITY;
ALTER TABLE invites         ENABLE ROW LEVEL SECURITY;
ALTER TABLE channel_sessions ENABLE ROW LEVEL SECURITY;

-- Helper: is the current user a member of the given server?
CREATE OR REPLACE FUNCTION is_server_member(p_server_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM server_members
    WHERE server_id = p_server_id
      AND user_id   = auth.uid()
  );
$$;

-- users: anyone can read; only own row insert/update
CREATE POLICY "users_select" ON users
  FOR SELECT USING (true);

CREATE POLICY "users_insert" ON users
  FOR INSERT WITH CHECK (id = auth.uid());

CREATE POLICY "users_update" ON users
  FOR UPDATE USING (id = auth.uid());

-- servers: members can read; owner can insert/update
CREATE POLICY "servers_select" ON servers
  FOR SELECT USING (is_server_member(id));

CREATE POLICY "servers_insert" ON servers
  FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "servers_update" ON servers
  FOR UPDATE USING (owner_id = auth.uid());

-- server_members: members of same server can read; users insert themselves
CREATE POLICY "server_members_select" ON server_members
  FOR SELECT USING (is_server_member(server_id));

CREATE POLICY "server_members_insert" ON server_members
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- channels: server members can read; server owner/admin can insert/update
CREATE POLICY "channels_select" ON channels
  FOR SELECT USING (is_server_member(server_id));

CREATE POLICY "channels_insert" ON channels
  FOR INSERT WITH CHECK (is_server_member(server_id));

-- channel_presence: server members can read; users manage own row
CREATE POLICY "channel_presence_select" ON channel_presence
  FOR SELECT USING (is_server_member(
    (SELECT server_id FROM channels WHERE id = channel_id)
  ));

CREATE POLICY "channel_presence_insert" ON channel_presence
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "channel_presence_delete" ON channel_presence
  FOR DELETE USING (user_id = auth.uid());

-- messages: server members can read; users insert own messages
CREATE POLICY "messages_select" ON messages
  FOR SELECT USING (is_server_member(
    (SELECT server_id FROM channels WHERE id = channel_id)
  ));

CREATE POLICY "messages_insert" ON messages
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- invites: server members can read; members can insert
CREATE POLICY "invites_select" ON invites
  FOR SELECT USING (is_server_member(server_id));

CREATE POLICY "invites_insert" ON invites
  FOR INSERT WITH CHECK (is_server_member(server_id));

-- channel_sessions: server members can read; host manages own session
CREATE POLICY "channel_sessions_select" ON channel_sessions
  FOR SELECT USING (is_server_member(
    (SELECT server_id FROM channels WHERE id = channel_id)
  ));

CREATE POLICY "channel_sessions_insert" ON channel_sessions
  FOR INSERT WITH CHECK (host_id = auth.uid());

CREATE POLICY "channel_sessions_update" ON channel_sessions
  FOR UPDATE USING (host_id = auth.uid());
