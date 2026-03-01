


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."estimate_status_enum" AS ENUM (
    'approved',
    'denied',
    'follow_up'
);


ALTER TYPE "public"."estimate_status_enum" OWNER TO "postgres";


CREATE TYPE "public"."job_status_enum" AS ENUM (
    'pending',
    'done',
    'cancelled'
);


ALTER TYPE "public"."job_status_enum" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."rls_auto_enable"() RETURNS "event_trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'pg_catalog'
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$$;


ALTER FUNCTION "public"."rls_auto_enable"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."estimates" (
    "work_order_id" "uuid" NOT NULL,
    "estimated_amount" numeric NOT NULL,
    "handled_by" "text",
    "status" "public"."estimate_status_enum" DEFAULT 'follow_up'::"public"."estimate_status_enum" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "deleted_at" timestamp with time zone
);


ALTER TABLE "public"."estimates" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."jobs" (
    "work_order_id" "uuid" NOT NULL,
    "parts_total_cost" numeric DEFAULT 0.00 NOT NULL,
    "subtotal" numeric NOT NULL,
    "tip_amount" numeric DEFAULT 0.00 NOT NULL,
    "payment_method_id" "uuid",
    "status" "public"."job_status_enum" DEFAULT 'pending'::"public"."job_status_enum" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "deleted_at" timestamp with time zone
);


ALTER TABLE "public"."jobs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."payment_methods" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "deleted_at" timestamp with time zone
);


ALTER TABLE "public"."payment_methods" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."review_records" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "job_id" "uuid" NOT NULL,
    "review_date" "date" NOT NULL,
    "review_type_id" "uuid" NOT NULL,
    "amount" numeric NOT NULL,
    "payment_method_id" "uuid",
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "deleted_at" timestamp with time zone
);


ALTER TABLE "public"."review_records" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."review_types" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "price" numeric NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "deleted_at" timestamp with time zone
);


ALTER TABLE "public"."review_types" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."technicians" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "commission" numeric DEFAULT 0.00 NOT NULL,
    "email" "text",
    "hired_date" "date",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "deleted_at" timestamp with time zone
);


ALTER TABLE "public"."technicians" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."work_orders" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "technician_id" "uuid" NOT NULL,
    "work_title" "text" NOT NULL,
    "description" "text",
    "category" "text",
    "region" "text",
    "address" "text",
    "work_order_date" "date" NOT NULL,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "deleted_at" timestamp with time zone,
    "review_id" "uuid"
);


ALTER TABLE "public"."work_orders" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."v_estimates" AS
 SELECT "wo"."id" AS "work_order_id",
    "wo"."technician_id",
    "wo"."work_title",
    "wo"."description",
    "wo"."category",
    "wo"."region",
    "wo"."address",
    "wo"."work_order_date",
    "e"."estimated_amount",
    "e"."handled_by",
    "e"."status" AS "estimate_status",
    "e"."created_at"
   FROM ("public"."work_orders" "wo"
     JOIN "public"."estimates" "e" ON ((("e"."work_order_id" = "wo"."id") AND ("e"."deleted_at" IS NULL))))
  WHERE ("wo"."deleted_at" IS NULL);


ALTER VIEW "public"."v_estimates" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."v_jobs" AS
 SELECT "wo"."id" AS "work_order_id",
    "wo"."technician_id",
    "wo"."work_title",
    "wo"."description",
    "wo"."category",
    "wo"."region",
    "wo"."address",
    "wo"."work_order_date",
    "wo"."notes",
    "j"."parts_total_cost",
    "j"."subtotal",
    "j"."tip_amount",
    ("j"."subtotal" - "j"."parts_total_cost") AS "net_revenue",
    (("j"."subtotal" - "j"."parts_total_cost") * ("t"."commission" / (100)::numeric)) AS "total_commission",
    (("j"."subtotal" - "j"."parts_total_cost") * ((1)::numeric - ("t"."commission" / (100)::numeric))) AS "total_company_net",
    "pm"."name" AS "payment_method",
    "j"."status",
    "j"."created_at",
    "rr"."id" AS "review_id",
    "rr"."review_date",
    "rr"."amount" AS "review_amount",
    "rt"."name" AS "review_type",
    "rr"."notes" AS "review_notes"
   FROM ((((("public"."work_orders" "wo"
     JOIN "public"."jobs" "j" ON ((("j"."work_order_id" = "wo"."id") AND ("j"."deleted_at" IS NULL))))
     LEFT JOIN "public"."technicians" "t" ON ((("t"."id" = "wo"."technician_id") AND ("t"."deleted_at" IS NULL))))
     LEFT JOIN "public"."payment_methods" "pm" ON (("pm"."id" = "j"."payment_method_id")))
     LEFT JOIN "public"."review_records" "rr" ON ((("rr"."job_id" = "wo"."id") AND ("rr"."deleted_at" IS NULL))))
     LEFT JOIN "public"."review_types" "rt" ON (("rt"."id" = "rr"."review_type_id")))
  WHERE ("wo"."deleted_at" IS NULL);


