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
end
