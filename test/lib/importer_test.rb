require 'test_helper'
require 'importer'

class ImporterTest < ActiveSupport::TestCase

  test 'reads OnSong style' do
    content = <<-SONG
      You're Beautiful
      Phil Wickham
      Key: A

      [A]Oo[D]ooh, [F#m]Oo[E]ooh
      [A]I see Your face, in [D]every sunrise
      The [F#m]colors of the morning, are [E]inside Your eyes
    SONG

    importer = Importer.new(content)
    version = importer.as_version

    assert version.new_record?
    assert_equal "You're Beautiful", version.title
    assert_equal "Phil Wickham", version.artist_names
    assert_equal "A", version.key
    assert_includes version.content, "[A]I see Your face, in [D]every sunrise"
    refute_includes version.content, "You're Beautiful"
    refute_includes version.content, "Phil Wickham"
  end

  test 'reads ChordPro style' do
    content = <<-SONG
      {title: You're Beautiful}
      {composer: Phil Wickham}
      {lyricist: Seth Jeffery}
      {key: A}

      {soc}
      [A]Oo[D]ooh, [F#m]Oo[E]ooh
      [A]I see Your face, in [D]every sunrise
      The [F#m]colors of the morning, are [E]inside Your eyes
      {eoc}
    SONG

    importer = Importer.new(content)
    version = importer.as_version

    assert version.new_record?
    assert_equal "You're Beautiful", version.title
    assert_equal "Phil Wickham", version.composer_names
    assert_equal "Seth Jeffery", version.lyricist_names
    assert_equal "", version.artist_names
    assert_equal "A", version.key
    assert_includes version.content, "[A]I see Your face, in [D]every sunrise"
    refute_includes version.content, "You're Beautiful"
    refute_includes version.content, "Phil Wickham"
  end

end
