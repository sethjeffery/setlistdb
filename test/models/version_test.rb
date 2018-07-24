require 'test_helper'

class VersionTest < ActiveSupport::TestCase

  test 'find_by_slug_and_position' do
    version = Version.find_by_slug_and_position(songs(:write_a_song).slug, versions(:write_a_song).position)
    assert_equal versions(:write_a_song), version
  end

  test 'update authors on save' do
    version = versions(:write_a_song)
    version.artist_names = 'Kim Walker-Smith, Brand New, Phil Wickham'
    version.save!

    # Change authors
    new_author = Author.last
    assert_equal 'Brand New', new_author.name
    assert_equal [authors(:kim), new_author, authors(:phil)], version.reload.artists

    # Reorder authors
    version.artist_names = 'Phil Wickham, Kim Walker-Smith'
    version.save!
    assert_equal [authors(:phil), authors(:kim)], version.reload.artists
  end
end
