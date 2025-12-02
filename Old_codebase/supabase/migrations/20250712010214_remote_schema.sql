CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();


grant delete on table "storage"."s3_multipart_uploads" to "postgres";

grant insert on table "storage"."s3_multipart_uploads" to "postgres";

grant references on table "storage"."s3_multipart_uploads" to "postgres";

grant select on table "storage"."s3_multipart_uploads" to "postgres";

grant trigger on table "storage"."s3_multipart_uploads" to "postgres";

grant truncate on table "storage"."s3_multipart_uploads" to "postgres";

grant update on table "storage"."s3_multipart_uploads" to "postgres";

grant delete on table "storage"."s3_multipart_uploads_parts" to "postgres";

grant insert on table "storage"."s3_multipart_uploads_parts" to "postgres";

grant references on table "storage"."s3_multipart_uploads_parts" to "postgres";

grant select on table "storage"."s3_multipart_uploads_parts" to "postgres";

grant trigger on table "storage"."s3_multipart_uploads_parts" to "postgres";

grant truncate on table "storage"."s3_multipart_uploads_parts" to "postgres";

grant update on table "storage"."s3_multipart_uploads_parts" to "postgres";

create policy "ALL 6ka5xv_0"
on "storage"."objects"
as permissive
for select
to public
using ((bucket_id = 'listing_images'::text));


create policy "ALL 6ka5xv_1"
on "storage"."objects"
as permissive
for insert
to public
with check ((bucket_id = 'listing_images'::text));


create policy "ALL 6ka5xv_2"
on "storage"."objects"
as permissive
for update
to public
using ((bucket_id = 'listing_images'::text));


create policy "ALL 6ka5xv_3"
on "storage"."objects"
as permissive
for delete
to public
using ((bucket_id = 'listing_images'::text));


create policy "All access pass kfw0af_0"
on "storage"."objects"
as permissive
for select
to public
using ((bucket_id = 'user-content'::text));


create policy "All access pass kfw0af_1"
on "storage"."objects"
as permissive
for insert
to public
with check ((bucket_id = 'user-content'::text));


create policy "All access pass kfw0af_2"
on "storage"."objects"
as permissive
for update
to public
using ((bucket_id = 'user-content'::text));


create policy "All access pass kfw0af_3"
on "storage"."objects"
as permissive
for delete
to public
using ((bucket_id = 'user-content'::text));



