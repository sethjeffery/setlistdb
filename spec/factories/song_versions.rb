FactoryBot.define do
  factory :song_version do
    song nil
    title "MyString"
    content "MyText"
    lyrics "MyText"
    author "MyString"
    user nil
    key "MyString"
    year 1
    lang "MyString"
    type 1
  end
end
