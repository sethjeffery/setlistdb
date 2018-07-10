require 'test_helper'

class VersionIntegrationTest < ActionDispatch::IntegrationTest
  test 'show version' do
    version = versions(:write_a_song)
    get "/songs/#{version.song.slug}/v/1"
    assert_response :success
    assert_equal "text/html", response.content_type
  end

  test 'download chordpro' do
    version = versions(:write_a_song)
    get "/songs/#{version.song.slug}/v/1.chopro"
    assert_response :success
    assert_equal "text/chordpro", response.content_type
    assert response.body.present?
  end

  test 'download onsong' do
    version = versions(:write_a_song)
    get "/songs/#{version.song.slug}/v/1.onsong"
    assert_response :success
    assert_equal "text/onsong", response.content_type
    assert response.body.present?
  end

  test 'new version requires sign-in' do
    version = versions(:write_a_song)
    get "/songs/#{version.song.slug}/v/new"
    assert_redirected_to user_facebook_omniauth_authorize_path
  end
end
