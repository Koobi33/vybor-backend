insert into users values(0, 'admin', 'Ro0TU$$eR_aGg1N', null);

insert into players values(0, 0, 0, 0, 0, false, true, 'now'::timestamp, 0, null, 'ru', 0);

--insert into questions(player_author_id, label_locale, a1_locale, a1_selection_count, a1_image_url, a2_locale, a2_selection_count, a2_image_url) values(...);

update players
set name = 'AdminPlayer'
where id = 0