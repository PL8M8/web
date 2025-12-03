alter table "public"."reports" alter column "type" drop default;

alter type "public"."report type" rename to "report type__old_version_to_be_dropped";

create type "public"."report type" as enum ('forum', 'warning', 'problem', 'document', 'recommendation');

create table "public"."update_attachments" (
    "id" uuid not null default gen_random_uuid(),
    "update_id" integer not null,
    "file_name" text not null,
    "file_type" text not null,
    "file_size" integer not null,
    "file_url" text not null,
    "file_path" text not null,
    "created_at" timestamp with time zone default now()
);


alter table "public"."reports" alter column type type "public"."report type" using type::text::"public"."report type";

alter table "public"."reports" alter column "type" set default 'problem'::"report type";

drop type "public"."report type__old_version_to_be_dropped";

alter table "public"."vehicles" add column "is_archived" boolean default false;

CREATE INDEX idx_update_attachments_update_id ON public.update_attachments USING btree (update_id);

CREATE UNIQUE INDEX update_attachments_pkey ON public.update_attachments USING btree (id);

alter table "public"."update_attachments" add constraint "update_attachments_pkey" PRIMARY KEY using index "update_attachments_pkey";

grant delete on table "public"."update_attachments" to "anon";

grant insert on table "public"."update_attachments" to "anon";

grant references on table "public"."update_attachments" to "anon";

grant select on table "public"."update_attachments" to "anon";

grant trigger on table "public"."update_attachments" to "anon";

grant truncate on table "public"."update_attachments" to "anon";

grant update on table "public"."update_attachments" to "anon";

grant delete on table "public"."update_attachments" to "authenticated";

grant insert on table "public"."update_attachments" to "authenticated";

grant references on table "public"."update_attachments" to "authenticated";

grant select on table "public"."update_attachments" to "authenticated";

grant trigger on table "public"."update_attachments" to "authenticated";

grant truncate on table "public"."update_attachments" to "authenticated";

grant update on table "public"."update_attachments" to "authenticated";

grant delete on table "public"."update_attachments" to "service_role";

grant insert on table "public"."update_attachments" to "service_role";

grant references on table "public"."update_attachments" to "service_role";

grant select on table "public"."update_attachments" to "service_role";

grant trigger on table "public"."update_attachments" to "service_role";

grant truncate on table "public"."update_attachments" to "service_role";

grant update on table "public"."update_attachments" to "service_role";

create policy "Enable delete for authenticated users"
on "public"."update_attachments"
as permissive
for delete
to public
using (true);


create policy "Enable insert for authenticated users"
on "public"."update_attachments"
as permissive
for insert
to public
with check (true);


create policy "Enable read access for all users"
on "public"."update_attachments"
as permissive
for select
to public
using (true);



