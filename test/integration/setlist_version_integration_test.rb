require 'test_helper'

class SetlistVersionIntegrationTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  test 'destroy setlist version' do
    setlist = setlists(:active)
    setlist_version = setlist_versions(:active_version)
    sign_in setlist.user

    delete "/setlists/#{setlist.to_param}/versions/#{setlist_version.to_param}"
    assert_redirected_to "/setlists/#{setlist.to_param}"
    assert_nil SetlistVersion.find_by(id: setlist_version.id)
  end

end