ALTER VIEW "public"."v_jobs" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."v_jobs_summary" AS
 SELECT "count"("j"."work_order_id") AS "total_jobs",
    "sum"("j"."tip_amount") AS "technician_total_tips",
    "sum"("j"."parts_total_cost") AS "parts_total_cost",
    "sum"("j"."subtotal") AS "gross_revenue",
    "sum"(("j"."subtotal" - "j"."parts_total_cost")) AS "net_revenue",
    "sum"((("j"."subtotal" - "j"."parts_total_cost") * ((1)::numeric - ("t"."commission" / (100)::numeric)))) AS "total_company_net_earned"
   FROM (("public"."jobs" "j"
     LEFT JOIN "public"."work_orders" "wo" ON ((("wo"."id" = "j"."work_order_id") AND ("wo"."deleted_at" IS NULL))))
     LEFT JOIN "public"."technicians" "t" ON ((("t"."id" = "wo"."technician_id") AND ("t"."deleted_at" IS NULL))))
  WHERE (("j"."deleted_at" IS NULL) AND ("j"."status" = 'done'::"public"."job_status_enum"));


ALTER VIEW "public"."v_jobs_summary" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."v_review_records" AS
 SELECT "wo"."id" AS "work_order_id",
    "wo"."technician_id",
    "wo"."work_title",
    "wo"."category",
    "j"."parts_total_cost",
    "j"."subtotal",
    "j"."tip_amount",
    "rr"."id" AS "review_id",
    "rr"."review_date",
    "rr"."amount" AS "review_amount",
    "rt"."name" AS "review_type",
    "pm"."name" AS "payment_method",
    "rr"."notes" AS "review_notes",
    "rr"."created_at"
   FROM (((("public"."work_orders" "wo"
     JOIN "public"."jobs" "j" ON ((("j"."work_order_id" = "wo"."id") AND ("j"."deleted_at" IS NULL) AND ("j"."status" = 'done'::"public"."job_status_enum"))))
     JOIN "public"."review_records" "rr" ON ((("rr"."job_id" = "wo"."id") AND ("rr"."deleted_at" IS NULL))))
     LEFT JOIN "public"."review_types" "rt" ON (("rt"."id" = "rr"."review_type_id")))
     LEFT JOIN "public"."payment_methods" "pm" ON (("pm"."id" = "rr"."payment_method_id")))
  WHERE ("wo"."deleted_at" IS NULL);


