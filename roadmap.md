# Requested work

- [x] Add three-language treasure descriptions and multiple tags, localized hover/focus details, and clearer upload errors.
- [x] Update the executable external SQL setup for the new fields and save function; the user must run it in the external project's SQL editor.

- [x] Inspect and document administrator, association, news and treasure table design without changing existing content.
- [x] Make the mobile menu dismissible and scrollable; verify navigation at the user's viewport and on a small phone.
- [ ] Apply tables and copy existing content into the specified external project. Blocked: this Cloud-backed project has no supported connection to that external database; account passwords are not a database integration.
- [ ] Connect public pages and administrator login to the external project and verify saved content. Blocked: external schema/data migration and authorized connection must complete first.
- [ ] Run docs/external-admin-setup.sql in the external Supabase project and create the first admin. Blocked: must be run by the user in their Supabase dashboard.
## Admin content tabs
- [x] Add account, gallery, association, news and contact management tabs.
- [x] Add three-language content editors and connect public reads without changing existing presentation.
- [x] Supply additive external SQL and verify login, all five tabs, editor forms, public pages and save failure handling.
- [ ] Verify successful external content save/readback. Blocked: user must run the updated docs/external-admin-setup.sql on the external database; real save currently reports missing setup.

## Homepage button, sign-out destination and news categories
- [x] Rename the homepage primary button to 关于协会 and send it to the association page.
- [x] Return to the homepage after an administrator signs out.
- [x] Build news category buttons from the categories actually present in the news list.
