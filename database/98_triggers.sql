-- ============================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS
$$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;

-- ============================================================
-- USERS
-- ============================================================

CREATE TRIGGER trg_users_updated
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- ============================================================
-- SCHOOLS
-- ============================================================

CREATE TRIGGER trg_schools_updated
BEFORE UPDATE ON schools
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- ============================================================
-- STUDENTS
-- ============================================================

CREATE TRIGGER trg_students_updated
BEFORE UPDATE ON students
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- ============================================================
-- PARENTS
-- ============================================================

CREATE TRIGGER trg_parents_updated
BEFORE UPDATE ON parents
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- ============================================================
-- SPONSORS
-- ============================================================

CREATE TRIGGER trg_sponsors_updated
BEFORE UPDATE ON sponsors
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- ============================================================
-- PROJECTS
-- ============================================================

CREATE TRIGGER trg_projects_updated
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- ============================================================
-- NEWS
-- ============================================================

CREATE TRIGGER trg_news_updated
BEFORE UPDATE ON news
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- ============================================================
-- ORGANIZATION SETTINGS
-- ============================================================

CREATE TRIGGER trg_organization_settings_updated
BEFORE UPDATE ON organization_settings
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();