ALTER VIEW "public"."v_review_records" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."v_review_records_summary" AS
 WITH "base_jobs" AS (
         SELECT "j"."work_order_id"
           FROM ("public"."work_orders" "wo"
             LEFT JOIN "public"."jobs" "j" ON ((("j"."work_order_id" = "wo"."id") AND ("j"."deleted_at" IS NULL) AND ("j"."status" = 'done'::"public"."job_status_enum"))))
          WHERE ("wo"."deleted_at" IS NULL)
        ), "review_data" AS (
         SELECT "rr"."id",
            "rr"."job_id",
            "rr"."review_date",
            "rr"."review_type_id",
            "rr"."amount",
            "rr"."payment_method_id",
            "rr"."notes",
            "rr"."created_at",
            "rr"."deleted_at"
           FROM "public"."review_records" "rr"
          WHERE ("rr"."deleted_at" IS NULL)
        )
 SELECT "count"(DISTINCT "bj"."work_order_id") AS "total_done_jobs",
    "count"(DISTINCT "rd"."job_id") AS "total_jobs_with_reviews",
    ("count"(DISTINCT "bj"."work_order_id") - "count"(DISTINCT "rd"."job_id")) AS "total_jobs_without_reviews",
    "count"(DISTINCT "rd"."review_type_id") AS "distinct_review_types",
    "count"(DISTINCT "rd"."payment_method_id") AS "distinct_payment_methods",
    COALESCE("sum"("rd"."amount"), (0)::numeric) AS "total_review_amount",
    COALESCE("avg"("rd"."amount"), (0)::numeric) AS "avg_review_amount",
    COALESCE("min"("rd"."amount"), (0)::numeric) AS "min_review_amount",
    COALESCE("max"("rd"."amount"), (0)::numeric) AS "max_review_amount",
        CASE
            WHEN ("count"(DISTINCT "rd"."job_id") = 0) THEN (0)::numeric
            ELSE ("sum"("rd"."amount") / ("count"(DISTINCT "rd"."job_id"))::numeric)
        END AS "avg_amount_per_reviewed_job",
        CASE
            WHEN ("count"(DISTINCT "bj"."work_order_id") = 0) THEN (0)::numeric
            ELSE (("count"(DISTINCT "rd"."job_id"))::numeric / ("count"(DISTINCT "bj"."work_order_id"))::numeric)
        END AS "review_coverage_ratio"
   FROM ("base_jobs" "bj"
     LEFT JOIN "review_data" "rd" ON (("rd"."job_id" = "bj"."work_order_id")));


ALTER VIEW "public"."v_review_records_summary" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."v_technicians_summary" AS
SELECT
    NULL::"uuid" AS "technician_id",
    NULL::"text" AS "name",
    NULL::bigint AS "total_jobs",
    NULL::numeric AS "total_parts",
    NULL::numeric AS "total_tips",
    NULL::numeric AS "gross_revenue",
    NULL::numeric AS "net_revenue",
    NULL::numeric AS "total_commission_earned",
    NULL::numeric AS "total_company_net";


ALTER VIEW "public"."v_technicians_summary" OWNER TO "postgres";


ALTER TABLE ONLY "public"."estimates"
    ADD CONSTRAINT "estimates_pkey" PRIMARY KEY ("work_order_id");



ALTER TABLE ONLY "public"."jobs"
    ADD CONSTRAINT "jobs_pkey" PRIMARY KEY ("work_order_id");



ALTER TABLE ONLY "public"."payment_methods"
    ADD CONSTRAINT "payment_methods_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."payment_methods"
    ADD CONSTRAINT "payment_methods_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."review_records"
    ADD CONSTRAINT "review_records_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."review_types"
    ADD CONSTRAINT "review_types_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."review_types"
    ADD CONSTRAINT "review_types_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."technicians"
    ADD CONSTRAINT "technicians_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."work_orders"
    ADD CONSTRAINT "work_orders_pkey" PRIMARY KEY ("id");



CREATE OR REPLACE VIEW "public"."v_technicians_summary" AS
 SELECT "t"."id" AS "technician_id",
    "t"."name",
    "count"(DISTINCT "j"."work_order_id") AS "total_jobs",
    COALESCE("sum"("j"."parts_total_cost"), (0)::numeric) AS "total_parts",
    COALESCE("sum"("j"."tip_amount"), (0)::numeric) AS "total_tips",
    COALESCE("sum"("j"."subtotal"), (0)::numeric) AS "gross_revenue",
    COALESCE(("sum"("j"."subtotal") - "sum"("j"."parts_total_cost")), (0)::numeric) AS "net_revenue",
    COALESCE((("sum"("j"."subtotal") - "sum"("j"."parts_total_cost")) * ("t"."commission" / (100)::numeric)), (0)::numeric) AS "total_commission_earned",
    COALESCE((("sum"("j"."subtotal") - "sum"("j"."parts_total_cost")) * ((1)::numeric - ("t"."commission" / (100)::numeric))), (0)::numeric) AS "total_company_net"
   FROM (("public"."technicians" "t"
     LEFT JOIN "public"."work_orders" "wo" ON ((("wo"."technician_id" = "t"."id") AND ("wo"."deleted_at" IS NULL))))
     LEFT JOIN "public"."jobs" "j" ON ((("j"."work_order_id" = "wo"."id") AND ("j"."deleted_at" IS NULL) AND ("j"."status" = 'done'::"public"."job_status_enum"))))
  GROUP BY "t"."id", "t"."name";



