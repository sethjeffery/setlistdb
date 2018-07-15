require 'test_helper'

class SetlistTest < ActiveSupport::TestCase
  test "active" do
    assert setlists(:active).active?
    assert_includes Setlist.active, setlists(:active)

    refute setlists(:past).active?
    refute_includes Setlist.active, setlists(:past)
  end

  test "past" do
    assert setlists(:past).past?
    assert_includes Setlist.past, setlists(:past)

    refute setlists(:active).past?
    refute_includes Setlist.past, setlists(:active)
  end

  test 'has versions' do
    assert_includes setlists(:active).versions, versions(:write_a_song)
  end

  test 'can have first version' do
    setlist = Setlist.create! date: Date.current,
                              user: users(:user),
                              song: songs(:write_a_song).to_param,
                              version: versions(:write_a_song).to_param

    assert_includes setlist.versions, versions(:write_a_song)
  end

  test 'can reorder versions' do
    setlist = Setlist.create! date: Date.current,
                              user: users(:user),
                              versions: [versions(:write_a_song), versions(:write_a_song_v2)]

    sv = setlist.setlist_versions.ordered
    assert_equal [sv[0].id, sv[1].id], sv.map(&:id)

    setlist.reorder(sv[1].hashid, sv[0].hashid)
    assert_equal [sv[1].id, sv[0].id], sv.reload.map(&:id)
  end
end
