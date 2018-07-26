# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2018_07_26_131025) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"
  enable_extension "unaccent"

  create_table "authors", force: :cascade do |t|
    t.string "name"
    t.string "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_authors_on_name"
  end

  create_table "friendly_id_slugs", force: :cascade do |t|
    t.string "slug", null: false
    t.integer "sluggable_id", null: false
    t.string "sluggable_type", limit: 50
    t.string "scope"
    t.datetime "created_at"
    t.index ["slug", "sluggable_type", "scope"], name: "index_friendly_id_slugs_on_slug_and_sluggable_type_and_scope", unique: true
    t.index ["slug", "sluggable_type"], name: "index_friendly_id_slugs_on_slug_and_sluggable_type"
    t.index ["sluggable_id"], name: "index_friendly_id_slugs_on_sluggable_id"
    t.index ["sluggable_type"], name: "index_friendly_id_slugs_on_sluggable_type"
  end

  create_table "setlist_version_authors", force: :cascade do |t|
    t.bigint "setlist_version_id"
    t.bigint "author_id"
    t.integer "authoring", default: 0
    t.integer "position", default: 1
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["author_id"], name: "index_setlist_version_authors_on_author_id"
    t.index ["setlist_version_id"], name: "index_setlist_version_authors_on_setlist_version_id"
  end

  create_table "setlist_versions", force: :cascade do |t|
    t.bigint "setlist_id"
    t.bigint "version_id"
    t.integer "position"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "title"
    t.text "content"
    t.string "key"
    t.integer "transpose", default: 0
    t.integer "year"
    t.string "lang"
    t.index ["setlist_id"], name: "index_setlist_versions_on_setlist_id"
    t.index ["version_id"], name: "index_setlist_versions_on_version_id"
  end

  create_table "setlists", force: :cascade do |t|
    t.bigint "user_id"
    t.string "title"
    t.date "date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "notes"
    t.index ["user_id", "date"], name: "index_setlists_on_user_id_and_date"
    t.index ["user_id"], name: "index_setlists_on_user_id"
  end

  create_table "songs", force: :cascade do |t|
    t.string "title"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "slug"
    t.index ["slug"], name: "index_songs_on_slug"
  end

  create_table "users", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet "current_sign_in_ip"
    t.inet "last_sign_in_ip"
    t.string "slug"
    t.string "provider"
    t.string "uid"
    t.string "image"
    t.string "role"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  create_table "version_authors", force: :cascade do |t|
    t.bigint "version_id"
    t.bigint "author_id"
    t.integer "position", default: 1
    t.integer "authoring", default: 0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["author_id"], name: "index_version_authors_on_author_id"
    t.index ["version_id"], name: "index_version_authors_on_version_id"
  end

  create_table "versions", force: :cascade do |t|
    t.bigint "song_id"
    t.string "title"
    t.text "content"
    t.text "lyrics"
    t.bigint "user_id"
    t.string "key"
    t.integer "year"
    t.string "lang"
    t.integer "version_type"
    t.integer "position", default: 0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "author_name"
    t.text "notes"
    t.index ["lang"], name: "index_versions_on_lang"
    t.index ["song_id", "position"], name: "index_versions_on_song_id_and_position"
    t.index ["title"], name: "index_versions_on_title"
    t.index ["user_id"], name: "index_versions_on_user_id"
  end

  add_foreign_key "setlist_version_authors", "authors"
  add_foreign_key "setlist_version_authors", "setlist_versions"
  add_foreign_key "setlist_versions", "setlists"
  add_foreign_key "setlist_versions", "versions"
  add_foreign_key "setlists", "users"
  add_foreign_key "version_authors", "authors"
  add_foreign_key "version_authors", "versions"
  add_foreign_key "versions", "songs"
  add_foreign_key "versions", "users"
end