ALTER TABLE ONLY "public"."estimates"
    ADD CONSTRAINT "estimates_work_order_id_fkey" FOREIGN KEY ("work_order_id") REFERENCES "public"."work_orders"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."jobs"
    ADD CONSTRAINT "jobs_payment_method_id_fkey" FOREIGN KEY ("payment_method_id") REFERENCES "public"."payment_methods"("id");



ALTER TABLE ONLY "public"."jobs"
    ADD CONSTRAINT "jobs_work_order_id_fkey" FOREIGN KEY ("work_order_id") REFERENCES "public"."work_orders"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."review_records"
    ADD CONSTRAINT "review_records_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("work_order_id");



ALTER TABLE ONLY "public"."review_records"
    ADD CONSTRAINT "review_records_payment_method_id_fkey" FOREIGN KEY ("payment_method_id") REFERENCES "public"."payment_methods"("id");



ALTER TABLE ONLY "public"."review_records"
    ADD CONSTRAINT "review_records_review_type_id_fkey" FOREIGN KEY ("review_type_id") REFERENCES "public"."review_types"("id");



ALTER TABLE ONLY "public"."work_orders"
    ADD CONSTRAINT "work_orders_technician_id_fkey" FOREIGN KEY ("technician_id") REFERENCES "public"."technicians"("id");





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "anon";
GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "service_role";


















GRANT ALL ON TABLE "public"."estimates" TO "anon";
GRANT ALL ON TABLE "public"."estimates" TO "authenticated";
GRANT ALL ON TABLE "public"."estimates" TO "service_role";



GRANT ALL ON TABLE "public"."jobs" TO "anon";
GRANT ALL ON TABLE "public"."jobs" TO "authenticated";
GRANT ALL ON TABLE "public"."jobs" TO "service_role";



GRANT ALL ON TABLE "public"."payment_methods" TO "anon";
GRANT ALL ON TABLE "public"."payment_methods" TO "authenticated";
GRANT ALL ON TABLE "public"."payment_methods" TO "service_role";



GRANT ALL ON TABLE "public"."review_records" TO "anon";
GRANT ALL ON TABLE "public"."review_records" TO "authenticated";
GRANT ALL ON TABLE "public"."review_records" TO "service_role";



GRANT ALL ON TABLE "public"."review_types" TO "anon";
GRANT ALL ON TABLE "public"."review_types" TO "authenticated";
GRANT ALL ON TABLE "public"."review_types" TO "service_role";



GRANT ALL ON TABLE "public"."technicians" TO "anon";
GRANT ALL ON TABLE "public"."technicians" TO "authenticated";
GRANT ALL ON TABLE "public"."technicians" TO "service_role";



GRANT ALL ON TABLE "public"."work_orders" TO "anon";
GRANT ALL ON TABLE "public"."work_orders" TO "authenticated";
GRANT ALL ON TABLE "public"."work_orders" TO "service_role";



GRANT ALL ON TABLE "public"."v_estimates" TO "anon";
GRANT ALL ON TABLE "public"."v_estimates" TO "authenticated";
GRANT ALL ON TABLE "public"."v_estimates" TO "service_role";



GRANT ALL ON TABLE "public"."v_jobs" TO "anon";
GRANT ALL ON TABLE "public"."v_jobs" TO "authenticated";
GRANT ALL ON TABLE "public"."v_jobs" TO "service_role";



GRANT ALL ON TABLE "public"."v_jobs_summary" TO "anon";
GRANT ALL ON TABLE "public"."v_jobs_summary" TO "authenticated";
GRANT ALL ON TABLE "public"."v_jobs_summary" TO "service_role";



GRANT ALL ON TABLE "public"."v_review_records" TO "anon";
GRANT ALL ON TABLE "public"."v_review_records" TO "authenticated";
GRANT ALL ON TABLE "public"."v_review_records" TO "service_role";



GRANT ALL ON TABLE "public"."v_review_records_summary" TO "anon";
GRANT ALL ON TABLE "public"."v_review_records_summary" TO "authenticated";
GRANT ALL ON TABLE "public"."v_review_records_summary" TO "service_role";



GRANT ALL ON TABLE "public"."v_technicians_summary" TO "anon";
GRANT ALL ON TABLE "public"."v_technicians_summary" TO "authenticated";
GRANT ALL ON TABLE "public"."v_technicians_summary" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";



































drop extension if exists "pg_net";


