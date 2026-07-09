-- Public "Wall of Shame" leaderboard (Phase 9.6, growth/distribution).
--
-- Deliberately reuses most_transferred_lots (lots that change hands most
-- often) rather than most_reported_lots. most_reported_lots stays
-- admin-only per the comment in 20260708000000_analytics_views.sql —
-- surfacing which specific residents get reported most is moderation-
-- sensitive and could enable targeted harassment. Transfer churn carries
-- no such risk: it's public market activity, not a compliance signal
-- about a specific resident.
grant select on most_transferred_lots to anon, authenticated;
