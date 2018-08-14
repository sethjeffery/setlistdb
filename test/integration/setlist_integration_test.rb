require 'test_helper'
require 'minitest/mock'

class SetlistIntegrationTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  test 'reorder setlist' do
    setlist = setlists(:active)
    sign_in setlist.user

    mock = Minitest::Mock.new
    mock.expect(:reorder, true)
    Setlist.stub_any_instance(:reorder, -> _ids { mock.reorder }) do
      post "/setlists/#{setlist.to_param}/reorder", { params: { setlist_versions: '1,2' }}
      assert_response :success
      mock.verify
    end
  end

  test 'destroy setlist' do
    setlist = setlists(:active)
    sign_in setlist.user

    delete "/setlists/#{setlist.to_param}"
    assert_redirected_to "/users/#{setlist.user.to_param}"
    assert_nil Setlist.find_by(id: setlist.id)
  end

end
