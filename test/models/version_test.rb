require 'test_helper'

class VersionTest < ActiveSupport::TestCase

  test 'find_by_slug_and_position' do
    version = Version.find_by_slug_and_position(songs(:write_a_song).slug, versions(:write_a_song).position)
    assert_equal versions(:write_a_song), version
  end

end
