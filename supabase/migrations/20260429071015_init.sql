-- Extensions
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";


-- Tables
CREATE TABLE IF NOT EXISTS "public"."users" (
    "id"               "uuid" NOT NULL,
    "email"            "text" NOT NULL,
    "name"             "text",
    "expertise"        "text",
    "sql_level"        "text",
    "avatar_url"       "text",
    "plan"             "text" DEFAULT 'Free'::"text" NOT NULL,
    "plan_status"      "text" DEFAULT 'active'::"text" NOT NULL,
    "plan_expires_at"  timestamp with time zone,
    "polar_customer_id" "text",
    "created_at"       timestamp with time zone DEFAULT "now"() NOT NULL
);
COMMENT ON TABLE "public"."users" IS 'Users information';

CREATE TABLE IF NOT EXISTS "public"."databases" (
    "id"          "uuid" NOT NULL,
    "user_id"     "uuid",
    "name"        "text" NOT NULL,
    "industry"    "text" NOT NULL,
    "size"        "text" NOT NULL,
    "description" "text",
    "row_count"   bigint NOT NULL,
    "db_schema"   "jsonb" NOT NULL,
    "db_path"     "text" NOT NULL,
    "created_at"  timestamp with time zone DEFAULT "now"() NOT NULL
);

CREATE TABLE IF NOT EXISTS "public"."challenges" (
    "id"          "uuid" NOT NULL,
    "database_id" "uuid",
    "user_id"     "uuid",
    "name"        "text" NOT NULL,
    "topics"      "jsonb" NOT NULL,
    "description" "text" NOT NULL,
    "level"       "text" NOT NULL,
    "solution"    "text" NOT NULL,
    "public"      boolean NOT NULL,
    "created_at"  timestamp with time zone DEFAULT "now"() NOT NULL
);

CREATE TABLE IF NOT EXISTS "public"."challenge_attempts" (
    "id"           "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id"      "uuid",
    "challenge_id" "uuid",
    "solved"       boolean NOT NULL,
    "n_hints"      integer DEFAULT 0 NOT NULL,
    "solution_used" boolean NOT NULL,
    "score"        bigint DEFAULT '0'::bigint,
    "created_at"   timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at"   timestamp with time zone DEFAULT "now"()
);

CREATE TABLE IF NOT EXISTS "public"."feedbacks" (
    "id"         "uuid" NOT NULL,
    "user_id"    "uuid" NOT NULL,
    "type"       "text" DEFAULT 'General'::"text" NOT NULL,
    "message"    "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

CREATE TABLE IF NOT EXISTS "public"."user_actions" (
    "id"          "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id"     "uuid",
    "action_type" "text" NOT NULL,
    "metadata"    "jsonb" NOT NULL,
    "created_at"  timestamp with time zone DEFAULT "now"() NOT NULL
);

CREATE TABLE IF NOT EXISTS "public"."user_usages" (
    "id"                    "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id"               "uuid",
    "n_db_generated"        bigint DEFAULT '0'::bigint NOT NULL,
    "n_challenge_generated" bigint DEFAULT '0'::bigint NOT NULL,
    "n_hints_used"          bigint DEFAULT '0'::bigint NOT NULL,
    "reset_at"              timestamp with time zone NOT NULL,
    "created_at"            timestamp with time zone DEFAULT "now"() NOT NULL
);


-- Primary Keys
ALTER TABLE ONLY "public"."users"              ADD CONSTRAINT "users_pkey"              PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."databases"          ADD CONSTRAINT "databases_pkey"          PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."challenges"         ADD CONSTRAINT "challenges_pkey"         PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."challenge_attempts" ADD CONSTRAINT "challenge_attempts_pkey" PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."feedbacks"          ADD CONSTRAINT "feedbacks_pkey"          PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."user_actions"       ADD CONSTRAINT "user_actions_pkey"       PRIMARY KEY ("id");
ALTER TABLE ONLY "public"."user_usages"        ADD CONSTRAINT "usages_pkey"             PRIMARY KEY ("id");


-- Foreign Keys
ALTER TABLE ONLY "public"."databases"
    ADD CONSTRAINT "databases_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");

ALTER TABLE ONLY "public"."challenges"
    ADD CONSTRAINT "challenges_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."challenges"
    ADD CONSTRAINT "challenges_database_id_fkey"
    FOREIGN KEY ("database_id") REFERENCES "public"."databases"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."challenge_attempts"
    ADD CONSTRAINT "challenge_attempts_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");

ALTER TABLE ONLY "public"."challenge_attempts"
    ADD CONSTRAINT "challenge_attempts_challenge_id_fkey"
    FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("id") ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY "public"."feedbacks"
    ADD CONSTRAINT "feedbacks_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");

ALTER TABLE ONLY "public"."user_actions"
    ADD CONSTRAINT "user_actions_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");

ALTER TABLE ONLY "public"."user_usages"
    ADD CONSTRAINT "usages_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");


-- Row Level Security
ALTER TABLE "public"."users"              ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."databases"          ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."challenges"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."challenge_attempts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."feedbacks"          ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."user_actions"       ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."user_usages"        ENABLE ROW LEVEL SECURITY;


-- Grants
GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON TABLE "public"."users"              TO "anon", "authenticated", "service_role";
GRANT ALL ON TABLE "public"."databases"          TO "anon", "authenticated", "service_role";
GRANT ALL ON TABLE "public"."challenges"         TO "anon", "authenticated", "service_role";
GRANT ALL ON TABLE "public"."challenge_attempts" TO "anon", "authenticated", "service_role";
GRANT ALL ON TABLE "public"."feedbacks"          TO "anon", "authenticated", "service_role";
GRANT ALL ON TABLE "public"."user_actions"       TO "anon", "authenticated", "service_role";
GRANT ALL ON TABLE "public"."user_usages"        TO "anon", "authenticated", "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres", "anon", "authenticated", "service_role";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres", "anon", "authenticated", "service_role";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES     TO "postgres", "anon", "authenticated", "service_role";
