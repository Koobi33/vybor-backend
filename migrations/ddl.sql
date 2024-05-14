create table users
(
    id         serial  PRIMARY KEY,
    tg_id      varchar NOT NULL,
    tg_id_hash varchar NOT NULL,
    wallet_id  varchar
);

create table players
(
    id                      serial    PRIMARY KEY,
    user_id                 int4      NOT NULL,
    score                   int       NOT NULL,
    coins                   int       NOT NULL,
    energy                  int       NOT NULL,
    is_wallet_connected     boolean   NOT NULL,
    is_moderator            boolean   NOT NULL,
    next_free_question_time timestamp NOT NULL,
    available_questions     int       NOT NULL,
    fill_energy_time        timestamp,
    locale                  varchar   NOT NULL,
    current_strick          int       NOT NULL,
    constraint fk_user foreign key (user_id) references users (id)
);

create table questions
(
    id                 serial  PRIMARY KEY,
    player_author_id   int4    NOT NULL,
    label_locale       varchar NOT NULL,
    a1_locale          varchar NOT NULL,
    a1_selection_count int     NOT NULL,
    a1_image_url       varchar NOT NULL,
    a2_locale          varchar NOT NULL,
    a2_selection_count int     NOT NULL,
    a2_image_url       varchar NOT NULL,
    constraint fk_player_author_id foreign key (player_author_id) references players (id)
);

create table players_question
(
    player_id     int4    NOT NULL,
    question_id   int4    NOT NULL,
    primary key (player_id, question_id),
    constraint fk_player_id foreign key (player_id) references players (id),
    constraint fk_question_id foreign key (question_id) references questions (id)
);

alter table players
    add column name varchar;

create table invites
(
    send_invite_player_id int4    NOT NULL,
    get_invite_player_id  int4    NOT NULL,
    invite_placement      varchar NOT NULL,
    invite_entity_id      varchar NOT NULL,
    primary key (send_invite_player_id, get_invite_player_id),
    constraint fk_send_invite_player_id foreign key (send_invite_player_id) references players (id),
    constraint fk_get_invite_player_id foreign key (get_invite_player_id) references players (id),
    constraint sender_recipient_are_not_same check (send_invite_player_id != get_invite_player_id)
);

create table quests
(
    quest_id     serial primary key,
    mechanic     varchar not null,
    type         varchar not null,
    max_progress float4  not null,
    reward       int4    not null,
    params       json
);

create table players_quests
(
    quest_id int4 not null,
    player_id int4 not null,
    progress float4 not null,
    is_rewarded boolean not null,
    update_time timestamp,
    primary key (quest_id, player_id),
    constraint fk_quest_id foreign key (quest_id) references quests (quest_id),
    constraint fk_player_id foreign key (player_id) references players (id)
);